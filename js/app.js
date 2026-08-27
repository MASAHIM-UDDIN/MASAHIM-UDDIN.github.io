/* ==========================================================================
   MASAHIM UDDIN - PYTHON DEVELOPER PORTFOLIO
   Application Logic, Animations, & Interactions
   ========================================================================== */

const CONTACT_EMAIL = "";

function startApp() {
  initNavbar();
  initMobileMenu();
  initScrollReveals();
  initCursorGlow();
  initActiveNavHighlight();
  initContactForm();
  initCodeWindowInteractions();
  initTypewriterSwapper();
  initExperienceTechStack();
  initSkillsIcons();
  initAboutEnhancement();
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
    mobileToggle.innerHTML = isOpen
      ? '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>'
      : '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>';
  };
  mobileToggle.addEventListener('click', toggleMenu);
  navLinks.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', () => {
    if (navLinks.classList.contains('open')) toggleMenu();
  }));
}

function initScrollReveals() {
  const reveals = document.querySelectorAll('.reveal-on-scroll');
  if (!reveals.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    reveals.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }), { rootMargin: '0px 0px -60px 0px', threshold: 0.15 });
  reveals.forEach(el => observer.observe(el));
}

function initCursorGlow() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const orb1 = document.querySelector('.glow-orb-1');
  const orb2 = document.querySelector('.glow-orb-2');
  if (!orb1 || !orb2) return;
  let mouseX = 0, mouseY = 0, currentX1 = 0, currentY1 = 0, currentX2 = 0, currentY2 = 0;
  window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; }, { passive: true });
  const animate = () => {
    currentX1 += (mouseX - currentX1) * 0.03;
    currentY1 += (mouseY - currentY1) * 0.03;
    currentX2 += (mouseX - currentX2) * 0.02;
    currentY2 += (mouseY - currentY2) * 0.02;
    orb1.style.transform = `translate3d(${currentX1 * 0.05}px, ${currentY1 * 0.05}px, 0)`;
    orb2.style.transform = `translate3d(${-currentX2 * 0.04}px, ${-currentY2 * 0.04}px, 0)`;
    requestAnimationFrame(animate);
  };
  animate();
}

function initActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.getAttribute('id');
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
  }), { rootMargin: '-30% 0px -60% 0px' });
  sections.forEach(section => observer.observe(section));
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  const statusDiv = document.getElementById('formStatus');
  if (!form || !statusDiv) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('contactName')?.value.trim() || '';
    const email = document.getElementById('contactEmail')?.value.trim() || '';
    const message = document.getElementById('contactMessage')?.value.trim() || '';
    if (!name || !email || !message) return showStatus('Please complete all fields before sending.', 'error');
    if (!/^\S+@\S+\.\S+$/.test(email)) return showStatus('Please provide a valid email address.', 'error');
    if (CONTACT_EMAIL) {
      const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
      showStatus(`Thank you, ${name}! Your email client has been opened to send the message.`, 'success');
    } else {
      showStatus(`Thank you, ${name}! Your message was validated successfully. (Note: To send emails directly, set the CONTACT_EMAIL variable in app.js).`, 'success');
    }
    form.reset();
  });
  function showStatus(msg, type) {
    statusDiv.textContent = msg;
    statusDiv.className = `form-status ${type}`;
    statusDiv.style.display = 'block';
    setTimeout(() => { statusDiv.style.display = 'none'; }, 6000);
  }
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
  if (!target) return;
  const phrases = ['Masahim Uddin', 'Python Developer'];
  let phraseIndex = 0;
  target.style.transition = 'opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
  target.style.display = 'inline-block';
  function swapText() {
    target.style.opacity = '0';
    target.style.transform = 'translateY(-8px)';
    setTimeout(() => {
      phraseIndex = (phraseIndex + 1) % phrases.length;
      target.textContent = phrases[phraseIndex];
      target.style.transform = 'translateY(8px)';
      setTimeout(() => { target.style.opacity = '1'; target.style.transform = 'translateY(0)'; }, 50);
    }, 450);
  }
  setInterval(swapText, 3000);
}

