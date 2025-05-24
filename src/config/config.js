// src/config/config.js
/**
 * Application-wide configuration
 * Centralizes environment variables and configuration settings
 */
const config = {
  // API endpoints
  api: {
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000',
    endpoints: {
      bookings: '/api/bookings',
      promoCode: '/api/promocode',
      priceItems: '/api/price-item',
      driver: '/api/driver'
    }
  },

  // External API keys
  apiKeys: {
    googleMaps: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    getAddress: process.env.REACT_APP_GETADDRESS_API_KEY,
    stripe: process.env.REACT_APP_STRIPKEY
  },

  // Application mode
  isDevelopment: process.env.REACT_APP_MODE === 'develop',

  // Default settings
  defaults: {
    language: 'en',
    currency: 'GBP',
    currencySymbol: '£',
    phoneNumber: '07404228217',
    email: 'eremovalsscot@gmail.com'
  },

  // Feature flags
  features: {
    enablePromoCodes: true,
    enableHelperOption: true,
    enableWhatsApp: true,
    enableMultiLanguage: true
  },

  // Map configuration
  map: {
    defaultCenter: {
      lat: 55.953251,
      lng: -3.188267
    },
    defaultZoom: 13,
    mapId: '18b403a38f0b2a2'
  },

  // Social media links
  socialMedia: {
    whatsapp: 'https://wa.me/447404228217',
    instagram: 'https://instagram.com/yourprofile',
    twitter: 'https://x.com/yourprofile'
  }
};

export default config;