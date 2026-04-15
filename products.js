// ============================================
// HOJI TECH — PRODUCTS DATA & MANAGEMENT
// ============================================

const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: 'Gaming PC Pro X5',
    brand: 'Custom Build',
    type: 'pc',
    condition: 'new',
    price: 89900,
    oldPrice: 99900,
    popularity: 95,
    inStock: true,
    warranty: '24 месяца',
    description: 'Мощный игровой ПК на базе Intel Core i7 последнего поколения. Идеально подходит для современных игр и работы с графикой.',
    images: [
      'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=600&q=80',
      'https://images.unsplash.com/photo-1562976540-1502c2145186?w=600&q=80',
      'https://images.unsplash.com/photo-1593640408182-31c228cf3a6a?w=600&q=80',
      'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&q=80'
    ],
    specs: {
      'Процессор': 'Intel Core i7-13700K',
      'Оперативная память': '32 GB DDR5 5600MHz',
      'Видеокарта': 'NVIDIA RTX 4070 Ti 12 GB',
      'Хранилище': 'SSD 1 TB NVMe PCIe 4.0',
      'Материнская плата': 'MSI Z790 Gaming Plus',
      'Блок питания': '750W 80+ Gold',
      'Охлаждение': 'Deepcool AK620',
      'Корпус': 'Fractal Design Pop Air'
    }
  },
  {
    id: 2,
    name: 'MacBook Pro 14" M3',
    brand: 'Apple',
    type: 'laptop',
    condition: 'new',
    price: 149900,
    oldPrice: null,
    popularity: 98,
    inStock: true,
    warranty: '12 месяцев',
    description: 'Профессиональный ноутбук с процессором Apple M3. Невероятная производительность и автономность.',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&q=80',
      'https://images.unsplash.com/photo-1542621334-a254cf47733d?w=600&q=80',
      'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=600&q=80'
    ],
    specs: {
      'Процессор': 'Apple M3 Pro 12-core',
      'Оперативная память': '36 GB unified',
      'Хранилище': 'SSD 512 GB',
      'Дисплей': '14.2" Liquid Retina XDR 3024×1964',
      'Видеокарта': 'Apple M3 Pro 18-core GPU',
      'Автономность': 'до 18 часов',
      'Порты': 'HDMI, 3×Thunderbolt 4, MagSafe 3, SD',
      'ОС': 'macOS Sonoma'
    }
  },
  {
    id: 3,
    name: 'ThinkPad X1 Carbon',
    brand: 'Lenovo',
    type: 'laptop',
    condition: 'used',
    price: 48900,
    oldPrice: 65000,
    popularity: 82,
    inStock: true,
    warranty: '6 месяцев',
    description: 'Б/У ноутбук в отличном состоянии. Прошёл полную диагностику. Небольшие потёртости на корпусе.',
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80',
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&q=80',
      'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=600&q=80'
    ],
    specs: {
      'Процессор': 'Intel Core i5-1135G7',
      'Оперативная память': '16 GB LPDDR4x',
      'Хранилище': 'SSD 512 GB',
      'Дисплей': '14" IPS 1920×1200',
      'Вес': '1.12 кг',
      'Автономность': 'до 15 часов',
      'Порты': '2×Thunderbolt 4, 2×USB-A, HDMI',
      'Состояние': 'Б/У, 8/10'
    }
  },
  {
    id: 4,
    name: 'Рабочая станция Dell Precision',
    brand: 'Dell',
    type: 'pc',
    condition: 'used',
    price: 67500,
    oldPrice: 85000,
    popularity: 70,
    inStock: true,
    warranty: '6 месяцев',
    description: 'Мощная рабочая станция для профессиональных задач. Б/У, в рабочем состоянии.',
    images: [
      'https://images.unsplash.com/photo-1551410224-699683e15636?w=600&q=80',
      'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=600&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
      'https://images.unsplash.com/photo-1601524909162-ae8725290836?w=600&q=80'
    ],
    specs: {
      'Процессор': 'Intel Xeon W-2235 3.8GHz',
      'Оперативная память': '64 GB DDR4 ECC',
      'Видеокарта': 'NVIDIA Quadro RTX 4000 8 GB',
      'Хранилище': 'SSD 512 GB + HDD 2 TB',
      'ОС': 'Windows 11 Pro',
      'Форм-фактор': 'Tower',
      'Состояние': 'Б/У, 7/10'
    }
  },
  {
    id: 5,
    name: 'ASUS ROG Strix G16',
    brand: 'ASUS',
    type: 'laptop',
    condition: 'new',
    price: 112000,
    oldPrice: 125000,
    popularity: 88,
    inStock: true,
    warranty: '24 месяца',
    description: 'Топовый игровой ноутбук с дисплеем 240 Гц и системой охлаждения ROG.',
    images: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&q=80',
      'https://images.unsplash.com/photo-1593640495390-742a50c1a3d0?w=600&q=80',
      'https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=600&q=80',
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&q=80'
    ],
    specs: {
      'Процессор': 'Intel Core i9-13980HX',
      'Оперативная память': '32 GB DDR5',
      'Видеокарта': 'NVIDIA RTX 4080 12 GB',
      'Дисплей': '16" QHD+ 240Hz',
      'Хранилище': 'SSD 1 TB',
      'Автономность': 'до 8 часов',
      'ОС': 'Windows 11 Home',
      'Вес': '2.5 кг'
    }
  },
  {
    id: 6,
    name: 'Office PC Intel Core i3',
    brand: 'Custom Build',
    type: 'pc',
    condition: 'new',
    price: 32900,
    oldPrice: null,
    popularity: 75,
    inStock: true,
    warranty: '12 месяцев',
    description: 'Надёжный офисный компьютер для работы с документами, интернетом и бухгалтерией.',
    images: [
      'https://images.unsplash.com/photo-1593640408182-31c228cf3a6a?w=600&q=80',
      'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=600&q=80',
      'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=600&q=80',
      'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&q=80'
    ],
    specs: {
      'Процессор': 'Intel Core i3-12100',
      'Оперативная память': '8 GB DDR4',
      'Хранилище': 'SSD 256 GB',
      'Видеокарта': 'Intel UHD Graphics 730',
      'ОС': 'Windows 11 Home',
      'Гарантия': '12 месяцев'
    }
  },
  {
    id: 7,
    name: 'HP EliteBook 840 G8',
    brand: 'HP',
    type: 'laptop',
    condition: 'used',
    price: 42000,
    oldPrice: 58000,
    popularity: 77,
    inStock: true,
    warranty: '3 месяца',
    description: 'Бизнес-ноутбук HP в отличном состоянии. Тонкий и лёгкий корпус, надёжная клавиатура.',
    images: [
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&q=80',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80',
      'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=600&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80'
    ],
    specs: {
      'Процессор': 'Intel Core i5-1145G7',
      'Оперативная память': '16 GB DDR4',
      'Хранилище': 'SSD 512 GB',
      'Дисплей': '14" FHD IPS',
      'Вес': '1.35 кг',
      'Состояние': 'Б/У, 8/10',
      'ОС': 'Windows 11 Pro'
    }
  },
  {
    id: 8,
    name: 'Gaming PC AMD Ryzen 7',
    brand: 'Custom Build',
    type: 'pc',
    condition: 'new',
    price: 79900,
    oldPrice: 89900,
    popularity: 85,
    inStock: true,
    warranty: '24 месяца',
    description: 'Сбалансированный игровой ПК на AMD Ryzen 7. Отличное соотношение цена/производительность.',
    images: [
      'https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?w=600&q=80',
      'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=600&q=80',
      'https://images.unsplash.com/photo-1562976540-1502c2145186?w=600&q=80',
      'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&q=80'
    ],
    specs: {
      'Процессор': 'AMD Ryzen 7 7700X',
      'Оперативная память': '32 GB DDR5 6000MHz',
      'Видеокарта': 'AMD Radeon RX 7800 XT 16 GB',
      'Хранилище': 'SSD 1 TB NVMe',
      'Материнская плата': 'ASUS TUF B650-Plus',
      'Блок питания': '750W 80+ Gold',
      'ОС': 'Windows 11 Home',
      'Корпус': 'NZXT H5 Flow'
    }
  },
  {
    id: 9,
    name: 'Dell XPS 15 OLED',
    brand: 'Dell',
    type: 'laptop',
    condition: 'new',
    price: 139000,
    oldPrice: null,
    popularity: 90,
    inStock: true,
    warranty: '12 месяцев',
    description: 'Премиальный ноутбук с OLED дисплеем 3.5K. Для творческих профессионалов.',
    images: [
      'https://images.unsplash.com/photo-1542621334-a254cf47733d?w=600&q=80',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&q=80',
      'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=600&q=80'
    ],
    specs: {
      'Процессор': 'Intel Core i9-13900H',
      'Оперативная память': '32 GB LPDDR5',
      'Хранилище': 'SSD 1 TB NVMe',
      'Дисплей': '15.6" OLED 3.5K 120Hz',
      'Видеокарта': 'NVIDIA RTX 4060 8 GB',
      'Автономность': 'до 13 часов',
      'Вес': '1.86 кг',
      'ОС': 'Windows 11 Pro'
    }
  },
  {
    id: 10,
    name: 'Мощный ПК для монтажа',
    brand: 'Custom Build',
    type: 'pc',
    condition: 'new',
    price: 124900,
    oldPrice: 139900,
    popularity: 80,
    inStock: true,
    warranty: '24 месяца',
    description: 'Рабочая станция для видеомонтажа, 3D-рендеринга и разработки. Максимальная производительность.',
    images: [
      'https://images.unsplash.com/photo-1593640408182-31c228cf3a6a?w=600&q=80',
      'https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?w=600&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
      'https://images.unsplash.com/photo-1562976540-1502c2145186?w=600&q=80'
    ],
    specs: {
      'Процессор': 'Intel Core i9-13900K',
      'Оперативная память': '64 GB DDR5',
      'Видеокарта': 'NVIDIA RTX 4090 24 GB',
      'Хранилище': 'SSD 2 TB NVMe + SSD 4 TB',
      'Блок питания': '1000W 80+ Platinum',
      'ОС': 'Windows 11 Pro',
      'Охлаждение': 'Liquid Cooling 360mm'
    }
  },
  {
    id: 11,
    name: 'Acer Nitro 5',
    brand: 'Acer',
    type: 'laptop',
    condition: 'used',
    price: 38000,
    oldPrice: 52000,
    popularity: 72,
    inStock: true,
    warranty: '3 месяца',
    description: 'Доступный игровой ноутбук Acer в хорошем состоянии. Отличный выбор для начинающих геймеров.',
    images: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&q=80',
      'https://images.unsplash.com/photo-1629131726692-1accd0c53ce0?w=600&q=80',
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&q=80',
      'https://images.unsplash.com/photo-1593640495390-742a50c1a3d0?w=600&q=80'
    ],
    specs: {
      'Процессор': 'Intel Core i5-12500H',
      'Оперативная память': '16 GB DDR4',
      'Видеокарта': 'NVIDIA RTX 3060 6 GB',
      'Дисплей': '15.6" FHD 144Hz',
      'Хранилище': 'SSD 512 GB',
      'Состояние': 'Б/У, 8/10',
      'ОС': 'Windows 11 Home'
    }
  },
  {
    id: 12,
    name: 'Budget PC Celeron',
    brand: 'Custom Build',
    type: 'pc',
    condition: 'used',
    price: 14900,
    oldPrice: 19000,
    popularity: 60,
    inStock: true,
    warranty: '1 месяц',
    description: 'Бюджетный компьютер для базовых задач. Б/У, полностью исправен.',
    images: [
      'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=600&q=80',
      'https://images.unsplash.com/photo-1601524909162-ae8725290836?w=600&q=80',
      'https://images.unsplash.com/photo-1593640408182-31c228cf3a6a?w=600&q=80',
      'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&q=80'
    ],
    specs: {
      'Процессор': 'Intel Celeron G5905',
      'Оперативная память': '4 GB DDR4',
      'Хранилище': 'HDD 500 GB',
      'Видеокарта': 'Intel UHD 610',
      'ОС': 'Windows 10 Pro',
      'Состояние': 'Б/У, 7/10'
    }
  }
];

