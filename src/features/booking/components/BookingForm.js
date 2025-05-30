// src/features/booking/components/BookingForm.js - Enhanced UI
import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button, Alert } from '../../../common/components/ui';
import { useBookingForm } from '../hooks/useBookingForm';
import './BookingForm.css';

/**
 * Enhanced booking form component for collecting contact details
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
      <div className="modern-booking-form">
          {/* Professional Header */}
          <div className="form-header-modern">
              <div className="header-content">
                  <div className="header-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor"/>
                      </svg>
                  </div>
                  <div className="header-text">
                      <h3>{t('booking.contactDetails', 'Contact Information')}</h3>
                      <p>{t('booking.contactDescription', 'We need your details to confirm and manage your booking')}</p>
                  </div>
              </div>
              <div className="step-indicator">
                  <span className="step-number">3</span>
                  <span className="step-text">Final Step</span>
              </div>
          </div>

          {/* Enhanced Form */}
          <form onSubmit={handleSubmit} className="contact-form-enhanced">
              {/* Name Field with Icon */}
              <div className="form-field-group">
                  <div className="field-wrapper">
                      <div className="field-icon">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor"/>
                          </svg>
                      </div>
                      <div className="field-content">
                          <label htmlFor="name" className="field-label">
                              {t('booking.name', 'Full Name')}
                              <span className="required-asterisk">*</span>
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formValues.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder={t('booking.namePlaceholder', 'Enter your full name')}
                            className={`field-input ${errors.name ? 'error' : ''}`}
                            disabled={isSubmitting}
                            required
                          />
                          {errors.name && (
                            <div className="field-error">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
                                </svg>
                                <span>{errors.name}</span>
                            </div>
                          )}
                      </div>
                  </div>
              </div>

              {/* Phone Field with Icon */}
              <div className="form-field-group">
                  <div className="field-wrapper">
                      <div className="field-icon">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z" fill="currentColor"/>
                          </svg>
                      </div>
                      <div className="field-content">
                          <label htmlFor="phone" className="field-label">
                              {t('booking.phone', 'Phone Number')}
                              <span className="required-asterisk">*</span>
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formValues.phone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder={t('booking.phonePlaceholder', '07XXX XXXXXX')}
                            className={`field-input ${errors.phone ? 'error' : ''}`}
                            disabled={isSubmitting}
                            required
                          />
                          {errors.phone && (
                            <div className="field-error">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
                                </svg>
                                <span>{errors.phone}</span>
                            </div>
                          )}
                      </div>
                  </div>
              </div>

              {/* Email Field with Icon */}
              <div className="form-field-group">
                  <div className="field-wrapper">
                      <div className="field-icon">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor"/>
                          </svg>
                      </div>
                      <div className="field-content">
                          <label htmlFor="email" className="field-label">
                              {t('booking.email', 'Email Address')}
                              <span className="required-asterisk">*</span>
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formValues.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            placeholder={t('booking.emailPlaceholder', 'your.email@example.com')}
                            className={`field-input ${errors.email ? 'error' : ''}`}
                            disabled={isSubmitting}
                            required
                          />
                          {errors.email && (
                            <div className="field-error">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor"/>
                                </svg>
                                <span>{errors.phone}</span>
                            </div>
                          )}
                      </div>
                  </div>
              </div>

              {/* Enhanced Submit Button */}
              <div className="form-actions">
                  <button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    className="submit-button-enhanced"
                  >
                      {isSubmitting ? (
                        <div className="button-loading">
                            <div className="loading-spinner"></div>
                            <span>{t('booking.submitting', 'Processing...')}</span>
                        </div>
                      ) : (
                        <div className="button-content">
                            <span>{t('booking.continueToPayment', 'Continue to Payment')}</span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z" fill="currentColor"/>
                            </svg>
                        </div>
                      )}
                  </button>
              </div>
          </form>

          {/* Security Badge */}
          <div className="security-badge">
              <div className="badge-content">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z" fill="currentColor"/>
                  </svg>
                  <span>{t('booking.securityNotice', 'Your information is secure and encrypted')}</span>
              </div>
          </div>

          {/* Quick Contact Alternative */}
          <div className="quick-contact">
              <div className="divider">
                  <span>{t('booking.orContact', 'Or contact us directly')}</span>
              </div>
              <div className="contact-methods">
                  <a href="tel:+447404228217" className="contact-method">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z" fill="currentColor"/>
                      </svg>
                      <span>{t('booking.callUs', 'Call Us')}</span>
                  </a>
                  <a href="https://wa.me/447404228217" target="_blank" rel="noopener noreferrer" className="contact-method">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17.472 14.382C17.367 14.382 17.101 14.382 16.939 14.26C16.777 14.139 15.277 13.415 15.115 13.354C14.952 13.293 14.834 13.262 14.716 13.446C14.599 13.63 14.025 14.26 13.925 14.382C13.826 14.503 13.727 14.534 13.565 14.413C13.403 14.291 12.872 14.118 12.247 13.57C11.757 13.145 11.417 12.612 11.318 12.428C11.219 12.244 11.301 12.153 11.416 12.031C11.516 11.926 11.641 11.751 11.751 11.646C11.861 11.54 11.896 11.466 11.948 11.344C12.001 11.222 11.975 11.117 11.923 10.995C11.871 10.874 11.417 9.846 11.273 9.478C11.129 9.11 10.984 9.157 10.875 9.157C10.766 9.157 10.648 9.126 10.53 9.126C10.412 9.126 10.218 9.157 10.056 9.341C9.894 9.525 9.329 10.249 9.329 11.277C9.329 12.305 10.073 13.302 10.183 13.424C10.293 13.546 11.417 15.253 13.155 16.177C14.894 17.101 14.894 16.761 15.362 16.73C15.83 16.699 16.645 16.037 16.807 15.345C16.969 14.653 16.969 14.073 16.917 13.982C16.865 13.891 16.764 13.86 16.602 13.738C16.44 13.617 15.362 13.048 15.2 12.986C15.038 12.925 14.92 12.894 14.802 13.078C14.684 13.262 14.237 13.982 14.119 14.104C14.001 14.226 13.883 14.257 13.721 14.135C13.559 14.014 13.028 13.841 12.403 13.293C11.913 12.868 11.573 12.335 11.474 12.151C11.375 11.967 11.457 11.876 11.572 11.754C11.672 11.649 11.797 11.474 11.907 11.369C12.017 11.264 12.052 11.189 12.105 11.067C12.157 10.945 12.131 10.84 12.079 10.719C12.027 10.597 11.573 9.569 11.429 9.201C11.285 8.833 11.14 8.88 11.031 8.88C10.922 8.88 10.804 8.849 10.686 8.849C10.568 8.849 10.374 8.88 10.212 9.064C10.05 9.248 9.485 9.972 9.485 11C9.485 12.028 10.229 13.025 10.339 13.147C10.449 13.269 11.573 14.976 13.311 15.9C15.049 16.824 15.049 16.484 15.517 16.453C15.985 16.422 16.8 15.76 16.962 15.068C17.124 14.376 17.124 13.796 17.072 13.705C17.02 13.614 16.919 13.583 16.757 13.461" fill="currentColor"/>
                      </svg>
                      <span>{t('booking.whatsapp', 'WhatsApp')}</span>
                  </a>
                  <a href="mailto:eremovalsscot@gmail.com" className="contact-method">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor"/>
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
    isVisible: PropTypes.bool
};

export default BookingForm;