function initExperienceTechStack() {
  const body = document.querySelector('.experience-body');
  if (!body || body.querySelector('.experience-tech-stack')) return;
  const style = document.createElement('style');
  style.textContent = `
    .experience-tech-stack{margin-top:26px;padding-top:22px;border-top:1px solid var(--border-subtle)}
    .experience-tech-label{margin-bottom:14px;font-family:var(--font-mono);font-size:.75rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#b58cff}
    .experience-tech-grid{display:grid;grid-template-columns:repeat(7,minmax(70px,1fr));gap:12px}
    .experience-tech-item{min-height:84px;padding:10px 6px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;text-align:center;background:linear-gradient(145deg,rgba(255,255,255,.045),rgba(15,20,32,.82));border:1px solid var(--border-subtle);border-radius:12px;transition:transform var(--transition-fast),border-color var(--transition-fast),box-shadow var(--transition-fast),background var(--transition-fast)}
    .experience-tech-item img{width:30px;height:30px;object-fit:contain;transition:transform var(--transition-fast)}
    .experience-tech-item span{font-size:.72rem;font-weight:600;color:var(--text-muted);line-height:1.2;white-space:nowrap}
    .experience-tech-item:hover{transform:translateY(-4px);border-color:rgba(139,92,246,.45);background:linear-gradient(145deg,rgba(139,92,246,.12),rgba(255,90,31,.07));box-shadow:0 10px 24px rgba(0,0,0,.35),0 0 22px rgba(139,92,246,.12)}
    .experience-tech-item:hover img{transform:scale(1.08)}
    @media(max-width:1024px){.experience-tech-grid{grid-template-columns:repeat(4,minmax(76px,1fr))}}
    @media(max-width:768px){.experience-tech-grid{grid-template-columns:repeat(4,minmax(64px,1fr));gap:9px}.experience-tech-item{min-height:76px}.experience-tech-item img{width:26px;height:26px}.experience-tech-item span{font-size:.66rem}}
    @media(max-width:480px){.experience-tech-grid{grid-template-columns:repeat(3,minmax(74px,1fr))}}
  `;
  document.head.appendChild(style);
  const stack = document.createElement('div');
  stack.className = 'experience-tech-stack';
  stack.innerHTML = `
    <div class="experience-tech-label">Languages &amp; Technologies</div>
    <div class="experience-tech-grid">
      <div class="experience-tech-item"><img src="https://cdn.simpleicons.org/python/3776AB" alt="Python" loading="lazy"><span>Python</span></div>
      <div class="experience-tech-item"><img src="https://cdn.simpleicons.org/django/44B78B" alt="Django" loading="lazy"><span>Django</span></div>
      <div class="experience-tech-item"><img src="https://cdn.simpleicons.org/flask/FFFFFF" alt="Flask" loading="lazy"><span>Flask</span></div>
      <div class="experience-tech-item"><img src="https://cdn.simpleicons.org/fastapi/009688" alt="FastAPI" loading="lazy"><span>FastAPI</span></div>
      <div class="experience-tech-item"><img src="https://cdn.simpleicons.org/postgresql/4169E1" alt="PostgreSQL" loading="lazy"><span>PostgreSQL</span></div>
      <div class="experience-tech-item"><img src="https://cdn.simpleicons.org/mysql/4479A1" alt="MySQL" loading="lazy"><span>MySQL</span></div>
      <div class="experience-tech-item"><img src="https://cdn.simpleicons.org/git/F05032" alt="Git" loading="lazy"><span>Git</span></div>
    </div>`;
  body.appendChild(stack);
}

