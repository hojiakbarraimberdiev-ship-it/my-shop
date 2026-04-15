// ============================================
// HOJI TECH — UI MODULE
// ============================================

// ---- TOAST ----
let toastCounter = 0;

export function showToast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const id = `toast-${++toastCounter}`;
  const icons = { success: '✓', error: '✕', info: 'ℹ' };

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.id = id;
  toast.innerHTML = `
    <span class="toast__icon">${icons[type] || icons.info}</span>
    <span class="toast__text">${message}</span>
    <button class="toast__close" aria-label="Закрыть">✕</button>
  `;

  container.appendChild(toast);
  // Trigger animation
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });

  const remove = () => {
    toast.classList.add('hide');
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  };

  toast.querySelector('.toast__close').addEventListener('click', remove);
  setTimeout(remove, duration);
}

// ---- THEME ----
const THEME_KEY = 'hoji_tech_theme';

export function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}

export function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem(THEME_KEY, next);
  updateThemeIcon(next);
}

function updateThemeIcon(theme) {
  const icons = document.querySelectorAll('.theme-icon');
  icons.forEach(icon => {
    icon.textContent = theme === 'dark' ? '◑' : '○';
  });
}

// ---- HEADER SCROLL ----
export function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 80) {
      header.style.boxShadow = 'var(--shadow-lg)';
    } else {
      header.style.boxShadow = 'none';
    }
    lastY = y;
  }, { passive: true });
}

// ---- MOBILE NAV ----
export function initMobileNav() {
  const burger = document.getElementById('burger');
  const nav = document.getElementById('mainNav');
  const overlay = document.getElementById('navOverlay');
  if (!burger || !nav) return;

  const close = () => {
    burger.classList.remove('open');
    nav.classList.remove('open');
    if (overlay) overlay.classList.remove('show');
  };

  burger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    if (overlay) overlay.classList.toggle('show', isOpen);
  });

  if (overlay) overlay.addEventListener('click', close);

  // Close on nav link click
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', close);
  });
}

// ---- INTERSECTION OBSERVER for product cards ----
let observer = null;

export function initCardReveal() {
  if (observer) observer.disconnect();

  const cards = document.querySelectorAll('.product-card.hidden');
  if (!cards.length) return;

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        setTimeout(() => {
          el.classList.remove('hidden');
          el.classList.add('visible');
          observer.unobserve(el);
        }, i * 60);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

  cards.forEach(card => observer.observe(card));
}

// ---- COUNTER ANIMATION ----
export function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');
  counters.forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1200;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString('ru-RU');
      if (progress < 1) requestAnimationFrame(tick);
    };
    tick();
  });
}

// ---- INIT PAGE REVEAL ----
export function initHeroObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        observer.disconnect();
      }
    });
  });
  const stats = document.querySelector('.hero__stats');
  if (stats) observer.observe(stats);
}

// ---- VALIDATE PHONE (Kyrgyzstan) ----
export function validateKgPhone(digits) {
  // 9 digits after +996
  return /^\d{9}$/.test(digits);
}

// ---- FORMAT PHONE ----
export function formatPhoneInput(input) {
  input.addEventListener('input', () => {
    // Only digits
    let val = input.value.replace(/\D/g, '');
    if (val.length > 9) val = val.slice(0, 9);
    input.value = val;
  });
}

// ---- TABS ----
export function initTabs(containerSelector, tabSelector, contentPrefix) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  container.querySelectorAll(tabSelector).forEach(tab => {
    tab.addEventListener('click', () => {
      container.querySelectorAll(tabSelector).forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.dataset.tab;
      document.querySelectorAll(`[id^="${contentPrefix}"]`).forEach(c => c.classList.remove('active'));
      const content = document.getElementById(`${contentPrefix}${target}`);
      if (content) content.classList.add('active');
    });
  });
}

// ---- SHOW/HIDE PASSWORD ----
export function initPasswordToggles() {
  document.querySelectorAll('.password-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = document.getElementById(btn.dataset.target);
      if (!input) return;
      const isText = input.type === 'text';
      input.type = isText ? 'password' : 'text';
      btn.textContent = isText ? '👁' : '🙈';
    });
  });
}

// ---- CONFIRM DIALOG ----
export function confirmAction(message) {
  return window.confirm(message);
}

// ---- SET ACTIVE NAV LINK ----
export function setActiveNavLink() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page) link.classList.add('active');
  });
}
