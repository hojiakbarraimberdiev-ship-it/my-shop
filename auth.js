// ============================================
// HOJI TECH — AUTH MODULE
// ============================================

const USERS_KEY = 'hoji_tech_users';
const CURRENT_USER_KEY = 'hoji_tech_current_user';

// ---- DEFAULT ADMIN ----
const DEFAULT_ADMIN = {
  id: 1,
  firstName: 'Администратор',
  lastName: 'Hoji Tech',
  email: 'admin@hoji.tech',
  password: 'admin123',
  phone: '5553181900',
  address: '1-этаж, Торговый центр Корона, 44 улица А.Масалиева, Ош',
  role: 'admin',
  createdAt: new Date('2024-01-01').toISOString()
};

// ---- INIT USERS ----
function initUsers() {
  const users = getUsers();
  const adminExists = users.find(u => u.email === DEFAULT_ADMIN.email);
  if (!adminExists) {
    users.push(DEFAULT_ADMIN);
    saveUsers(users);
  }
}

// ---- GET ALL USERS ----
export function getUsers() {
  try {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// ---- SAVE USERS ----
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// ---- GET CURRENT USER ----
export function getCurrentUser() {
  try {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

// ---- IS LOGGED IN ----
export function isLoggedIn() {
  return getCurrentUser() !== null;
}

// ---- IS ADMIN ----
export function isAdmin() {
  const user = getCurrentUser();
  return user?.role === 'admin';
}

// ---- LOGIN ----
export function login(email, password) {
  initUsers();
  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (!user) {
    return { success: false, error: 'Неверный email или пароль' };
  }
  const { password: _, ...safeUser } = user;
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
  return { success: true, user: safeUser };
}

// ---- REGISTER ----
export function register(data) {
  initUsers();
  const users = getUsers();

  // Check duplicate
  if (users.find(u => u.email.toLowerCase() === data.email.toLowerCase())) {
    return { success: false, error: 'Пользователь с таким email уже существует' };
  }

  const newUser = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 2,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    password: data.password,
    phone: data.phone || '',
    address: '',
    role: 'user',
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);

  const { password: _, ...safeUser } = newUser;
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
  return { success: true, user: safeUser };
}

// ---- LOGOUT ----
export function logout() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

// ---- UPDATE PROFILE ----
export function updateProfile(data) {
  const currentUser = getCurrentUser();
  if (!currentUser) return false;

  const users = getUsers();
  const idx = users.findIndex(u => u.id === currentUser.id);
  if (idx === -1) return false;

  const updated = {
    ...users[idx],
    firstName: data.firstName || users[idx].firstName,
    lastName: data.lastName || users[idx].lastName,
    phone: data.phone || users[idx].phone,
    address: data.address || users[idx].address
  };

  if (data.newPassword && data.newPassword.length >= 6) {
    updated.password = data.newPassword;
  }

  users[idx] = updated;
  saveUsers(users);

  const { password: _, ...safeUser } = updated;
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
  return safeUser;
}

// ---- UPDATE AUTH HEADER ----
export function updateAuthHeader() {
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

// ---- PROTECT PAGE (redirect if not logged in) ----
export function requireAuth(redirectTo = 'login.html') {
  if (!isLoggedIn()) {
    window.location.href = redirectTo;
    return false;
  }
  return true;
}

// ---- PROTECT ADMIN PAGE ----
export function requireAdmin() {
  if (!isLoggedIn()) {
    window.location.href = 'login.html';
    return false;
  }
  if (!isAdmin()) {
    window.location.href = 'profile.html';
    return false;
  }
  return true;
}

// ---- ORDERS ----
const ORDERS_KEY = 'hoji_tech_orders';

export function getOrders() {
  try {
    const data = localStorage.getItem(ORDERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveOrder(order) {
  const orders = getOrders();
  orders.push(order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function updateOrderStatus(orderId, status) {
  const orders = getOrders();
  const idx = orders.findIndex(o => o.id === orderId);
  if (idx === -1) return;
  orders[idx].status = status;
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function getUserOrders(userId) {
  return getOrders().filter(o => o.userId === userId);
}

export function generateOrderId() {
  return 'ORD-' + Date.now().toString(36).toUpperCase();
}

export const ORDER_STATUSES = {
  pending:    { label: 'Ожидает подтверждения', cls: 'order-status--pending' },
  confirmed:  { label: 'Подтверждён',           cls: 'order-status--confirmed' },
  processing: { label: 'В обработке',           cls: 'order-status--processing' },
  shipped:    { label: 'Отправлен',             cls: 'order-status--shipped' },
  delivered:  { label: 'Доставлен',             cls: 'order-status--delivered' },
  cancelled:  { label: 'Отменён',               cls: 'order-status--cancelled' }
};

export function getStatusLabel(status) {
  return ORDER_STATUSES[status]?.label || status;
}
export function getStatusClass(status) {
  return ORDER_STATUSES[status]?.cls || '';
}

// Init on import
initUsers();
