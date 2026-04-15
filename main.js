// ============================================
// IT MARKET — MAIN ENTRY POINT
// ============================================

import { initTheme, toggleTheme, initHeaderScroll, initMobileNav, showToast,
  setActiveNavLink, initPasswordToggles, formatPhoneInput, initCardReveal,
  initHeroObserver, validateKgPhone } from './ui.js';
import { updateCartBadge, addToCart, getCart, renderCartPage, clearCart,
  renderCheckoutItems, updateCheckoutSummary } from './cart.js';
import { getAllProducts, filterProducts, sortProducts, getUniqueBrands,
  createProductCardHTML, formatPrice, getProductById, addProduct,
  updateProduct, deleteProduct } from './products.js';
import { getCurrentUser, isLoggedIn, isAdmin, login, register, logout,
  updateProfile, requireAuth, requireAdmin, saveOrder, getOrders,
  getUserOrders, updateOrderStatus, generateOrderId, getStatusLabel,
  getStatusClass } from './auth.js';
import { debounce, getUrlParams, formatDate, validateEmail,
  validateKgPhone as utilValidatePhone, paginate, renderPagination,
  parseSpecs, parseImageUrls, confirmAction } from './utils.js';

// ============================================
// GLOBAL INIT
// ============================================
function globalInit() {
  initTheme();
  initHeaderScroll();
  initMobileNav();
  updateCartBadge();
  setActiveNavLink();

  document.querySelectorAll('#themeToggle').forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });

  document.querySelectorAll('.phone-input').forEach(input => {
    formatPhoneInput(input);
  });

  initPasswordToggles();
}

function updateAuthHeader() {
  const authBtn = document.getElementById('authBtn');
  if (!authBtn) return;
  const user = getCurrentUser();
  if (user) {
    authBtn.href = user.role === 'admin' ? 'admin.html' : 'profile.html';
    authBtn.title = user.firstName;
    authBtn.querySelector('span').textContent = user.firstName.charAt(0).toUpperCase();
    authBtn.style.fontWeight = '700';
    authBtn.style.fontSize = '14px';
  } else {
    authBtn.href = 'login.html';
    authBtn.title = 'Войти';
    authBtn.querySelector('span').textContent = '◎';
    authBtn.style.fontWeight = '';
    authBtn.style.fontSize = '';
  }
}

function showFieldError(id, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  const input = el.closest('.form-group')?.querySelector('.form-input, .phone-input');
  if (input) input.classList.add('error');
}

function clearFieldError(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = '';
  const input = el.closest('.form-group')?.querySelector('.form-input, .phone-input');
  if (input) input.classList.remove('error');
}

// ============================================
// HOME PAGE
// ============================================
function initHomePage() {
  initHeroObserver();

  const grid = document.getElementById('featuredGrid');
  if (!grid) return;

  setTimeout(() => {
    const products = getAllProducts()
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 4);
    grid.innerHTML = products.map(createProductCardHTML).join('');
    initCardReveal();

    grid.addEventListener('click', e => {
      const btn = e.target.closest('.add-to-cart-btn');
      if (btn) {
        addToCart(Number(btn.dataset.id));
        updateCartBadge();
      }
    });
  }, 300);
}

