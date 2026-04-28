// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const target = document.querySelector(a.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

// Highlight active nav pill on scroll
const sections = [
  "about-sec",
  "projects",
  "certs",
  "skills-sec",
  "contact-sec",
];
const pills = document.querySelectorAll(".nav-pill");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        pills.forEach((p) => (p.style.background = ""));
        const active = document.querySelector(
          `.nav-pill[href="#${entry.target.id}"]`,
        );
        if (active) {
          active.style.background = "var(--yellow)";
          active.style.borderColor = "var(--yellow)";
        }
      }
    });
  },
  { threshold: 0.3 },
);
sections.forEach((id) => {
  const el = document.getElementById(id);
  if (el) observer.observe(el);
});

// Fade-in on scroll
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
    el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    fadeObserver.observe(el);
  });
