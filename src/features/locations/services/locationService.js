// src/features/locations/services/locationService.js
import { fetchApi } from '../../../common/utils/apiUtils';
import config from '../../../config/config';

/**
 * Service for location-related API operations
 */
export const locationService = {
    /**
     * Get addresses by postcode using GetAddress.io API
     * @param {string} postcode - Postcode to lookup
     * @returns {Promise<string[]>} Array of formatted addresses
     */
    getAddressesByPostcode: async (postcode) => {
        if (!postcode) {
            throw new Error('Postcode is required');
        }

        const url = `https://api.getAddress.io/autocomplete/${postcode}?api-key=${config.apiKeys.getAddress}`;

        try {
            const data = await fetchApi(url);

            if (data.suggestions && Array.isArray(data.suggestions)) {
                return data.suggestions.map(suggestion => suggestion.address);
            }

            return [];
        } catch (error) {
         //   console.error('Error fetching addresses from GetAddress.io:', error);
            throw new Error('Failed to fetch addresses');
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