// ---- STORAGE KEYS ----
const PRODUCTS_KEY = 'hoji_tech_products';

// ---- GET ALL PRODUCTS ----
export function getAllProducts() {
  try {
    const stored = localStorage.getItem(PRODUCTS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {}
  // Init with defaults
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(DEFAULT_PRODUCTS));
  return DEFAULT_PRODUCTS;
}

// ---- SAVE ALL PRODUCTS ----
export function saveProducts(products) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

// ---- GET PRODUCT BY ID ----
export function getProductById(id) {
  const products = getAllProducts();
  return products.find(p => p.id === Number(id)) || null;
}

// ---- FILTER PRODUCTS ----
export function filterProducts(products, filters = {}) {
  return products.filter(p => {
    // Type filter
    if (filters.types && filters.types.length > 0) {
      if (!filters.types.includes(p.type)) return false;
    }
    // Condition filter
    if (filters.conditions && filters.conditions.length > 0) {
      if (!filters.conditions.includes(p.condition)) return false;
    }
    // Brand filter
    if (filters.brands && filters.brands.length > 0) {
      if (!filters.brands.includes(p.brand)) return false;
    }
    // Price filter
    if (filters.priceMin !== undefined && p.price < filters.priceMin) return false;
    if (filters.priceMax !== undefined && p.price > filters.priceMax) return false;
    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const haystack = `${p.name} ${p.brand} ${p.type}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

// ---- SORT PRODUCTS ----
export function sortProducts(products, sort = 'popular') {
  const sorted = [...products];
  switch (sort) {
    case 'price_asc':  sorted.sort((a, b) => a.price - b.price); break;
    case 'price_desc': sorted.sort((a, b) => b.price - a.price); break;
    case 'name_asc':   sorted.sort((a, b) => a.name.localeCompare(b.name)); break;
    case 'popular':
    default:           sorted.sort((a, b) => b.popularity - a.popularity);
  }
  return sorted;
}

// ---- GET UNIQUE BRANDS ----
export function getUniqueBrands() {
  return [...new Set(getAllProducts().map(p => p.brand))].sort();
}

// ---- FORMAT PRICE ----
export function formatPrice(price) {
  return price.toLocaleString('ru-RU') + ' ⃀';
}

// ---- CREATE PRODUCT CARD HTML ----
export function createProductCardHTML(product) {
  const conditionBadge = product.condition === 'used'
    ? '<span class="badge badge--used">Б/У</span>'
    : '<span class="badge badge--new">Новый</span>';
  const saleBadge = product.oldPrice
    ? '<span class="badge badge--sale">Скидка</span>'
    : '';
  const oldPriceHTML = product.oldPrice
    ? `<span class="product-card__price-old">${formatPrice(product.oldPrice)}</span>`
    : '';
  const mainImg = product.images?.[0] || 'https://images.unsplash.com/photo-1593640408182-31c228cf3a6a?w=400&q=60';

  return `
    <div class="product-card hidden" data-id="${product.id}">
      <div class="product-card__img-wrap">
        <a href="product.html?id=${product.id}">
          <img class="product-card__img" src="${mainImg}" alt="${product.name}" loading="lazy">
        </a>
        <div class="product-card__badges">
          ${conditionBadge}
          ${saleBadge}
        </div>
      </div>
      <div class="product-card__body">
        <div class="product-card__brand">${product.brand}</div>
        <h3 class="product-card__title">
          <a href="product.html?id=${product.id}">${product.name}</a>
        </h3>
        <div class="product-card__price-row">
          <span class="product-card__price">${formatPrice(product.price)}</span>
          ${oldPriceHTML}
        </div>
      </div>
      <div class="product-card__footer">
        <button class="btn btn--ghost add-to-cart-btn" data-id="${product.id}">В корзину</button>
        <a href="product.html?id=${product.id}" class="btn btn--primary">Подробнее</a>
      </div>
    </div>
  `;
}

// ---- ADD PRODUCT (admin) ----
export function addProduct(data) {
  const products = getAllProducts();
  const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
  const product = {
    id: newId,
    ...data,
    popularity: data.popularity || 50
  };
  products.push(product);
  saveProducts(products);
  return product;
}

// ---- UPDATE PRODUCT (admin) ----
export function updateProduct(id, data) {
  const products = getAllProducts();
  const idx = products.findIndex(p => p.id === Number(id));
  if (idx === -1) return null;
  products[idx] = { ...products[idx], ...data };
  saveProducts(products);
  return products[idx];
}

// ---- DELETE PRODUCT (admin) ----
export function deleteProduct(id) {
  const products = getAllProducts().filter(p => p.id !== Number(id));
  saveProducts(products);
}
