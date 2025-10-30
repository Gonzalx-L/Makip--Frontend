// Constantes de la aplicación

// Rutas
export const ROUTES = {
  // Públicas
  HOME: '/',
  PRODUCTS: '/productos',
  PRODUCT_DETAIL: '/productos/:id',
  ABOUT: '/nosotros',
  CONTACT: '/contacto',
  
  // Autenticación
  LOGIN: '/login',
  REGISTER: '/registro',
  
  // Cliente
  PROFILE: '/perfil',
  ORDERS: '/mis-pedidos',
  CART: '/carrito',
  CHECKOUT: '/checkout',
  
  // Admin
  ADMIN_DASHBOARD: '/admin',
  ADMIN_PRODUCTS: '/admin/productos',
  ADMIN_ORDERS: '/admin/pedidos',
  ADMIN_METRICS: '/admin/metricas',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
  },
  PRODUCTS: {
    LIST: '/products',
    DETAIL: '/products/:id',
    CREATE: '/products',
    UPDATE: '/products/:id',
    DELETE: '/products/:id',
  },
  ORDERS: {
    LIST: '/orders',
    CREATE: '/orders',
    DETAIL: '/orders/:id',
    UPDATE: '/orders/:id',
  },
  CART: {
    GET: '/cart',
    ADD: '/cart/add',
    UPDATE: '/cart/update',
    REMOVE: '/cart/remove',
    CLEAR: '/cart/clear',
  },
} as const;

// Configuración
export const CONFIG = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  ITEMS_PER_PAGE: 12,
  MAX_CART_ITEMS: 99,
} as const;