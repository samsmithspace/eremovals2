// src/services/api.js
import config from '../config/config';
import { fetchApi, handleApiResponse } from '../common/utils/apiUtils';

/**
 * Main API service for handling all HTTP requests
 * Provides a centralized interface for API communications
 */
class ApiService {
    constructor() {
        this.baseURL = config.api.baseUrl;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }

    /**
     * Generic GET request
     * @param {string} endpoint - API endpoint
     * @param {Object} options - Request options
     * @returns {Promise} Response data
     */
    async get(endpoint, options = {}) {
        const url = this.buildUrl(endpoint);

        try {
            return await fetchApi(url, {
                method: 'GET',
                headers: {
                    ...this.defaultHeaders,
                    ...options.headers
                },
                ...options
            });
        } catch (error) {
            this.handleError('GET', endpoint, error);
            throw error;
        }
    }

    /**
     * Generic POST request
     * @param {string} endpoint - API endpoint
     * @param {Object} data - Request body data
     * @param {Object} options - Request options
     * @returns {Promise} Response data
     */
    async post(endpoint, data = null, options = {}) {
        const url = this.buildUrl(endpoint);

        try {
            return await fetchApi(url, {
                method: 'POST',
                headers: {
                    ...this.defaultHeaders,
                    ...options.headers
                },
                body: data ? JSON.stringify(data) : undefined,
                ...options
            });
        } catch (error) {
            this.handleError('POST', endpoint, error);
            throw error;
        }
    }

    /**
     * Generic PUT request
     * @param {string} endpoint - API endpoint
     * @param {Object} data - Request body data
     * @param {Object} options - Request options
     * @returns {Promise} Response data
     */
    async put(endpoint, data = null, options = {}) {
        const url = this.buildUrl(endpoint);

        try {
            return await fetchApi(url, {
                method: 'PUT',
                headers: {
                    ...this.defaultHeaders,
                    ...options.headers
                },
                body: data ? JSON.stringify(data) : undefined,
                ...options
            });
        } catch (error) {
            this.handleError('PUT', endpoint, error);
            throw error;
        }
    }

    /**
     * Generic DELETE request
     * @param {string} endpoint - API endpoint
     * @param {Object} options - Request options
     * @returns {Promise} Response data
     */
    async delete(endpoint, options = {}) {
        const url = this.buildUrl(endpoint);

        try {
            return await fetchApi(url, {
                method: 'DELETE',
                headers: {
                    ...this.defaultHeaders,
                    ...options.headers
                },
                ...options
            });
        } catch (error) {
            this.handleError('DELETE', endpoint, error);
            throw error;
        }
    }

    /**
     * Upload file with FormData
     * @param {string} endpoint - API endpoint
     * @param {FormData} formData - Form data with file
     * @param {Object} options - Request options
     * @returns {Promise} Response data
     */
    async upload(endpoint, formData, options = {}) {
        const url = this.buildUrl(endpoint);

        try {
            // Don't set Content-Type for FormData, let browser set it with boundary
            const headers = { ...options.headers };
            delete headers['Content-Type'];

            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: formData,
                ...options
            });

            await handleApiResponse(response);
            return response.json();
        } catch (error) {
            this.handleError('UPLOAD', endpoint, error);
            throw error;
        }
    }

    /**
     * Build full URL from endpoint
     * @param {string} endpoint - API endpoint
     * @returns {string} Full URL
     */
    buildUrl(endpoint) {
        // Handle absolute URLs
        if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
            return endpoint;
        }

        // Handle relative URLs
        const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        return `${this.baseURL}${cleanEndpoint}`;
    }

    /**
     * Handle API errors consistently
     * @param {string} method - HTTP method
     * @param {string} endpoint - API endpoint
     * @param {Error} error - Error object
     */
    handleError(method, endpoint, error) {
        console.error(`API Error [${method} ${endpoint}]:`, error);

        // You can add error reporting service integration here
        if (config.isDevelopment) {
            console.group(`API Error Details`);
            console.log('Method:', method);
            console.log('Endpoint:', endpoint);
            console.log('Error:', error);
            console.groupEnd();
        }
    }

    /**
     * Set default headers for all requests
     * @param {Object} headers - Headers to set
     */
    setDefaultHeaders(headers) {
        this.defaultHeaders = {
            ...this.defaultHeaders,
            ...headers
        };
    }

    /**
     * Add authorization header
     * @param {string} token - Authorization token
     */
    setAuthToken(token) {
        if (token) {
            this.defaultHeaders.Authorization = `Bearer ${token}`;
        } else {
            delete this.defaultHeaders.Authorization;
        }
    }

    /**
     * Check if API is reachable
     * @returns {Promise<boolean>} Whether API is reachable
     */
    async healthCheck() {
        try {
            await this.get('/health');
            return true;
        } catch (error) {
            console.warn('API health check failed:', error);
            return false;
        }
    }

    /**
     * Cancel ongoing requests (for cleanup)
     */
    cancelRequests() {
        // Implementation would depend on your cancellation strategy
        // Could use AbortController for modern browsers
        console.log('Cancelling ongoing API requests...');
    }
}

// Create and export singleton instance
const apiService = new ApiService();
export default apiService;

// Export the class for testing purposes
export { ApiService };