// ============================================
// CATALOG PAGE
// ============================================
function initCatalogPage() {
  const grid = document.getElementById('catalogGrid');
  if (!grid) return;

  let currentPage = 1;
  const PER_PAGE = 12;

  // Brand filters
  const brandFiltersEl = document.getElementById('brandFilters');
  if (brandFiltersEl) {
    getUniqueBrands().forEach(brand => {
      const label = document.createElement('label');
      label.className = 'filter-checkbox';
      label.innerHTML = `<input type="checkbox" name="brand" value="${brand}"> <span>${brand}</span>`;
      brandFiltersEl.appendChild(label);
    });
  }

  function getFilters() {
    return {
      types: [...document.querySelectorAll('input[name="type"]:checked')].map(i => i.value),
      conditions: [...document.querySelectorAll('input[name="condition"]:checked')].map(i => i.value),
      brands: [...document.querySelectorAll('input[name="brand"]:checked')].map(i => i.value),
      priceMin: parseInt(document.getElementById('priceMin')?.value) || 0,
      priceMax: parseInt(document.getElementById('priceMax')?.value) || 999999,
      search: document.getElementById('searchInput')?.value || '',
      sort: document.getElementById('sortSelect')?.value || 'popular'
    };
  }

  function renderProducts(page = 1) {
    currentPage = page;
    const filters = getFilters();
    let filtered = filterProducts(getAllProducts(), filters);
    filtered = sortProducts(filtered, filters.sort);

    const countEl = document.getElementById('productsCount');
    if (countEl) countEl.textContent = filtered.length;

    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const { items } = paginate(filtered, page, PER_PAGE);

    const emptyEl = document.getElementById('catalogEmpty');
    if (items.length === 0) {
      grid.innerHTML = '';
      if (emptyEl) emptyEl.style.display = 'block';
    } else {
      if (emptyEl) emptyEl.style.display = 'none';
      grid.innerHTML = items.map(createProductCardHTML).join('');
      setTimeout(initCardReveal, 50);
    }

    renderPagination(
      document.getElementById('pagination'),
      { page, totalPages, hasPrev: page > 1, hasNext: page < totalPages },
      renderProducts
    );
  }

  // Search with debounce
  const searchInput = document.getElementById('searchInput');
  const searchClear = document.getElementById('searchClear');
  if (searchInput) {
    const debouncedRender = debounce(() => renderProducts(1), 350);
    searchInput.addEventListener('input', () => {
      if (searchClear) searchClear.style.display = searchInput.value ? 'block' : 'none';
      debouncedRender();
    });
    if (searchClear) {
      searchClear.addEventListener('click', () => {
        searchInput.value = '';
        searchClear.style.display = 'none';
        renderProducts(1);
      });
    }
  }

  document.getElementById('sortSelect')?.addEventListener('change', () => renderProducts(1));
  document.getElementById('applyFilters')?.addEventListener('click', () => renderProducts(1));

  function resetFilters() {
    document.querySelectorAll('input[name="type"], input[name="condition"], input[name="brand"]').forEach(i => i.checked = false);
    const priceMinEl = document.getElementById('priceMin');
    const priceMaxEl = document.getElementById('priceMax');
    const slider = document.getElementById('priceSlider');
    if (priceMinEl) priceMinEl.value = '';
    if (priceMaxEl) priceMaxEl.value = '';
    if (slider) slider.value = slider.max;
    if (searchInput) { searchInput.value = ''; if (searchClear) searchClear.style.display = 'none'; }
    renderProducts(1);
  }

  document.getElementById('resetFilters')?.addEventListener('click', resetFilters);
  document.getElementById('resetFiltersEmpty')?.addEventListener('click', resetFilters);

  const slider = document.getElementById('priceSlider');
  if (slider) {
    slider.addEventListener('input', () => {
      const priceMaxEl = document.getElementById('priceMax');
      if (priceMaxEl) priceMaxEl.value = slider.value;
    });
  }

  grid.addEventListener('click', e => {
    const btn = e.target.closest('.add-to-cart-btn');
    if (btn) {
      addToCart(Number(btn.dataset.id));
      updateCartBadge();
    }
  });

  // Mobile filters toggle
  const filtersToggle = document.getElementById('filtersToggle');
  const filtersPanel = document.getElementById('filtersPanel');
  const navOverlay = document.getElementById('navOverlay');
  if (filtersToggle && filtersPanel) {
    filtersToggle.addEventListener('click', () => {
      filtersPanel.classList.toggle('open');
      if (navOverlay) navOverlay.classList.toggle('show');
    });
    if (navOverlay) {
      navOverlay.addEventListener('click', () => {
        filtersPanel.classList.remove('open');
        navOverlay.classList.remove('show');
      });
    }
  }

  // Apply URL params
  const params = getUrlParams();
  if (params.type) {
    const el = document.querySelector(`input[name="type"][value="${params.type}"]`);
    if (el) el.checked = true;
  }
  if (params.condition) {
    const el = document.querySelector(`input[name="condition"][value="${params.condition}"]`);
    if (el) el.checked = true;
  }
  if (params.search && searchInput) {
    searchInput.value = params.search;
    if (searchClear) searchClear.style.display = 'block';
  }

  renderProducts(1);
}

