// Optimized BookingForm.js - Clean single-layer implementation
import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useBookingForm } from '../hooks/useBookingForm';
import './BookingForm.css';

/**
 * Optimized booking form component - clean single layer without redundant wrappers
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
      <div className="booking-form-clean">

          <div className="progress-dots">
              <div className="progress-dot completed"></div>
              <div className="progress-dot completed"></div>
              <div className="progress-dot current"></div>
          </div>

          <p className="form-description">
              <span className="step-icon">🎯</span>
              {t('contactDescription', 'Please provide your contact information so we can confirm and manage your booking.')}
          </p>

          {/* Clean Contact Form */}
          <form onSubmit={handleSubmit} className="contact-form-clean">
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
                    placeholder={t('booking.enterFullName', 'Enter your full name')}
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
                      {t('booking.phoneNumber', 'Phone Number')}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formValues.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={t('booking.enterPhoneNumber', '07XXX XXXXXX')}
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
                    placeholder={t('booking.enterEmailAddress', 'your.email@example.com')}
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
                        <div className="loading-spinner"></div>
                        <span>{t('booking.submitting', 'Processing...')}</span>
                    </>
                  ) : (
                    <>
                        <span className="button-icon">🚀</span>
                        <span>{t('booking.continueToPayment', 'Continue to Payment')}</span>
                    </>
                  )}
              </button>
          </form>

          {/* Security Notice */}
          <div className="security-notice-clean">
              <span className="notice-icon">🔒</span>
              <p className="notice-text">
                  {t('booking.securityNotice', 'Your information is secure and encrypted')}
              </p>
          </div>

          {/* Alternative Contact */}
          <div className="alternative-contact-clean">
              <h4>{t('booking.orContact', 'Or contact us directly')}</h4>
              <div className="contact-links">
                  <a href="tel:+447404228217" className="contact-link">
                      <span>📞</span>
                      <span>{t('booking.callUs', 'Call Us')}</span>
                  </a>
                  <a href="https://wa.me/447404228217" target="_blank" rel="noopener noreferrer" className="contact-link">
                      <span>💬</span>
                      <span>{t('booking.whatsapp', 'WhatsApp')}</span>
                  </a>
                  <a href="mailto:eremovalsscot@gmail.com" className="contact-link">
                      <span>✉️</span>
                      <span>{t('booking.email', 'Email')}</span>
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