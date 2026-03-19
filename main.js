/* =========================================
   APEX F1 — ENHANCED GSAP ANIMATIONS
   Cinematic, Smooth, Interactive
   ========================================= */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// =========================================
// CUSTOM CURSOR
// =========================================
function initCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring || window.innerWidth < 768) return;

  let mx = 0, my = 0;
  let dx = 0, dy = 0;
  let rx = 0, ry = 0;

  window.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
  });

  function animate() {
    // Dot follows quickly
    dx += (mx - dx) * 0.2;
    dy += (my - dy) * 0.2;
    dot.style.left = dx + 'px';
    dot.style.top = dy + 'px';

    // Ring follows slowly (trailing)
    rx += (mx - rx) * 0.08;
    ry += (my - ry) * 0.08;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';

    requestAnimationFrame(animate);
  }
  animate();
}

// =========================================
// PRELOADER
// =========================================
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const counter = document.getElementById('preloader-counter');
  let count = { val: 0 };

  gsap.to(count, {
    val: 100,
    duration: 2,
    ease: 'power2.inOut',
    onUpdate: () => {
      counter.textContent = Math.round(count.val);
    },
    onComplete: () => {
      // Cinematic exit
      const exitTl = gsap.timeline();
      exitTl
        .to('.preloader-ring', { scale: 0.8, opacity: 0, duration: 0.4, ease: 'power2.in' })
        .to('.preloader-text', { y: -20, opacity: 0, duration: 0.3, ease: 'power2.in' }, '-=0.3')
        .to(counter, { y: 20, opacity: 0, duration: 0.3, ease: 'power2.in' }, '-=0.2')
        .to(preloader, {
          clipPath: 'inset(0 0 100% 0)',
          duration: 0.8,
          ease: 'power3.inOut',
          onComplete: () => {
            preloader.style.display = 'none';
            startHeroSequence();
          }
        });
    }
  });
}

// =========================================
// SPEED LINES CANVAS
// =========================================
function initSpeedCanvas() {
  const canvas = document.getElementById('speed-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h;
  const lines = [];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class SpeedLine {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.len = 20 + Math.random() * 80;
      this.speed = 8 + Math.random() * 12;
      this.alpha = Math.random() * 0.15;
      this.hue = Math.random() > 0.7 ? 0 : 30; // red or orange hue
    }
    update() {
      this.x += this.speed;
      if (this.x > w + this.len) this.reset();
      this.x = this.x > w + this.len ? -this.len : this.x;
    }
    draw() {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x - this.len, this.y);
      const grad = ctx.createLinearGradient(this.x, this.y, this.x - this.len, this.y);
      grad.addColorStop(0, `hsla(${this.hue}, 100%, 50%, ${this.alpha})`);
      grad.addColorStop(1, 'transparent');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  for (let i = 0; i < 40; i++) lines.push(new SpeedLine());

  function loop() {
    ctx.clearRect(0, 0, w, h);
    lines.forEach(l => { l.update(); l.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
}

// =========================================
// HERO ENTRANCE SEQUENCE
// =========================================
function startHeroSequence() {
  const tl = gsap.timeline({
    defaults: { ease: 'power4.out' },
    onComplete: () => {
      initScrollAnimations();
      initParallax();
      initHorizontalGallery();
    }
  });

  // Show nav
  tl.to('#main-nav', { 
    y: 0, 
    duration: 0.6, 
    ease: 'power2.out',
    onStart: () => document.getElementById('main-nav').classList.add('visible')
  })

  // Badge slides in
  .from('#hero-badge', { 
    y: 40, 
    opacity: 0, 
    duration: 0.8,
    ease: 'power3.out' 
  }, '-=0.3')

  // Title lines SLAM in from below (clip-path reveal)
  .from('#title-1', {
    y: '120%',
    opacity: 0,
    duration: 1.0,
    ease: 'power4.out'
  }, '-=0.4')
  .from('#title-2', {
    y: '120%',
    opacity: 0,
    duration: 1.0,
    ease: 'power4.out'
  }, '-=0.7')
  .from('#title-3', {
    y: '120%',
    opacity: 0,
    duration: 1.0,
    ease: 'power4.out'
  }, '-=0.7')

  // Add a kinetic bounce to the accent title
  .to('#title-2', {
    scale: 1.02,
    duration: 0.3,
    ease: 'power2.out',
    yoyo: true,
    repeat: 1
  }, '-=0.3')

  // Subtitle fades in
  .from('#hero-subtitle', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out'
  }, '-=0.5')

  // CTA buttons stagger in
  .from('#hero-cta .btn', {
    y: 25,
    opacity: 0,
    duration: 0.6,
    stagger: 0.12,
    ease: 'back.out(1.4)'
  }, '-=0.4')

  // Stats counter in
  .from('.hero-stat', {
    y: 30,
    opacity: 0,
    duration: 0.6,
    stagger: 0.08,
    ease: 'power3.out'
  }, '-=0.3')

  // Scroll indicator
  .from('#scroll-indicator', {
    opacity: 0,
    y: 20,
    duration: 0.6,
    ease: 'power2.out'
  }, '-=0.2');

  // Animate stat numbers with counter
  document.querySelectorAll('.stat-number').forEach(el => {
    const target = parseInt(el.getAttribute('data-target'));
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 2.5,
      delay: 1.5,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = Math.round(obj.val);
      }
    });
  });
}

