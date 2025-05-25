// src/i18n/useTranslationHook.js
import { useTranslation as useI18nextTranslation } from 'react-i18next';

/**
 * Custom translation hook that handles nested keys properly
 * @param {string} namespace - Translation namespace (optional)
 * @returns {Object} Translation functions and language info
 */
export const useTranslation = (namespace = 'translation') => {
  const { t: originalT, i18n, ready } = useI18nextTranslation(namespace);

  // Enhanced translation function that handles nested keys better
  const t = (key, defaultValue, options = {}) => {
    // If key contains dots, try to get nested value
    if (typeof key === 'string' && key.includes('.')) {
      const result = originalT(key, defaultValue, options);

      // If translation key not found and we have a default, use it
      if (result === key && defaultValue) {
        return defaultValue;
      }

      return result;
    }

    // For simple keys or objects
    const result = originalT(key, defaultValue, options);

    // Return default value if translation not found
    if (result === key && defaultValue !== undefined) {
      return defaultValue;
    }

    return result;
  };

  return {
    t,
    i18n,
    ready,
    language: i18n.language,
    changeLanguage: i18n.changeLanguage
  };
};

export default useTranslation;