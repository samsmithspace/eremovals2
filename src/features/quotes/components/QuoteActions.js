// src/features/quotes/components/QuoteActions.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { loadStripe } from '@stripe/stripe-js';
import { BookingForm } from '../../booking/components/BookingForm';
import { PromotionCode } from './PromotionCode';
import { Button, Spinner, Alert } from '../../../common/components/ui';
import { usePaymentProcessing } from '../../booking/hooks/usePaymentProcessing';
import { usePromoCode } from '../hooks/usePromoCode';
import config from '../../../config/config';

const stripePromise = loadStripe(config.apiKeys.stripe);

/**
 * Component to handle quote actions including contact form, promo codes, and payment
 * @param {Object} props
 * @param {string} props.bookingId - ID of the booking
 * @param {number} props.price - Base price for the service
 * @param {number} props.helperPrice - Price with helper included
 * @param {Function} props.onSubmitted - Callback when booking is submitted
 */
const QuoteActions = ({ bookingId, price, helperPrice, onSubmitted }) => {
    const { t, i18n } = useTranslation();
    const [showPricing, setShowPricing] = useState(false);

    // Custom hooks
    const {
        processPayment,
        isProcessing,
        error: paymentError
    } = usePaymentProcessing();

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
            const paymentPrice = withHelper ? currentHelperPrice : currentPrice;
            const sessionId = await processPayment(bookingId, paymentPrice, i18n.language, withHelper);

            if (sessionId) {
                const stripe = await stripePromise;
                const { error } = await stripe.redirectToCheckout({ sessionId });

                if (error) {
                    console.error('Stripe redirect error:', error);
                }
            }
        } catch (error) {
            console.error('Payment processing error:', error);
        }
    };

    const handlePromoCodeApplied = (newPrice, newHelperPrice, discountPercent) => {
        // The usePromoCode hook handles the state updates
        console.log('Promo code applied:', { newPrice, newHelperPrice, discountPercent });
    };

    return (
        <div className="quote-actions">
            {/* Contact Form */}
            <BookingForm
                bookingId={bookingId}
                onSubmit={handleContactSubmitted}
                isVisible={!showPricing}
            />

            {/* Promotion Code */}
            {showPricing && (
                <PromotionCode
                    bookingId={bookingId}
                    onApplied={handlePromoCodeApplied}
                    isApplying={isApplyingPromo}
                    error={promoError}
                />
            )}

            {/* Pricing and Payment Section */}
            {showPricing && (
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
            )}
        </div>
    );
};

/**
 * Pricing section component
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
        <div className="pricing-section">
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

            <div className="payment-buttons">
                {showHelperOption && (
                    <Button
                        onClick={() => onPayment(true)}
                        variant="secondary"
                        size="large"
                        disabled={isProcessing}
                        className="payment-button helper-button"
                    >
                        {isProcessing ? (
                            <>
                                <Spinner size="small" />
                                {t('processing', 'Processing...')}
                            </>
                        ) : (
                            t('payAndBookWithHelper', 'Pay and Book with Helper')
                        )}
                    </Button>
                )}

                <Button
                    onClick={() => onPayment(false)}
                    variant="primary"
                    size="large"
                    disabled={isProcessing}
                    className="payment-button main-button"
                >
                    {isProcessing ? (
                        <>
                            <Spinner size="small" />
                            {t('processing', 'Processing...')}
                        </>
                    ) : (
                        t('payAndBook', 'Pay and Book without Helper')
                    )}
                </Button>
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