// =========================================
// SCROLL-DRIVEN ANIMATIONS
// =========================================
function initScrollAnimations() {

  // --- Hero Parallax & Fade ---
  gsap.to('#hero-content', {
    y: -120,
    opacity: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: '50% top',
      end: 'bottom top',
      scrub: 1.5
    }
  });

  // Scale up hero video slightly on scroll
  gsap.to('.hero-video-bg iframe', {
    scale: 1.15,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 2
    }
  });

  // SVG Track line draw
  gsap.to('#track-line', {
    strokeDashoffset: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: '40% center',
      end: 'bottom top',
      scrub: 1
    }
  });

  // Scroll indicator fade out
  gsap.to('#scroll-indicator', {
    opacity: 0,
    y: -20,
    scrollTrigger: {
      trigger: '#hero',
      start: '10% top',
      end: '30% top',
      scrub: 1
    }
  });

  // Speed canvas fade on scroll
  gsap.to('#speed-canvas', {
    opacity: 0,
    scrollTrigger: {
      trigger: '#hero',
      start: '30% top',
      end: '80% top',
      scrub: 1
    }
  });

  // --- Section Transitions ---
  gsap.utils.toArray('.section-transition').forEach(trans => {
    gsap.from(trans, {
      opacity: 0,
      scaleX: 0.3,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: trans,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  // --- Section Headers (cinematic reveal) ---
  gsap.utils.toArray('.section-header').forEach(header => {
    const tag = header.querySelector('.section-tag');
    const title = header.querySelector('.section-title');
    const line = header.querySelector('.title-underline');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: header,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });

    if (tag) tl.from(tag, { y: 20, opacity: 0, duration: 0.5, ease: 'power2.out' });
    if (title) tl.from(title, { y: 50, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.2');
    if (line) tl.from(line, { scaleX: 0, duration: 0.8, ease: 'power2.out' }, '-=0.4');
  });

  // --- Race Cards (3D tilt entrance) ---
  gsap.utils.toArray('.race-card').forEach((card, i) => {
    gsap.from(card, {
      y: 80,
      opacity: 0,
      rotateX: 8,
      duration: 0.9,
      delay: i * 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 88%',
        toggleActions: 'play none none none'
      }
    });
  });

  // --- Driver Cards ---
  gsap.utils.toArray('.driver-card').forEach((card, i) => {
    gsap.set(card, { y: 60, opacity: 0 });
    gsap.set(card.querySelector('.driver-image-wrap'), { scale: 0.8, opacity: 0 });
    gsap.set(card.querySelectorAll('.d-stat'), { y: 15, opacity: 0 });

    ScrollTrigger.create({
      trigger: '.drivers-section',
      start: 'top 70%',
      once: true,
      onEnter: () => {
        gsap.to(card, {
          y: 0, opacity: 1,
          duration: 0.9,
          delay: i * 0.2,
          ease: 'power3.out'
        });
        gsap.to(card.querySelector('.driver-image-wrap'), {
          scale: 1, opacity: 1,
          duration: 0.7,
          delay: i * 0.2 + 0.2,
          ease: 'back.out(1.6)'
        });
        gsap.to(card.querySelectorAll('.d-stat'), {
          y: 0, opacity: 1,
          duration: 0.4,
          delay: i * 0.2 + 0.4,
          stagger: 0.08,
          ease: 'power2.out'
        });
      }
    });
  });

  // --- Standings (slide in from left with stagger) ---
  const standingsRows = gsap.utils.toArray('.standings-row:not(.header-row)');
  standingsRows.forEach((row, i) => {
    gsap.from(row, {
      x: -60,
      opacity: 0,
      duration: 0.7,
      delay: i * 0.07,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: row,
        start: 'top 92%',
        toggleActions: 'play none none none',
        onEnter: () => {
          const bar = row.querySelector('.s-bar-fill');
          if (bar) {
            gsap.to(bar, {
              width: bar.getAttribute('data-width') + '%',
              duration: 1.4,
              delay: i * 0.07 + 0.3,
              ease: 'power2.out'
            });
          }
        }
      }
    });
  });

  // --- Article Cards (staggered scale-up) ---
  gsap.utils.toArray('.article-card').forEach((card, i) => {
    gsap.from(card, {
      y: 60,
      opacity: 0,
      scale: 0.96,
      duration: 0.8,
      delay: i * 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 90%',
        toggleActions: 'play none none none'
      }
    });
  });

  // --- Calendar Items (wipe in) ---
  gsap.utils.toArray('.cal-item').forEach((item, i) => {
    gsap.from(item, {
      x: -40,
      opacity: 0,
      duration: 0.5,
      delay: i * 0.06,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 92%',
        toggleActions: 'play none none none'
      }
    });
  });

  // --- Next Race Widget ---
  gsap.from('#next-race-widget', {
    scale: 0.92,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#next-race-widget',
      start: 'top 82%',
      toggleActions: 'play none none none'
    }
  });

  // Gauge fill
  gsap.to('#gauge-needle', {
    strokeDashoffset: 40,
    duration: 2.5,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '#next-race-widget',
      start: 'top 80%',
      toggleActions: 'play none none none'
    }
  });

  // --- Newsletter ---
  gsap.from('#newsletter-content', {
    y: 50,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#newsletter',
      start: 'top 80%',
      toggleActions: 'play none none none'
    }
  });

  // --- Footer ---
  const footerTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.footer-section',
      start: 'top 92%',
      toggleActions: 'play none none none'
    }
  });

  footerTl
    .from('.footer-brand', { y: 30, opacity: 0, duration: 0.6, ease: 'power2.out' })
    .from('.footer-col', { y: 30, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'power2.out' }, '-=0.3')
    .from('.footer-checkered', { scaleX: 0, duration: 1, ease: 'power2.out' }, '-=0.2');
}

