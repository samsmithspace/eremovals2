// src/features/locations/services/locationService.js
import { fetchApi } from 'common/utils/apiUtils';
import config from 'config/config';

/**
 * Enhanced service for location-related API operations
 */
export const locationService = {
    /**
     * Get addresses by postcode using GetAddress.io API
     * @param {string} postcode - Postcode to lookup
     * @returns {Promise<string[]>} Array of formatted addresses
     */
    getAddressesByPostcode: async (postcode) => {
        console.log('locationService.getAddressesByPostcode - Called with:', postcode);

        if (!postcode) {
            console.error('locationService.getAddressesByPostcode - No postcode provided');
            throw new Error('Postcode is required');
        }

        // Clean and validate postcode
        const cleanPostcode = postcode.trim().replace(/\s+/g, '');
        console.log('locationService.getAddressesByPostcode - Cleaned postcode:', cleanPostcode);

        // Check if we have the API key
        if (!config.apiKeys.getAddress) {
            console.error('locationService.getAddressesByPostcode - GetAddress API key not configured');
            throw new Error('GetAddress API key not configured');
        }

        const url = `https://api.getAddress.io/autocomplete/${cleanPostcode}?api-key=${config.apiKeys.getAddress}`;
        console.log('locationService.getAddressesByPostcode - Making request to:', url.replace(config.apiKeys.getAddress, '[API_KEY]'));

        try {
            const data = await fetchApi(url);
            console.log('locationService.getAddressesByPostcode - API response:', data);

            if (data.suggestions && Array.isArray(data.suggestions)) {
                const addresses = data.suggestions.map(suggestion => suggestion.address);
                console.log(`locationService.getAddressesByPostcode - Extracted ${addresses.length} addresses:`, addresses.slice(0, 3));
                return addresses;
            } else {
                console.log('locationService.getAddressesByPostcode - No suggestions in response or suggestions is not an array');
                console.log('locationService.getAddressesByPostcode - Response structure:', Object.keys(data));
                return [];
            }
        } catch (error) {
            console.error('locationService.getAddressesByPostcode - API call failed:', error);
            console.error('locationService.getAddressesByPostcode - Error details:', {
                message: error.message,
                postcode: cleanPostcode,
                url: url.replace(config.apiKeys.getAddress, '[API_KEY]'),
                timestamp: new Date().toISOString()
            });

            // Provide more specific error messages
            if (error.message.includes('404')) {
                throw new Error(`No addresses found for postcode: ${cleanPostcode}`);
            } else if (error.message.includes('401') || error.message.includes('403')) {
                throw new Error('Invalid API key or access denied');
            } else if (error.message.includes('429')) {
                throw new Error('API rate limit exceeded');
            } else {
                throw new Error('Failed to fetch addresses');
            }
        }
    },

    /**
     * Validate if a location string is a valid address
     * @param {string} location - Location string to validate
     * @returns {boolean} Whether the location appears to be valid
     */
    validateLocation: (location) => {
        if (!location || typeof location !== 'string') {
            return false;
        }

        // Basic validation - check if it contains some address-like elements
        const trimmed = location.trim();
        return trimmed.length > 5 &&
          (trimmed.includes(',') ||
            /\d/.test(trimmed) || // Contains numbers
            /\b(street|road|lane|avenue|drive|close|way|place)\b/i.test(trimmed));
    },

    /**
     * Format address for display
     * @param {string} address - Raw address string
     * @returns {string} Formatted address
     */
    formatAddress: (address) => {
        if (!address) return '';

        return address
          .replace(/,/g, ', ') // Add spaces after commas
          .replace(/\s+/g, ' ') // Remove extra spaces
          .trim();
    },

    /**
     * Calculate distance between two locations using Google Maps Distance Matrix
     * @param {string} origin - Starting location
     * @param {string} destination - Ending location
     * @returns {Promise<Object>} Distance and duration information
     */
    calculateDistance: async (origin, destination) => {
        return new Promise((resolve, reject) => {
            if (!window.google || !window.google.maps) {
                reject(new Error('Google Maps API not loaded'));
                return;
            }

            const service = new window.google.maps.DistanceMatrixService();

            service.getDistanceMatrix({
                origins: [origin],
                destinations: [destination],
                travelMode: window.google.maps.TravelMode.DRIVING,
                unitSystem: window.google.maps.UnitSystem.IMPERIAL,
                avoidHighways: false,
                avoidTolls: false
            }, (response, status) => {
                if (status === 'OK' && response.rows[0].elements[0].status === 'OK') {
                    const element = response.rows[0].elements[0];
                    resolve({
                        distance: element.distance.text,
                        duration: element.duration.text,
                        distanceValue: element.distance.value, // in meters
                        durationValue: element.duration.value  // in seconds
                    });
                } else {
                    reject(new Error(`Distance calculation failed: ${status}`));
                }
            });
        });
    },

    /**
     * Get location coordinates from address
     * @param {string} address - Address to geocode
     * @returns {Promise<Object>} Latitude and longitude coordinates
     */
    geocodeAddress: async (address) => {
        return new Promise((resolve, reject) => {
            if (!window.google || !window.google.maps) {
                reject(new Error('Google Maps API not loaded'));
                return;
            }

            const geocoder = new window.google.maps.Geocoder();

            geocoder.geocode({ address }, (results, status) => {
                if (status === 'OK' && results[0]) {
                    const location = results[0].geometry.location;
                    resolve({
                        lat: location.lat(),
                        lng: location.lng(),
                        formattedAddress: results[0].formatted_address
                    });
                } else {
                    reject(new Error(`Geocoding failed: ${status}`));
                }
            });
        });
    }
};

export default locationService;