// src/features/locations/hooks/useLocationSearch.js
import { useJsApiLoader } from '@react-google-maps/api';
import config from 'config/config';

const libraries = ['places', 'marker'];

/**
 * Hook for loading Google Maps API and managing location search functionality
 * @returns {Object} Loading state and error information
 */
export const useLocationSearch = () => {
    const { isLoaded, loadError } = useJsApiLoader({
        googleMapsApiKey: config.apiKeys.googleMaps,
        libraries,
    });

    return {
        isLoaded,
        loadError,
        isReady: isLoaded && !loadError
    };
};
