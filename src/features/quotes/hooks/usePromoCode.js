// src/features/quotes/hooks/usePromoCode.js - FIXED VERSION with proper state updates
import { useState, useCallback, useEffect } from 'react';
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

    // FIXED: Update current prices when original prices change
    useEffect(() => {
        console.log('usePromoCode: Original prices changed', { originalPrice, originalHelperPrice });
        setCurrentPrice(originalPrice);
        setCurrentHelperPrice(originalHelperPrice);
    }, [originalPrice, originalHelperPrice]);

    const applyPromoCode = useCallback(async (promoCode) => {
        console.log('usePromoCode: Starting promo code application', {
            bookingId,
            promoCode,
            originalPrice,
            originalHelperPrice
        });

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
                // FIXED: Calculate discounted prices if not provided by backend
                let newPrice = result.newPrice;
                let newHelperPrice = result.newHelperPrice;
                let discountPercent = result.discount;

                // If backend doesn't provide new prices, calculate them
                if (!newPrice && discountPercent) {
                    newPrice = originalPrice * (1 - discountPercent / 100);
                    console.log('usePromoCode: Calculated newPrice', newPrice);
                }

                if (!newHelperPrice && discountPercent) {
                    newHelperPrice = originalHelperPrice * (1 - discountPercent / 100);
                    console.log('usePromoCode: Calculated newHelperPrice', newHelperPrice);
                }

                // FIXED: Ensure we have valid numbers
                const finalPrice = Number(newPrice) || originalPrice;
                const finalHelperPrice = Number(newHelperPrice) || originalHelperPrice;
                const finalDiscount = Number(discountPercent) || 0;

                console.log('usePromoCode: Setting state with final values', {
                    finalPrice,
                    finalHelperPrice,
                    finalDiscount
                });

                // Update state immediately
                setCurrentPrice(finalPrice);
                setCurrentHelperPrice(finalHelperPrice);
                setDiscount(finalDiscount);

                return {
                    success: true,
                    newPrice: finalPrice,
                    newHelperPrice: finalHelperPrice,
                    discount: finalDiscount,
                    originalPrice: originalPrice,
                    originalHelperPrice: originalHelperPrice,
                    // Include savings for display
                    savings: originalPrice - finalPrice,
                    helperSavings: originalHelperPrice - finalHelperPrice
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
    }, [bookingId, originalPrice, originalHelperPrice]);

    const resetPromoCode = useCallback(() => {
        console.log('usePromoCode: Resetting to original prices', { originalPrice, originalHelperPrice });
        setCurrentPrice(originalPrice);
        setCurrentHelperPrice(originalHelperPrice);
        setDiscount(0);
        setError(null);
    }, [originalPrice, originalHelperPrice]);

    const refreshPrices = useCallback(async () => {
        if (!bookingId) return;

        try {
            const latestPrices = await quoteService.getLatestPrices(bookingId);
            console.log('usePromoCode: Refreshed prices', latestPrices);
            setCurrentPrice(latestPrices.price);
            setCurrentHelperPrice(latestPrices.helperPrice);
        } catch (err) {
            console.error('Error refreshing prices:', err);
        }
    }, [bookingId]);

    // Debug logging
    console.log('usePromoCode: Current state', {
        originalPrice,
        originalHelperPrice,
        currentPrice,
        currentHelperPrice,
        discount,
        hasDiscount: currentPrice < originalPrice || currentHelperPrice < originalHelperPrice
    });

    return {
        currentPrice,
        currentHelperPrice,
        discount,
        isApplying,
        error,
        applyPromoCode,
        resetPromoCode,
        refreshPrices,
        // Helper computed values
        hasDiscount: currentPrice < originalPrice || currentHelperPrice < originalHelperPrice,
        savings: originalPrice - currentPrice,
        helperSavings: originalHelperPrice - currentHelperPrice
    };
};