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
  const wrap = document.querySelector(".logo-wrap");
  const logoImg = document.getElementById("logo-img");
  const logoFallback = document.getElementById("logo-fallback");
  if (!wrap || !logoImg || !logoFallback) return;

  const src = wrap.getAttribute("data-logo-src") || "";
  if (src.trim() !== "") {
    logoImg.src = src;
    logoImg.onload = () => {
      logoImg.style.display = "block";
      logoFallback.style.display = "none";
    };
    logoImg.onerror = () => {
      // src was set but image failed — keep fallback
      logoImg.style.display = "none";
      logoFallback.style.display = "flex";
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
  const heroWrap = document.querySelector(".hero-photo-wrap");
  const heroPhoto = document.getElementById("hero-photo");
  const heroPlaceholder = document.getElementById("hero-placeholder");
  if (heroWrap && heroPhoto && heroPlaceholder) {
    const src = heroWrap.getAttribute("data-photo-src") || "";
    if (src.trim() !== "") {
      heroPhoto.src = src;
      heroPhoto.onload = () => {
        heroPhoto.style.display = "block";
        heroPlaceholder.style.display = "none";
      };
      heroPhoto.onerror = () => {
        heroPhoto.style.display = "none";
        heroPlaceholder.style.display = "block";
      };
    }
  }

  // About photo
  const aboutPhoto = document.getElementById("about-photo");
  const aboutPlaceholder = document.getElementById("about-placeholder");
  if (aboutPhoto && aboutPlaceholder) {
    if (aboutPhoto.src && aboutPhoto.src !== window.location.href) {
      aboutPhoto.onload = () => {
        aboutPhoto.style.display = "block";
        aboutPlaceholder.style.display = "none";
      };
      aboutPhoto.onerror = () => {
        aboutPhoto.style.display = "none";
        aboutPlaceholder.style.display = "block";
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
  document.querySelectorAll(".skill-pill[data-icon]").forEach((pill) => {
    const src = (pill.getAttribute("data-icon") || "").trim();
    if (!src) return;
    const dot = document.createElement("span");
    dot.className = "skill-icon-dot";
    dot.style.backgroundImage = `url('${src}')`;
    dot.setAttribute("aria-hidden", "true");
    pill.insertBefore(dot, pill.firstChild);
  });
}

/* Same system for tool badges */
function initToolIcons() {
  document.querySelectorAll(".tool-badge[data-icon]").forEach((badge) => {
    const src = (badge.getAttribute("data-icon") || "").trim();
    if (!src) return;
    const dot = document.createElement("span");
    dot.className = "tool-icon-dot";
    dot.style.backgroundImage = `url('${src}')`;
    dot.setAttribute("aria-hidden", "true");
    badge.insertBefore(dot, badge.firstChild);
  });
}
initSkillIcons();
initToolIcons();

/* ─────────────────────────────────────────────────
   CHANGE 2: HAMBURGER MENU TOGGLE
───────────────────────────────────────────────── */
/* ─────────────────────────────────────────────────
   HAMBURGER MENU TOGGLE
───────────────────────────────────────────────── */
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

function toggleMenu(forceClose = false) {
  if (!mobileMenu) return;
  const isOpen = mobileMenu.classList.contains("open") || forceClose;
  if (isOpen) {
    mobileMenu.classList.remove("open");
    hamburger.classList.remove("active");
    hamburger.setAttribute("aria-expanded", "false");
  } else {
    mobileMenu.classList.add("open");
    hamburger.classList.add("active");
    hamburger.setAttribute("aria-expanded", "true");
  }
}

if (hamburger && mobileMenu) {
  hamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => toggleMenu(true));
  });

  document.addEventListener("click", (e) => {
    if (
      mobileMenu.classList.contains("open") &&
      !mobileMenu.contains(e.target) &&
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
  a.addEventListener("click", (e) => {
    const target = document.querySelector(a.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

/* ─────────────────────────────────────────────────
   ACTIVE NAV PILL on scroll
───────────────────────────────────────────────── */
(function () {
  const ease = "power3.out";
  const pills = document.querySelectorAll(".pill");
  const tlRefs = [];
  const activeTweens = [];

  function layout() {
    pills.forEach((pill, i) => {
      const circle = pill.querySelector(".hover-circle");
      const label = pill.querySelector(".pill-label");
      const white = pill.querySelector(".pill-label-hover");
      if (!circle) return;

      const rect = pill.getBoundingClientRect();
      const w = rect.width,
        h = rect.height;
      const R = ((w * w) / 4 + h * h) / (2 * h);
      const D = Math.ceil(2 * R) + 2;
      const delta =
        Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
      const originY = D - delta;

      circle.style.width = D + "px";
      circle.style.height = D + "px";
      circle.style.bottom = -delta + "px";

      gsap.set(circle, {
        xPercent: -50,
        scale: 0,
        transformOrigin: `50% ${originY}px`,
      });
      if (label) gsap.set(label, { y: 0 });
      if (white) gsap.set(white, { y: h + 12, opacity: 0 });

      tlRefs[i]?.kill();
      const tl = gsap.timeline({ paused: true });
      tl.to(
        circle,
        { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: "auto" },
        0,
      );
      if (label)
        tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: "auto" }, 0);
      if (white) {
        gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
        tl.to(
          white,
          { y: 0, opacity: 1, duration: 2, ease, overwrite: "auto" },
          0,
        );
      }
      tlRefs[i] = tl;
    });
  }

  function handleEnter(i) {
    const tl = tlRefs[i];
    if (!tl) return;
    activeTweens[i]?.kill();
    activeTweens[i] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease,
      overwrite: "auto",
    });
  }

  function handleLeave(i) {
    const tl = tlRefs[i];
    if (!tl) return;
    activeTweens[i]?.kill();
    activeTweens[i] = tl.tweenTo(0, { duration: 0.2, ease, overwrite: "auto" });
  }

  pills.forEach((pill, i) => {
    pill.addEventListener("mouseenter", () => handleEnter(i));
    pill.addEventListener("mouseleave", () => handleLeave(i));
    pill.addEventListener("click", () => {
      document
        .querySelectorAll(".pill")
        .forEach((p) => p.classList.remove("is-active"));
      pill.classList.add("is-active");
    });
  });

  // Logo spin
  const logoEl = document.getElementById("logoEl");
  if (logoEl) {
    logoEl.addEventListener("mouseenter", () => {
      gsap.set(logoEl, { rotate: 0 });
      gsap.to(logoEl, { rotate: 360, duration: 0.4, ease, overwrite: "auto" });
    });
  }

  // Auto highlight active link on scroll
  const sectionIds = [
    "about-sec",
    "projects",
    "certs",
    "skills-sec",
    "contact-sec",
  ];
  window.addEventListener("scroll", () => {
    let current = sectionIds[0];
    sectionIds.forEach((id) => {
      const sec = document.getElementById(id);
      if (sec && window.scrollY >= sec.offsetTop - 120) current = id;
    });
    pills.forEach((pill) => {
      const href = pill.getAttribute("href")?.replace("#", "");
      if (href === current) {
        document
          .querySelectorAll(".pill")
          .forEach((p) => p.classList.remove("is-active"));
        pill.classList.add("is-active");
      }
    });
  });

  window.addEventListener("resize", layout);
  setTimeout(layout, 100);
})();

/* ─────────────────────────────────────────────────
   FADE-IN ON SCROLL
───────────────────────────────────────────────── */
const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  },
  { threshold: 0.1 },
);

document
  .querySelectorAll(".project-card, .cert-card, .contact-card")
  .forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition =
      "opacity 0.5s ease, transform 0.5s ease, box-shadow 0.25s ease";
    fadeObserver.observe(el);
  });
