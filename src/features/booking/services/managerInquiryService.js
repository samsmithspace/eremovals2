// src/services/managerInquiryService.js
import config from 'config/config';

/**
 * Service for sending customer inquiries to manager
 */
export const managerInquiryService = {
  /**
   * Send customer inquiry to manager with booking details
   * @param {Object} customerData - Customer contact information
   * @param {string} bookingId - Booking ID to get details from
   * @param {number} estimatedPrice - Current estimated price
   * @param {number} estimatedPriceWithHelper - Current price with helper
   * @returns {Promise<Object>} Response from manager notification API
   */
  async sendCustomerInquiry(customerData, bookingId, estimatedPrice, estimatedPriceWithHelper) {
    try {
      console.log('ManagerInquiryService: Sending customer inquiry...', {
        customerData,
        bookingId,
        estimatedPrice,
        estimatedPriceWithHelper
      });

      console.log("booking id")
      console.log(bookingId)
      // First, get the booking details
      const bookingResponse = await fetch(`${config.api.baseUrl}/api/bookings/${bookingId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log(bookingResponse);
      if (!bookingResponse.ok) {
        throw new Error(`Failed to fetch booking details: ${bookingResponse.status}`);
      }

      const bookingData = await bookingResponse.json();



      if (!bookingData.booking) {
        throw new Error('Failed to get booking details');
      }

      const booking = bookingData.booking;

      // Prepare the inquiry data according to your backend structure
      const inquiryData = {
        customerName: customerData.name,
        customerPhone: customerData.phone,
        customerEmail: customerData.email || '', // Make email optional
        startLocation: booking.startLocation,
        destinationLocation: booking.destinationLocation,
        moveDate: booking.date,
        moveTime: booking.time,
        moveType: booking.moveType || 'Standard Move',
        details: {
          boxDetails: booking.details?.boxDetails || [],
          furnitureDetails: booking.details?.furnitureDetails || [],
          applianceDetails: booking.details?.applianceDetails || [],
          liftAvailable: booking.details?.liftAvailable || false,
          numberOfStairs: booking.details?.numberOfStairs || 0,
          liftAvailabledest: booking.details?.liftAvailabledest || false,
          numberofstairsright: booking.details?.numberofstairsright || 0
        },
        estimatedPrice: booking.price,
        estimatedPriceWithHelper: booking.helperprice,
        additionalNotes: `Customer has completed the quote process and is ready to proceed with payment. Booking ID: ${bookingId}`
      };

      console.log('ManagerInquiryService: Prepared inquiry data:', inquiryData);

      // Send to manager notification endpoint
      const response = await fetch(`${config.api.baseUrl}/api/manager/send-inquiry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inquiryData)
      });

      if (!response.ok) {
        throw new Error(`Manager inquiry API failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('ManagerInquiryService: API response:', result);

      if (result.success) {
        return {
          success: true,
          message: result.message || 'Customer inquiry sent to manager successfully'
        };
      } else {
        throw new Error(result.error || 'Failed to send inquiry to manager');
      }

    } catch (error) {
      console.error('ManagerInquiryService: Error sending customer inquiry:', error);
      throw new Error(error.message || 'Failed to send customer inquiry to manager');
    }
  },

  /**
   * Send inquiry with current quote state (for use before payment)
   * @param {Object} customerData - Customer information
   * @param {string} bookingId - Booking ID
   * @param {Object} priceData - Current pricing information
   * @returns {Promise<Object>} Response from API
   */
  async sendPrePaymentInquiry(customerData, bookingId, priceData) {
    const { currentPrice, currentHelperPrice, discount } = priceData;

    try {
      const inquiryData = {
        ...customerData,
        bookingId,
        currentPrice,
        currentHelperPrice,
        discount,
        stage: 'pre-payment',
        timestamp: new Date().toISOString()
      };

      console.log('ManagerInquiryService: Sending pre-payment inquiry:', inquiryData);

      return await this.sendCustomerInquiry(
        customerData,
        bookingId,
        currentPrice,
        currentHelperPrice
      );
    } catch (error) {
      console.error('ManagerInquiryService: Pre-payment inquiry error:', error);
      throw error;
    }
  },

  /**
   * Format customer data for manager notification
   * @param {Object} rawCustomerData - Raw form data
   * @returns {Object} Formatted customer data
   */
  formatCustomerData(rawCustomerData) {
    return {
      name: rawCustomerData.name?.trim() || '',
      phone: rawCustomerData.phone?.trim() || '',
      email: rawCustomerData.email?.trim() || '',
      submittedAt: new Date().toISOString()
    };
  },

  /**
   * Validate customer data before sending
   * @param {Object} customerData - Customer data to validate
   * @returns {Object} Validation result
   */
  validateCustomerData(customerData) {
    const errors = [];

    if (!customerData.name || customerData.name.trim().length < 2) {
      errors.push('Customer name is required');
    }

    if (!customerData.phone || customerData.phone.trim().length < 10) {
      errors.push('Valid phone number is required');
    }

    // Email is optional, but if provided, should be valid
    if (customerData.email && customerData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(customerData.email.trim())) {
        errors.push('Valid email address is required');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

export default managerInquiryService;