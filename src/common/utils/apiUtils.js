// src/common/utils/apiUtils.js - FIXED VERSION
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
 * @param {string} endpoint - API endpoint path (can be full URL or relative path)
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} - Promise resolving to parsed JSON response
 */
export const fetchApi = async (endpoint, options = {}) => {
  // Handle full URLs (for external APIs) vs relative endpoints
  let url;
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    url = endpoint;
  } else {
    // FIXED: Use config.api.baseUrl instead of config.apiUrl
    const baseUrl = config.api.baseUrl;
    if (!baseUrl) {
      throw new Error('API base URL is not configured');
    }
    // Ensure endpoint starts with /
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    url = `${baseUrl}${cleanEndpoint}`;
  }

  console.log('Making API request to:', url); // Debug log

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
  try {
    const response = await fetchApi(config.api.endpoints.bookings, {
      method: 'POST',
      body: JSON.stringify(bookingData)
    });
    return response;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw new Error(error.message || 'Failed to create booking');
  }
};

/**
 * Get booking details by ID
 * @param {string} bookingId - ID of the booking
 * @returns {Promise<Object>} - Promise resolving to booking details
 */
export const getBookingById = async (bookingId) => {
  try {
    const response = await fetchApi(`${config.api.endpoints.bookings}/${bookingId}`);
    return response;
  } catch (error) {
    console.error('Error fetching booking:', error);
    throw new Error(error.message || 'Failed to fetch booking details');
  }
};

/**
 * Apply a promotion code to a booking
 * @param {string} bookingId - ID of the booking
 * @param {string} promoCode - Promotion code to apply
 * @returns {Promise<Object>} - Promise resolving to updated booking with discount
 */
export const applyPromoCode = async (bookingId, promoCode) => {
  try {
    const response = await fetchApi(`${config.api.endpoints.promoCode}/${bookingId}/apply-promo`, {
      method: 'POST',
      body: JSON.stringify({ promoCode })
    });
    return response;
  } catch (error) {
    console.error('Error applying promo code:', error);
    throw new Error(error.message || 'Failed to apply promotion code');
  }
};