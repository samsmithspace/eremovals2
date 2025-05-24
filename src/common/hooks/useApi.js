// src/common/hooks/useApi.js
import { useState, useCallback } from 'react';
import { handleApiResponse } from '../utils/apiUtils';

/**
 * Custom hook for making API requests
 *
 * @param {string} baseUrl - Base URL for API requests (optional)
 * @returns {Object} API methods and state
 */
export const useApi = (baseUrl = '') => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const request = useCallback(async (endpoint, options = {}) => {
        const url = baseUrl ? `${baseUrl}${endpoint}` : endpoint;

        setLoading(true);
        setError(null);

        try {
            const headers = {
                'Content-Type': 'application/json',
                ...options.headers
            };

            const config = {
                ...options,
                headers
            };

            // For POST, PUT requests with JSON body
            if (options.body && typeof options.body === 'object') {
                config.body = JSON.stringify(options.body);
            }

            const response = await fetch(url, config);
            const processedResponse = await handleApiResponse(response);

            // Parse as JSON if content type is JSON
            const contentType = response.headers.get('content-type');
            const result = contentType && contentType.includes('application/json')
                ? await processedResponse.json()
                : await processedResponse.text();

            setData(result);
            setLoading(false);

            return result;
        } catch (err) {
            setError(err.message || 'Something went wrong');
            setLoading(false);
            throw err;
        }
    }, [baseUrl]);

    const get = useCallback((endpoint, options = {}) => {
        return request(endpoint, { ...options, method: 'GET' });
    }, [request]);

    const post = useCallback((endpoint, data, options = {}) => {
        return request(endpoint, { ...options, method: 'POST', body: data });
    }, [request]);

    const put = useCallback((endpoint, data, options = {}) => {
        return request(endpoint, { ...options, method: 'PUT', body: data });
    }, [request]);

    const del = useCallback((endpoint, options = {}) => {
        return request(endpoint, { ...options, method: 'DELETE' });
    }, [request]);

    return {
        loading,
        error,
        data,
        request,
        get,
        post,
        put,
        delete: del
    };
};

export default useApi;