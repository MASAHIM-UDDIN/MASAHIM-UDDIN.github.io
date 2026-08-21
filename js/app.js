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
    if (!name || !email || !message) return showStatus('Please complete all fields before sending.', 'error');
    if (!/^\S+@\S+\.\S+$/.test(email)) return showStatus('Please provide a valid email address.', 'error');
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton?.innerHTML || 'Get In Touch →';
    if (submitButton) { submitButton.disabled = true; submitButton.innerHTML = 'Sending…'; }
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, email, message, _subject: `Portfolio Contact from ${name}`, _replyto: email, _template: 'table', _url: window.location.href, _honey: '' })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.success === false) throw new Error(result.message || 'Unable to submit the form.');
      form.reset();
      showStatus(`Thanks, ${name}! Your message has been sent successfully.`, 'success');
    } catch (error) {
      console.error('Contact form submission failed:', error);
      showStatus('We could not send your message right now. Please try again or email dr.masahimuddin@gmail.com directly.', 'error');
    } finally {
      if (submitButton) { submitButton.disabled = false; submitButton.innerHTML = originalText; }
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

function initExperienceDetails() {
  const section = document.querySelector('#experience');
  const body = section?.querySelector('.experience-body');
  const company = section?.querySelector('.experience-company');
  const card = section?.querySelector('.experience-card');
  const title = section?.querySelector('.section-title');
  if (!section || !body || !company || !card) return;

  if (title && !title.querySelector('.experience-title-accent')) {
    title.innerHTML = 'Professional <span class="experience-title-accent">Experience</span>';
  }

  body.innerHTML = `
    <div class="experience-summary-wrap">
      <div class="experience-summary-copy">
        <span class="experience-kicker"><span class="kicker-dot"></span> Engineering Role</span>
        <p class="experience-summary">Working as a Python Developer at TGT Nexus, building and maintaining practical software solutions across backend, automation, and web application workflows.</p>
      </div>
      <div class="experience-stack-label"><span class="stack-icon">&lt;/&gt;</span><span>Python</span><i></i><span>Backend</span><i></i><span>Automation</span></div>
    </div>
    <ul class="experience-list">
      <li><span class="experience-index">01</span><span class="experience-item-icon">&lt;/&gt;</span><span class="experience-item-text">Develop and maintain Python-based application logic and backend functionality.</span><span class="experience-item-arrow">→</span></li>
      <li><span class="experience-index">02</span><span class="experience-item-icon violet">●</span><span class="experience-item-text">Build and integrate REST APIs and connect application workflows with external services and data sources.</span><span class="experience-item-arrow">→</span></li>
      <li><span class="experience-index">03</span><span class="experience-item-icon">ϟ</span><span class="experience-item-text">Create automation scripts and data-processing workflows to reduce repetitive manual work.</span><span class="experience-item-arrow">→</span></li>
      <li><span class="experience-index">04</span><span class="experience-item-icon violet">▦</span><span class="experience-item-text">Work with SQL databases, data handling, and application-level database integration.</span><span class="experience-item-arrow">→</span></li>
      <li><span class="experience-index">05</span><span class="experience-item-icon violet">◈</span><span class="experience-item-text">Implement and troubleshoot frontend/backend features using JavaScript, HTML, CSS, and PHP when required by the project.</span><span class="experience-item-arrow">→</span></li>
      <li><span class="experience-index">06</span><span class="experience-item-icon violet">⌘</span><span class="experience-item-text">Use Git and GitHub for version control, collaboration, code review, and production changes.</span><span class="experience-item-arrow">→</span></li>
    </ul>
    <div class="experience-item-wide"><span class="experience-index">07</span><span class="experience-item-icon violet">✓</span><span class="experience-item-text">Debug existing systems, resolve application issues, and improve maintainability and reliability of production code.</span><span class="experience-item-arrow">→</span></div>
  `;

  company.innerHTML = '';
  const logoWrap = document.createElement('span');
  logoWrap.className = 'tgt-logo-wrap';
  const logo = document.createElement('img');
  logo.className = 'tgt-nexus-logo';
  logo.src = 'footer-logo.png';
  logo.alt = 'TGT Nexus logo';
  logo.loading = 'lazy';
  logo.decoding = 'async';
  logoWrap.appendChild(logo);
  company.appendChild(logoWrap);

  const companyName = document.createElement('span');
  companyName.className = 'tgt-company-name';
  companyName.innerHTML = 'TGT <strong>NEXUS</strong>';
  company.appendChild(companyName);

  const employment = document.createElement('span');
  employment.className = 'employment-pill';
  employment.innerHTML = '<span></span>Full-time';
  company.appendChild(employment);
  card.classList.add('experience-card-reference');

  const styleId = 'experience-reference-styles';
  if (document.getElementById(styleId)) return;
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    #experience .header-group{margin-bottom:34px}
    #experience .section-title{font-size:clamp(2.5rem,5vw,4rem);letter-spacing:-.045em;line-height:1.05}
    #experience .experience-title-accent{color:var(--accent-orange)}
    #experience .section-description{font-size:1.08rem;max-width:760px;margin-top:16px}
    #experience .experience-card-reference{position:relative;overflow:hidden;padding:52px 50px 46px;border-radius:30px;border:1px solid transparent;background:linear-gradient(#070a11,#070a11) padding-box,linear-gradient(110deg,#ff5a1f 0%,#ff7a3d 28%,#d65adf 65%,#8b5cf6 100%) border-box;box-shadow:0 28px 90px rgba(0,0,0,.38),inset 0 1px 0 rgba(255,255,255,.05)}
    #experience .experience-card-reference:before{content:'';position:absolute;inset:-40% -10% auto -15%;width:48%;height:70%;background:radial-gradient(circle,rgba(255,90,31,.18),transparent 70%);filter:blur(30px);pointer-events:none}
    #experience .experience-card-reference:after{content:'';position:absolute;inset:auto -12% -45% auto;width:45%;height:72%;background:radial-gradient(circle,rgba(139,92,246,.16),transparent 68%);filter:blur(34px);pointer-events:none}
    #experience .experience-content{position:relative;z-index:2}
    #experience .experience-header{display:flex;align-items:flex-start;justify-content:space-between;gap:30px}
    #experience .experience-role{font-size:clamp(2rem,4vw,3rem);font-weight:800;letter-spacing:-.045em}
    #experience .experience-company{display:flex;align-items:center;gap:16px;margin-top:18px;flex-wrap:wrap}
    #experience .tgt-logo-wrap{display:flex;align-items:center;justify-content:center;width:188px;height:58px;padding:8px 18px;border-radius:14px;background:rgba(10,12,18,.78);border:1px solid rgba(255,255,255,.14);box-shadow:inset 0 1px 0 rgba(255,255,255,.05),0 10px 28px rgba(0,0,0,.22)}
    #experience .tgt-nexus-logo{display:block;width:100%;height:100%;object-fit:contain;object-position:center;max-width:100%;border:0;border-radius:0;padding:0;background:transparent;box-shadow:none}
    #experience .tgt-company-name{color:#f97316;font-size:1.1rem;font-weight:800;letter-spacing:.02em}
    #experience .tgt-company-name strong{color:#ff4b18}
    #experience .employment-pill{display:inline-flex;align-items:center;gap:8px;padding:10px 16px;border-radius:999px;border:1px solid rgba(139,92,246,.35);background:rgba(139,92,246,.08);color:#d8b4fe;font-family:var(--font-mono);font-size:.82rem;font-weight:700}
    #experience .employment-pill span,#experience .kicker-dot{width:7px;height:7px;border-radius:50%;background:#a78bfa;box-shadow:0 0 12px rgba(167,139,250,.75)}
    #experience .experience-badge{border-color:rgba(255,90,31,.48);background:rgba(255,90,31,.04);box-shadow:0 0 22px rgba(255,90,31,.12)}
    #experience .experience-body{margin-top:44px;padding-top:30px;border-top:1px solid rgba(255,255,255,.10)}
    #experience .experience-summary-wrap{display:flex;align-items:center;justify-content:space-between;gap:36px;margin-bottom:28px}
    #experience .experience-summary-copy{max-width:760px}
    #experience .experience-kicker{display:inline-flex;align-items:center;gap:10px;margin-bottom:10px;color:#c4b5fd;font-family:var(--font-mono);font-size:.78rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase}
    #experience .experience-summary{margin:0;color:#cbd5e1;font-size:1.12rem;line-height:1.75}
    #experience .experience-stack-label{display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:15px 19px;border:1px solid rgba(167,139,250,.42);border-radius:999px;background:rgba(139,92,246,.06);color:#c4b5fd;font-family:var(--font-mono);font-size:.82rem;font-weight:700;white-space:nowrap;box-shadow:inset 0 1px 0 rgba(255,255,255,.04),0 8px 30px rgba(87,55,170,.10)}
    #experience .experience-stack-label i{width:4px;height:4px;border-radius:50%;background:#a78bfa}
    #experience .stack-icon{color:#e9d5ff;font-size:1rem}
    #experience .experience-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin:0;padding:0;list-style:none}
    #experience .experience-list li,#experience .experience-item-wide{position:relative;display:grid;grid-template-columns:42px 74px 1fr 42px;gap:14px;align-items:center;min-height:174px;padding:25px 24px;border-radius:22px;border:1px solid rgba(255,255,255,.10);background:linear-gradient(145deg,rgba(18,17,31,.86),rgba(9,10,17,.92));box-shadow:inset 0 1px 0 rgba(255,255,255,.04),0 18px 45px rgba(0,0,0,.16);overflow:hidden;transition:transform .3s ease,border-color .3s ease,box-shadow .3s ease}
    #experience .experience-list li:before,#experience .experience-item-wide:before{content:'';position:absolute;left:24px;right:24px;bottom:17px;height:5px;border-radius:999px;background:linear-gradient(90deg,#ff6330,#d34f86,#6d3be6);opacity:.9}
    #experience .experience-list li:hover,#experience .experience-item-wide:hover{transform:translateY(-6px);border-color:rgba(255,90,31,.34);box-shadow:inset 0 1px 0 rgba(255,255,255,.06),0 22px 55px rgba(0,0,0,.28),0 0 28px rgba(255,90,31,.07)}
    #experience .experience-index{align-self:start;color:#ff6530;font-family:var(--font-mono);font-size:1.05rem;font-weight:800;padding-top:4px}
    #experience .experience-item-icon{display:flex;align-items:center;justify-content:center;width:68px;height:68px;border-radius:19px;color:#ff7040;font-family:var(--font-mono);font-size:1.45rem;font-weight:800;border:1px solid rgba(196,181,253,.48);background:linear-gradient(145deg,rgba(255,90,31,.09),rgba(139,92,246,.08));box-shadow:inset 0 1px 0 rgba(255,255,255,.06),0 10px 28px rgba(0,0,0,.18)}
    #experience .experience-item-icon.violet{color:#b47cff}
    #experience .experience-item-text{align-self:start;color:#d7dee9;font-size:1.05rem;line-height:1.68;padding-top:8px}
    #experience .experience-item-arrow{justify-self:end;align-self:end;display:flex;align-items:center;justify-content:center;width:42px;height:42px;margin-bottom:-3px;border-radius:50%;border:1px solid rgba(196,181,253,.55);color:#d8b4fe;font-size:1.2rem;background:rgba(139,92,246,.05);transition:transform .25s ease,background .25s ease}
    #experience .experience-list li:hover .experience-item-arrow,#experience .experience-item-wide:hover .experience-item-arrow{transform:translateX(4px);background:rgba(255,90,31,.10)}
    #experience .experience-item-wide{margin-top:16px}
    @media (max-width:900px){#experience .experience-card-reference{padding:38px 28px}#experience .experience-summary-wrap{flex-direction:column;align-items:flex-start}#experience .experience-list{grid-template-columns:1fr}}
    @media (max-width:600px){#experience .experience-card-reference{padding:28px 18px;border-radius:22px}#experience .experience-header{flex-direction:column}#experience .tgt-logo-wrap{width:165px;height:52px}#experience .experience-list li,#experience .experience-item-wide{grid-template-columns:30px 58px 1fr 36px;gap:10px;padding:20px 16px;min-height:160px}#experience .experience-item-icon{width:56px;height:56px;border-radius:16px;font-size:1.1rem}#experience .experience-item-text{font-size:.95rem}#experience .experience-stack-label{white-space:normal;border-radius:18px}}
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
