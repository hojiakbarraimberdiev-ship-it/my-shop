export function debounce(fn, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
export function throttle(fn, limit = 100) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
export function getUrlParams() {
  const params = {};
  new URLSearchParams(window.location.search).forEach((val, key) => { params[key] = val; });
  return params;
}
export function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('ru-RU', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' });
}
export function safeJSON(str, fallback = null) {
  try { return JSON.parse(str); } catch { return fallback; }
}
export function parseSpecs(text) {
  try { return JSON.parse(text); } catch {
    const specs = {};
    text.split('\n').forEach(line => {
      const [key, ...rest] = line.split(':');
      if (key && rest.length) specs[key.trim()] = rest.join(':').trim();
    });
    return specs;
  }
}
export function parseImageUrls(text) {
  if (!text || !text.trim()) return [];
  return text.split(',').map(s => s.trim()).filter(Boolean);
}
export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
export function validateKgPhone(digits) {
  return /^\d{9}$/.test(digits);
}
export function confirmAction(message) {
  return window.confirm(message);
}
export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
export function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}
const _cache = new Map();
export const cache = {
  get: (key) => _cache.get(key),
  set: (key, val, ttl = 60000) => { _cache.set(key, val); setTimeout(() => _cache.delete(key), ttl); },
  has: (key) => _cache.has(key)
};
export function paginate(items, page = 1, perPage = 12) {
  const total = items.length;
  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;
  return { items: items.slice(start, start + perPage), total, totalPages, page, perPage, hasPrev: page > 1, hasNext: page < totalPages };
}
export function renderPagination(container, paginationData, onPageChange) {
  if (!container) return;
  const { page, totalPages, hasPrev, hasNext } = paginationData;
  if (totalPages <= 1) { container.innerHTML = ''; return; }
  let html = `<button class="page-btn" data-page="${page-1}" ${!hasPrev?'disabled':''}>←</button>`;
  getPaginationRange(page, totalPages).forEach(p => {
    if (p === '...') html += `<span class="page-btn" style="cursor:default;opacity:0.5">…</span>`;
    else html += `<button class="page-btn ${p===page?'active':''}" data-page="${p}">${p}</button>`;
  });
  html += `<button class="page-btn" data-page="${page+1}" ${!hasNext?'disabled':''}>→</button>`;
  container.innerHTML = html;
  container.querySelectorAll('.page-btn[data-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.disabled) return;
      const p = parseInt(btn.dataset.page);
      if (p >= 1 && p <= totalPages) onPageChange(p);
    });
  });
}
function getPaginationRange(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, '...', total];
  if (current >= total - 3) return [1, '...', total-4, total-3, total-2, total-1, total];
  return [1, '...', current-1, current, current+1, '...', total];
}