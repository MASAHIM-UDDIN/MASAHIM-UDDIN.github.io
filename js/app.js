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
   EXPERIENCE — polished TGT Nexus role card
   -------------------------------------------------------------------------- */
function initExperienceDetails() {
  const body = document.querySelector('#experience .experience-body');
  const company = document.querySelector('#experience .experience-company');
  const card = document.querySelector('#experience .experience-card');
  if (!body || !company || !card) return;

  body.innerHTML = `
    <div class="experience-summary-wrap">
      <div>
        <span class="experience-kicker">Engineering role</span>
        <p class="experience-summary">Working as a Python Developer at TGT Nexus, building and maintaining practical software solutions across backend, automation, and web application workflows.</p>
      </div>
      <span class="experience-stack-label">Python · Backend · Automation</span>
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

  company.innerHTML = '';
  const logo = document.createElement('img');
  logo.className = 'tgt-nexus-logo';
  logo.src = 'footer-logo.png';
  logo.alt = 'TGT Nexus logo';
  logo.loading = 'lazy';
  logo.decoding = 'async';

  const logoWrap = document.createElement('span');
  logoWrap.className = 'tgt-logo-wrap';
  logoWrap.appendChild(logo);
  company.appendChild(logoWrap);

  const companyName = document.createElement('span');
  companyName.className = 'tgt-company-name';
  companyName.textContent = 'TGT Nexus';
  company.appendChild(companyName);

  const roleLabel = document.createElement('span');
  roleLabel.className = 'tgt-role-label';
  roleLabel.textContent = 'Engineering';
  company.appendChild(roleLabel);

  card.classList.add('experience-card-enhanced');

  const styleId = 'experience-inline-styles';
  if (document.getElementById(styleId)) return;

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    #experience .experience-card-enhanced {
      position: relative;
      overflow: hidden;
      isolation: isolate;
      background:
        radial-gradient(circle at 8% 5%, rgba(255,90,31,.14), transparent 28%),
        radial-gradient(circle at 96% 90%, rgba(139,92,246,.14), transparent 30%),
        linear-gradient(145deg, rgba(17,21,32,.98), rgba(7,10,17,.95));
      border: 1px solid rgba(255,255,255,.12);
      box-shadow: 0 30px 90px rgba(0,0,0,.34), inset 0 1px 0 rgba(255,255,255,.05);
      transition: transform .3s ease, border-color .3s ease, box-shadow .3s ease;
    }
    #experience .experience-card-enhanced:hover {
      transform: translateY(-4px);
      border-color: rgba(255,255,255,.17);
      box-shadow: 0 34px 100px rgba(0,0,0,.40), 0 0 0 1px rgba(255,90,31,.06) inset;
    }
    #experience .experience-card-enhanced::before {
      content: '';
      position: absolute;
      inset: 0 0 auto;
      height: 2px;
      background: linear-gradient(90deg,#ff5a1f,#f2a7ff 48%,#8b5cf6);
      z-index: 3;
    }
    #experience .experience-card-enhanced::after {
      content: '';
      position: absolute;
      width: 320px;
      height: 320px;
      right: -170px;
      top: -170px;
      border-radius: 50%;
      background: rgba(139,92,246,.08);
      filter: blur(30px);
      pointer-events: none;
      z-index: 0;
    }
    #experience .experience-content { position: relative; z-index: 2; }
    #experience .experience-header { align-items: flex-start; gap: 24px; }
    #experience .experience-role { letter-spacing: -.03em; }
    #experience .experience-company {
      display: inline-flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 11px;
    }
    #experience .experience-company .company-icon { display: none; }
    #experience .tgt-logo-wrap {
      width: 116px;
      height: 48px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 5px 10px;
      border: 1px solid rgba(255,255,255,.12);
      border-radius: 13px;
      background: linear-gradient(145deg, rgba(255,255,255,.07), rgba(255,255,255,.025));
      box-shadow: 0 10px 30px rgba(0,0,0,.22), inset 0 1px 0 rgba(255,255,255,.05);
      overflow: hidden;
      transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease;
    }
    #experience .tgt-logo-wrap:hover {
      transform: translateY(-2px);
      border-color: rgba(255,90,31,.30);
      box-shadow: 0 14px 34px rgba(0,0,0,.28), 0 0 18px rgba(255,90,31,.08);
    }
    #experience .tgt-nexus-logo {
      width: 100%;
      height: 100%;
      object-fit: contain;
      object-position: center;
      display: block;
    }
    #experience .tgt-company-name {
      color: #ff6b36;
      font-weight: 800;
      letter-spacing: -.01em;
    }
    #experience .tgt-role-label {
      padding: 5px 9px;
      border: 1px solid rgba(139,92,246,.22);
      background: rgba(139,92,246,.08);
      border-radius: 999px;
      color: #c4b5fd;
      font-family: var(--font-mono);
      font-size: .62rem;
      font-weight: 700;
      letter-spacing: .08em;
      text-transform: uppercase;
    }
    #experience .experience-body {
      margin-top: 30px;
      padding-top: 28px;
      border-top: 1px solid rgba(255,255,255,.08);
    }
    #experience .experience-summary-wrap {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 26px;
      margin-bottom: 20px;
    }
    #experience .experience-kicker {
      display: block;
      margin-bottom: 6px;
      color: #c4b5fd;
      font-family: var(--font-mono);
      font-size: .66rem;
      font-weight: 700;
      letter-spacing: .12em;
      text-transform: uppercase;
    }
    #experience .experience-summary {
      margin: 0;
      max-width: 900px;
      color: var(--text-muted);
      line-height: 1.78;
      font-size: 1rem;
    }
    #experience .experience-stack-label {
      white-space: nowrap;
      padding: 8px 12px;
      border: 1px solid rgba(139,92,246,.24);
      background: rgba(139,92,246,.08);
      border-radius: 999px;
      color: #ddd6fe;
      font-family: var(--font-mono);
      font-size: .64rem;
      font-weight: 700;
      letter-spacing: .06em;
    }
    #experience .experience-list {
      display: grid;
      grid-template-columns: repeat(2,minmax(0,1fr));
      gap: 13px;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    #experience .experience-list li {
      display: grid;
      grid-template-columns: 38px 1fr;
      gap: 12px;
      align-items: start;
      min-height: 84px;
      padding: 17px;
      border: 1px solid rgba(255,255,255,.075);
      border-radius: 15px;
      background: linear-gradient(145deg, rgba(255,255,255,.040), rgba(255,255,255,.018));
      color: #aeb6c6;
      line-height: 1.62;
      transition: transform .25s ease, border-color .25s ease, background .25s ease, box-shadow .25s ease;
    }
    #experience .experience-list li:hover {
      transform: translateY(-4px);
      border-color: rgba(255,90,31,.28);
      background: linear-gradient(145deg, rgba(255,90,31,.065), rgba(139,92,246,.035));
      box-shadow: 0 16px 34px rgba(0,0,0,.18);
    }
    #experience .experience-index {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      border-radius: 9px;
      background: linear-gradient(135deg, rgba(255,90,31,.18), rgba(139,92,246,.18));
      border: 1px solid rgba(255,255,255,.09);
      color: #fff;
      font-family: var(--font-mono);
      font-size: .62rem;
      font-weight: 700;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.08);
    }
    #experience .timeline-dot {
      box-shadow: 0 0 0 6px rgba(255,90,31,.08), 0 0 22px rgba(255,90,31,.38);
    }
    @media (max-width: 860px) {
      #experience .experience-list { grid-template-columns: 1fr; }
      #experience .experience-summary-wrap { align-items: flex-start; flex-direction: column; }
    }
    @media (max-width: 560px) {
      #experience .experience-header { gap: 16px; }
      #experience .experience-list li { min-height: auto; padding: 15px; }
      #experience .experience-stack-label { display: none; }
      #experience .tgt-logo-wrap { width: 100px; height: 44px; }
      #experience .tgt-role-label { display: none; }
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