function initSkillsIcons() {
  if (document.querySelector('.skills-icon-style')) return;

  const iconMap = {
    'Python': ['https://cdn.simpleicons.org/python/3776AB', 'Python'],
    'JavaScript': ['https://cdn.simpleicons.org/javascript/F7DF1E', 'JavaScript'],
    'HTML': ['https://cdn.simpleicons.org/html5/E34F26', 'HTML5'],
    'CSS': ['https://cdn.simpleicons.org/css/1572B6', 'CSS3'],
    'Python Backend Dev': ['https://cdn.simpleicons.org/python/3776AB', 'Python'],
    'REST APIs': ['https://cdn.simpleicons.org/fastapi/009688', 'REST APIs'],
    'Authentication': ['https://cdn.simpleicons.org/letsencrypt/FFFFFF', 'Authentication'],
    'Server-side Development': ['https://cdn.simpleicons.org/django/44B78B', 'Server-side Development'],
    'SQL': ['https://cdn.simpleicons.org/mysql/4479A1', 'SQL'],
    'Database Design': ['https://cdn.simpleicons.org/postgresql/4169E1', 'Database Design'],
    'Data Handling': ['https://cdn.simpleicons.org/pandas/150458', 'Data Handling'],
    'Git': ['https://cdn.simpleicons.org/git/F05032', 'Git'],
    'GitHub': ['https://cdn.simpleicons.org/github/FFFFFF', 'GitHub'],
    'VS Code': ['https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg', 'VS Code'],
    'Linux': ['https://cdn.simpleicons.org/linux/FCC624', 'Linux']
  };

  const style = document.createElement('style');
  style.className = 'skills-icon-style';
  style.textContent = `
    .skill-item{justify-content:flex-start;gap:10px}
    .skill-item > span:first-child{display:inline-flex;align-items:center;gap:10px;min-width:0;flex:1}
    .skill-item .skill-tech-icon{width:18px;height:18px;object-fit:contain;flex:0 0 18px;filter:drop-shadow(0 0 8px rgba(139,92,246,.12));transition:transform var(--transition-fast)}
    .skill-item:hover .skill-tech-icon{transform:scale(1.12)}
    .skill-item .skill-indicator{margin-left:auto;flex:0 0 7px}
    @media(max-width:480px){.skill-item .skill-tech-icon{width:17px;height:17px;flex-basis:17px}.skill-item{gap:8px}}
  `;
  document.head.appendChild(style);

  document.querySelectorAll('.skill-item').forEach(item => {
    if (item.querySelector('.skill-tech-icon')) return;
    const label = item.querySelector('span:first-child');
    if (!label) return;
    const name = label.textContent.trim();
    const icon = iconMap[name];
    if (!icon) return;
    const img = document.createElement('img');
    img.className = 'skill-tech-icon';
    img.src = icon[0];
    img.alt = icon[1];
    img.loading = 'lazy';
    label.prepend(img);
  });
}

