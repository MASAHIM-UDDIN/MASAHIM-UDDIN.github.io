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
   EXPERIENCE — styled TGT Nexus role card
   -------------------------------------------------------------------------- */
function initExperienceDetails() {
  const body = document.querySelector('#experience .experience-body');
  const company = document.querySelector('#experience .experience-company');
  const card = document.querySelector('#experience .experience-card');
  if (!body || !company || !card) return;

  body.innerHTML = `
    <div class="experience-summary-wrap">
      <p class="experience-summary">
        Working as a Python Developer at TGT Nexus, building and maintaining practical software solutions across backend, automation, and web application workflows.
      </p>
      <span class="experience-stack-label">Core responsibilities</span>
    </div>
    <ul class="experience-list">
      <li><span class="experience-index">01</span><span>Develop and maintain Python-based application logic and backend functionality.</span></li>
      <li><span class="experience-index">02</span><span>Build and integrate REST APIs and connect application workflows with external services and data sources.</span></li>
      <li><span class="experience-index">03</span><span>Create automation scripts and data-processing workflows to reduce repetitive manual work.</span></li>
      <li><span class="experience-index">04</span><span>Work with SQL databases, data handling, and application-level database integration.</span></li>
      <li><span class="experience-index">05</span><span>Implement and troubleshoot frontend/backend features using JavaScript, HTML, CSS, and PHP when required by the project.</span></li>
      <li><span class="experience-index">06</span><span>Use Git and GitHub for version control, collaboration, code review, and production changes.</span></li>
      <li><span class="experience-index">07</span><span>Debug existing systems, resolve application issues, and improve maintainability and reliability of production code.</span></li>
    </ul>
  `;

  if (!company.querySelector('.tgt-nexus-logo')) {
    const logo = document.createElement('img');
    logo.className = 'tgt-nexus-logo';
    logo.src = 'footer-logo.png';
    logo.alt = 'TGT Nexus';
    logo.width = 42;
    logo.height = 42;
    logo.loading = 'lazy';
    logo.decoding = 'async';
    logo.addEventListener('error', () => logo.remove());
    company.prepend(logo);
  }

  card.classList.add('experience-card-enhanced');

  const styleId = 'experience-inline-styles';
  if (document.getElementById(styleId)) return;
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    #experience .experience-card-enhanced {
      position: relative;
      overflow: hidden;
      background:
        radial-gradient(circle at 8% 10%, rgba(255, 90, 31, 0.10), transparent 30%),
        radial-gradient(circle at 95% 88%, rgba(139, 92, 246, 0.09), transparent 32%),
        linear-gradient(145deg, rgba(15, 20, 32, 0.94), rgba(9, 12, 19, 0.88));
      border: 1px solid rgba(255, 255, 255, 0.10);
      box-shadow: 0 24px 70px rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.04);
    }
    #experience .experience-card-enhanced::before {
      content: '';
      position: absolute;
      inset: 0 0 auto;
      height: 1px;
      background: linear-gradient(90deg, #ff5a1f, rgba(216, 180, 254, 0.7), #8b5cf6);
      opacity: 0.85;
    }
    #experience .experience-content { position: relative; z-index: 2; }
    #experience .experience-header { align-items: flex-start; gap: 24px; }
    #experience .experience-role { letter-spacing: -0.025em; }
    #experience .experience-company {
      display: inline-flex;
      align-items: center;
      gap: 11px;
      margin-top: 9px;
    }
    #experience .tgt-nexus-logo {
      width: 42px;
      height: 42px;
      object-fit: contain;
      border-radius: 11px;
      padding: 7px;
      background: rgba(255, 255, 255, 0.045);
      border: 1px solid rgba(255, 255, 255, 0.10);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
      flex: 0 0 auto;
    }
    #experience .experience-company::after {
      content: 'TGT Nexus';
      display: none;
    }
    #experience .experience-body {
      margin-top: 28px;
      padding-top: 26px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }
    #experience .experience-summary-wrap {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 24px;
      margin-bottom: 18px;
    }
    #experience .experience-summary {
      margin: 0;
      max-width: 860px;
      color: var(--text-muted);
      line-height: 1.75;
      font-size: 1rem;
    }
    #experience .experience-stack-label {
      white-space: nowrap;
      padding: 7px 11px;
      border: 1px solid rgba(139, 92, 246, 0.22);
      background: rgba(139, 92, 246, 0.07);
      border-radius: 999px;
      color: #c4b5fd;
      font-family: var(--font-mono);
      font-size: 0.68rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    #experience .experience-list {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    #experience .experience-list li {
      display: grid;
      grid-template-columns: 36px 1fr;
      gap: 12px;
      align-items: start;
      min-height: 82px;
      padding: 16px;
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 13px;
      background: rgba(255, 255, 255, 0.025);
      color: var(--text-muted);
      line-height: 1.6;
      transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease;
    }
    #experience .experience-list li:hover {
      transform: translateY(-3px);
      border-color: rgba(255, 90, 31, 0.26);
      background: rgba(255, 90, 31, 0.045);
    }
    #experience .experience-index {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      border-radius: 9px;
      background: linear-gradient(135deg, rgba(255, 90, 31, 0.16), rgba(139, 92, 246, 0.16));
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #f9fafb;
      font-family: var(--font-mono);
      font-size: 0.63rem;
      font-weight: 700;
    }
    #experience .timeline-dot {
      box-shadow: 0 0 0 5px rgba(255, 90, 31, 0.08), 0 0 18px rgba(255, 90, 31, 0.35);
    }
    @media (max-width: 860px) {
      #experience .experience-list { grid-template-columns: 1fr; }
      #experience .experience-summary-wrap { align-items: flex-start; flex-direction: column; }
    }
    @media (max-width: 560px) {
      #experience .experience-header { gap: 16px; }
      #experience .experience-list li { min-height: auto; }
      #experience .experience-stack-label { display: none; }
    }
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
