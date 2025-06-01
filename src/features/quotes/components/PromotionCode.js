// Enhanced PromotionCode component with better state management - Update PromotionCode.js

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { FormInput, Button, Spinner, Alert } from '../../../common/components/ui';
import './PromotionCode.css';

/**
 * Enhanced promotion code component with visual discount effects
 */
const PromotionCode = ({ bookingId, onApplied, isApplying, error, applyPromoCodeFunc }) => {
    const { t } = useTranslation();
    const [promoCode, setPromoCode] = useState('');
    const [validationError, setValidationError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [appliedDiscount, setAppliedDiscount] = useState(null);
    const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

    const handleChange = (e) => {
        const value = e.target.value.toUpperCase().slice(0, 6);
        setPromoCode(value);
        setValidationError('');
        setSuccessMessage('');
        setAppliedDiscount(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (promoCode.length !== 6) {
            setValidationError(t('invalidPromoCodeLength', 'Promotion code must be exactly 6 characters long.'));
            return;
        }

        try {
            console.log('PromotionCode: Submitting promo code', promoCode);

            // Use the prop function if provided, otherwise use the default API call
            let result;
            if (applyPromoCodeFunc) {
                result = await applyPromoCodeFunc(promoCode);
            } else {
                // Fallback to default implementation
                const { quoteService } = await import('../services/quoteService');
                result = await quoteService.applyPromoCode(bookingId, promoCode);
            }

            console.log('PromotionCode: Received result', result);

            if (result.success) {
                // Store discount information for display
                const discountInfo = {
                    discount: result.discount,
                    originalPrice: result.originalPrice,
                    newPrice: result.newPrice,
                    savings: result.savings || (result.originalPrice - result.newPrice),
                    originalHelperPrice: result.originalHelperPrice,
                    newHelperPrice: result.newHelperPrice,
                    helperSavings: result.helperSavings || (result.originalHelperPrice - result.newHelperPrice)
                };

                setAppliedDiscount(discountInfo);

                // Show success animation
                setShowSuccessAnimation(true);
                setTimeout(() => setShowSuccessAnimation(false), 2000);

                // Set success message with savings details
                setSuccessMessage(
                  t('promoCodeAppliedWithSavings',
                    'Promotion code applied! You get {{discount}}% off - You saved £{{savings}}!', {
                        discount: result.discount,
                        savings: discountInfo.savings.toFixed(2)
                    })
                );

                // FIXED: Call onApplied with all the necessary information
                if (onApplied) {
                    console.log('PromotionCode: Calling onApplied with', {
                        newPrice: result.newPrice,
                        newHelperPrice: result.newHelperPrice,
                        discount: result.discount
                    });

                    onApplied(result.newPrice, result.newHelperPrice, result.discount, result);
                }

                // Clear the input after successful application
                setPromoCode('');

                // Trigger visual effects on price display
                triggerPriceDisplayEffects(result.discount);
            }
        } catch (err) {
            console.error('PromotionCode: Error applying promotion code:', err);
            const errorMessage = err.message || 'Failed to apply promotion code';
            setValidationError(errorMessage);
        }
    };

    // Trigger visual effects on the price display
    const triggerPriceDisplayEffects = (discount) => {
        // Add CSS class to price display for animation
        const priceDisplay = document.querySelector('.price-display');
        if (priceDisplay) {
            priceDisplay.classList.add('has-discount', 'promo-success-flash');

            // Remove animation class after completion
            setTimeout(() => {
                priceDisplay.classList.remove('promo-success-flash');
            }, 1000);
        }

        // Trigger re-render of parent components
        window.dispatchEvent(new CustomEvent('promoCodeApplied', {
            detail: { discount }
        }));
    };

    const displayError = validationError || error;

    return (
      <div className="promotion-code-section">
          <div className="promo-header">
              <h3>{t('promotionCode', 'Promotion Code')}</h3>
              <p className="promo-description">
                  {t('promoCodeDescription', 'Have a promotion code? Enter it below to get a discount.')}
              </p>
          </div>

          <form onSubmit={handleSubmit} className="promo-form">
              <div className="promo-input-group">
                  <FormInput
                    id="promoCode"
                    name="promoCode"
                    type="text"
                    label={t('enterPromoCode', 'Promotion Code')}
                    value={promoCode}
                    onChange={handleChange}
                    placeholder={t('promoCodePlaceholder', 'Enter 6-character code')}
                    disabled={isApplying}
                    maxLength={6}
                    error={displayError}
                    className="promo-input"
                  />

                  <Button
                    type="submit"
                    variant="secondary"
                    disabled={!promoCode.trim() || isApplying || promoCode.length !== 6}
                    className="apply-button"
                  >
                      {isApplying ? (
                        <>
                            <Spinner size="small" />
                            {t('applying', 'Applying...')}
                        </>
                      ) : (
                        t('applyCode', 'Apply Code')
                      )}
                  </Button>
              </div>

              {/* Enhanced Success Message with Savings Details */}
              {successMessage && (
                <div className={`promo-success ${showSuccessAnimation ? 'success-animation' : ''}`}>
                    <div className="success-content">
                        <div className="success-icon">🎉</div>
                        <div className="success-text">
                            <div className="success-title">
                                {t('discountApplied', 'Discount Applied!')}
                            </div>
                            <div className="success-details">
                                {appliedDiscount && (
                                  <div className="savings-breakdown">
                                            <span className="discount-percentage">
                                                {appliedDiscount.discount}% OFF
                                            </span>

                                  </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
              )}

              {displayError && (
                <Alert variant="error" className="promo-error">
                    {displayError}
                </Alert>
              )}
          </form>

          <div className="promo-help">
              <p className="help-text">
                  {t('promoCodeHelp', 'Promotion codes are case-sensitive and must be exactly 6 characters.')}
              </p>
          </div>
      </div>
    );
};

PromotionCode.propTypes = {
    bookingId: PropTypes.string.isRequired,
    onApplied: PropTypes.func,
    isApplying: PropTypes.bool,
    error: PropTypes.string,
    applyPromoCodeFunc: PropTypes.func // New prop to pass the apply function
};

export default PromotionCode;