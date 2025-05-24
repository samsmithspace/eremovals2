/**
 * Storage service for managing localStorage and sessionStorage
 */
class StorageService {
    constructor() {
        this.isSupported = this.checkSupport();
    }

    checkSupport() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }

    // Local Storage methods
    setLocal(key, value) {
        if (!this.isSupported) return false;
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.warn('Failed to set localStorage item:', e);
            return false;
        }
    }

    getLocal(key, defaultValue = null) {
        if (!this.isSupported) return defaultValue;
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.warn('Failed to get localStorage item:', e);
            return defaultValue;
        }
    }

    removeLocal(key) {
        if (!this.isSupported) return false;
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.warn('Failed to remove localStorage item:', e);
            return false;
        }
    }

    clearLocal() {
        if (!this.isSupported) return false;
        try {
            localStorage.clear();
            return true;
        } catch (e) {
            console.warn('Failed to clear localStorage:', e);
            return false;
        }
    }

    // Session Storage methods
    setSession(key, value) {
        if (!this.isSupported) return false;
        try {
            sessionStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.warn('Failed to set sessionStorage item:', e);
            return false;
        }
    }

    getSession(key, defaultValue = null) {
        if (!this.isSupported) return defaultValue;
        try {
            const item = sessionStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.warn('Failed to get sessionStorage item:', e);
            return defaultValue;
        }
    }

    removeSession(key) {
        if (!this.isSupported) return false;
        try {
            sessionStorage.removeItem(key);
            return true;
        } catch (e) {
            console.warn('Failed to remove sessionStorage item:', e);
            return false;
        }
    }

    clearSession() {
        if (!this.isSupported) return false;
        try {
            sessionStorage.clear();
            return true;
        } catch (e) {
            console.warn('Failed to clear sessionStorage:', e);
            return false;
        }
    }

    // Preference methods
    setPreference(key, value) {
        return this.setLocal(`pref_${key}`, value);
    }

    getPreference(key, defaultValue = null) {
        return this.getLocal(`pref_${key}`, defaultValue);
    }

    // Utility methods
    getStorageInfo() {
        if (!this.isSupported) return { supported: false };

        return {
            supported: true,
            localStorage: {
                length: localStorage.length,
                keys: Object.keys(localStorage)
            },
            sessionStorage: {
                length: sessionStorage.length,
                keys: Object.keys(sessionStorage)
            }
        };
    }

    cleanup() {
        // Remove expired items (if you implement expiration)
        console.log('Storage cleanup completed');
    }
}

const storageService = new StorageService();
export default storageService;