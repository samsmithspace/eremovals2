// src/features/booking/hooks/usePaymentProcessing.js - FIXED VERSION
import { useState, useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { bookingService } from '../services/bookingService';
import config from '../../../config/config';

const stripePromise = loadStripe(config.apiKeys.stripe);

/**
 * Custom hook for handling payment processing
 * @param {string} bookingId - The booking ID (passed as parameter instead of from context)
 * @returns {Object} Payment processing state and handlers
 */
export const usePaymentProcessing = (bookingId = null) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Process payment for booking
     * @param {string} targetBookingId - Booking ID to process payment for
     * @param {number} amount - Payment amount
     * @param {string} language - Language for checkout
     * @param {boolean} withHelper - Whether to include helper service
     */
    const processPayment = useCallback(async (targetBookingId, amount, language = 'en', withHelper = false) => {
        const finalBookingId = targetBookingId || bookingId;

        if (!finalBookingId) {
            const errorMessage = 'No booking ID provided for payment processing';
            setError(errorMessage);
            throw new Error(errorMessage);
        }

        setIsProcessing(true);
        setError(null);

        try {
            console.log('Payment processing started:', {
                bookingId: finalBookingId,
                amount,
                language,
                withHelper
            });

            // Determine which endpoint to use based on helper inclusion
            const endpoint = withHelper
              ? 'createCheckoutSessionWithHelper'
              : 'createCheckoutSession';

            // Call the appropriate booking service method
            let sessionResponse;
            if (withHelper) {
                sessionResponse = await bookingService.createCheckoutSessionWithHelper(finalBookingId, amount, language);
            } else {
                sessionResponse = await bookingService.createCheckoutSession(finalBookingId, amount, language);
            }

            console.log('Session response from service:', sessionResponse);

            // FIXED: Extract sessionId correctly from response
            let sessionId;
            if (typeof sessionResponse === 'string') {
                // If response is already a string, use it directly
                sessionId = sessionResponse;
            } else if (sessionResponse && typeof sessionResponse === 'object') {
                // If response is an object, extract sessionId
                sessionId = sessionResponse.sessionId || sessionResponse.id || sessionResponse.session_id;
            }

            console.log('Extracted sessionId:', sessionId);

            if (!sessionId || typeof sessionId !== 'string') {
                console.error('Invalid sessionId received:', sessionResponse);
                throw new Error('Invalid session ID returned from payment service');
            }

            // Redirect to Stripe checkout with the correct sessionId string
            const stripe = await stripePromise;
            console.log('Redirecting to Stripe with sessionId:', sessionId);

            const { error: stripeError } = await stripe.redirectToCheckout({
                sessionId: sessionId  // FIXED: Pass only the string, not the object
            });

            if (stripeError) {
                console.error('Stripe redirect error:', stripeError);
                throw new Error(`Payment redirect error: ${stripeError.message}`);
            }

            return sessionId;
        } catch (error) {
            console.error('Payment processing error:', error);
            const errorMessage = error.message || 'Payment processing failed';
            setError(errorMessage);
            throw error;
        } finally {
            setIsProcessing(false);
        }
    }, [bookingId]);

    /**
     * Clear any existing errors
     */
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        isProcessing,
        error,
        processPayment,
        clearError
    };
};