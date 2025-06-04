
import { useState, useEffect } from 'react';
import { locationService } from '../services/locationService';

/**
 * Hook for looking up detailed addresses based on postcode
 * @param {string} postcode - Postcode to lookup addresses for
 * @returns {Object} Addresses array and loading state
 */
export const useAddressLookup = (postcode) => {
    const [addresses, setAddresses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAddresses = async () => {
            if (!postcode || postcode.length < 3) {
                setAddresses([]);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const addressData = await locationService.getAddressesByPostcode(postcode);
                setAddresses(addressData);
            } catch (err) {
              //  console.error('Error fetching addresses:', err);
                setError(err.message);
                setAddresses([]);
            } finally {
                setIsLoading(false);
            }
        };

        // Debounce the API call
        const timeoutId = setTimeout(fetchAddresses, 300);

        return () => clearTimeout(timeoutId);
    }, [postcode]);

    return {
        addresses,
        isLoading,
        error,
        hasAddresses: addresses.length > 0
    };
};
