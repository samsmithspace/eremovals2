// src/common/hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

/**
 * Custom hook for managing state in localStorage
 *
 * @param {string} key - localStorage key
 * @param {any} initialValue - Initial value if key doesn't exist
 * @returns {Array} [storedValue, setValue]
 */
export const useLocalStorage = (key, initialValue) => {
    // Get from localStorage or use initialValue
    const readValue = () => {
        if (typeof window === 'undefined') {
            return initialValue;
        }

        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    };

    const [storedValue, setStoredValue] = useState(readValue);

    // Return a wrapped version of useState's setter function that
    // persists the new value to localStorage
    const setValue = (value) => {
        if (typeof window === 'undefined') {
            console.warn(`Can't set localStorage key "${key}" when window is undefined`);
            return;
        }

        try {
            // Allow value to be a function so we have the same API as useState
            const valueToStore = value instanceof Function ? value(storedValue) : value;

            // Save state
            setStoredValue(valueToStore);

            // Save to localStorage
            window.localStorage.setItem(key, JSON.stringify(valueToStore));

            // Dispatch an event so other hooks listening to the same key can update
            window.dispatchEvent(new Event('local-storage'));
        } catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error);
        }
    };

    // Listen for changes to this localStorage key in other tabs/windows
    useEffect(() => {
        const handleStorageChange = () => {
            setStoredValue(readValue());
        };

        // This custom event is fired by setValue
        window.addEventListener('local-storage', handleStorageChange);
        // This is a standard event fired when localStorage changes in other documents
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('local-storage', handleStorageChange);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return [storedValue, setValue];
};

export default useLocalStorage;