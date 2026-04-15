// ============================================
// HOJI TECH — CART MODULE
// ============================================

import { getProductById, formatPrice } from './products.js';
import { showToast } from './ui.js';

const CART_KEY = 'hoji_tech_cart';

// ---- GET CART ----
export function getCart() {
  try {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// ---- SAVE CART ----
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

// ---- ADD TO CART ----
export function addToCart(productId, qty = 1) {
  const cart = getCart();
  const product = getProductById(productId);
  if (!product) return false;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty = Math.min(existing.qty + qty, 99);
  } else {
    cart.push({ id: productId, qty });
  }
  saveCart(cart);
  showToast(`«${product.name}» добавлен в корзину`, 'success');
  return true;
}

// ---- REMOVE FROM CART ----
export function removeFromCart(productId) {
  const cart = getCart().filter(item => item.id !== productId);
  saveCart(cart);
}

// ---- UPDATE QTY ----
export function updateCartQty(productId, qty) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  if (qty <= 0) {
    removeFromCart(productId);
    return;
  }
  item.qty = Math.min(qty, 99);
  saveCart(cart);
}

// ---- CLEAR CART ----
export function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartBadge();
}

// ---- GET CART TOTAL ----
export function getCartTotal() {
  const cart = getCart();
  return cart.reduce((sum, item) => {
    const p = getProductById(item.id);
    return p ? sum + p.price * item.qty : sum;
  }, 0);
}

// ---- GET CART COUNT ----
export function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

// ---- UPDATE BADGE ----
export function updateCartBadge() {
  const count = getCartCount();
  const badges = document.querySelectorAll('#cartBadge');
  badges.forEach(badge => {
    if (count > 0) {
      badge.textContent = count;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  });
}

// ---- RENDER CART PAGE ----
export function renderCartPage() {
  const cartEmpty = document.getElementById('cartEmpty');
  const cartLayout = document.getElementById('cartLayout');
  if (!cartEmpty || !cartLayout) return;

  const cart = getCart();
  if (cart.length === 0) {
    cartEmpty.style.display = 'block';
    cartLayout.style.display = 'none';
    return;
  }

  cartEmpty.style.display = 'none';
  cartLayout.style.display = 'grid';

  const listEl = document.getElementById('cartItemsList');
  if (!listEl) return;

  listEl.innerHTML = cart.map(item => {
    const p = getProductById(item.id);
    if (!p) return '';
    const img = p.images?.[0] || '';
    const itemTotal = p.price * item.qty;
    return `
      <div class="cart-item" data-id="${p.id}">
        <div class="cart-item__info">
          <img class="cart-item__img" src="${img}" alt="${p.name}" loading="lazy">
          <div>
            <div class="cart-item__title">
              <a href="product.html?id=${p.id}">${p.name}</a>
            </div>
            <div class="cart-item__brand">${p.brand}</div>
          </div>
        </div>
        <div class="cart-item__price">${formatPrice(p.price)}</div>
        <div class="cart-qty">
          <button class="cart-qty__btn" data-action="minus" data-id="${p.id}">−</button>
          <span class="cart-qty__num">${item.qty}</span>
          <button class="cart-qty__btn" data-action="plus" data-id="${p.id}">+</button>
        </div>
        <div class="cart-item__total">${formatPrice(itemTotal)}</div>
        <button class="cart-item__remove" data-id="${p.id}" title="Удалить">✕</button>
      </div>
    `;
  }).join('');

  // Summary
  const total = getCartTotal();
  const count = getCartCount();
  const el = id => document.getElementById(id);
  if (el('summaryCount')) el('summaryCount').textContent = count;
  if (el('summarySubtotal')) el('summarySubtotal').textContent = formatPrice(total);
  if (el('summaryTotal')) el('summaryTotal').textContent = formatPrice(total);

  // Bind events
  listEl.querySelectorAll('.cart-item__remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      removeFromCart(id);
      renderCartPage();
    });
  });

  listEl.querySelectorAll('.cart-qty__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      const item = getCart().find(i => i.id === id);
      if (!item) return;
      const newQty = btn.dataset.action === 'plus' ? item.qty + 1 : item.qty - 1;
      updateCartQty(id, newQty);
      renderCartPage();
    });
  });
}

// ---- RENDER CHECKOUT ITEMS ----
export function renderCheckoutItems() {
  const container = document.getElementById('checkoutItems');
  if (!container) return;

  const cart = getCart();
  if (cart.length === 0) {
    window.location.href = 'cart.html';
    return;
  }

  container.innerHTML = cart.map(item => {
    const p = getProductById(item.id);
    if (!p) return '';
    const img = p.images?.[0] || '';
    return `
      <div class="checkout-item">
        <img class="checkout-item__img" src="${img}" alt="${p.name}" loading="lazy">
        <div class="checkout-item__info">
          <div class="checkout-item__name">${p.name}</div>
          <div class="checkout-item__qty">${item.qty} шт.</div>
        </div>
        <div class="checkout-item__price">${formatPrice(p.price * item.qty)}</div>
      </div>
    `;
  }).join('');

  updateCheckoutSummary();
}

export function updateCheckoutSummary(deliveryCost = 200) {
  const subtotal = getCartTotal();
  const total = subtotal + deliveryCost;

  const el = id => document.getElementById(id);
  if (el('checkoutSubtotal')) el('checkoutSubtotal').textContent = formatPrice(subtotal);
  if (el('checkoutDelivery')) el('checkoutDelivery').textContent = deliveryCost === 0 ? 'Бесплатно' : formatPrice(deliveryCost);
  if (el('checkoutTotal')) el('checkoutTotal').textContent = formatPrice(total);
}
