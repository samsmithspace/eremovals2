// src/common/utils/apiUtils.js
import config from '../../config/config';

/**
 * Handle API response errors consistently
 * @param {Response} response - Fetch API response object
 * @returns {Promise} - Resolved response or throws an error with message
 */
export const handleApiResponse = async (response) => {
  if (!response.ok) {
    try {
      const errorData = await response.json();
      throw new Error(errorData.error || response.statusText);
    } catch (err) {
      // If parsing JSON fails, use status text
      throw new Error(response.statusText || 'An unknown error occurred');
    }
  }
  return response;
};

/**
 * Performs API requests with consistent error handling and headers
 * @param {string} endpoint - API endpoint path (without base URL)
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} - Promise resolving to parsed JSON response
 */
export const fetchApi = async (endpoint, options = {}) => {
  const url = `${config.apiUrl}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  await handleApiResponse(response);

  // Only try to parse JSON if there's content
  if (response.status !== 204) {
    return response.json();
  }

  return null;
};

/**
 * Create a booking via the API
 * @param {Object} bookingData - Booking information
 * @returns {Promise<Object>} - Promise resolving to booking response
 */
export const createBooking = async (bookingData) => {
  return fetchApi('/api/bookings', {
    method: 'POST',
    body: JSON.stringify(bookingData)
  });
};

/**
 * Get booking details by ID
 * @param {string} bookingId - ID of the booking
 * @returns {Promise<Object>} - Promise resolving to booking details
 */
export const getBookingById = async (bookingId) => {
  return fetchApi(`/api/bookings/${bookingId}`);
};

/**
 * Apply a promotion code to a booking
 * @param {string} bookingId - ID of the booking
 * @param {string} promoCode - Promotion code to apply
 * @returns {Promise<Object>} - Promise resolving to updated booking with discount
 */
export const applyPromoCode = async (bookingId, promoCode) => {
  return fetchApi(`/api/promocode/${bookingId}/apply-promo`, {
    method: 'POST',
    body: JSON.stringify({ promoCode })
  });
};