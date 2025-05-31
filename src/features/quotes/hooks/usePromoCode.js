// src/features/quotes/hooks/usePromoCode.js - FIXED VERSION
import { useState, useCallback } from 'react';
import { quoteService } from '../services/quoteService';

/**
 * Hook for managing promotion code functionality
 * @param {string} bookingId - ID of the booking
 * @param {number} originalPrice - Original price before discount
 * @param {number} originalHelperPrice - Original helper price before discount
 * @returns {Object} Promo code functionality and state
 */
export const usePromoCode = (bookingId, originalPrice = 0, originalHelperPrice = 0) => {
    const [currentPrice, setCurrentPrice] = useState(originalPrice);
    const [currentHelperPrice, setCurrentHelperPrice] = useState(originalHelperPrice);
    const [discount, setDiscount] = useState(0);
    const [isApplying, setIsApplying] = useState(false);
    const [error, setError] = useState(null);

    const applyPromoCode = useCallback(async (promoCode) => {
        console.log('usePromoCode: Starting promo code application', { bookingId, promoCode });

        if (!bookingId) {
            const errorMsg = 'No booking ID provided for promo code application';
            console.error(errorMsg);
            throw new Error(errorMsg);
        }

        if (!promoCode || promoCode.length !== 6) {
            const errorMsg = 'Invalid promotion code format';
            console.error(errorMsg);
            throw new Error(errorMsg);
        }

        setIsApplying(true);
        setError(null);

        try {
            console.log('usePromoCode: Calling quoteService.applyPromoCode');
            const result = await quoteService.applyPromoCode(bookingId, promoCode);
            console.log('usePromoCode: Received result', result);

            if (result.success) {
                setCurrentPrice(result.newPrice);
                setCurrentHelperPrice(result.newHelperPrice);
                setDiscount(result.discount);

                return {
                    success: true,
                    newPrice: result.newPrice,
                    newHelperPrice: result.newHelperPrice,
                    discount: result.discount
                };
            } else {
                throw new Error(result.error || 'Invalid promotion code');
            }
        } catch (err) {
            console.error('usePromoCode: Error occurred', err);
            const errorMessage = err.message || 'Failed to apply promotion code';
            setError(errorMessage);
            throw err;
        } finally {
            setIsApplying(false);
        }
    }, [bookingId]);

    const resetPromoCode = useCallback(() => {
        setCurrentPrice(originalPrice);
        setCurrentHelperPrice(originalHelperPrice);
        setDiscount(0);
        setError(null);
    }, [originalPrice, originalHelperPrice]);

    const refreshPrices = useCallback(async () => {
        if (!bookingId) return;

        try {
            const latestPrices = await quoteService.getLatestPrices(bookingId);
            setCurrentPrice(latestPrices.price);
            setCurrentHelperPrice(latestPrices.helperPrice);
        } catch (err) {
            console.error('Error refreshing prices:', err);
        }
    }, [bookingId]);

    return {
        currentPrice,
        currentHelperPrice,
        discount,
        isApplying,
        error,
        applyPromoCode,
        resetPromoCode,
        refreshPrices
    };
};