export const APP_NAME = 'Navjeevan Creation';

export const ROUTES = {
  HOME: '/',
  SHOP: '/shop',
  COLLECTIONS: '/collections',
  OFFERS: '/offers',
  BLOGS: '/blogs',
  ABOUT: '/about',
  CONTACT: '/contact',
  FAQ: '/faq',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  PROFILE: '/profile',
  ORDERS: '/orders',
  WISHLIST: '/wishlist',
  ADDRESSES: '/addresses',
  NOTIFICATIONS: '/notifications',
  COUPONS: '/coupons',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ADMIN: '/admin',
};

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const CURRENCY = 'Rs.';
export const TAX_RATE = 0.18; // 18% GST
export const FREE_SHIPPING_THRESHOLD = 5000;
export const STANDARD_SHIPPING_COST = 150;
