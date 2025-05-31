// src/features/quotes/services/quoteService.js - COMPLETE UPDATED VERSION
import { fetchApi } from '../../../common/utils/apiUtils';
import config from '../../../config/config';

/**
 * Service for quote-related API operations
 */
export const quoteService = {
    /**
     * Calculate quote based on booking data
     * @param {Object} quoteData - Data for quote calculation
     * @returns {Promise<Object>} Quote calculation result
     */
    calculateQuote: async (quoteData) => {
        try {
            console.log('Calculating quote with data:', quoteData);
            console.log('Using API endpoint:', config.api.endpoints.bookings);

            const response = await fetchApi(config.api.endpoints.bookings, {
                method: 'POST',
                body: JSON.stringify(quoteData)
            });

            console.log('Quote calculation response:', response);

            return {
                bookingId: response.booking._id,
                price: response.booking.price,
                helperPrice: response.booking.helperprice,
                distance: response.booking.distance,
                estimatedDuration: response.booking.estimatedDuration,
                booking: response.booking
            };
        } catch (error) {
            console.error('Error calculating quote:', error);
            throw new Error('Failed to calculate quote. Please try again.');
        }
    },

    /**
     * Apply promotion code to a booking
     * @param {string} bookingId - ID of the booking
     * @param {string} promoCode - Promotion code to apply
     * @returns {Promise<Object>} Promo code application result
     */
    applyPromoCode: async (bookingId, promoCode) => {
        try {
            console.log('Applying promo code:', { bookingId, promoCode });
            console.log('API base URL:', config.api.baseUrl);
            console.log('Bookings endpoint:', config.api.endpoints.bookings);

            // Build the exact URL
            const url = `${config.api.endpoints.promoCode}/${bookingId}/apply-promo`;
            console.log('Constructed URL:', url);

            const response = await fetchApi(url, {
                method: 'POST',
                body: JSON.stringify({ promoCode })
            });

            console.log('Promo code response:', response);

            // Handle both success and error responses from backend
            if (response.success === false) {
                throw new Error(response.error || 'Invalid promotion code');
            }

            return {
                success: true,
                newPrice: response.newPrice || response.discountedPrice,
                newHelperPrice: response.newHelperPrice || response.discountedHelperPrice,
                discount: response.discount
            };
        } catch (error) {
            console.error('Error applying promo code:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack
            });
            throw new Error(error.message || 'Invalid promotion code. Please try again.');
        }
    },

    /**
     * Get latest prices for a booking (after promo code application)
     * @param {string} bookingId - ID of the booking
     * @returns {Promise<Object>} Latest pricing information
     */
    getLatestPrices: async (bookingId) => {
        try {
            const response = await fetchApi(
              `${config.api.endpoints.bookings}/${bookingId}`
            );

            return {
                price: response.booking.price,
                helperPrice: response.booking.helperprice
            };
        } catch (error) {
            console.error('Error fetching latest prices:', error);
            throw new Error('Failed to fetch latest prices');
        }
    },

    /**
     * Create Stripe checkout session for payment
     * @param {string} bookingId - ID of the booking
     * @param {number} amount - Payment amount
     * @param {string} language - User's language preference
     * @param {boolean} withHelper - Whether helper service is included
     * @returns {Promise<string>} Stripe session ID
     */
    createCheckoutSession: async (bookingId, amount, language = 'en', withHelper = false) => {
        try {
            const endpoint = withHelper
              ? `/create-checkout-session-helper`
              : `/create-checkout-session`;

            const response = await fetchApi(
              `${config.api.endpoints.bookings}/${bookingId}${endpoint}`,
              {
                  method: 'POST',
                  body: JSON.stringify({
                      bookingId,
                      amount,
                      lang: language
                  })
              }
            );

            if (!response.sessionId) {
                throw new Error('No session ID returned from payment service');
            }

            return response.sessionId;
        } catch (error) {
            console.error('Error creating checkout session:', error);
            throw new Error('Failed to create payment session. Please try again.');
        }
    },

    /**
     * Update booking with contact information
     * @param {string} bookingId - ID of the booking
     * @param {Object} contactInfo - Contact information
     * @returns {Promise<Object>} Updated booking data
     */
    updateBookingContact: async (bookingId, contactInfo) => {
        try {
            const response = await fetchApi(
              `${config.api.endpoints.bookings}/${bookingId}/contact`,
              {
                  method: 'POST',
                  body: JSON.stringify(contactInfo)
              }
            );

            return response;
        } catch (error) {
            console.error('Error updating booking contact:', error);
            throw new Error('Failed to update contact information');
        }
    },

    /**
     * Get booking details by ID
     * @param {string} bookingId - ID of the booking
     * @returns {Promise<Object>} Booking details
     */
    getBookingById: async (bookingId) => {
        try {
            const response = await fetchApi(
              `${config.api.endpoints.bookings}/${bookingId}`
            );

            return response;
        } catch (error) {
            console.error('Error fetching booking:', error);
            throw new Error('Failed to fetch booking details');
        }
    },

    /**
     * Cancel a booking
     * @param {string} bookingId - ID of the booking
     * @param {string} reason - Cancellation reason
     * @returns {Promise<Object>} Response data
     */
    cancelBooking: async (bookingId, reason = '') => {
        try {
            const response = await fetchApi(
              `${config.api.endpoints.bookings}/${bookingId}/cancel`,
              {
                  method: 'POST',
                  body: JSON.stringify({ reason })
              }
            );

            return response;
        } catch (error) {
            console.error('Error cancelling booking:', error);
            throw new Error('Failed to cancel booking');
        }
    },

    /**
     * Get booking history for a customer
     * @param {string} email - Customer email
     * @returns {Promise<Array>} List of bookings
     */
    getBookingHistory: async (email) => {
        try {
            const response = await fetchApi(
              `${config.api.endpoints.bookings}/history?email=${encodeURIComponent(email)}`
            );

            return response;
        } catch (error) {
            console.error('Error fetching booking history:', error);
            throw new Error('Failed to fetch booking history');
        }
    },

    /**
     * Update booking status
     * @param {string} bookingId - ID of the booking
     * @param {string} status - New status
     * @returns {Promise<Object>} Updated booking data
     */
    updateBookingStatus: async (bookingId, status) => {
        try {
            const response = await fetchApi(
              `${config.api.endpoints.bookings}/${bookingId}/status`,
              {
                  method: 'PATCH',
                  body: JSON.stringify({ status })
              }
            );

            return response;
        } catch (error) {
            console.error('Error updating booking status:', error);
            throw new Error('Failed to update booking status');
        }
    },

    /**
     * Send booking confirmation notification
     * @param {string} bookingId - ID of the booking
     * @returns {Promise<Object>} Response data
     */
    sendBookingConfirmation: async (bookingId) => {
        try {
            const response = await fetchApi(
              `${config.api.endpoints.bookings}/${bookingId}/send`,
              {
                  method: 'POST',
                  body: JSON.stringify({ bookingId })
              }
            );

            return response;
        } catch (error) {
            console.error('Error sending booking confirmation:', error);
            throw new Error('Failed to send booking confirmation');
        }
    },

    /**
     * Remove applied promotion code from booking
     * @param {string} bookingId - ID of the booking
     * @returns {Promise<Object>} Updated booking data
     */
    removePromoCode: async (bookingId) => {
        try {
            const response = await fetchApi(
              `${config.api.endpoints.bookings}/${bookingId}/remove-promo`,
              {
                  method: 'POST'
              }
            );

            return {
                success: true,
                price: response.originalPrice,
                helperPrice: response.originalHelperPrice
            };
        } catch (error) {
            console.error('Error removing promo code:', error);
            throw new Error('Failed to remove promotion code');
        }
    },

    /**
     * Validate quote data before submission
     * @param {Object} quoteData - Quote data to validate
     * @returns {Object} Validation result
     */
    validateQuoteData: (quoteData) => {
        const errors = [];
        const {
            startLocation,
            destinationLocation,
            moveType,
            date,
            time,
            details
        } = quoteData;

        // Required field validation
        if (!startLocation?.trim()) {
            errors.push('Start location is required');
        }

        if (!destinationLocation?.trim()) {
            errors.push('Destination location is required');
        }

        if (!moveType) {
            errors.push('Move type is required');
        }

        if (!date) {
            errors.push('Move date is required');
        }

        if (!time) {
            errors.push('Move time is required');
        }

        // Date validation
        if (date) {
            const moveDate = new Date(date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (moveDate < today) {
                errors.push('Move date cannot be in the past');
            }
        }

        // Move type specific validation
        if (moveType === 'student' || moveType === 'house') {
            if (!details?.boxDetails || !Array.isArray(details.boxDetails)) {
                errors.push('Box details are required for this move type');
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    },

    /**
     * Format quote data for API submission
     * @param {Object} rawQuoteData - Raw quote data from form
     * @returns {Object} Formatted quote data
     */
    formatQuoteData: (rawQuoteData) => {
        const {
            startLocation,
            destinationLocation,
            moveType,
            details,
            date,
            time
        } = rawQuoteData;

        return {
            startLocation: startLocation?.trim(),
            destinationLocation: destinationLocation?.trim(),
            moveType,
            details: {
                boxDetails: details?.boxDetails || [],
                furnitureDetails: details?.furnitureDetails || [],
                applianceDetails: details?.applianceDetails || [],
                specialItems: details?.specialItems || [],
                liftAvailable: Boolean(details?.liftAvailable),
                liftAvailabledest: Boolean(details?.liftAvailabledest),
                numberOfStairs: Number(details?.numberOfStairs) || 0,
                numberofstairsright: Number(details?.numberofstairsright) || 0
            },
            date,
            time,
            timestamp: new Date().toISOString()
        };
    },

    /**
     * Calculate estimated move duration based on details
     * @param {Object} details - Move details
     * @returns {number} Estimated duration in hours
     */
    estimateMoveDuration: (details) => {
        let baseDuration = 2; // Base 2 hours for any move

        // Add time for boxes
        if (details?.boxDetails) {
            const totalBoxes = details.boxDetails.reduce((sum, box) => sum + (box.numberOfBoxes || 0), 0);
            baseDuration += Math.ceil(totalBoxes / 20) * 0.5; // 30 minutes per 20 boxes
        }

        // Add time for furniture
        if (details?.furnitureDetails) {
            const totalFurniture = details.furnitureDetails.reduce((sum, furniture) => sum + (furniture.quantity || 0), 0);
            baseDuration += totalFurniture * 0.25; // 15 minutes per furniture item
        }

        // Add time for appliances
        if (details?.applianceDetails) {
            const totalAppliances = details.applianceDetails.reduce((sum, appliance) => sum + (appliance.quantity || 0), 0);
            baseDuration += totalAppliances * 0.5; // 30 minutes per appliance
        }

        // Add time for stairs (no lift)
        if (!details?.liftAvailable && details?.numberOfStairs > 0) {
            baseDuration += details.numberOfStairs * 0.1; // 6 minutes per floor
        }

        if (!details?.liftAvailabledest && details?.numberofstairsright > 0) {
            baseDuration += details.numberofstairsright * 0.1; // 6 minutes per floor
        }

        // Add time for special items
        if (details?.specialItems && details.specialItems.length > 0) {
            baseDuration += details.specialItems.length * 0.5; // 30 minutes per special item
        }

        return Math.max(baseDuration, 1); // Minimum 1 hour
    },

    /**
     * Get available promo codes (admin function)
     * @returns {Promise<Array>} List of available promo codes
     */
    getAvailablePromoCodes: async () => {
        try {
            const response = await fetchApi(
              `${config.api.endpoints.bookings}/promo-codes`
            );

            return response.promoCodes || [];
        } catch (error) {
            console.error('Error fetching promo codes:', error);
            throw new Error('Failed to fetch promo codes');
        }
    },

    /**
     * Check if a promo code is valid (without applying it)
     * @param {string} promoCode - Promotion code to check
     * @returns {Promise<Object>} Validation result
     */
    validatePromoCode: async (promoCode) => {
        try {
            const response = await fetchApi(
              `${config.api.endpoints.bookings}/validate-promo`,
              {
                  method: 'POST',
                  body: JSON.stringify({ promoCode })
              }
            );

            return {
                isValid: response.valid,
                discount: response.discount,
                description: response.description
            };
        } catch (error) {
            console.error('Error validating promo code:', error);
            return {
                isValid: false,
                error: error.message
            };
        }
    },

    /**
     * Get pricing information for a quote
     * @param {Object} quoteData - Quote data for pricing
     * @returns {Promise<Object>} Pricing information
     */
    getPricing: async (quoteData) => {
        try {
            const response = await fetchApi(
              `${config.api.endpoints.bookings}/pricing`,
              {
                  method: 'POST',
                  body: JSON.stringify(quoteData)
              }
            );

            return {
                basePrice: response.basePrice,
                helperPrice: response.helperPrice,
                breakdown: response.breakdown,
                distance: response.distance
            };
        } catch (error) {
            console.error('Error getting pricing:', error);
            throw new Error('Failed to get pricing information');
        }
    }
};

export default quoteService;