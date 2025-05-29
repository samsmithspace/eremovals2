// src/features/quotes/services/quoteService.js
import { fetchApi } from '../../../common/utils/apiUtils';
import config from '../../../config/config';

const API_BASE_URL = config.api.baseUrl;

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
            const response = await fetchApi(`${API_BASE_URL}${config.api.endpoints.bookings}`, {
                method: 'POST',
                body: JSON.stringify(quoteData)
            });
            console.log("hahaha-------------hahaha");
            return {
                bookingId: response.booking._id,
                price: response.booking.price,
                helperPrice: response.booking.helperprice,
                distance: response.booking.distance,
                estimatedDuration: response.booking.estimatedDuration,
                booking: response.booking
            };
        } catch (error) {
            console.log('Error calculating quote:', error);
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
            const response = await fetchApi(
                `${API_BASE_URL}${config.api.endpoints.promoCode}/${bookingId}/apply-promo`,
                {
                    method: 'POST',
                    body: JSON.stringify({ promoCode })
                }
            );

            return {
                success: true,
                newPrice: response.newPrice,
                newHelperPrice: response.newHelperPrice,
                discount: response.discount
            };
        } catch (error) {
           // console.error('Error applying promo code:', error);
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
                `${API_BASE_URL}${config.api.endpoints.promoCode}/${bookingId}/latest-price`
            );

            return {
                price: response.price,
                helperPrice: response.helperprice
            };
        } catch (error) {
           // console.error('Error fetching latest prices:', error);
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
                `${API_BASE_URL}${config.api.endpoints.bookings}/${bookingId}${endpoint}`,
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
          //  console.error('Error creating checkout session:', error);
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
                `${API_BASE_URL}${config.api.endpoints.bookings}/${bookingId}/contact`,
                {
                    method: 'POST',
                    body: JSON.stringify(contactInfo)
                }
            );

            return response;
        } catch (error) {
           // console.error('Error updating booking contact:', error);
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
                `${API_BASE_URL}${config.api.endpoints.bookings}/${bookingId}`
            );

            return response;
        } catch (error) {
           // console.error('Error fetching booking:', error);
            throw new Error('Failed to fetch booking details');
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
            if (!details.boxDetails || !Array.isArray(details.boxDetails)) {
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
                boxDetails: details.boxDetails || [],
                furnitureDetails: details.furnitureDetails || [],
                applianceDetails: details.applianceDetails || [],
                specialItems: details.specialItems || [],
                liftAvailable: Boolean(details.liftAvailable),
                liftAvailabledest: Boolean(details.liftAvailabledest),
                numberOfStairs: Number(details.numberOfStairs) || 0,
                numberofstairsright: Number(details.numberofstairsright) || 0
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
        if (details.boxDetails) {
            const totalBoxes = details.boxDetails.reduce((sum, box) => sum + (box.numberOfBoxes || 0), 0);
            baseDuration += Math.ceil(totalBoxes / 20) * 0.5; // 30 minutes per 20 boxes
        }

        // Add time for furniture
        if (details.furnitureDetails) {
            const totalFurniture = details.furnitureDetails.reduce((sum, furniture) => sum + (furniture.quantity || 0), 0);
            baseDuration += totalFurniture * 0.25; // 15 minutes per furniture item
        }

        // Add time for appliances
        if (details.applianceDetails) {
            const totalAppliances = details.applianceDetails.reduce((sum, appliance) => sum + (appliance.quantity || 0), 0);
            baseDuration += totalAppliances * 0.5; // 30 minutes per appliance
        }

        // Add time for stairs (no lift)
        if (!details.liftAvailable && details.numberOfStairs > 0) {
            baseDuration += details.numberOfStairs * 0.1; // 6 minutes per floor
        }

        if (!details.liftAvailabledest && details.numberofstairsright > 0) {
            baseDuration += details.numberofstairsright * 0.1; // 6 minutes per floor
        }

        // Add time for special items
        if (details.specialItems && details.specialItems.length > 0) {
            baseDuration += details.specialItems.length * 0.5; // 30 minutes per special item
        }

        return Math.max(baseDuration, 1); // Minimum 1 hour
    }
};

export default quoteService;