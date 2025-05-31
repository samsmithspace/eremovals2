// Updated BookingForm.js - With improved icons and scoped description
import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useBookingForm } from '../hooks/useBookingForm';
import './BookingForm.css';

const BookingForm = ({ bookingId, onSubmit, isVisible = true }) => {
    const { t } = useTranslation();

    const {
        formValues,
        errors,
        isSubmitting,
        isValid,
        handleChange,
        handleBlur,
        handleSubmit,
    } = useBookingForm(bookingId, onSubmit);

    if (!isVisible) return null;

    return (
      <div className="booking-form-clean">
          {/* Contact form intro after progress indicator */}
          <div className="contact-form-description">
              <span>📋</span>
              <span>
          {t(
            'contactDescription',
            'Please provide your contact information for a personalized quote'
          )}
        </span>
          </div>

          <form onSubmit={handleSubmit} className="contact-form-clean">
              {/* Name */}
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
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>

              {/* Phone */}
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
                  {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
              </div>

              {/* Email */}
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
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              {/* Submit */}
              <button type="submit" disabled={!isValid || isSubmitting} className="submit-button-clean">
                  {isSubmitting ? (
                    <>
                        <div className="loading-spinner"></div>
                        <span>{t('booking.submitting', 'Processing...')}</span>
                    </>
                  ) : (
                    <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                        <span>{t('booking.continueToPayment', 'Check Price')}</span>
                    </>
                  )}
              </button>
          </form>

          {/* Security Notice */}
          <div className="security-notice-clean">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z" />
              </svg>
              <span className="notice-text">
          {t('booking.securityNotice', 'Your information is secure and protected')}
        </span>
          </div>

          {/* Alternative Contact */}
          <div className="alternative-contact-clean">
              <h4>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20,15.5C18.8,15.5 17.5,15.3 16.4,14.9...Z" />
                  </svg>
                  {t('booking.orContact', 'Alternative Contact Methods')}
              </h4>
              <div className="contact-links">
                  <a href="tel:+447404228217" className="contact-link">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41..." />
                      </svg>
                      <span>{t('booking.callUs', 'Call Us')}</span>
                  </a>
                  <a
                    href="https://wa.me/447404228217"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-link"
                  >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472,14.382C17.367,14.382 17.218,14.382...Z" />
                      </svg>
                      <span>{t('booking.whatsapp', 'WhatsApp')}</span>
                  </a>
                  <a href="mailto:eremovalsscot@gmail.com" className="contact-link">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18..." />
                      </svg>
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
    isVisible: PropTypes.bool,
};

export default BookingForm;
