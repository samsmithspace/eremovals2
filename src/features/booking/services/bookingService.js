// src/features/booking/services/bookingService.js - FIXED PAYMENT METHODS
import { fetchApi } from 'common/utils/apiUtils';
import config from 'config/config';

const API_BASE_URL = config.api.baseUrl;
const ENDPOINTS = config.api.endpoints;

/**
 * Service for booking-related API operations
 */
export const bookingService = {
    /**
     * Create a new booking
     * @param {Object} bookingData - Booking information
     * @returns {Promise<Object>} Created booking data
     */
    createBooking: async (bookingData) => {
        try {
            const response = await fetchApi(`${API_BASE_URL}${ENDPOINTS.bookings}`, {
                method: 'POST',
                body: JSON.stringify(bookingData)
            });
            return response;
        } catch (error) {
            // console.error('Error creating booking:', error);
            throw new Error(error.message || 'Failed to create booking');
        }
    },

    /**
     * Get booking details by ID
     * @param {string} bookingId - ID of the booking
     * @returns {Promise<Object>} Booking details
     */
    getBookingById: async (bookingId) => {
        try {
            const response = await fetchApi(`${API_BASE_URL}${ENDPOINTS.bookings}/${bookingId}`);
            return response;
        } catch (error) {
            //    console.error('Error fetching booking:', error);
            throw new Error(error.message || 'Failed to fetch booking details');
        }
    },

    /**
     * Update contact information for a booking
     * @param {string} bookingId - ID of the booking
     * @param {Object} contactInfo - Contact information
     * @returns {Promise<Object>} Updated booking data
     */
    updateContactInfo: async (bookingId, contactInfo) => {
        try {
            const response = await fetchApi(`${API_BASE_URL}${ENDPOINTS.bookings}/${bookingId}/contact`, {
                method: 'POST',
                body: JSON.stringify(contactInfo)
            });
            return response;
        } catch (error) {
            // console.error('Error updating contact info:', error);
            throw new Error(error.message || 'Failed to update contact information');
        }
    },

    /**
     * Create Stripe checkout session (without helper)
     * @param {string} bookingId - ID of the booking
     * @param {number} amount - Payment amount
     * @param {string} lang - Language for checkout page
     * @returns {Promise<string>} Checkout session ID
     */
    createCheckoutSession: async (bookingId, amount, lang = 'en') => {
        try {
            console.log('BookingService: Creating checkout session:', { bookingId, amount, lang });

            const response = await fetchApi(
              `${API_BASE_URL}${ENDPOINTS.bookings}/${bookingId}/create-checkout-session`,
              {
                  method: 'POST',
                  body: JSON.stringify({ bookingId, amount, lang })
              }
            );

            console.log('BookingService: Checkout session response:', response);

            // FIXED: Extract and return sessionId as string
            let sessionId;
            if (typeof response === 'string') {
                sessionId = response;
            } else if (response && typeof response === 'object') {
                sessionId = response.sessionId || response.id || response.session_id;
            }

            if (!sessionId || typeof sessionId !== 'string') {
                console.error('BookingService: Invalid sessionId in response:', response);
                throw new Error('No session ID returned from payment service');
            }

            console.log('BookingService: Returning sessionId:', sessionId);
            return sessionId; // Return only the string
        } catch (error) {
            //  console.error('Error creating checkout session:', error);
            throw new Error(error.message || 'Failed to create payment session');
        }
    },

    /**
     * Create Stripe checkout session with helper
     * @param {string} bookingId - ID of the booking
     * @param {number} amount - Payment amount including helper
     * @param {string} lang - Language for checkout page
     * @returns {Promise<string>} Checkout session ID
     */
    createCheckoutSessionWithHelper: async (bookingId, amount, lang = 'en') => {
        try {
            console.log('BookingService: Creating checkout session with helper:', { bookingId, amount, lang });

            const response = await fetchApi(
              `${API_BASE_URL}${ENDPOINTS.bookings}/${bookingId}/create-checkout-session-helper`,
              {
                  method: 'POST',
                  body: JSON.stringify({ bookingId, amount, lang })
              }
            );

            console.log('BookingService: Helper checkout session response:', response);

            // FIXED: Extract and return sessionId as string
            let sessionId;
            if (typeof response === 'string') {
                sessionId = response;
            } else if (response && typeof response === 'object') {
                sessionId = response.sessionId || response.id || response.session_id;
            }

            if (!sessionId || typeof sessionId !== 'string') {
                console.error('BookingService: Invalid sessionId in helper response:', response);
                throw new Error('No session ID returned from payment service');
            }

            console.log('BookingService: Returning helper sessionId:', sessionId);
            return sessionId; // Return only the string
        } catch (error) {
            //  console.error('Error creating helper checkout session:', error);
            throw new Error(error.message || 'Failed to create payment session with helper');
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
              `${API_BASE_URL}${ENDPOINTS.bookings}/${bookingId}/send`,
              {
                  method: 'POST',
                  body: JSON.stringify({ bookingId })
              }
            );
            return response;
        } catch (error) {
            // console.error('Error sending booking confirmation:', error);
            throw new Error(error.message || 'Failed to send booking confirmation');
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
              `${API_BASE_URL}${ENDPOINTS.bookings}/${bookingId}/cancel`,
              {
                  method: 'POST',
                  body: JSON.stringify({ reason })
              }
            );
            return response;
        } catch (error) {
            // console.error('Error cancelling booking:', error);
            throw new Error(error.message || 'Failed to cancel booking');
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
              `${API_BASE_URL}${ENDPOINTS.bookings}/history?email=${encodeURIComponent(email)}`
            );
            return response;
        } catch (error) {
            // console.error('Error fetching booking history:', error);
            throw new Error(error.message || 'Failed to fetch booking history');
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
              `${API_BASE_URL}${ENDPOINTS.bookings}/${bookingId}/status`,
              {
                  method: 'PATCH',
                  body: JSON.stringify({ status })
              }
            );
            return response;
        } catch (error) {
            //  console.error('Error updating booking status:', error);
            throw new Error(error.message || 'Failed to update booking status');
        }
    }
};

export default bookingService;