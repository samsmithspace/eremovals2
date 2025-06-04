// src/features/locations/hooks/useAddressLookup.js
import { useState, useEffect } from 'react';
import { locationService } from '../services/locationService';

/**
 * Enhanced hook for looking up detailed addresses based on postcode
 * @param {string} postcode - Postcode to lookup addresses for
 * @returns {Object} Addresses array and loading state
 */
export const useAddressLookup = (postcode) => {
    const [addresses, setAddresses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAddresses = async () => {
            console.log('useAddressLookup - fetchAddresses called with postcode:', postcode);

            if (!postcode || postcode.length < 3) {
                console.log('useAddressLookup - Postcode too short or empty, clearing addresses');
                setAddresses([]);
                return;
            }

            setIsLoading(true);
            setError(null);
            console.log('useAddressLookup - Starting address lookup for:', postcode);

            try {
                const addressData = await locationService.getAddressesByPostcode(postcode);
                console.log('useAddressLookup - Received address data:', addressData);

                setAddresses(addressData);

                if (addressData.length === 0) {
                    console.warn('useAddressLookup - No addresses found for postcode:', postcode);
                } else {
                    console.log(`useAddressLookup - Successfully loaded ${addressData.length} addresses`);
                }
            } catch (err) {
                console.error('useAddressLookup - Error fetching addresses:', err);
                console.error('useAddressLookup - Error details:', {
                    message: err.message,
                    postcode: postcode,
                    timestamp: new Date().toISOString()
                });

                setError(err.message);
                setAddresses([]);
            } finally {
                setIsLoading(false);
                console.log('useAddressLookup - Finished loading addresses');
            }
        };

        // Debounce the API call
        console.log('useAddressLookup - Setting up debounced fetch for postcode:', postcode);
        const timeoutId = setTimeout(fetchAddresses, 300);

        return () => {
            console.log('useAddressLookup - Clearing timeout for postcode:', postcode);
            clearTimeout(timeoutId);
        };
    }, [postcode]);

    // Log state changes
    useEffect(() => {
        console.log('useAddressLookup - State updated:', {
            postcode,
            addressesCount: addresses.length,
            isLoading,
            hasError: !!error
        });
    }, [addresses, isLoading, error, postcode]);

    return {
        addresses,
        isLoading,
        error,
        hasAddresses: addresses.length > 0
    };
};