// =========================================
// PARALLAX EFFECTS
// =========================================
function initParallax() {
  // Race card images
  gsap.utils.toArray('.race-card-image img').forEach(img => {
    gsap.to(img, {
      yPercent: -12,
      ease: 'none',
      scrollTrigger: {
        trigger: img.closest('.race-card'),
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5
      }
    });
  });

  // Driver numbers float
  gsap.utils.toArray('.driver-number').forEach(num => {
    gsap.to(num, {
      y: -40,
      ease: 'none',
      scrollTrigger: {
        trigger: num.closest('.driver-card'),
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5
      }
    });
  });

  // Standings BG
  gsap.to('.standings-bg', {
    yPercent: -15,
    ease: 'none',
    scrollTrigger: {
      trigger: '.standings-section',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5
    }
  });

  // Article images subtle parallax
  gsap.utils.toArray('.article-image img').forEach(img => {
    gsap.to(img, {
      yPercent: -8,
      ease: 'none',
      scrollTrigger: {
        trigger: img.closest('.article-card'),
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5
      }
    });
  });
}

// =========================================
// HORIZONTAL SCROLL GALLERY
// =========================================
function initHorizontalGallery() {
  const track = document.getElementById('gallery-track');
  if (!track) return;

  const items = track.querySelectorAll('.gallery-item');
  const totalWidth = (items.length * (400 + 20)) - 20; // item width + gap
  const viewportWidth = window.innerWidth;
  const scrollAmount = totalWidth - viewportWidth + 100;

  if (scrollAmount <= 0) return;

  gsap.to(track, {
    x: -scrollAmount,
    ease: 'none',
    scrollTrigger: {
      trigger: '.gallery-section',
      start: 'top 20%',
      end: `+=${scrollAmount}`,
      scrub: 1.5,
      pin: true,
      anticipatePin: 1
    }
  });

  // Scale-in gallery items
  items.forEach((item, i) => {
    gsap.from(item, {
      scale: 0.85,
      opacity: 0,
      duration: 0.6,
      delay: i * 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.gallery-section',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
  });
}

// =========================================
// NAVIGATION
// =========================================
function initNavigation() {
  const nav = document.getElementById('main-nav');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const navLinks = document.querySelectorAll('.nav-link');
  const scrollProgress = document.getElementById('scroll-progress');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 50) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');

    const total = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress.style.width = (scrollY / total) * 100 + '%';
  });

  // Active section tracking
  const sections = document.querySelectorAll('.section');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 100) current = s.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// =========================================
