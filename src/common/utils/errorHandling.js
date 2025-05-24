// src/common/utils/errorHandling.js
/**
 * Parse error responses consistently
 * @param {Error|Object} error - Error object or response
 * @returns {string} - Human-readable error message
 */
export const parseError = (error) => {
    if (!error) {
        return 'An unknown error occurred';
    }

    // If error is an Error object with a message
    if (error.message) {
        return error.message;
    }

    // If error is a response object with an error property
    if (error.error) {
        return error.error;
    }

    // If error is a string
    if (typeof error === 'string') {
        return error;
    }

    // Default fallback
    return 'An unexpected error occurred';
};

/**
 * Log errors consistently
 * @param {Error|Object} error - Error to log
 * @param {string} context - Context where the error occurred
 */
export const logError = (error, context = 'application') => {
    // In development, log the full error object
    if (process.env.NODE_ENV === 'development') {
        console.error(`[${context}] Error:`, error);
    } else {
        // In production, log a simpler message to avoid exposing internals
        console.error(`[${context}] Error: ${parseError(error)}`);

        // Here you could also send errors to a monitoring service like Sentry
        // if (window.Sentry) {
        //   window.Sentry.captureException(error);
        // }
    }
};

/**
 * Centralized error handler for async operations
 * @param {Function} fn - Async function to execute
 * @param {Object} options - Options for error handling
 * @param {Function} options.onError - Custom error handler
 * @param {string} options.context - Context for error logging
 * @returns {Function} - Wrapped function with error handling
 */
export const withErrorHandling = (fn, options = {}) => {
    return async (...args) => {
        const { onError, context = 'application' } = options;

        try {
            return await fn(...args);
        } catch (error) {
            // Log the error
            logError(error, context);

            // Call custom error handler if provided
            if (onError && typeof onError === 'function') {
                onError(error);
            }

            // Re-throw the error for the caller to handle if needed
            throw error;
        }
    };
};