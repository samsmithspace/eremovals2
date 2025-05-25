// src/i18n/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files directly
import enTranslation from './locales/en/translation.json';
import zhTranslation from './locales/zh/translation.json';

const resources = {
  en: {
    translation: enTranslation
  },
  zh: {
    translation: zhTranslation
  }
};

const detectionOptions = {
  order: ['path', 'localStorage', 'navigator', 'htmlTag'],
  lookupFromPathIndex: 0,
  lookupFromSubdomainIndex: 0,
  caches: ['localStorage'],
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

    // Namespace configuration
    defaultNS: 'translation',
    ns: ['translation'],

    react: {
      useSuspense: true,
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'em', 'span'],
      transSupportBasicHtmlNodes: true
    },

    keySeparator: '.',
    nsSeparator: false,

    returnObjects: true,
    returnEmptyString: false,
    returnNull: false,

    // Handle missing keys
    parseMissingKeyHandler: (key) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Missing translation key: ${key}`);
      }
      return key;
    },

    // Load path for dynamic loading (if needed later)
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    }
  });

export default i18n;