// src/features/booking/hooks/usePaymentProcessing.js
import { useState, useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { bookingService } from '../services/bookingService';
import { useBookingContext } from '../context/BookingContext';
import config from '../../../config/config';

const stripePromise = loadStripe(config.apiKeys.stripe);

/**
 * Custom hook for handling payment processing
 * @returns {Object} Payment processing state and handlers
 */
export const usePaymentProcessing = () => {
    const { bookingId, pricing, setError, clearError } = useBookingContext();
    const [isProcessing, setIsProcessing] = useState(false);

    /**
     * Process payment for booking without helper
     */
    const processStandardPayment = useCallback(async () => {
        if (!bookingId) {
            setError('No booking ID found');
            return;
        }

        setIsProcessing(true);
        clearError();

        try {
            const { sessionId } = await bookingService.createCheckoutSession(
                bookingId,
                pricing.finalPrice || pricing.basePrice
            );

            if (!sessionId) {
                throw new Error('No session ID returned from payment service');
            }

            const stripe = await stripePromise;
            const { error } = await stripe.redirectToCheckout({ sessionId });

            if (error) {
                throw new Error(`Payment redirect error: ${error.message}`);
            }
        } catch (error) {
            console.error('Payment processing error:', error);
            setError(error.message || 'Payment processing failed');
        } finally {
            setIsProcessing(false);
        }
    }, [bookingId, pricing, setError, clearError]);

    /**
     * Process payment for booking with helper
     */
    const processHelperPayment = useCallback(async () => {
        if (!bookingId) {
            setError('No booking ID found');
            return;
        }

        setIsProcessing(true);
        clearError();

        try {
            const { sessionId } = await bookingService.createCheckoutSessionWithHelper(
                bookingId,
                pricing.helperPrice
            );

            if (!sessionId) {
                throw new Error('No session ID returned from payment service');
            }

            const stripe = await stripePromise;
            const { error } = await stripe.redirectToCheckout({ sessionId });

            if (error) {
                throw new Error(`Payment redirect error: ${error.message}`);
            }
        } catch (error) {
            console.error('Helper payment processing error:', error);
            setError(error.message || 'Payment processing failed');
        } finally {
            setIsProcessing(false);
        }
    }, [bookingId, pricing, setError, clearError]);

    return {
        isProcessing,
        processStandardPayment,
        processHelperPayment
    };
};