// src/features/booking/components/BookingForm.js
import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useBookingForm } from '../hooks/useBookingForm';
import { FormInput, Button, Spinner } from '../../../common/components/ui';

/**
 * Booking form component for collecting customer contact details
 * @param {Object} props
 * @param {Function} props.onSubmit - Callback when form is submitted successfully
 * @param {string} props.bookingId - ID of the booking
 * @param {boolean} props.isVisible - Whether the form should be visible
 */
const BookingForm = ({ onSubmit, bookingId, isVisible = true }) => {
    const { t } = useTranslation();
    const {
        formValues,
        errors,
        isSubmitting,
        handleChange,
        handleSubmit,
        isValid
    } = useBookingForm(bookingId, onSubmit);

    if (!isVisible) return null;

    return (
        <div className="booking-form">
            <div className="form-header">
                <h3>{t('contactDetails', 'Contact Details')}</h3>
                <p className="form-description">
                    {t('contactDetailsDescription', 'Fill your contact details to confirm the booking, we may contact you for information if needed.')}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="contact-form">
                <FormInput
                    id="name"
                    name="name"
                    type="text"
                    label={t('name', 'Name')}
                    value={formValues.name}
                    onChange={handleChange}
                    error={errors.name}
                    required
                    disabled={isSubmitting}
                />

                <FormInput
                    id="phone"
                    name="phone"
                    type="tel"
                    label={t('phoneNumber', 'Phone Number')}
                    value={formValues.phone}
                    onChange={handleChange}
                    error={errors.phone}
                    required
                    disabled={isSubmitting}
                />

                <FormInput
                    id="email"
                    name="email"
                    type="email"
                    label={t('emailAddress', 'Email Address')}
                    value={formValues.email}
                    onChange={handleChange}
                    error={errors.email}
                    required
                    disabled={isSubmitting}
                />

                <Button
                    type="submit"
                    variant="primary"
                    size="large"
                    disabled={!isValid || isSubmitting}
                    className="submit-button"
                >
                    {isSubmitting ? (
                        <>
                            <Spinner size="small" />
                            {t('processing', 'Processing...')}
                        </>
                    ) : (
                        t('confirm', 'Confirm')
                    )}
                </Button>
            </form>
        </div>
    );
};

BookingForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    bookingId: PropTypes.string.isRequired,
    isVisible: PropTypes.bool
};

export default BookingForm;