// ============================================
// PRODUCT PAGE
// ============================================
function initProductPage() {
  const { id } = getUrlParams();
  if (!id) { window.location.href = 'catalog.html'; return; }

  const product = getProductById(Number(id));
  const skeleton = document.getElementById('productSkeleton');
  const detail = document.getElementById('productDetail');
  const tabs = document.getElementById('productTabs');
  const related = document.getElementById('relatedSection');

  if (!product) {
    if (skeleton) skeleton.innerHTML = `
      <div class="catalog-empty" style="grid-column:1/-1">
        <div class="empty-icon">😕</div>
        <h3>Товар не найден</h3>
        <a href="catalog.html" class="btn btn--primary">В каталог</a>
      </div>`;
    return;
  }

  // SEO
  document.title = `${product.name} — IT Market`;
  const pageDescEl = document.getElementById('pageDesc');
  if (pageDescEl) pageDescEl.setAttribute('content', product.description || '');
  const ogTitleEl = document.getElementById('ogTitle');
  if (ogTitleEl) ogTitleEl.setAttribute('content', product.name);

  // Breadcrumb
  const breadcrumbTitle = document.getElementById('breadcrumbTitle');
  if (breadcrumbTitle) breadcrumbTitle.textContent = product.name;

  // JSON-LD
  const schema = document.createElement('script');
  schema.type = 'application/ld+json';
  schema.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    brand: { '@type': 'Brand', name: product.brand },
    description: product.description,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'KGS',
      availability: product.inStock ? 'InStock' : 'OutOfStock'
    }
  });
  document.head.appendChild(schema);

  setTimeout(() => {
    if (skeleton) skeleton.style.display = 'none';
    if (detail) detail.style.display = 'grid';
    if (tabs) tabs.style.display = 'block';
    if (related) related.style.display = 'block';

    const images = product.images?.length
      ? product.images
      : ['https://images.unsplash.com/photo-1593640408182-31c228cf3a6a?w=600&q=80'];

    // Gallery main
    const mainImg = document.getElementById('galleryMain');
    if (mainImg) { mainImg.src = images[0]; mainImg.alt = product.name; }

    // Thumbnails
    const thumbsContainer = document.getElementById('galleryThumbs');
    if (thumbsContainer) {
      thumbsContainer.innerHTML = images.map((src, i) => `
        <div class="gallery-thumb ${i === 0 ? 'active' : ''}" data-idx="${i}">
          <img src="${src}" alt="${product.name} ${i + 1}" loading="lazy">
        </div>
      `).join('');

      thumbsContainer.querySelectorAll('.gallery-thumb').forEach(thumb => {
        thumb.addEventListener('click', () => {
          if (mainImg) mainImg.src = images[Number(thumb.dataset.idx)];
          thumbsContainer.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
          thumb.classList.add('active');
        });
      });
    }

    // Zoom modal
    const galleryMainEl = document.querySelector('.gallery-main');
    const zoomModal = document.getElementById('zoomModal');
    const zoomImg = document.getElementById('zoomImg');
    if (galleryMainEl && zoomModal && zoomImg) {
      galleryMainEl.addEventListener('click', () => {
        zoomImg.src = mainImg?.src || '';
        zoomModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      });
      const closeZoom = () => { zoomModal.style.display = 'none'; document.body.style.overflow = ''; };
      document.getElementById('zoomClose')?.addEventListener('click', closeZoom);
      document.getElementById('zoomBackdrop')?.addEventListener('click', closeZoom);
      document.addEventListener('keydown', e => { if (e.key === 'Escape') closeZoom(); });
    }

    // Badges
    const badgesEl = document.getElementById('productBadges');
    if (badgesEl) {
      badgesEl.innerHTML = product.condition === 'used'
        ? '<span class="badge badge--used">Б/У</span>'
        : '<span class="badge badge--new">Новый</span>';
      if (product.oldPrice) badgesEl.innerHTML += '<span class="badge badge--sale">Скидка</span>';
    }

    // Text info
    const set = (elId, text) => { const el = document.getElementById(elId); if (el) el.textContent = text || ''; };
    set('productTitle', product.name);
    set('productBrand', product.brand);
    set('productSku', `ITM-${String(product.id).padStart(4, '0')}`);
    set('productPrice', formatPrice(product.price));
    set('productWarranty', product.warranty || '—');

    const oldPriceEl = document.getElementById('productPriceOld');
    if (oldPriceEl) {
      if (product.oldPrice) { oldPriceEl.textContent = formatPrice(product.oldPrice); oldPriceEl.style.display = 'block'; }
      else oldPriceEl.style.display = 'none';
    }

    // Qty controls
    let qty = 1;
    const qtyInput = document.getElementById('qtyInput');
    document.getElementById('qtyPlus')?.addEventListener('click', () => {
      qty = Math.min(qty + 1, 99);
      if (qtyInput) qtyInput.value = qty;
    });
    document.getElementById('qtyMinus')?.addEventListener('click', () => {
      qty = Math.max(qty - 1, 1);
      if (qtyInput) qtyInput.value = qty;
    });
    if (qtyInput) {
      qtyInput.addEventListener('change', () => {
        qty = Math.max(1, Math.min(99, parseInt(qtyInput.value) || 1));
        qtyInput.value = qty;
      });
    }

    // Add to cart
    document.getElementById('addToCartBtn')?.addEventListener('click', () => {
      addToCart(product.id, qty);
      updateCartBadge();
    });

    // Specs table
    const specsTable = document.getElementById('specsTable');
    if (specsTable && product.specs) {
      specsTable.innerHTML = Object.entries(product.specs)
        .map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`)
        .join('');
    }

    // Description
    const descEl = document.getElementById('productDescription');
    if (descEl) descEl.textContent = product.description || '';

    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(`tab-${btn.dataset.tab}`)?.classList.add('active');
      });
    });

    // Related products
    const relatedGrid = document.getElementById('relatedGrid');
    if (relatedGrid) {
      const relatedProducts = getAllProducts()
        .filter(p => p.id !== product.id && p.type === product.type)
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 4);
      relatedGrid.innerHTML = relatedProducts.map(createProductCardHTML).join('');
      relatedGrid.addEventListener('click', e => {
        const btn = e.target.closest('.add-to-cart-btn');
        if (btn) { addToCart(Number(btn.dataset.id)); updateCartBadge(); }
      });
      setTimeout(initCardReveal, 100);
    }
  }, 300);
}

// ============================================
// CART PAGE
// ============================================
function initCartPage() {
  renderCartPage();
  document.getElementById('clearCartBtn')?.addEventListener('click', () => {
    if (confirmAction('Очистить корзину?')) {
      clearCart();
      renderCartPage();
    }
  });
}

// ============================================
// CHECKOUT PAGE
// ============================================
function initCheckoutPage() {
  renderCheckoutItems();

  let currentStep = 1;
  let deliveryCost = 200;

  function goToStep(step) {
    document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.checkout-step').forEach((s, i) => {
      s.classList.toggle('active', i + 1 === step);
      s.classList.toggle('done', i + 1 < step);
    });
    document.getElementById(`step${step}`)?.classList.add('active');
    currentStep = step;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Step 1
  document.getElementById('nextStep1')?.addEventListener('click', () => {
    let valid = true;
    const firstName = document.getElementById('firstName')?.value?.trim();
    const lastName = document.getElementById('lastName')?.value?.trim();
    const phone = document.getElementById('phone')?.value;
    const email = document.getElementById('email')?.value;

    if (!firstName) { showFieldError('firstNameError', 'Введите имя'); valid = false; } else clearFieldError('firstNameError');
    if (!lastName) { showFieldError('lastNameError', 'Введите фамилию'); valid = false; } else clearFieldError('lastNameError');
    if (!phone || !utilValidatePhone(phone)) { showFieldError('phoneError', 'Введите корректный номер (9 цифр)'); valid = false; } else clearFieldError('phoneError');
    if (email && !validateEmail(email)) { showFieldError('emailError', 'Некорректный email'); valid = false; } else clearFieldError('emailError');

    if (valid) goToStep(2);
  });

  // Delivery toggle
  document.querySelectorAll('input[name="payment"]').forEach(radio => {
  radio.addEventListener('change', () => {
    const cardForm = document.getElementById('cardForm');
    if (cardForm) cardForm.style.display = radio.value === 'card' ? 'block' : 'none';
  });
});

const cardNumberInput = document.getElementById('cardNumber');
if (cardNumberInput) {
  cardNumberInput.addEventListener('input', () => {
    let val = cardNumberInput.value.replace(/\D/g, '').slice(0, 16);
    cardNumberInput.value = val.replace(/(.{4})/g, '$1 ').trim();
  });
}

const cardExpiryInput = document.getElementById('cardExpiry');
if (cardExpiryInput) {
  cardExpiryInput.addEventListener('input', () => {
    let val = cardExpiryInput.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 3) val = val.slice(0, 2) + '/' + val.slice(2);
    cardExpiryInput.value = val;
  });
}

const cardCvvInput = document.getElementById('cardCvv');
if (cardCvvInput) {
  cardCvvInput.addEventListener('input', () => {
    cardCvvInput.value = cardCvvInput.value.replace(/\D/g, '').slice(0, 3);
  });
}
  document.querySelectorAll('input[name="delivery"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const addrGroup = document.getElementById('addressGroup');
      if (radio.value === 'pickup') {
        deliveryCost = 0;
        if (addrGroup) addrGroup.style.display = 'none';
      } else {
        deliveryCost = 200;
        if (addrGroup) addrGroup.style.display = 'block';
      }
      updateCheckoutSummary(deliveryCost);
    });
  });

  // Step 2
  document.getElementById('prevStep2')?.addEventListener('click', () => goToStep(1));
  document.getElementById('nextStep2')?.addEventListener('click', () => {
    const delivery = document.querySelector('input[name="delivery"]:checked')?.value;
    let valid = true;
    if (delivery === 'courier') {
      const address = document.getElementById('address')?.value?.trim();
      if (!address) { showFieldError('addressError', 'Введите адрес доставки'); valid = false; } else clearFieldError('addressError');
    }
    if (valid) { updateOrderReview(); goToStep(3); }
  });

  // Step 3
  document.getElementById('prevStep3')?.addEventListener('click', () => goToStep(2));

  function updateOrderReview() {
    const review = document.getElementById('orderReview');
    if (!review) return;
    const delivery = document.querySelector('input[name="delivery"]:checked')?.value;
    const payment = document.querySelector('input[name="payment"]:checked')?.value;
    const firstName = document.getElementById('firstName')?.value;
    const lastName = document.getElementById('lastName')?.value;
    const phone = document.getElementById('phone')?.value;
    const address = document.getElementById('address')?.value;
    review.innerHTML = `
      <strong>Получатель:</strong> ${firstName} ${lastName}<br>
      <strong>Телефон:</strong> +996 ${phone}<br>
      <strong>Доставка:</strong> ${delivery === 'courier' ? `Курьер: ${address}` : 'Самовывоз'}<br>
      <strong>Оплата:</strong> ${payment === 'card' ? 'Банковская карта' : 'Наличными'}
    `;
  }

  // Submit
  document.getElementById('checkoutForm')?.addEventListener('submit', async e => {
    e.preventDefault();
      const payment = document.querySelector('input[name="payment"]:checked')?.value;
    if (payment === 'card') {
    const cardNumber = document.getElementById('cardNumber')?.value.replace(/\s/g, '');
    const cardExpiry = document.getElementById('cardExpiry')?.value;
    const cardCvv    = document.getElementById('cardCvv')?.value;
    const cardName   = document.getElementById('cardName')?.value.trim();
    let cardValid = true;
    if (!cardNumber || cardNumber.length !== 16) { showFieldError('cardNumberError', 'Введите 16 цифр'); cardValid = false; } else clearFieldError('cardNumberError');
    if (!cardExpiry || cardExpiry.length !== 5)  { showFieldError('cardExpiryError', 'Формат: ММ/ГГ'); cardValid = false; } else clearFieldError('cardExpiryError');
    if (!cardCvv || cardCvv.length !== 3)        { showFieldError('cardCvvError', 'Введите 3 цифры'); cardValid = false; } else clearFieldError('cardCvvError');
    if (!cardName)                               { showFieldError('cardNameError', 'Введите имя'); cardValid = false; } else clearFieldError('cardNameError');
    if (!cardValid) return;
    }
    const btn = document.getElementById('submitOrder');
    const loader = document.getElementById('submitLoader');
    const btnText = document.getElementById('submitBtnText');
    if (btn) btn.disabled = true;
    if (loader) loader.style.display = 'inline-block';
    if (btnText) btnText.style.display = 'none';

    await new Promise(r => setTimeout(r, 1200));

    const cart = getCart();
    const user = getCurrentUser();
    const orderId = generateOrderId();

    const order = {
      id: orderId,
      userId: user?.id || null,
      items: cart.map(item => {
        const p = getProductById(item.id);
        return { id: item.id, name: p?.name, price: p?.price, qty: item.qty };
      }),
      customer: {
        firstName: document.getElementById('firstName')?.value,
        lastName: document.getElementById('lastName')?.value,
        phone: '+996' + document.getElementById('phone')?.value,
        email: document.getElementById('email')?.value,
        address: document.getElementById('address')?.value
      },
      delivery: document.querySelector('input[name="delivery"]:checked')?.value,
      payment: document.querySelector('input[name="payment"]:checked')?.value,
      comment: document.getElementById('comment')?.value,
      subtotal: cart.reduce((s, i) => s + (getProductById(i.id)?.price || 0) * i.qty, 0),
      deliveryCost,
      total: cart.reduce((s, i) => s + (getProductById(i.id)?.price || 0) * i.qty, 0) + deliveryCost,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    saveOrder(order);
    clearCart();

    const modal = document.getElementById('successModal');
    const orderNumEl = document.getElementById('orderNumber');
    if (orderNumEl) orderNumEl.textContent = orderId;
    if (modal) modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  });
}

// ============================================
// LOGIN PAGE
// ============================================
function initLoginPage() {
  if (isLoggedIn()) { window.location.href = 'profile.html'; return; }

  const tabs = document.querySelectorAll('.auth-tab');
  const forms = document.querySelectorAll('.auth-form');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      forms.forEach(f => f.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`${tab.dataset.tab}Form`)?.classList.add('active');
    });
  });

  // Login
  document.getElementById('loginForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('loginEmail')?.value;
    const password = document.getElementById('loginPassword')?.value;
    let valid = true;

    if (!email || !validateEmail(email)) { showFieldError('loginEmailError', 'Введите корректный email'); valid = false; } else clearFieldError('loginEmailError');
    if (!password || password.length < 6) { showFieldError('loginPasswordError', 'Минимум 6 символов'); valid = false; } else clearFieldError('loginPasswordError');
    if (!valid) return;

    const result = login(email, password);
    if (result.success) {
      showToast('Добро пожаловать!', 'success');
      setTimeout(() => { window.location.href = result.user.role === 'admin' ? 'admin.html' : 'profile.html'; }, 700);
    } else {
      showToast(result.error, 'error');
      showFieldError('loginPasswordError', result.error);
    }
  });

  // Register
  document.getElementById('registerForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const firstName = document.getElementById('regFirstName')?.value?.trim();
    const lastName = document.getElementById('regLastName')?.value?.trim();
    const email = document.getElementById('regEmail')?.value;
    const password = document.getElementById('regPassword')?.value;
    const passwordConfirm = document.getElementById('regPasswordConfirm')?.value;
    let valid = true;

    if (!firstName) { showFieldError('regFirstNameError', 'Введите имя'); valid = false; } else clearFieldError('regFirstNameError');
    if (!lastName) { showFieldError('regLastNameError', 'Введите фамилию'); valid = false; } else clearFieldError('regLastNameError');
    if (!email || !validateEmail(email)) { showFieldError('regEmailError', 'Введите корректный email'); valid = false; } else clearFieldError('regEmailError');
    if (!password || password.length < 6) { showFieldError('regPasswordError', 'Минимум 6 символов'); valid = false; } else clearFieldError('regPasswordError');
    if (password !== passwordConfirm) { showFieldError('regPasswordConfirmError', 'Пароли не совпадают'); valid = false; } else clearFieldError('regPasswordConfirmError');
    if (!valid) return;

    const result = register({ firstName, lastName, email, password, phone: document.getElementById('regPhone')?.value });
    if (result.success) {
      showToast('Регистрация прошла успешно!', 'success');
      setTimeout(() => { window.location.href = 'profile.html'; }, 700);
    } else {
      showToast(result.error, 'error');
      showFieldError('regEmailError', result.error);
    }
  });
}

// ============================================
// PROFILE PAGE
// ============================================
function initProfilePage() {
  if (!requireAuth()) return;
  const user = getCurrentUser();

  const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val || ''; };
  const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };

  setText('profileName', `${user.firstName} ${user.lastName}`);
  setText('profileEmail', user.email);
  const initials = `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase();
  const initialsEl = document.getElementById('profileInitials');
  if (initialsEl) initialsEl.textContent = initials;

  setVal('profileFirstName', user.firstName);
  setVal('profileLastName', user.lastName);
  setVal('profileEmailInput', user.email);

  const storedUsers = JSON.parse(localStorage.getItem('itmarket_users') || '[]');
  const fullUser = storedUsers.find(u => u.id === user.id);
  if (fullUser) {
    setVal('profilePhone', fullUser.phone);
    setVal('profileAddress', fullUser.address);
  }

  if (isAdmin()) {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      const adminLink = document.createElement('a');
      adminLink.href = 'admin.html';
      adminLink.className = 'profile-nav__item';
      adminLink.innerHTML = '<span>⚙</span> Панель администратора';
      logoutBtn.parentNode.insertBefore(adminLink, logoutBtn);
    }
  }

  // Tab switching
  document.querySelectorAll('.profile-nav__item[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.profile-nav__item').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(`tab-${btn.dataset.tab}`)?.classList.add('active');
      if (btn.dataset.tab === 'orders') renderOrders();
    });
  });

  // Save profile
  document.getElementById('profileForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const updated = updateProfile({
      firstName: document.getElementById('profileFirstName')?.value,
      lastName: document.getElementById('profileLastName')?.value,
      phone: document.getElementById('profilePhone')?.value,
      address: document.getElementById('profileAddress')?.value,
      newPassword: document.getElementById('profileNewPassword')?.value
    });
    if (updated) {
      showToast('Данные сохранены', 'success');
      setText('profileName', `${updated.firstName} ${updated.lastName}`);
    }
  });

  // Logout
  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    logout();
    window.location.href = 'index.html';
  });

  function renderOrders() {
    const list = document.getElementById('ordersList');
    const empty = document.getElementById('ordersEmpty');
    if (!list) return;

    const orders = getUserOrders(user.id);
    if (orders.length === 0) {
      list.innerHTML = '';
      if (empty) empty.style.display = 'block';
      return;
    }
    if (empty) empty.style.display = 'none';

    list.innerHTML = [...orders].reverse().map(order => `
      <div class="order-card">
        <div class="order-card__header">
          <div>
            <div class="order-card__num">${order.id}</div>
            <div class="order-card__date">${formatDate(order.createdAt)}</div>
          </div>
          <span class="order-status ${getStatusClass(order.status)}">${getStatusLabel(order.status)}</span>
        </div>
        <div class="order-card__items">
          ${(order.items || []).map(i => `${i.name} × ${i.qty}`).join(', ')}
        </div>
        <div class="order-card__total">${formatPrice(order.total || 0)}</div>
      </div>
    `).join('');
  }
}

