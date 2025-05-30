// src/features/booking/components/BookingForm.js - React Component
import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button, Alert } from '../../../common/components/ui';
import { useBookingForm } from '../hooks/useBookingForm';
import './BookingForm.css';

/**
 * Booking form component for collecting contact details
 * @param {Object} props
 * @param {string} props.bookingId - ID of the booking
 * @param {Function} props.onSubmit - Callback when form is submitted successfully
 * @param {boolean} props.isVisible - Whether the form is visible
 */
const BookingForm = ({ bookingId, onSubmit, isVisible = true }) => {
    const { t } = useTranslation();

    const {
        formValues,
        errors,
        isSubmitting,
        isValid,
        handleChange,
        handleBlur,
        handleSubmit
    } = useBookingForm(bookingId, onSubmit);

    if (!isVisible) return null;

    return (
      <div className="booking-form">

          <p className="section-description">
              <span className="step-icon">🎯</span>
              {t('booking.finalStep', 'Please provide your contact details to complete the booking process.')}
          </p>

          <form onSubmit={handleSubmit} className="contact-form-simple">
              {/* Name Field */}
              <div className="form-group" data-field="name">
                  <label htmlFor="name" className="form-label required">
                      {t('booking.name', 'Full Name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formValues.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={t('booking.namePlaceholder', 'Enter your full name')}
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    disabled={isSubmitting}
                    required
                  />
                  {errors.name && (
                    <div className="invalid-feedback">
                        {errors.name}
                    </div>
                  )}
              </div>

              {/* Phone Field */}
              <div className="form-group" data-field="phone">
                  <label htmlFor="phone" className="form-label required">
                      {t('booking.phone', 'Phone Number')}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formValues.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={t('booking.phonePlaceholder', 'Enter your phone number')}
                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                    disabled={isSubmitting}
                    required
                  />
                  {errors.phone && (
                    <div className="invalid-feedback">
                        {errors.phone}
                    </div>
                  )}
              </div>

              {/* Email Field */}
              <div className="form-group" data-field="email">
                  <label htmlFor="email" className="form-label required">
                      {t('booking.email', 'Email Address')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formValues.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={t('booking.emailPlaceholder', 'Enter your email address')}
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    disabled={isSubmitting}
                    required
                  />
                  {errors.email && (
                    <div className="invalid-feedback">
                        {errors.email}
                    </div>
                  )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="submit-button-clean"
              >
                  {isSubmitting ? (
                    <>
                        <div className="spinner"></div>
                        {t('booking.submitting', 'Submitting...')}
                    </>
                  ) : (
                    <>
                        <span className="button-icon">✓</span>
                        <span>{t('booking.continueToPayment', 'Continue to Payment')}</span>
                    </>
                  )}
              </button>
          </form>

          {/* Security Notice */}
          <div className="security-notice-clean">
              <span className="notice-icon">🔒</span>
              <p className="notice-text">
                  {t('booking.securityNotice', 'Your information is secure and will only be used to process your booking.')}
              </p>
          </div>

          {/* Alternative Contact */}
          <div className="alternative-contact-simple">
              <h4>{t('booking.alternativeContact', 'Prefer to call?')}</h4>
              <div className="contact-links">
                  <a href="tel:+447404228217" className="contact-link">
                      📞 {t('booking.callUs', 'Call Us')}
                  </a>
                  <a
                    href="https://wa.me/447404228217"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-link"
                  >
                      💬 {t('booking.whatsapp', 'WhatsApp')}
                  </a>
                  <a href="mailto:eremovalsscot@gmail.com" className="contact-link">
                      ✉️ {t('booking.email', 'Email')}
                  </a>
              </div>
          </div>
      </div>
    );
};

BookingForm.propTypes = {
    bookingId: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
    isVisible: PropTypes.bool
};

export default BookingForm;