/* ==========================================================================
   MASAHIM UDDIN - PYTHON DEVELOPER PORTFOLIO
   Application Logic, Animations, & Interactions
   ========================================================================== */

function startApp() {
  initNavbar();
  initMobileMenu();
  initScrollReveals();
  initCursorGlow();
  initActiveNavHighlight();
  initContactForm();
  initCodeWindowInteractions();
  initTypewriterSwapper();
  initExperienceDetails();
  showContactReturnStatus();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}

function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const handleScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

function initMobileMenu() {
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  if (!mobileToggle || !navLinks) return;

  const toggleMenu = () => {
    const isOpen = navLinks.classList.contains('open');
    navLinks.classList.toggle('open', !isOpen);
    mobileToggle.setAttribute('aria-expanded', String(!isOpen));
    mobileToggle.innerHTML = !isOpen
      ? '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>'
      : '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>';
  };

  mobileToggle.addEventListener('click', toggleMenu);
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) toggleMenu();
    });
  });
}

function initScrollReveals() {
  const reveals = document.querySelectorAll('.reveal-on-scroll');
  if (!reveals.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    reveals.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { root: null, rootMargin: '0px 0px -60px 0px', threshold: 0.15 });
  reveals.forEach(el => observer.observe(el));
}

function initCursorGlow() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const orb1 = document.querySelector('.glow-orb-1');
  const orb2 = document.querySelector('.glow-orb-2');
  if (!orb1 || !orb2) return;

  let mouseX = 0, mouseY = 0;
  let currentX1 = 0, currentY1 = 0;
  let currentX2 = 0, currentY2 = 0;
  let animationFrame = null;

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  const animateGlow = () => {
    currentX1 += (mouseX - currentX1) * 0.03;
    currentY1 += (mouseY - currentY1) * 0.03;
    currentX2 += (mouseX - currentX2) * 0.02;
    currentY2 += (mouseY - currentY2) * 0.02;
    orb1.style.transform = `translate3d(${currentX1 * 0.05}px, ${currentY1 * 0.05}px, 0)`;
    orb2.style.transform = `translate3d(${-currentX2 * 0.04}px, ${-currentY2 * 0.04}px, 0)`;
    animationFrame = requestAnimationFrame(animateGlow);
  };
  animationFrame = requestAnimationFrame(animateGlow);
  window.addEventListener('pagehide', () => {
    if (animationFrame) cancelAnimationFrame(animationFrame);
  }, { once: true });
}

function initActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
    });
  }, { rootMargin: '-30% 0px -60% 0px' });
  sections.forEach(section => observer.observe(section));
}

/* --------------------------------------------------------------------------
   CONTACT FORM — FormSubmit backend for GitHub Pages
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const statusDiv = document.getElementById('formStatus');
  if (!form || !statusDiv) return;

  const endpoint = 'https://formsubmit.co/ajax/dr.masahimuddin@gmail.com';

  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const messageInput = document.getElementById('contactMessage');
  if (!nameInput || !emailInput || !messageInput) return;

  nameInput.name = 'name';
  emailInput.name = 'email';
  messageInput.name = 'message';

  if (!form.querySelector('input[name="_honey"]')) {
    const honeypot = document.createElement('input');
    honeypot.type = 'text';
    honeypot.name = '_honey';
    honeypot.tabIndex = -1;
    honeypot.autocomplete = 'off';
    honeypot.style.display = 'none';
    form.appendChild(honeypot);
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !email || !message) {
      showStatus('Please complete all fields before sending.', 'error');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      showStatus('Please provide a valid email address.', 'error');
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton?.innerHTML || 'Get In Touch →';
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.innerHTML = 'Sending…';
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          message,
          _subject: `Portfolio Contact from ${name}`,
          _replyto: email,
          _template: 'table',
          _url: window.location.href,
          _honey: ''
        })
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success === false) {
        throw new Error(result.message || 'Unable to submit the form.');
      }

      form.reset();
      showStatus(`Thanks, ${name}! Your message has been sent successfully.`, 'success');
    } catch (error) {
      console.error('Contact form submission failed:', error);
      showStatus('We could not send your message right now. Please try again or email dr.masahimuddin@gmail.com directly.', 'error');
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.innerHTML = originalText;
      }
    }
  });

  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `form-status ${type}`;
    statusDiv.style.display = 'block';
  }
}

function showContactReturnStatus() {
  if (!window.location.search.includes('contact=success')) return;
  const statusDiv = document.getElementById('formStatus');
  if (!statusDiv) return;
  statusDiv.textContent = 'Thanks! Your message has been sent successfully.';
  statusDiv.className = 'form-status success';
  statusDiv.style.display = 'block';
}

/* --------------------------------------------------------------------------
   EXPERIENCE — concrete responsibilities, without invented metrics
   -------------------------------------------------------------------------- */
function initExperienceDetails() {
  const body = document.querySelector('#experience .experience-body');
  if (!body) return;

  body.innerHTML = `
    <p class="experience-summary">
      Working as a Python Developer at TGT Nexus, building and maintaining practical software solutions across backend, automation, and web application workflows.
    </p>
    <ul class="experience-list">
      <li>Develop and maintain Python-based application logic and backend functionality.</li>
      <li>Build and integrate REST APIs and connect application workflows with external services and data sources.</li>
      <li>Create automation scripts and data-processing workflows to reduce repetitive manual work.</li>
      <li>Work with SQL databases, data handling, and application-level database integration.</li>
      <li>Implement and troubleshoot frontend/backend features using JavaScript, HTML, CSS, and PHP when required by the project.</li>
      <li>Use Git and GitHub for version control, collaboration, code review, and production changes.</li>
      <li>Debug existing systems, resolve application issues, and improve maintainability and reliability of production code.</li>
    </ul>
  `;

  const styleId = 'experience-inline-styles';
  if (document.getElementById(styleId)) return;
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    .experience-summary { margin: 0 0 20px; color: var(--text-muted); line-height: 1.75; }
    .experience-list { margin: 0; padding-left: 1.2rem; display: grid; gap: 12px; color: var(--text-muted); }
    .experience-list li { position: relative; padding-left: 4px; line-height: 1.65; }
    .experience-list li::marker { color: var(--accent-orange); }
  `;
  document.head.appendChild(style);
}

function initCodeWindowInteractions() {
  const codeWindow = document.querySelector('.code-window');
  if (!codeWindow) return;
  codeWindow.querySelectorAll('.code-line').forEach(line => {
    line.addEventListener('mouseenter', () => { line.style.backgroundColor = 'rgba(255, 255, 255, 0.03)'; });
    line.addEventListener('mouseleave', () => { line.style.backgroundColor = 'transparent'; });
  });
}

function initTypewriterSwapper() {
  const target = document.getElementById('typewriterSwapper');
  if (!target || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  target.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
  target.style.display = 'inline-block';

  window.setInterval(() => {
    target.style.opacity = '0';
    target.style.transform = 'translateY(-6px)';
    window.setTimeout(() => {
      target.textContent = 'Masahim Uddin';
      target.style.transform = 'translateY(6px)';
      window.setTimeout(() => {
        target.style.opacity = '1';
        target.style.transform = 'translateY(0)';
      }, 50);
    }, 350);
  }, 3000);
}
