/**
 * Scroll-Controlled Background Canvas Frame Animation Controller
 * Pure scroll-driven frame scrubbing: scroll down -> forward, scroll up -> backward.
 * NO autoplay. Stationary = static frame.
 * Optimized with smooth interpolation (lerping) and chunked preloading.
 */

class ScrollFrameAnimationController {
  constructor(options = {}) {
    this.canvas = document.getElementById(options.canvasId || 'hero-animation-canvas');
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d', { alpha: false });
    this.totalFrames = options.totalFrames || 240;
    this.framePathPattern = options.framePathPattern || 'assets/animation/frame_%06d.jpg';

    this.frames = new Array(this.totalFrames).fill(null);
    this.isLoaded = new Array(this.totalFrames).fill(false);
    
    this.currentFrame = 0; // Float for smooth interpolation
    this.targetFrame = 0;  // Integer target from scroll
    this.renderedFrameIndex = -1;
    this.isRendering = false;
    this.animationFrameId = null;

    this.init();
  }

  getFrameUrl(index) {
    const formattedIndex = String(index).padStart(6, '0');
    return `assets/animation/frame_${formattedIndex}.jpg`;
  }

  init() {
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    // Scroll listener with passive flag for high performance
    window.addEventListener('scroll', () => this.onScroll(), { passive: true });

    // Initial progressive frame preloading
    this.preloadFrames();

    // Initial scroll position calculation
    this.onScroll();
  }

  resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.ctx.scale(dpr, dpr);

    // Re-render current frame on resize
    const frameIdx = Math.round(this.currentFrame);
    if (this.frames[frameIdx] && this.isLoaded[frameIdx]) {
      this.renderFrame(this.frames[frameIdx]);
    }
  }

  preloadImage(index) {
    return new Promise((resolve) => {
      if (this.isLoaded[index]) {
        resolve(this.frames[index]);
        return;
      }

      const img = new Image();
      img.src = this.getFrameUrl(index);
      img.onload = () => {
        this.frames[index] = img;
        this.isLoaded[index] = true;
        resolve(img);
      };
      img.onerror = () => {
        this.isLoaded[index] = false;
        resolve(null);
      };
    });
  }

  async preloadFrames() {
    // 1. Preload frame 0 for instant initial paint
    const first = await this.preloadImage(0);
    if (first) {
      this.renderFrame(first);
      this.canvas.classList.add('canvas-ready');
    }

    // 2. Preload first 20 frames immediately for quick responsiveness
    const initialBatch = [];
    for (let i = 1; i < 20; i++) {
      initialBatch.push(this.preloadImage(i));
    }
    await Promise.all(initialBatch);

    // 3. Preload remaining frames in background chunks so scrubbing is instant
    let nextIndex = 20;
    const chunkSize = 15;

    const loadNextChunk = () => {
      if (nextIndex >= this.totalFrames) return;

      const chunkPromises = [];
      const end = Math.min(nextIndex + chunkSize, this.totalFrames);

      for (let i = nextIndex; i < end; i++) {
        chunkPromises.push(this.preloadImage(i));
      }
      nextIndex = end;

      Promise.all(chunkPromises).then(() => {
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(loadNextChunk, { timeout: 800 });
        } else {
          setTimeout(loadNextChunk, 60);
        }
      });
    };

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(loadNextChunk, { timeout: 800 });
    } else {
      setTimeout(loadNextChunk, 80);
    }
  }

  onScroll() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    const maxScroll = Math.max(
      (document.documentElement.scrollHeight || document.body.scrollHeight) - window.innerHeight,
      1
    );

    // Calculate scroll progress between 0.0 and 1.0
    const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1);

    // Map progress directly to frame index
    this.targetFrame = Math.min(
      Math.floor(progress * (this.totalFrames - 1)),
      this.totalFrames - 1
    );

    // Start smoothing loop if not already running
    if (!this.isRendering) {
      this.isRendering = true;
      this.renderLoop();
    }
  }

  renderLoop() {
    // Smoothly interpolate current frame toward target frame
    const diff = this.targetFrame - this.currentFrame;

    if (Math.abs(diff) > 0.08) {
      // Lerp toward target (0.18 gives snappy yet smooth response)
      this.currentFrame += diff * 0.18;
      
      const frameToDraw = Math.round(this.currentFrame);
      if (frameToDraw !== this.renderedFrameIndex) {
        // If exact target frame isn't loaded yet, find closest loaded frame
        const actualFrame = this.getClosestLoadedFrame(frameToDraw);
        if (actualFrame) {
          this.renderFrame(actualFrame);
          this.renderedFrameIndex = frameToDraw;
        }
      }

      // Continue render loop while moving
      this.animationFrameId = requestAnimationFrame(() => this.renderLoop());
    } else {
      // Settle on exact target frame
      this.currentFrame = this.targetFrame;
      const actualFrame = this.getClosestLoadedFrame(this.targetFrame);
      if (actualFrame) {
        this.renderFrame(actualFrame);
        this.renderedFrameIndex = this.targetFrame;
      }
      
      // Stop loop when stationary! No continuous background CPU/GPU usage!
      this.isRendering = false;
      this.animationFrameId = null;
    }
  }

  getClosestLoadedFrame(index) {
    if (this.frames[index] && this.isLoaded[index]) {
      return this.frames[index];
    }
    // Search backward for closest available frame
    for (let i = index - 1; i >= 0; i--) {
      if (this.frames[i] && this.isLoaded[i]) return this.frames[i];
    }
    // Search forward if backward not found
    for (let i = index + 1; i < this.totalFrames; i++) {
      if (this.frames[i] && this.isLoaded[i]) return this.frames[i];
    }
    return this.frames[0];
  }

  renderFrame(img) {
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const imgWidth = img.naturalWidth || 1920;
    const imgHeight = img.naturalHeight || 1080;

    // Cover math: preserve aspect ratio and center crop
    const hRatio = width / imgWidth;
    const vRatio = height / imgHeight;
    const ratio = Math.max(hRatio, vRatio);

    const centerShiftX = (width - imgWidth * ratio) / 2;
    const centerShiftY = (height - imgHeight * ratio) / 2;

    this.ctx.clearRect(0, 0, width, height);

    this.ctx.drawImage(
      img,
      0, 0, imgWidth, imgHeight,
      centerShiftX, centerShiftY, imgWidth * ratio, imgHeight * ratio
    );
  }
}

window.ScrollFrameAnimationController = ScrollFrameAnimationController;
