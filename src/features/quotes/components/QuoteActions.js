// Combined QuoteActions.js - Fixed import issue
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import BookingForm from '../../booking/components/BookingForm';
import PromotionCode from './PromotionCode'; // ✅ Fixed: Import the JS file, not CSS
import { Button, Spinner, Alert } from '../../../common/components/ui';
import { usePaymentProcessing } from '../../booking/hooks/usePaymentProcessing';
import { usePromoCode } from '../hooks/usePromoCode';
import './QuoteActions.css';

/**
 * Combined QuoteActions with promotion and payment in single card
 */
const QuoteActions = ({ bookingId, price, helperPrice, onSubmitted }) => {
  const { t, i18n } = useTranslation();
  const [showPricing, setShowPricing] = useState(false);

  const {
    processPayment,
    isProcessing,
    error: paymentError,
    clearError: clearPaymentError
  } = usePaymentProcessing(bookingId);

  const {
    currentPrice,
    currentHelperPrice,
    discount,
    applyPromoCode,
    isApplying: isApplyingPromo,
    error: promoError
  } = usePromoCode(bookingId, price, helperPrice);

  // Always show helper option if helper price is different and higher than regular price
  const showHelperOption = helperPrice && helperPrice > price;

  const handleContactSubmitted = () => {
    setShowPricing(true);
    if (onSubmitted) {
      onSubmitted({ bookingId, showPricing: true });
    }
  };

  const handlePayment = async (withHelper = false) => {
    try {
      clearPaymentError();
      const paymentPrice = withHelper ? currentHelperPrice : currentPrice;
      const sessionId = await processPayment(bookingId, paymentPrice, i18n.language, withHelper);
      console.log('Payment processing completed, sessionId:', sessionId);
    } catch (error) {
      console.error('Payment processing error:', error);
    }
  };

  const handlePromoCodeApplied = (newPrice, newHelperPrice, discountPercent) => {
    console.log('Promo code applied:', { newPrice, newHelperPrice, discountPercent });
  };

  return (
    <div className="quote-actions-optimized">
      {/* Contact Details Section */}
      {!showPricing && (
        <div className="section-container contact-section">
          <div className="section-header">
            <h4>
              <span className="section-icon">👤</span>
              {t('booking.contactDetails', 'Contact Details')}
            </h4>
          </div>
          <div className="section-content">
            <BookingForm
              bookingId={bookingId}
              onSubmit={handleContactSubmitted}
              isVisible={true}
            />
          </div>
        </div>
      )}

      {/* Combined Payment & Booking Section */}
      {showPricing && (
        <div className="section-container payment-booking-section">
          <div className="section-header">
            <h4>
              <span className="section-icon">💳</span>
              {t('paymentAndBooking', 'Payment & Booking')}
            </h4>
          </div>
          <div className="section-content">
            <CombinedPricingSection
              originalPrice={price}
              originalHelperPrice={helperPrice}
              currentPrice={currentPrice}
              currentHelperPrice={currentHelperPrice}
              discount={discount}
              showHelperOption={showHelperOption}
              onPayment={handlePayment}
              isProcessing={isProcessing}
              paymentError={paymentError}
              bookingId={bookingId}
              onPromoCodeApplied={handlePromoCodeApplied}
              isApplyingPromo={isApplyingPromo}
              promoError={promoError}
            />
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Combined pricing section with promotion code integrated
 */
const CombinedPricingSection = ({
                                  originalPrice,
                                  originalHelperPrice,
                                  currentPrice,
                                  currentHelperPrice,
                                  discount,
                                  showHelperOption,
                                  onPayment,
                                  isProcessing,
                                  paymentError,
                                  bookingId,
                                  onPromoCodeApplied,
                                  isApplyingPromo,
                                  promoError
                                }) => {
  const { t } = useTranslation();
  const hasDiscount = discount > 0;

  return (
    <div className="combined-pricing-container">
      {paymentError && (
        <Alert variant="error" title={t('paymentError', 'Payment Error')}>
          {paymentError}
        </Alert>
      )}

      {/* Helper Option Explanation */}
      <HelperExplanation />

      {/* Price Display - Keep Original Format */}
      <div className="price-display">
        <PriceItem
          label={t('estimatedPrice', 'Your estimated price (VAT included)')}
          originalPrice={originalPrice}
          currentPrice={currentPrice}
          hasDiscount={hasDiscount}
        />

        {/* Always show helper option if helperPrice exists */}
        <PriceItem
          label={t('priceWithHelper', 'Your estimated price with a helper (VAT included)')}
          originalPrice={originalHelperPrice}
          currentPrice={currentHelperPrice}
          hasDiscount={hasDiscount}
        />
      </div>

      {/* Promotion Code Section - Integrated after price */}
      <div className="promotion-section-integrated">
        <div className="promo-header-inline">
          <h5 className="promo-title">
            <span className="promo-icon">🎫</span>
            {t('promotionCode', 'Promotion Code')}
          </h5>
          <p className="promo-description">
            {t('promoCodeDescription', 'Have a promotion code? Enter it below to get a discount.')}
          </p>
        </div>

        <PromotionCode
          bookingId={bookingId}
          onApplied={onPromoCodeApplied}
          isApplying={isApplyingPromo}
          error={promoError}
        />
      </div>

      {/* Payment Buttons */}
      <div className="payment-buttons">
        {/* Helper Option Button - Enhanced */}
        <button
          onClick={() => onPayment(true)}
          disabled={isProcessing}
          className="payment-button helper-option"
        >
          {isProcessing ? (
            <>
              <div className="loading-spinner"></div>
              <span>{t('processing', 'Processing...')}</span>
            </>
          ) : (
            <>
              <div className="payment-button-content">
                <span className="payment-button-icon">👥</span>
                <div className="payment-button-text">
                  <span className="payment-button-title">{t('payAndBookWithHelper', 'Pay and Book with Helper')}</span>
                  <span className="payment-button-subtitle">{t('professionalAssistance', 'Professional assistance included')}</span>
                </div>
              </div>
              <div className="payment-button-price">£{currentHelperPrice}</div>
            </>
          )}
        </button>

        {/* Main Option Button - Enhanced */}
        <button
          onClick={() => onPayment(false)}
          disabled={isProcessing}
          className="payment-button main-option"
        >
          {isProcessing ? (
            <>
              <div className="loading-spinner"></div>
              <span>{t('processing', 'Processing...')}</span>
            </>
          ) : (
            <>
              <div className="payment-button-content">
                <span className="payment-button-icon">🚀</span>
                <div className="payment-button-text">
                  <span className="payment-button-title">{t('payAndBook', 'Pay and Book without Helper')}</span>
                  <span className="payment-button-subtitle">{t('standardService', 'Standard moving service')}</span>
                </div>
              </div>
              <div className="payment-button-price">£{currentPrice}</div>
            </>
          )}
        </button>
      </div>

      {/* Security Notice */}
      <div className="security-notice">
        <span className="notice-icon">🔒</span>
        <p className="notice-text">
          {t('paymentSecurity', 'Secure payment processing. Your card details are protected by industry-standard encryption.')}
        </p>
      </div>
    </div>
  );
};

/**
 * Individual price item component
 */
const PriceItem = ({ label, originalPrice, currentPrice, hasDiscount }) => {
  return (
    <div className="price-item">
      <span className="price-label">{label}:</span>
      <span className="price-value">
        {hasDiscount ? (
          <>
            <span className="original-price">£{originalPrice}</span>
            <span className="current-price">£{currentPrice}</span>
          </>
        ) : (
          <span className="current-price">£{currentPrice}</span>
        )}
      </span>
    </div>
  );
};

/**
 * Helper explanation component for better UX
 */
const HelperExplanation = () => {
  const { t } = useTranslation();

  return (
    <div className="helper-explanation">
      <div className="helper-header">
        <span className="helper-icon">👥</span>
        <h5 className="helper-title">
          {t('helperOption', 'Need Extra Help?')}
        </h5>
      </div>
      <p className="helper-description">
        {t('helperDescription', 'Add a professional helper to assist with your move. They can help with packing, lifting, and ensuring everything goes smoothly.')}
      </p>
      <div className="helper-benefits">
        <span className="benefit">✓ Professional assistance</span>
        <span className="benefit">✓ Faster completion</span>
        <span className="benefit">✓ Reduced stress</span>
      </div>
    </div>
  );
};

// PropTypes
PriceItem.propTypes = {
  label: PropTypes.string.isRequired,
  originalPrice: PropTypes.number.isRequired,
  currentPrice: PropTypes.number.isRequired,
  hasDiscount: PropTypes.bool.isRequired
};

CombinedPricingSection.propTypes = {
  originalPrice: PropTypes.number.isRequired,
  originalHelperPrice: PropTypes.number.isRequired,
  currentPrice: PropTypes.number.isRequired,
  currentHelperPrice: PropTypes.number.isRequired,
  discount: PropTypes.number.isRequired,
  showHelperOption: PropTypes.bool.isRequired,
  onPayment: PropTypes.func.isRequired,
  isProcessing: PropTypes.bool.isRequired,
  paymentError: PropTypes.string,
  bookingId: PropTypes.string.isRequired,
  onPromoCodeApplied: PropTypes.func.isRequired,
  isApplyingPromo: PropTypes.bool.isRequired,
  promoError: PropTypes.string
};

QuoteActions.propTypes = {
  bookingId: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  helperPrice: PropTypes.number.isRequired,
  onSubmitted: PropTypes.func
};

export default QuoteActions;