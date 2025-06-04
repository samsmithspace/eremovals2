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
    googleMaps: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
    getAddress: process.env.REACT_APP_GETADDRESS_API_KEY || '',
    stripe: process.env.REACT_APP_STRIPKEY || '',
    googleAnalytics: process.env.REACT_APP_GA_ID || ''
  },

  // Application mode
  //isDevelopment: process.env.NODE_ENV === 'production',
  isDevelopment: false,
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
    enableMultiLanguage: true,
    enableAnalytics: false,
    enablePerformanceMonitoring: false
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
console.log('Environment check:', {
  NODE_ENV: process.env.NODE_ENV,
  GOOGLE_MAPS_KEY: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  ALL_ENV_VARS: Object.keys(process.env).filter(key => key.startsWith('REACT_APP_'))
});
export default config;