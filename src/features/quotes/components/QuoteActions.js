// Streamlined QuoteActions.js - Clean Implementation Without Redundancy
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import BookingForm from '../../booking/components/BookingForm';
import PromotionCode from './PromotionCode';
import { Button, Spinner, Alert } from '../../../common/components/ui';
import { usePaymentProcessing } from '../../booking/hooks/usePaymentProcessing';
import { usePromoCode } from '../hooks/usePromoCode';
import './QuoteActions.css';

/**
 * Clean QuoteActions component - no redundant wrappers
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

  const showHelperOption = price > 60 && price !== helperPrice;

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
    <div className="quote-actions-clean">
      {/* Contact Details Section */}
      {!showPricing && (
        <div className="inventory-section">
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

      {/* Promotion Code Section */}
      {showPricing && (
        <div className="inventory-section">
          <div className="section-header">
            <h4>
              <span className="section-icon">🎫</span>
              {t('promotionCode', 'Promotion Code')}
            </h4>
          </div>
          <div className="section-content">
            <PromotionCode
              bookingId={bookingId}
              onApplied={handlePromoCodeApplied}
              isApplying={isApplyingPromo}
              error={promoError}
            />
          </div>
        </div>
      )}

      {/* Payment Section */}
      {showPricing && (
        <div className="inventory-section">
          <div className="section-header">
            <h4>
              <span className="section-icon">💳</span>
              {t('paymentAndBooking', 'Payment & Booking')}
            </h4>
          </div>
          <div className="section-content">
            <PricingSection
              originalPrice={price}
              originalHelperPrice={helperPrice}
              currentPrice={currentPrice}
              currentHelperPrice={currentHelperPrice}
              discount={discount}
              showHelperOption={showHelperOption}
              onPayment={handlePayment}
              isProcessing={isProcessing}
              paymentError={paymentError}
            />
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Clean pricing section without redundant styling
 */
const PricingSection = ({
                          originalPrice,
                          originalHelperPrice,
                          currentPrice,
                          currentHelperPrice,
                          discount,
                          showHelperOption,
                          onPayment,
                          isProcessing,
                          paymentError
                        }) => {
  const { t } = useTranslation();
  const hasDiscount = discount > 0;

  return (
    <>
      {paymentError && (
        <Alert variant="error" title={t('paymentError', 'Payment Error')}>
          {paymentError}
        </Alert>
      )}

      <div className="price-display">
        <PriceItem
          label={t('estimatedPrice', 'Your estimated price (VAT included)')}
          originalPrice={originalPrice}
          currentPrice={currentPrice}
          hasDiscount={hasDiscount}
        />

        {showHelperOption && (
          <PriceItem
            label={t('priceWithHelper', 'Your estimated price with a helper (VAT included)')}
            originalPrice={originalHelperPrice}
            currentPrice={currentHelperPrice}
            hasDiscount={hasDiscount}
          />
        )}
      </div>

      <div className="payment-buttons-clean">
        {showHelperOption && (
          <Button
            onClick={() => onPayment(true)}
            variant="secondary"
            size="large"
            disabled={isProcessing}
            className="payment-button-clean helper-button"
          >
            {isProcessing ? (
              <>
                <Spinner size="small" />
                {t('processing', 'Processing...')}
              </>
            ) : (
              <>
                <span>👥</span>
                <span>{t('payAndBookWithHelper', 'Pay and Book with Helper')}</span>
              </>
            )}
          </Button>
        )}

        <Button
          onClick={() => onPayment(false)}
          variant="primary"
          size="large"
          disabled={isProcessing}
          className="payment-button-clean main-button"
        >
          {isProcessing ? (
            <>
              <Spinner size="small" />
              {t('processing', 'Processing...')}
            </>
          ) : (
            <>
              <span>🚀</span>
              <span>{t('payAndBook', 'Pay and Book without Helper')}</span>
            </>
          )}
        </Button>
      </div>

      <div className="security-notice-clean">
        <span className="notice-icon">🔒</span>
        <p className="notice-text">
          {t('paymentSecurity', 'Secure payment processing. Your card details are protected by industry-standard encryption.')}
        </p>
      </div>
    </>
  );
};

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

PriceItem.propTypes = {
  label: PropTypes.string.isRequired,
  originalPrice: PropTypes.number.isRequired,
  currentPrice: PropTypes.number.isRequired,
  hasDiscount: PropTypes.bool.isRequired
};

PricingSection.propTypes = {
  originalPrice: PropTypes.number.isRequired,
  originalHelperPrice: PropTypes.number.isRequired,
  currentPrice: PropTypes.number.isRequired,
  currentHelperPrice: PropTypes.number.isRequired,
  discount: PropTypes.number.isRequired,
  showHelperOption: PropTypes.bool.isRequired,
  onPayment: PropTypes.func.isRequired,
  isProcessing: PropTypes.bool.isRequired,
  paymentError: PropTypes.string
};

QuoteActions.propTypes = {
  bookingId: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  helperPrice: PropTypes.number.isRequired,
  onSubmitted: PropTypes.func
};

export default QuoteActions;