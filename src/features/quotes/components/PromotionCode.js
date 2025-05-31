// src/features/quotes/components/PromotionCode.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { FormInput, Button, Spinner, Alert } from '../../../common/components/ui';
import { usePromoCode } from '../hooks/usePromoCode';
import './PromotionCode.css';
/**
 * Component for applying promotion codes to bookings
 * @param {Object} props
 * @param {string} props.bookingId - ID of the booking
 * @param {Function} props.onApplied - Callback when promo code is successfully applied
 * @param {boolean} props.isApplying - Whether promo code is being applied
 * @param {string} props.error - Error message if any
 */
const PromotionCode = ({ bookingId, onApplied, isApplying, error }) => {
    const { t } = useTranslation();
    const [promoCode, setPromoCode] = useState('');
    const [validationError, setValidationError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const { applyPromoCode } = usePromoCode(bookingId);

    const handleChange = (e) => {
        const value = e.target.value.toUpperCase().slice(0, 6); // Limit to 6 characters, uppercase
        setPromoCode(value);
        setValidationError('');
        setSuccessMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate promo code length
        if (promoCode.length !== 6) {
            setValidationError(t('invalidPromoCodeLength', 'Promotion code must be exactly 6 characters long.'));
            return;
        }

        try {
            const result = await applyPromoCode(promoCode);

            if (result.success) {
                setSuccessMessage(
                    t('promoCodeApplied', 'Promotion code applied! You get a discount of {{discount}}% off', {
                        discount: result.discount
                    })
                );

                if (onApplied) {
                    onApplied(result.newPrice, result.newHelperPrice, result.discount);
                }

                // Clear the input after successful application
                setPromoCode('');
            }
        } catch (err) {
          //  console.error('Error applying promotion code:', err);
        }
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

                {successMessage && (
                    <Alert variant="success" className="promo-success">
                        {successMessage}
                    </Alert>
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
    error: PropTypes.string
};

export default PromotionCode;