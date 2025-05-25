// src/i18n/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files directly
import enTranslation from './locales/en/translation.json';
import zhTranslation from './locales/zh/translation.json';

// Use the JSON files directly - they already have the correct structure
const resources = {
  en: {
    translation: enTranslation
  },
  zh: {
    translation: zhTranslation
  }
};

const detectionOptions = {
  order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
  caches: ['localStorage'],
  lookupFromPathIndex: 0,
  excludeCacheFor: ['cimode'],
  checkWhitelist: true
};

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: undefined, // Let detector determine language
    fallbackLng: 'en',
    whitelist: ['en', 'zh'],
    debug: process.env.NODE_ENV === 'development',
    detection: detectionOptions,

    interpolation: {
      escapeValue: false
    },

    // Simplified namespace configuration
    defaultNS: 'translation',

    react: {
      useSuspense: false,
      bindI18n: 'languageChanged',
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'em', 'span']
    },

    keySeparator: '.',
    nsSeparator: false, // Disable namespace separator

    returnObjects: true,
    returnEmptyString: false,
    returnNull: false,

    missingKeyHandler: (lng, ns, key, fallbackValue) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Missing translation key: ${lng}:${ns}:${key}`);
      }
    }
  });

export default i18n;