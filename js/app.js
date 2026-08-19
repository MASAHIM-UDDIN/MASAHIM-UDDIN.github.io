/* ==========================================================================
   MASAHIM UDDIN - PYTHON DEVELOPER PORTFOLIO
   Application Logic, Animations, & Interactions
   ========================================================================== */

/**
 * CONFIGURATION: Destination email for portfolio contact form.
 * Replace the string below with your actual contact email address.
 * Do not commit sensitive credentials.
 */
const CONTACT_EMAIL = ""; // e.g. "masahim@example.com"

function startApp() {
  initNavbar();
  initMobileMenu();
  initScrollReveals();
  initCursorGlow();
  initActiveNavHighlight();
  initContactForm();
  initCodeWindowInteractions();
  initTypewriterSwapper();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}

/* --------------------------------------------------------------------------
   1. STICKY NAVBAR ON SCROLL
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check
}

/* --------------------------------------------------------------------------
   2. MOBILE MENU DRAWER
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  if (!mobileToggle || !navLinks) return;

  const toggleMenu = () => {
    const isOpen = navLinks.classList.contains('open');
    if (isOpen) {
      navLinks.classList.remove('open');
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileToggle.innerHTML = `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      `;
    } else {
      navLinks.classList.add('open');
      mobileToggle.setAttribute('aria-expanded', 'true');
      mobileToggle.innerHTML = `
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      `;
    }
  };

  mobileToggle.addEventListener('click', toggleMenu);

  // Close drawer when clicking a navigation link
  const links = navLinks.querySelectorAll('.nav-link');
  links.forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) {
        toggleMenu();
      }
    });
  });
}

/* --------------------------------------------------------------------------
   3. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
   -------------------------------------------------------------------------- */
function initScrollReveals() {
  const reveals = document.querySelectorAll('.reveal-on-scroll');
  if (reveals.length === 0) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    reveals.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Reveal once
      }
    });
  }, observerOptions);

  reveals.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   4. AMBIENT CURSOR GLOW EFFECT
   -------------------------------------------------------------------------- */
function initCursorGlow() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const orb1 = document.querySelector('.glow-orb-1');
  const orb2 = document.querySelector('.glow-orb-2');
  if (!orb1 || !orb2) return;

  let mouseX = 0;
  let mouseY = 0;
  let currentX1 = 0, currentY1 = 0;
  let currentX2 = 0, currentY2 = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  function animateGlow() {
    // Smooth lerp following cursor
    currentX1 += (mouseX - currentX1) * 0.03;
    currentY1 += (mouseY - currentY1) * 0.03;
    
    currentX2 += (mouseX - currentX2) * 0.02;
    currentY2 += (mouseY - currentY2) * 0.02;

    if (orb1) orb1.style.transform = `translate3d(${currentX1 * 0.05}px, ${currentY1 * 0.05}px, 0)`;
    if (orb2) orb2.style.transform = `translate3d(${-currentX2 * 0.04}px, ${-currentY2 * 0.04}px, 0)`;

    requestAnimationFrame(animateGlow);
  }

  animateGlow();
}

/* --------------------------------------------------------------------------
   5. ACTIVE NAVIGATION HIGHLIGHT ON SCROLL
   -------------------------------------------------------------------------- */
function initActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-30% 0px -60% 0px'
  });

  sections.forEach(section => observer.observe(section));
}

/* --------------------------------------------------------------------------
   6. CONTACT FORM HANDLING
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const statusDiv = document.getElementById('formStatus');
  if (!form || !statusDiv) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const messageInput = document.getElementById('contactMessage');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';

    if (!name || !email || !message) {
      showStatus('Please complete all fields before sending.', 'error');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showStatus('Please provide a valid email address.', 'error');
      return;
    }

    // Check if target contact email is configured
    if (CONTACT_EMAIL && CONTACT_EMAIL.length > 0) {
      // Trigger mailto client
      const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
      
      showStatus(`Thank you, ${name}! Your email client has been opened to send the message.`, 'success');
      form.reset();
    } else {
      // Present polite notice that destination email is in config
      showStatus(`Thank you, ${name}! Your message was validated successfully. (Note: To send emails directly, set the CONTACT_EMAIL variable in app.js).`, 'success');
      form.reset();
    }
  });

  function showStatus(msg, type) {
    statusDiv.textContent = msg;
    statusDiv.className = `form-status ${type}`;
    statusDiv.style.display = 'block';

    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, 6000);
  }
}

/* --------------------------------------------------------------------------
   7. INTERACTIVE CODE WINDOW
   -------------------------------------------------------------------------- */
function initCodeWindowInteractions() {
  const codeWindow = document.querySelector('.code-window');
  if (!codeWindow) return;

  // Add a clean hover effect to code elements
  const codeLines = codeWindow.querySelectorAll('.code-line');
  codeLines.forEach(line => {
    line.addEventListener('mouseenter', () => {
      line.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
    });
    line.addEventListener('mouseleave', () => {
      line.style.backgroundColor = 'transparent';
    });
  });
}

/* --------------------------------------------------------------------------
   8. DYNAMIC FADE & SLIDE TEXT SWAPPER (MASAHIM UDDIN <-> PYTHON DEVELOPER)
   -------------------------------------------------------------------------- */
function initTypewriterSwapper() {
  const target = document.getElementById('typewriterSwapper');
  if (!target) return;

  const phrases = ["Masahim Uddin", "Python Developer"];
  let phraseIndex = 0;

  // Add smooth transition properties directly to target element
  target.style.transition = 'opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
  target.style.display = 'inline-block';

  function swapText() {
    // 1. Fade out and slide up
    target.style.opacity = '0';
    target.style.transform = 'translateY(-8px)';

    setTimeout(() => {
      // 2. Change text while invisible
      phraseIndex = (phraseIndex + 1) % phrases.length;
      target.textContent = phrases[phraseIndex];
      target.style.transform = 'translateY(8px)';

      // 3. Fade in and slide to resting position
      setTimeout(() => {
        target.style.opacity = '1';
        target.style.transform = 'translateY(0)';
      }, 50);
    }, 450);
  }

  // Swap every 3 seconds continuously
  setInterval(swapText, 3000);
}