// ============================================
// ADMIN PAGE
// ============================================
function initAdminPage() {
  if (!requireAdmin()) return;

  renderAdminStats();
  renderProductsTable();

  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.admin-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`adminTab-${tab.dataset.tab}`)?.classList.add('active');
      if (tab.dataset.tab === 'orders') renderOrdersTable();
    });
  });

  document.getElementById('adminLogout')?.addEventListener('click', () => {
    logout();
    window.location.href = 'login.html';
  });

  // Product modal
  const modal = document.getElementById('productModal');
  const form = document.getElementById('productForm');

  const openModal = () => {
    if (modal) modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };
  const closeModal = () => {
    if (modal) modal.style.display = 'none';
    document.body.style.overflow = '';
  };

  document.getElementById('addProductBtn')?.addEventListener('click', () => {
    document.getElementById('productModalTitle').textContent = 'Добавить товар';
    form?.reset();
    document.getElementById('productId').value = '';
    openModal();
  });

  document.getElementById('productModalClose')?.addEventListener('click', closeModal);
  document.getElementById('cancelProductBtn')?.addEventListener('click', closeModal);
  document.getElementById('productModalBackdrop')?.addEventListener('click', closeModal);

  form?.addEventListener('submit', e => {
    e.preventDefault();
    const id = document.getElementById('productId')?.value;
    const oldPriceVal = parseInt(document.getElementById('pOldPrice')?.value) || 0;
    const data = {
      name: document.getElementById('pName')?.value,
      brand: document.getElementById('pBrand')?.value,
      type: document.getElementById('pType')?.value,
      condition: document.getElementById('pCondition')?.value,
      price: parseInt(document.getElementById('pPrice')?.value) || 0,
      oldPrice: oldPriceVal > 0 ? oldPriceVal : null,
      popularity: parseInt(document.getElementById('pPopularity')?.value) || 50,
      warranty: document.getElementById('pWarranty')?.value,
      description: document.getElementById('pDescription')?.value,
      specs: parseSpecs(document.getElementById('pSpecs')?.value || '{}'),
      images: parseImageUrls(document.getElementById('pImages')?.value || ''),
      inStock: document.getElementById('pInStock')?.checked
    };

    if (id) {
      updateProduct(id, data);
      showToast('Товар обновлён', 'success');
    } else {
      addProduct(data);
      showToast('Товар добавлен', 'success');
    }
    closeModal();
    renderProductsTable();
    renderAdminStats();
  });

  // Order status modal
  const orderModal = document.getElementById('orderStatusModal');
  let editingOrderId = null;

  const closeOrderModal = () => {
    if (orderModal) orderModal.style.display = 'none';
    document.body.style.overflow = '';
  };

  document.getElementById('orderStatusClose')?.addEventListener('click', closeOrderModal);
  document.getElementById('cancelOrderStatus')?.addEventListener('click', closeOrderModal);
  document.getElementById('orderStatusBackdrop')?.addEventListener('click', closeOrderModal);

  document.getElementById('saveOrderStatus')?.addEventListener('click', () => {
    if (!editingOrderId) return;
    const status = document.getElementById('orderStatusSelect')?.value;
    updateOrderStatus(editingOrderId, status);
    showToast('Статус обновлён', 'success');
    closeOrderModal();
    renderOrdersTable();
    renderAdminStats();
  });

  function renderAdminStats() {
    const products = getAllProducts();
    const orders = getOrders();
    const users = JSON.parse(localStorage.getItem('itmarket_users') || '[]');
    const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);
    const el = id => document.getElementById(id);
    if (el('statProducts')) el('statProducts').textContent = products.length;
    if (el('statOrders')) el('statOrders').textContent = orders.length;
    if (el('statUsers')) el('statUsers').textContent = users.length;
    if (el('statRevenue')) el('statRevenue').textContent = formatPrice(revenue);
  }

  function renderProductsTable() {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;
    const products = getAllProducts();
    tbody.innerHTML = products.map(p => `
      <tr>
        <td><span style="font-family:var(--font-mono);font-size:12px">ITM-${String(p.id).padStart(4,'0')}</span></td>
        <td>${p.images?.[0] ? `<img src="${p.images[0]}" alt="${p.name}" loading="lazy">` : '—'}</td>
        <td><strong>${p.name}</strong></td>
        <td>${p.type === 'pc' ? 'ПК' : 'Ноутбук'}</td>
        <td><span class="badge ${p.condition === 'used' ? 'badge--used' : 'badge--new'}">${p.condition === 'used' ? 'Б/У' : 'Новый'}</span></td>
        <td><span style="font-family:var(--font-mono)">${formatPrice(p.price)}</span></td>
        <td><span class="dot ${p.inStock !== false ? 'dot--green' : 'dot--red'}" style="display:inline-block;width:10px;height:10px;border-radius:50%"></span></td>
        <td>
          <div class="action-btns">
            <button class="admin-btn admin-btn--edit" data-edit="${p.id}">Изменить</button>
            <button class="admin-btn admin-btn--delete" data-delete="${p.id}">Удалить</button>
          </div>
        </td>
      </tr>
    `).join('') || '<tr><td colspan="8" style="text-align:center;padding:40px;color:var(--text-3)">Нет товаров</td></tr>';

    tbody.querySelectorAll('[data-edit]').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = getProductById(Number(btn.dataset.edit));
        if (!p) return;
        document.getElementById('productModalTitle').textContent = 'Изменить товар';
        document.getElementById('productId').value = p.id;
        document.getElementById('pName').value = p.name;
        document.getElementById('pBrand').value = p.brand;
        document.getElementById('pType').value = p.type;
        document.getElementById('pCondition').value = p.condition;
        document.getElementById('pPrice').value = p.price;
        document.getElementById('pOldPrice').value = p.oldPrice || '';
        document.getElementById('pPopularity').value = p.popularity || 50;
        document.getElementById('pWarranty').value = p.warranty || '';
        document.getElementById('pDescription').value = p.description || '';
        document.getElementById('pSpecs').value = JSON.stringify(p.specs || {}, null, 2);
        document.getElementById('pImages').value = (p.images || []).join(', ');
        document.getElementById('pInStock').checked = p.inStock !== false;
        openModal();
      });
    });

    tbody.querySelectorAll('[data-delete]').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirmAction('Удалить этот товар?')) {
          deleteProduct(Number(btn.dataset.delete));
          renderProductsTable();
          renderAdminStats();
          showToast('Товар удалён', 'info');
        }
      });
    });
  }

  function renderOrdersTable() {
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) return;
    const orders = [...getOrders()].reverse();
    if (orders.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:40px;color:var(--text-3)">Заказов пока нет</td></tr>';
      return;
    }
    tbody.innerHTML = orders.map(o => `
      <tr>
        <td><span style="font-family:var(--font-mono);font-size:12px">${o.id}</span></td>
        <td>${formatDate(o.createdAt)}</td>
        <td>${o.customer?.firstName || ''} ${o.customer?.lastName || ''}</td>
        <td>${o.customer?.phone || ''}</td>
        <td><span style="font-family:var(--font-mono)">${formatPrice(o.total || 0)}</span></td>
        <td>${o.delivery === 'courier' ? 'Курьер' : 'Самовывоз'}</td>
        <td><span class="order-status ${getStatusClass(o.status)}">${getStatusLabel(o.status)}</span></td>
        <td>
          <button class="admin-btn admin-btn--status" data-order-id="${o.id}" data-current="${o.status}">
            Изменить
          </button>
          <button class="admin-btn admin-btn--delete" onclick="deleteOrder('${o.id}')">
            Удалить
          </button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('[data-order-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        editingOrderId = btn.dataset.orderId;
        const editOrderNumEl = document.getElementById('editOrderNum');
        if (editOrderNumEl) editOrderNumEl.textContent = editingOrderId;
        const statusSelect = document.getElementById('orderStatusSelect');
        if (statusSelect) statusSelect.value = btn.dataset.current;
        if (orderModal) orderModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      });
    });
  }
}
window.deleteOrder = function(orderId) {
  if (confirm('Удалить заказ ' + orderId + '?')) {
    let orders = [...getOrders()].filter(o => o.id !== orderId);
    localStorage.setItem('itmarket_orders', JSON.stringify(orders));
    renderOrdersTable();
    showToast('Заказ удалён', 'info');
  }
}

// ============================================
// CONTACTS PAGE
// ============================================
window.initContactsPage = function() {
  document.getElementById('contactForm')?.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    const name = document.getElementById('contactName')?.value?.trim();
    const phone = document.getElementById('contactPhone')?.value;
    const message = document.getElementById('contactMessage')?.value?.trim();

    if (!name) { showFieldError('contactNameError', 'Введите имя'); valid = false; } else clearFieldError('contactNameError');
    if (!phone) {showFieldError('contactPhoneError','Введите номер телефона'); valid = false;}
    if (!message) { showFieldError('contactMessageError', 'Введите сообщение'); valid = false; } else clearFieldError('contactMessageError');

      if (valid) {
        const token = '8219132435:AAElRVzo6dgjricTt3KQuENNsfJdQAbvXVE';
        const chatId = '8574915613';
        const text = `📩 Новое сообщение!\n👤 Имя: ${name}\n📞 Телефон: +996 ${phone}\n📧 Email: ${document.getElementById('contactEmail')?.value || '—'}\n📌 Тема: ${document.getElementById('contactSubject')?.value || '—'}\n💬 Сообщение: ${message}`;
        fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: text })
        })
        .then(() => {
          showToast('Сообщение отправлено! Мы свяжемся с вами.', 'success');
          e.target.reset();
        })
        .catch(() => {
          showToast('Ошибка отправки. Позвоните нам по телефону.', 'error');
        });
      }
  });
}

// ============================================
// ROUTER
// ============================================
function router() {
  globalInit();
  updateAuthHeader();

  const page = window.location.pathname.split('/').pop() || 'index.html';

  const routes = {
    'index.html': initHomePage,
    '':           initHomePage,
    'catalog.html':  initCatalogPage,
    'product.html':  initProductPage,
    'cart.html':     initCartPage,
    'checkout.html': initCheckoutPage,
    'login.html':    initLoginPage,
    'profile.html':  initProfilePage,
    'admin.html':    initAdminPage,
    'contacts.html': initContactsPage,
  };

  const handler = routes[page];
  if (handler) handler();
}

// Bootstrap
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', router);
} else {
  router();
}
