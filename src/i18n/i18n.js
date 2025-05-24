// src/i18n/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Import translation files
import enTranslation from './locales/en/translation.json';
import zhTranslation from './locales/zh/translation.json';

// Namespace configuration for better organization
const resources = {
    en: {
        translation: enTranslation.common,
        booking: enTranslation.booking,
        locations: enTranslation.locations,
        quotes: enTranslation.quotes,
        scheduling: enTranslation.scheduling,
        marketing: enTranslation.marketing,
        navigation: enTranslation.navigation,
        errors: enTranslation.errors
    },
    zh: {
        translation: zhTranslation.common,
        booking: zhTranslation.booking,
        locations: zhTranslation.locations,
        quotes: zhTranslation.quotes,
        scheduling: zhTranslation.scheduling,
        marketing: zhTranslation.marketing,
        navigation: zhTranslation.navigation,
        errors: zhTranslation.errors
    }
};

const detectionOptions = {
    // Define detection order and methods
    order: ['localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],

    // Cache user language
    caches: ['localStorage'],

    // Optional: detect from URL path
    lookupFromPathIndex: 0,

    // Don't cache cookie
    excludeCacheFor: ['cimode'],

    // HTML tag detection
    htmlTag: document.documentElement,

    // Only detect these languages
    checkWhitelist: true
};

// Initialize i18next
i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,

        // Language detection settings
        lng: undefined, // Let detector determine language
        fallbackLng: 'en',
        whitelist: ['en', 'zh'],

        // Debugging (disable in production)
        debug: process.env.NODE_ENV === 'development',

        // Detection options
        detection: detectionOptions,

        // Interpolation options
        interpolation: {
            escapeValue: false, // React already does escaping
            formatSeparator: ','
        },

        // Namespace configuration
        defaultNS: 'translation',
        ns: ['translation', 'booking', 'locations', 'quotes', 'scheduling', 'marketing', 'navigation', 'errors'],

        // React specific options
        react: {
            useSuspense: false,
            bindI18n: 'languageChanged',
            bindI18nStore: '',
            transEmptyNodeValue: '',
            transSupportBasicHtmlNodes: true,
            transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'em', 'span'],
        },

        // Backend options (if using http backend for dynamic loading)
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json',
            addPath: '/locales/add/{{lng}}/{{ns}}',
        },

        // Key separator for nested translations
        keySeparator: '.',
        nsSeparator: ':',

        // Missing key handling
        missingKeyHandler: (lng, ns, key, fallbackValue) => {
            if (process.env.NODE_ENV === 'development') {
                console.warn(`Missing translation key: ${lng}:${ns}:${key}`);
            }
        },

        // Additional formatting options
        returnObjects: true,
        returnEmptyString: false,
        returnNull: false,
    });

// Helper functions for language management
export const changeLanguage = (lng) => {
    return i18n.changeLanguage(lng);
};

export const getCurrentLanguage = () => {
    return i18n.language || 'en';
};

export const getSupportedLanguages = () => {
    return ['en', 'zh'];
};

export const isRTL = (lng = getCurrentLanguage()) => {
    // Add RTL languages here when needed
    const rtlLanguages = ['ar', 'he', 'fa'];
    return rtlLanguages.includes(lng);
};

export const getLanguageDirection = (lng = getCurrentLanguage()) => {
    return isRTL(lng) ? 'rtl' : 'ltr';
};

export const formatMessage = (key, options = {}) => {
    return i18n.t(key, options);
};

// Export configured i18n instance
export default i18n;