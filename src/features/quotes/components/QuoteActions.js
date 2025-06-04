// Fixed QuoteActions.js with proper applyPromoCode destructuring
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import BookingForm from '../../booking/components/BookingForm';
import PromotionCode from './PromotionCode';
import { Button, Spinner, Alert } from 'common/components/ui';
import { usePaymentProcessing } from '../../booking/hooks/usePaymentProcessing';
import { usePromoCode } from '../hooks/usePromoCode';
import './QuoteActions.css';

/**
 * Enhanced QuoteActions with visual discount effects
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
    applyPromoCode, // FIXED: Properly destructure applyPromoCode
    isApplying: isApplyingPromo,
    error: promoError
  } = usePromoCode(bookingId, price, helperPrice);

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

  const handlePromoCodeApplied = (newPrice, newHelperPrice, discountPercent, fullResult) => {
    console.log('Promo code applied in QuoteActions:', { newPrice, newHelperPrice, discountPercent, fullResult });

    // ADDED: Force component re-render by updating a dummy state
    console.log('Current state before promo:', {
      currentPrice,
      currentHelperPrice,
      originalPrice: price,
      originalHelperPrice: helperPrice,
      discount
    });

    // Force a re-render by updating component state
    setTimeout(() => {
      const priceDisplay = document.querySelector('.price-display');
      if (priceDisplay) {
        priceDisplay.classList.add('has-discount');
        priceDisplay.classList.add('promo-success-flash');

        setTimeout(() => {
          priceDisplay.classList.remove('promo-success-flash');
        }, 1000);
      }

      // ADDED: Force a re-render to ensure UI updates
      console.log('State after promo should be applied:', {
        currentPrice,
        currentHelperPrice,
        discount
      });
    }, 100);

    // The usePromoCode hook should automatically update the currentPrice values
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

      {/* Enhanced Payment & Booking Section */}
      {showPricing && (
        <div className="section-container payment-booking-section">
          <div className="section-header">
            <h4>
              <span className="section-icon">💳</span>
              {t('paymentAndBooking', 'Payment & Booking')}
            </h4>
          </div>
          <div className="section-content">
            <EnhancedPricingSection
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
              applyPromoCodeFunc={applyPromoCode} // FIXED: Pass the function correctly
            />
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Enhanced pricing section with visual discount effects
 */
const EnhancedPricingSection = ({
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
                                  promoError,
                                  applyPromoCodeFunc // FIXED: Add this prop
                                }) => {
  const { t } = useTranslation();

  // FIXED: Calculate hasDiscount based on price difference AND discount percentage
  const hasRegularDiscount = (currentPrice < originalPrice) || (discount > 0);
  const hasHelperDiscount = (currentHelperPrice < originalHelperPrice) || (discount > 0);
  const hasAnyDiscount = hasRegularDiscount || hasHelperDiscount || discount > 0;

  console.log('EnhancedPricingSection render:', {
    originalPrice,
    currentPrice,
    originalHelperPrice,
    currentHelperPrice,
    discount,
    hasRegularDiscount,
    hasHelperDiscount,
    hasAnyDiscount,
    priceDifference: originalPrice - currentPrice,
    helperPriceDifference: originalHelperPrice - currentHelperPrice
  });

  return (
    <div className="combined-pricing-container">
      {paymentError && (
        <Alert variant="error" title={t('paymentError', 'Payment Error')}>
          {paymentError}
        </Alert>
      )}

      {/* Helper Option Explanation */}
      <HelperExplanation />

      {/* Enhanced Price Display with strikethrough effects */}
      <div className={`price-display ${hasAnyDiscount ? 'has-discount' : ''}`}>
        <EnhancedPriceItem
          label={t('estimatedPrice', 'Your estimated price (VAT included)')}
          originalPrice={originalPrice}
          currentPrice={currentPrice}
          hasDiscount={hasRegularDiscount}
          discount={discount}
          isMainPrice={true}
        />

        <EnhancedPriceItem
          label={t('priceWithHelper', 'Your estimated price with a helper (VAT included)')}
          originalPrice={originalHelperPrice}
          currentPrice={currentHelperPrice}
          hasDiscount={hasHelperDiscount}
          discount={discount}
          isMainPrice={false}
        />
      </div>

      {/* Promotion Code Section */}
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
          applyPromoCodeFunc={applyPromoCodeFunc} // FIXED: Pass the function correctly
        />
      </div>

      {/* Enhanced Payment Buttons */}
      <div className="payment-buttons">
        {/* Helper Option Button */}
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
                  <span className="payment-button-title">
                    {t('payAndBookWithHelper', 'Pay and Book with Helper')}
                  </span>
                  <span className="payment-button-subtitle">
                    {t('professionalAssistance', 'Professional assistance included')}
                  </span>
                </div>
              </div>
              <EnhancedPaymentButtonPrice
                originalPrice={originalHelperPrice}
                currentPrice={currentHelperPrice}
                hasDiscount={hasHelperDiscount}
              />
            </>
          )}
        </button>

        {/* Main Option Button */}
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
                  <span className="payment-button-title">
                    {t('payAndBook', 'Pay and Book without Helper')}
                  </span>
                  <span className="payment-button-subtitle">
                    {t('standardService', 'Standard moving service')}
                  </span>
                </div>
              </div>
              <EnhancedPaymentButtonPrice
                originalPrice={originalPrice}
                currentPrice={currentPrice}
                hasDiscount={hasRegularDiscount}
              />
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
 * FIXED: Enhanced price item component with proper discount detection
 */
const EnhancedPriceItem = ({ label, originalPrice, currentPrice, hasDiscount, discount, isMainPrice = true }) => {
  const { t } = useTranslation();

  // FIXED: More robust discount detection
  const actualSavings = Math.max(0, originalPrice - currentPrice);
  const actualDiscountPercentage = originalPrice > 0 ? Math.round((actualSavings / originalPrice) * 100) : 0;

  // Use actual discount percentage if available, otherwise use passed discount
  const displayDiscountPercentage = actualDiscountPercentage > 0 ? actualDiscountPercentage : discount;

  // FIXED: Show discount if there's ANY price difference OR if discount percentage is provided
  const shouldShowDiscount = (actualSavings > 0.01) || (discount > 0) || hasDiscount;

  console.log('EnhancedPriceItem render:', {
    label,
    originalPrice,
    currentPrice,
    hasDiscount,
    shouldShowDiscount,
    actualSavings,
    actualDiscountPercentage,
    displayDiscountPercentage,
    discount
  });

  return (
    <div className="price-item">
      <span className="price-label">
        {label}
        {shouldShowDiscount && displayDiscountPercentage > 0 && (
          <span className="discount-badge">
            {displayDiscountPercentage}% OFF
          </span>
        )}
      </span>

      <div className="price-comparison">
        {shouldShowDiscount ? (
          <>
            {/* Original price with strikethrough */}
            <div className="price-row original">
              <span className="original-price">£{originalPrice.toFixed(2)}</span>
            </div>

            {/* Discounted price */}
            <div className="price-row discounted">
              <span className="current-price">£{currentPrice.toFixed(2)}</span>
            </div>

            {/* Savings indicator */}
            {actualSavings > 0 && (
              <div className="savings-indicator">
                {t('youSave', 'You save')} £{actualSavings.toFixed(2)}!
              </div>
            )}
          </>
        ) : (
          <div className="price-row">
            <span className="current-price">£{currentPrice.toFixed(2)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Enhanced payment button price with discount display
 */
const EnhancedPaymentButtonPrice = ({ originalPrice, currentPrice, hasDiscount }) => {
  const shouldShowDiscount = hasDiscount && (originalPrice > currentPrice);

  return (
    <div className={`payment-button-price ${shouldShowDiscount ? 'has-discount' : ''}`}>
      {shouldShowDiscount && (
        <div className="original-button-price">£{originalPrice.toFixed(2)}</div>
      )}
      <div className={shouldShowDiscount ? 'discounted-button-price' : ''}>
        £{currentPrice.toFixed(2)}
      </div>
    </div>
  );
};

/**
 * Helper explanation component
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
EnhancedPriceItem.propTypes = {
  label: PropTypes.string.isRequired,
  originalPrice: PropTypes.number.isRequired,
  currentPrice: PropTypes.number.isRequired,
  hasDiscount: PropTypes.bool.isRequired,
  discount: PropTypes.number,
  isMainPrice: PropTypes.bool
};

EnhancedPaymentButtonPrice.propTypes = {
  originalPrice: PropTypes.number.isRequired,
  currentPrice: PropTypes.number.isRequired,
  hasDiscount: PropTypes.bool.isRequired
};

EnhancedPricingSection.propTypes = {
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
  promoError: PropTypes.string,
  applyPromoCodeFunc: PropTypes.func.isRequired // FIXED: Add this prop type
};

QuoteActions.propTypes = {
  bookingId: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  helperPrice: PropTypes.number.isRequired,
  onSubmitted: PropTypes.func
};

export default QuoteActions;