// SMOOTH SCROLL
// =========================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        gsap.to(window, {
          scrollTo: { y: target, offsetY: 70 },
          duration: 1.2,
          ease: 'power3.inOut'
        });
      }
    });
  });
}

// =========================================
// PARTICLES (floating spark effect)
// =========================================
function initParticles() {
  const container = document.getElementById('hero-particles');
  if (!container || window.innerWidth < 768) return;

  for (let i = 0; i < 25; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.top = Math.random() * 100 + '%';
    p.style.width = (1 + Math.random() * 3) + 'px';
    p.style.height = p.style.width;
    container.appendChild(p);

    gsap.to(p, {
      y: -(80 + Math.random() * 200),
      x: (Math.random() - 0.5) * 80,
      opacity: Math.random() * 0.4 + 0.1,
      duration: 4 + Math.random() * 5,
      repeat: -1,
      delay: Math.random() * 4,
      ease: 'none',
      onRepeat: () => {
        gsap.set(p, {
          y: 0, x: 0, opacity: 0,
          left: Math.random() * 100 + '%',
          top: Math.random() * 100 + '%'
        });
      }
    });
  }
}

// =========================================
// COUNTDOWN
// =========================================
function initCountdown() {
  const raceDate = new Date('2026-04-20T06:00:00Z').getTime();

  function update() {
    const distance = raceDate - Date.now();
    if (distance > 0) {
      document.getElementById('cd-days').textContent = String(Math.floor(distance / 86400000)).padStart(2, '0');
      document.getElementById('cd-hours').textContent = String(Math.floor((distance % 86400000) / 3600000)).padStart(2, '0');
      document.getElementById('cd-mins').textContent = String(Math.floor((distance % 3600000) / 60000)).padStart(2, '0');
      document.getElementById('cd-secs').textContent = String(Math.floor((distance % 60000) / 1000)).padStart(2, '0');
    }
  }
  update();
  setInterval(update, 1000);
}

// =========================================
// NEWSLETTER
// =========================================
function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  const btn = form.querySelector('.newsletter-btn');

  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('newsletter-email').value;
    if (!email) return;

    gsap.to(btn, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });
    btn.querySelector('.btn-text').textContent = 'Subscribed!';
    btn.querySelector('.btn-icon').textContent = '✓';
    gsap.to(btn, { background: 'linear-gradient(135deg, #00cc66, #00aa55)', duration: 0.3 });

    // Confetti burst
    const rect = form.getBoundingClientRect();
    const colors = ['#e10600', '#ff6b35', '#ffd700', '#fff', '#00cc66'];
    for (let i = 0; i < 30; i++) {
      const c = document.createElement('div');
      c.style.cssText = `position:fixed;width:${4+Math.random()*6}px;height:${4+Math.random()*6}px;background:${colors[Math.floor(Math.random()*5)]};left:${rect.left+rect.width/2}px;top:${rect.top}px;z-index:99999;pointer-events:none;border-radius:${Math.random()>0.5?'50%':'2px'};`;
      document.body.appendChild(c);
      gsap.to(c, {
        x: (Math.random()-0.5)*300,
        y: -(80+Math.random()*200),
        rotation: Math.random()*720,
        opacity: 0,
        duration: 1+Math.random()*0.5,
        ease: 'power2.out',
        onComplete: () => c.remove()
      });
    }

    setTimeout(() => {
      btn.querySelector('.btn-text').textContent = 'Subscribe';
      btn.querySelector('.btn-icon').textContent = '→';
      gsap.to(btn, { background: 'linear-gradient(135deg, #e10600, #ff6b35, #ffd700)', duration: 0.3 });
      form.reset();
    }, 3000);
  });
}

