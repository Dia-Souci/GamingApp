// API Configuration and Environment Setup
export const API_CONFIG = {
  // Base URLs for different environments
  BASE_URLS: {
    development: 'http://localhost:3000/api',
    staging: 'https://api-staging.yourdomain.com/api',
    production: 'https://api.yourdomain.com/api',
  },
  
  // Request timeouts
  TIMEOUTS: {
    default: 10000,
    upload: 30000,
    download: 60000,
  },
  
  // Retry configuration
  RETRY: {
    attempts: 3,
    delay: 1000,
  },
  
  // Cache configuration
  CACHE: {
    products: 5 * 60 * 1000, // 5 minutes
    user: 10 * 60 * 1000,    // 10 minutes
  },
};

// Environment detection
export const getEnvironment = (): 'development' | 'staging' | 'production' => {
  const env = import.meta.env.VITE_ENVIRONMENT || 'development';
  return env as 'development' | 'staging' | 'production';
};

// Get base URL for current environment
export const getBaseUrl = (): string => {
  const env = getEnvironment();
  return import.meta.env.VITE_API_BASE_URL || API_CONFIG.BASE_URLS[env];
};

// Feature flags
export const FEATURES = {
  USE_MOCK_API: import.meta.env.VITE_USE_MOCK_API === 'true',
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_ERROR_REPORTING: import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true',
};

// API endpoints - Updated to match backend structure
export const ENDPOINTS = {
  // Game endpoints
  GAMES: '/games',
  GAME_BY_ID: (id: string) => `/games/${id}`,
  GAME_BY_SLUG: (slug: string) => `/games/slug/${slug}`,
  FEATURED_GAMES: '/games/featured',
  SEARCH_GAMES: '/games/search',
  
  // Order endpoints
  ORDERS: '/orders',
  ORDER_BY_ID: (id: string) => `/orders/${id}`,
  ORDER_STATUS: (id: string) => `/orders/${id}/status`,
  GUEST_ORDER: '/orders/guest',
  GUEST_ORDER_BY_NUMBER: (orderNumber: string) => `/orders/guest/${orderNumber}`,
  GUEST_ORDER_LOOKUP: '/orders/guest/lookup/email',
  GUEST_ORDER_CANCEL: (orderNumber: string) => `/orders/guest/${orderNumber}/cancel`,
  
  // Payment endpoints
  PAYMENT_INITIATE: '/payment/initiate',
  PAYMENT_CHECKOUT: (checkoutId: string) => `/payment/checkout/${checkoutId}`,
  PAYMENT_SUCCESS: '/payment/success',
  PAYMENT_FAILURE: '/payment/failure',
  PAYMENT_REFUND: (checkoutId: string) => `/payment/refund/${checkoutId}`,
  PAYMENT_WEBHOOK: '/payment/webhook/chargily',
  
  // Auth endpoints (for future use)
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  PROFILE: '/auth/profile',
  REFRESH: '/auth/refresh',
  
  // Cart endpoints
  CART: '/cart',
  CART_ADD: '/cart/items',
  CART_REMOVE: (gameId: string, platform: string) => `/cart/items/${gameId}/${platform}`,
  CART_UPDATE: (gameId: string, platform: string) => `/cart/items/${gameId}/${platform}`,
};

export default {
  API_CONFIG,
  getEnvironment,
  getBaseUrl,
  FEATURES,
  ENDPOINTS,
};