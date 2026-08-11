/**
 * Main Application Orchestrator
 * Ankit Haldar Portfolio — Scroll-Driven Cinematic Experience
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Scroll-Controlled Frame Animation Controller (NO autoplay)
  const frameController = new ScrollFrameAnimationController({
    canvasId: 'hero-animation-canvas',
    totalFrames: 240
  });

  // 2. Initialize Modals, Form Actions, and UI Interactions
  setupModals();
  setupContactForm();
  setupResumeAction();
  setupScrollReveal();
});

/**
 * Toast Notification System
 */
function showToast(message, duration = 3500) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast-item';
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ea2e2e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  requestAnimationFrame(() => {
    toast.classList.add('active');
  });

  setTimeout(() => {
    toast.classList.remove('active');
    setTimeout(() => toast.remove(), 400);
  }, duration);
}

/**
 * Modal Handling
 */
function setupModals() {
  const allModalBackdrops = document.querySelectorAll('.modal-backdrop');

  // Close modals on clicking close button or backdrop
  allModalBackdrops.forEach(modal => {
    const closeBtn = modal.querySelector('.modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeModal(modal));
    }
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      allModalBackdrops.forEach(m => closeModal(m));
    }
  });

  // Project Card Clicks
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      const projectId = card.dataset.projectId;
      openProjectModal(projectId);
    });
  });

  // View All Projects Link
  const viewAllBtn = document.getElementById('view-all-projects-btn');
  if (viewAllBtn) {
    viewAllBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openProjectModal('01');
    });
  }

  // Collaborate CTA Buttons
  const collaborateBtns = document.querySelectorAll('.trigger-collaborate');
  collaborateBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openContactModal();
    });
  });

  // Quick Copy Email
  const copyEmailRow = document.getElementById('copy-email-row');
  if (copyEmailRow) {
    copyEmailRow.addEventListener('click', () => {
      const email = 'haldarankit2006@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email copied to clipboard!');
      }).catch(() => {
        showToast('Email: ' + email);
      });
    });
  }
}

function openModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.remove('active');
  document.body.style.overflow = '';
}

function openContactModal() {
  const modal = document.getElementById('contact-modal');
  openModal(modal);
}

function openProjectModal(projectId) {
  const project = PORTFOLIO_DATA.projects.find(p => p.id === projectId) || PORTFOLIO_DATA.projects[0];
  const modal = document.getElementById('project-modal');
  const body = document.getElementById('project-modal-body');
  if (!modal || !body) return;

  body.innerHTML = `
    <div style="margin-bottom: 20px;">
      <span class="project-index-badge" style="position: static; display: inline-block; margin-bottom: 8px;">PROJECT ${project.id}</span>
      <h2 style="font-family: var(--font-body); font-size: 1.5rem; font-weight: 800; text-transform: uppercase; color: #fff; margin-bottom: 4px;">
        ${project.title}
      </h2>
      <div style="font-size: 0.76rem; font-weight: 800; color: var(--accent-red); letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 16px;">
        ${project.category}
      </div>
      <div style="width: 100%; height: 260px; border-radius: var(--radius-xs); overflow: hidden; margin-bottom: 18px; border: 1px solid rgba(255,255,255,0.1);">
        <img src="${project.image}" alt="${project.title}" style="width: 100%; height: 100%; object-fit: cover;">
      </div>
      <p style="font-size: 0.88rem; line-height: 1.6; color: var(--text-secondary); margin-bottom: 16px;">
        ${project.description}
      </p>
      <p style="font-size: 0.84rem; line-height: 1.6; color: #d4d4d8; margin-bottom: 20px;">
        ${project.details}
      </p>
      <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px;">
        ${project.tags.map(t => `<span style="background: rgba(234,46,46,0.12); border: 1px solid var(--accent-red-border); color: #fff; padding: 4px 10px; border-radius: 4px; font-size: 0.72rem; font-weight: 700;">${t}</span>`).join('')}
      </div>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; background: rgba(0,0,0,0.3); border: 1px solid var(--border-subtle); padding: 14px; border-radius: var(--radius-xs); margin-bottom: 20px;">
        ${Object.entries(project.metrics).map(([key, val]) => `
          <div>
            <div style="font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">${key.replace(/([A-Z])/g, ' $1')}</div>
            <div style="font-family: var(--font-display); font-size: 1.3rem; color: var(--accent-red); font-weight: 900;">${val}</div>
          </div>
        `).join('')}
      </div>
      <div style="display: flex; gap: 12px;">
        <a href="https://github.com/AnkitHaldar2006" target="_blank" rel="noopener noreferrer" class="btn-primary" style="flex: 1; text-align: center; text-decoration: none;">
          <span>Explore Source Code on GitHub</span>
          <span class="btn-arrow">→</span>
        </a>
      </div>
    </div>
  `;

  openModal(modal);
}

/**
 * Contact Form Logic
 */
function setupContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('[name="name"]').value;
    showToast(`Thank you, ${name || 'friend'}! Message sent successfully.`);
    form.reset();
    setTimeout(() => {
      const modal = document.getElementById('contact-modal');
      closeModal(modal);
    }, 1200);
  });
}

/**
 * Resume Download Action
 */
function setupResumeAction() {
  const resumeBtn = document.getElementById('download-resume-btn');
  if (!resumeBtn) return;

  resumeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showToast('Downloading Ankit Haldar - Resume (Data Science)...');
    
    const blob = new Blob([
      `ANKIT HALDAR - RESUME
BCA Student & Aspiring Data Scientist
Techno College Hooghly (2025–2035)

CONTACT INFORMATION
Email: haldarankit2006@gmail.com
GitHub: https://github.com/AnkitHaldar2006
LinkedIn: https://www.linkedin.com/in/ankit-haldar-77b823373/
Location: Kolkata, India

PROFESSIONAL SUMMARY
Aspiring Data Scientist and BCA student (Freshman) at Techno College Hooghly (2025-2035) with strong foundations in Python, Data Analysis, Machine Learning, C, C++, and Web Development. Passionate about uncovering actionable patterns from data and developing predictive analytical pipelines.

EDUCATION
Bachelor of Computer Applications (BCA)
Techno College Hooghly (2025–2035) · Hooghly, West Bengal, India

TECHNICAL SKILLS
- Programming Languages: Python, C, C++
- Libraries & Frameworks: Pandas, NumPy, Matplotlib, Scikit-learn
- Developer Tools: Git, GitHub, VS Code, Jupyter Notebook
- Data & Machine Learning: Data Analysis, Data Visualization, Machine Learning, Exploratory Data Analysis (EDA)

FEATURED PROJECTS
1. Personal Portfolio Website
   - Modern, fully responsive portfolio built from scratch with custom HTML5, CSS3, and JavaScript.
2. Data Analysis with Python
   - Exploratory data analysis (EDA) pipeline utilizing Pandas and Matplotlib for statistical insight discovery.
3. C++ Logic & Console Engine
   - Modular console applications and mini-game engines built in modern C++ with object-oriented paradigms.

CERTIFICATIONS & MILESTONES
- Python for Everybody (Coursera / University of Michigan) — In Progress
- Data Science Foundations (NPTEL / IIT) — Enrolling
- Introduction to Machine Learning (Google / Kaggle) — Planned
- Web Development Bootcamp (Udemy) — In Progress`
    ], { type: 'text/plain' });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Ankit_Haldar_Data_Science_Resume.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}

/**
 * Scroll Reveal Animations
 */
function setupScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));
}