// =========================================
// MICRO-INTERACTIONS
// =========================================
function initMicroInteractions() {
  // Button hover effects
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => gsap.to(btn, { scale: 1.04, duration: 0.25, ease: 'back.out(2)' }));
    btn.addEventListener('mouseleave', () => gsap.to(btn, { scale: 1, duration: 0.2, ease: 'power2.out' }));
  });

  // Logo interaction
  const logo = document.getElementById('nav-logo');
  if (logo) {
    logo.addEventListener('mouseenter', () => {
      gsap.to(logo.querySelector('.logo-apex'), { letterSpacing: '7px', duration: 0.3, ease: 'power2.out' });
      gsap.to(logo.querySelector('.logo-f1'), { color: '#e10600', duration: 0.3 });
    });
    logo.addEventListener('mouseleave', () => {
      gsap.to(logo.querySelector('.logo-apex'), { letterSpacing: '4px', duration: 0.3, ease: 'power2.out' });
      gsap.to(logo.querySelector('.logo-f1'), { color: '#606070', duration: 0.3 });
    });
  }

  // Race cards tilt on hover
  document.querySelectorAll('.race-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(card, {
        rotateY: x * 6,
        rotateX: -y * 6,
        duration: 0.4,
        ease: 'power2.out',
        transformPerspective: 600
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'power2.out' });
    });
  });

  // Driver cards tilt
  document.querySelectorAll('.driver-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(card, {
        rotateY: x * 8,
        rotateX: -y * 8,
        duration: 0.4,
        ease: 'power2.out',
        transformPerspective: 800
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'power2.out' });
    });
  });

  // Race link arrows
  document.querySelectorAll('.race-link').forEach(link => {
    link.addEventListener('mouseenter', () => gsap.to(link.querySelector('.arrow'), { x: 8, duration: 0.3, ease: 'back.out(2)' }));
    link.addEventListener('mouseleave', () => gsap.to(link.querySelector('.arrow'), { x: 0, duration: 0.2 }));
  });

  // Article link arrows
  document.querySelectorAll('.article-link').forEach(link => {
    link.addEventListener('mouseenter', () => gsap.to(link.querySelector('.link-arrow'), { x: 8, duration: 0.3, ease: 'back.out(2)' }));
    link.addEventListener('mouseleave', () => gsap.to(link.querySelector('.link-arrow'), { x: 0, duration: 0.2 }));
  });

  // Standings row glow on hover
  document.querySelectorAll('.standings-row:not(.header-row)').forEach(row => {
    row.addEventListener('mouseenter', () => gsap.to(row, { x: 8, duration: 0.3, ease: 'power2.out' }));
    row.addEventListener('mouseleave', () => gsap.to(row, { x: 0, duration: 0.3, ease: 'power2.out' }));
  });
}

// =========================================
// FUNCTIONAL BUTTONS (TOAST NOTIFICATIONS)
// =========================================
function initFunctionalButtons() {
  const showToast = (message) => {
    // Remove existing toast if any
    const existing = document.querySelector('.custom-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    gsap.fromTo(toast, 
      { y: 50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
    );
    
    setTimeout(() => {
      if (document.body.contains(toast)) {
        gsap.to(toast, { 
          y: 50, opacity: 0, duration: 0.4, ease: 'power2.in', 
          onComplete: () => toast.remove() 
        });
      }
    }, 3000);
  };

  // Add event listeners to all links meant for navigation or actions
  document.querySelectorAll('a[href="#"], .race-link, .article-link').forEach(btn => {
    // Note: this assumes any href="#" or .race-link is non-functional in this demo
    btn.addEventListener('click', (e) => {
      const parentNav = btn.closest('#main-nav');
      // If it's a smooth scroll anchor link, don't show toast
      if (btn.getAttribute('href').startsWith('#') && btn.getAttribute('href').length > 1) {
        return;
      }
      e.preventDefault();
      if (!parentNav) {
        let text = btn.textContent.trim().replace('→', '').replace('✓', '').trim();
        if (!text) text = "Action triggered";
        showToast(`Loading: ${text}...`);
      }
    });
  });
}

// =========================================
// BACKGROUND VIDEO TRANSITIONS
// =========================================
function initVideoTransitions() {
  // Hero section video - single video now, so no transition interval needed
  // Drivers section videos
  const driverVideos = document.querySelectorAll('.drivers-yt-video');
  if (driverVideos.length > 1) {
    let currentDriver = 0;
    setInterval(() => {
      driverVideos[currentDriver].classList.remove('active');
      currentDriver = (currentDriver + 1) % driverVideos.length;
      driverVideos[currentDriver].classList.add('active');
    }, 15000); // 15 second intervals
  }
}

// =========================================
// INIT
// =========================================
function init() {
  initCursor();
  initPreloader();
  initSpeedCanvas();
  initNavigation();
  initSmoothScroll();
  initCountdown();
  initNewsletter();
  initMicroInteractions();
  initParticles();
  initFunctionalButtons();
  initVideoTransitions();

  window.addEventListener('load', () => ScrollTrigger.refresh());
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