function initAboutEnhancement() {
  if (document.querySelector('.about-enhancement-style')) return;

  const style = document.createElement('style');
  style.className = 'about-enhancement-style';
  style.textContent = `
    .about-section{position:relative;overflow:hidden}
    .about-section::before{content:'';position:absolute;left:-260px;top:110px;width:560px;height:560px;background:radial-gradient(circle,rgba(255,90,31,.15) 0%,rgba(255,90,31,.055) 32%,transparent 70%);filter:blur(22px);pointer-events:none}
    .about-section::after{content:'';position:absolute;right:-220px;bottom:-200px;width:520px;height:520px;background:radial-gradient(circle,rgba(139,92,246,.18) 0%,rgba(139,92,246,.06) 36%,transparent 72%);filter:blur(24px);pointer-events:none}
    .about-section>.container{position:relative;z-index:1}
    .about-section .header-group{position:relative;margin-bottom:48px}
    .about-section .header-group::after{content:'';display:block;width:110px;height:2px;margin-top:18px;border-radius:999px;background:var(--accent-gradient);box-shadow:0 0 18px rgba(139,92,246,.18)}
    .about-section .section-title{max-width:850px;background:linear-gradient(100deg,#fff 0%,#fff 58%,#d9ccff 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;text-shadow:0 0 30px rgba(139,92,246,.08)}
    .about-grid{grid-template-columns:minmax(0,1.02fr) minmax(0,.98fr);gap:58px;align-items:start}
    .about-text-content{position:relative;padding:28px 0 20px 30px;border-left:1px solid rgba(255,255,255,.09)}
    .about-text-content::before{content:'“';position:absolute;left:-16px;top:-22px;font-family:Georgia,serif;font-size:90px;line-height:1;font-weight:700;color:rgba(255,90,31,.16);pointer-events:none}
    .about-text-content::after{content:'';position:absolute;left:-1px;top:0;width:2px;height:82px;background:linear-gradient(to bottom,var(--accent-orange),rgba(139,92,246,.75),transparent);box-shadow:0 0 16px rgba(255,90,31,.25)}
    .about-text-content p{max-width:650px;font-size:1.02rem;line-height:1.9;color:rgba(226,232,240,.77);margin-bottom:24px}
    .about-text-content p:last-child{margin-bottom:0}
    .about-text-content strong{color:#fff;font-weight:700}
    .about-highlights{gap:18px}
    .about-card{min-height:214px;padding:26px 24px 24px;background:linear-gradient(145deg,rgba(18,24,38,.78),rgba(10,14,24,.9));border:1px solid rgba(255,255,255,.075);border-radius:18px;box-shadow:inset 0 1px 0 rgba(255,255,255,.035),0 14px 30px rgba(0,0,0,.18);transition:transform .36s cubic-bezier(.2,.7,.2,1),border-color .36s ease,box-shadow .36s ease,background .36s ease}
    .about-card:nth-child(1){transform:translateY(10px)}
    .about-card:nth-child(2){transform:translateY(-2px)}
    .about-card:nth-child(3){transform:translateY(14px)}
    .about-card:nth-child(4){transform:translateY(2px)}
    .about-card::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 18% 0%,rgba(255,90,31,.12),transparent 44%);opacity:.75;pointer-events:none}
    .about-card:nth-child(even)::before{background:radial-gradient(circle at 82% 0%,rgba(139,92,246,.14),transparent 44%)}
    .about-card::after{height:2px;opacity:.7;background:linear-gradient(90deg,transparent,rgba(255,90,31,.95),rgba(139,92,246,.95),transparent)}
    .about-card:hover,.about-card:nth-child(1):hover,.about-card:nth-child(2):hover,.about-card:nth-child(3):hover,.about-card:nth-child(4):hover{transform:translateY(-8px) scale(1.012);border-color:rgba(139,92,246,.4);box-shadow:inset 0 1px 0 rgba(255,255,255,.055),0 22px 46px rgba(0,0,0,.33),0 0 28px rgba(139,92,246,.11);background:linear-gradient(145deg,rgba(23,30,48,.88),rgba(10,14,24,.95))}
    .about-card-icon{width:50px;height:50px;margin-bottom:20px;border-radius:14px;background:linear-gradient(135deg,rgba(255,90,31,.16),rgba(139,92,246,.12));border:1px solid rgba(255,255,255,.08);box-shadow:inset 0 1px 0 rgba(255,255,255,.06),0 8px 18px rgba(0,0,0,.18)}
    .about-card:hover .about-card-icon{transform:translateY(-2px) scale(1.08) rotate(4deg);box-shadow:0 0 22px rgba(255,90,31,.18),0 12px 24px rgba(0,0,0,.22)}
    .about-card-title{font-size:1.16rem;letter-spacing:-.02em;margin-bottom:9px}
    .about-card-desc{max-width:260px;font-size:.9rem;color:rgba(203,213,225,.7);line-height:1.65}
    @media(max-width:900px){.about-grid{grid-template-columns:1fr;gap:40px}.about-text-content{padding-left:22px}.about-highlights{margin-top:4px}}
    @media(max-width:600px){.about-section .header-group{margin-bottom:34px}.about-text-content{padding:24px 0 8px 18px}.about-text-content::before{font-size:66px;left:-11px;top:-14px}.about-text-content p{font-size:.98rem;line-height:1.8}.about-highlights{grid-template-columns:1fr}.about-card:nth-child(1),.about-card:nth-child(2),.about-card:nth-child(3),.about-card:nth-child(4){transform:none}.about-card,.about-card:nth-child(1),.about-card:nth-child(2),.about-card:nth-child(3),.about-card:nth-child(4){min-height:auto}}
  `;
  document.head.appendChild(style);
}
