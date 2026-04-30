/* ═══════════════════════════════════════════════════════
   ANKIT HALDAR — PORTFOLIO JS
   Changes applied:
     1. Editable logo — swaps in image if data-logo-src is set
     2. Hamburger menu toggle (mobile)
     5. Skill icon visibility
     7. Photo auto-swap for hero and about sections
═══════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────
   CHANGE 1: LOGO IMAGE SWAP
   If the .logo-wrap element has a non-empty data-logo-src,
   load it; otherwise keep the AH fallback.
   To use your logo: set data-logo-src="./asset/img/logo.png"
   on the <div class="logo-wrap"> in index.html.
───────────────────────────────────────────────── */
function initLogo() {
  const wrap = document.querySelector('.logo-wrap');
  const logoImg = document.getElementById('logo-img');
  const logoFallback = document.getElementById('logo-fallback');
  if (!wrap || !logoImg || !logoFallback) return;

  const src = wrap.getAttribute('data-logo-src') || '';
  if (src.trim() !== '') {
    logoImg.src = src;
    logoImg.onload = () => {
      logoImg.style.display = 'block';
      logoFallback.style.display = 'none';
    };
    logoImg.onerror = () => {
      // src was set but image failed — keep fallback
      logoImg.style.display = 'none';
      logoFallback.style.display = 'flex';
    };
  }
}
initLogo();


/* ─────────────────────────────────────────────────
   CHANGE 7: PHOTO AUTO-SWAP
   Hero + about photos: show <img> and hide emoji
   if a valid src is provided.
   Set data-photo-src on .hero-photo-wrap for the hero photo.
   Set src directly on .about-profile-photo for the about photo.
───────────────────────────────────────────────── */
function initPhotos() {
  // Hero photo
  const heroWrap = document.querySelector('.hero-photo-wrap');
  const heroPhoto = document.getElementById('hero-photo');
  const heroPlaceholder = document.getElementById('hero-placeholder');
  if (heroWrap && heroPhoto && heroPlaceholder) {
    const src = heroWrap.getAttribute('data-photo-src') || '';
    if (src.trim() !== '') {
      heroPhoto.src = src;
      heroPhoto.onload = () => {
        heroPhoto.style.display = 'block';
        heroPlaceholder.style.display = 'none';
      };
      heroPhoto.onerror = () => {
        heroPhoto.style.display = 'none';
        heroPlaceholder.style.display = 'block';
      };
    }
  }

  // About photo
  const aboutPhoto = document.getElementById('about-photo');
  const aboutPlaceholder = document.getElementById('about-placeholder');
  if (aboutPhoto && aboutPlaceholder) {
    if (aboutPhoto.src && aboutPhoto.src !== window.location.href) {
      aboutPhoto.onload = () => {
        aboutPhoto.style.display = 'block';
        aboutPlaceholder.style.display = 'none';
      };
      aboutPhoto.onerror = () => {
        aboutPhoto.style.display = 'none';
        aboutPlaceholder.style.display = 'block';
      };
    }
  }
}
initPhotos();


/* ─────────────────────────────────────────────────
   CHANGE 6: SKILL ICONS — background-image approach
   ──────────────────────────────────────────────────
   WHY: SVG files ignore <img> width/height and can
   render at any size. CSS background-image always
   respects the element's fixed 16×16px box.

   HOW TO ADD AN ICON:
     Set  data-icon="./asset/img/icons/python.svg"
     on the <span class="skill-pill"> in index.html.
     Works with .svg, .png, .jpg — any image format.
───────────────────────────────────────────────── */
function initSkillIcons() {
  document.querySelectorAll('.skill-pill[data-icon]').forEach((pill) => {
    const src = (pill.getAttribute('data-icon') || '').trim();
    if (!src) return;
    const dot = document.createElement('span');
    dot.className = 'skill-icon-dot';
    dot.style.backgroundImage = `url('${src}')`;
    dot.setAttribute('aria-hidden', 'true');
    pill.insertBefore(dot, pill.firstChild);
  });
}

/* Same system for tool badges */
function initToolIcons() {
  document.querySelectorAll('.tool-badge[data-icon]').forEach((badge) => {
    const src = (badge.getAttribute('data-icon') || '').trim();
    if (!src) return;
    const dot = document.createElement('span');
    dot.className = 'tool-icon-dot';
    dot.style.backgroundImage = `url('${src}')`;
    dot.setAttribute('aria-hidden', 'true');
    badge.insertBefore(dot, badge.firstChild);
  });
}
initSkillIcons();
initToolIcons();


/* ─────────────────────────────────────────────────
   CHANGE 2: HAMBURGER MENU TOGGLE
───────────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const topbarNav = document.getElementById('topbar-nav');

function toggleMenu(forceClose = false) {
  const isOpen = topbarNav.classList.contains('open') || forceClose;
  if (isOpen) {
    topbarNav.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  } else {
    topbarNav.classList.add('open');
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
  }
}

if (hamburger && topbarNav) {
  hamburger.addEventListener('click', () => toggleMenu());

  // Close menu when a nav pill is tapped
  topbarNav.querySelectorAll('.nav-pill').forEach((pill) => {
    pill.addEventListener('click', () => toggleMenu(true));
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (
      topbarNav.classList.contains('open') &&
      !topbarNav.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      toggleMenu(true);
    }
  });
}


/* ─────────────────────────────────────────────────
   SMOOTH SCROLL for anchor links
───────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});


/* ─────────────────────────────────────────────────
   ACTIVE NAV PILL on scroll
───────────────────────────────────────────────── */
const sections = ['about-sec', 'projects', 'certs', 'skills-sec', 'contact-sec'];
const pills = document.querySelectorAll('.nav-pill');

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        pills.forEach((p) => {
          p.style.background = '';
          p.style.borderColor = '';
        });
        const active = document.querySelector(`.nav-pill[href="#${entry.target.id}"]`);
        if (active) {
          active.style.background = 'var(--yellow)';
          active.style.borderColor = 'var(--yellow)';
        }
      }
    });
  },
  { threshold: 0.3 }
);

sections.forEach((id) => {
  const el = document.getElementById(id);
  if (el) navObserver.observe(el);
});


/* ─────────────────────────────────────────────────
   FADE-IN ON SCROLL
───────────────────────────────────────────────── */
const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll('.project-card, .cert-card, .contact-card').forEach((el) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease, box-shadow 0.25s ease';
  fadeObserver.observe(el);
});