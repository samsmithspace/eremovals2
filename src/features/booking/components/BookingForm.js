// Updated BookingForm.js with Manager Inquiry Integration and Newsletter Toggle
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useBookingForm } from '../hooks/useBookingForm';
import { managerInquiryService } from '../services/managerInquiryService';
import './BookingForm.css';

const BookingForm = ({ bookingId, onSubmit, isVisible = true }) => {
    const { t } = useTranslation();
    const [inquiryStatus, setInquiryStatus] = useState({ sent: false, sending: false, error: null });

    const {
        formValues,
        errors,
        isSubmitting,
        isValid,
        handleChange,
        handleBlur,
        handleSubmit: originalHandleSubmit,
        setFormValues
    } = useBookingForm(bookingId, null); // We'll handle onSubmit ourselves

    // Initialize newsletter consent as true (default checked)
    React.useEffect(() => {
        setFormValues(prev => ({
            ...prev,
            newsletterConsent: true
        }));
    }, [setFormValues]);

    if (!isVisible) return null;

    const handleNewsletterToggle = (e) => {
        const checked = e.target.checked;
        setFormValues(prev => ({
            ...prev,
            newsletterConsent: checked
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form first
        if (!isValid) {
            console.log('Form is not valid, cannot submit');
            return;
        }

        try {
            // Set sending status
            setInquiryStatus({ sent: false, sending: true, error: null });

            console.log('BookingForm: Submitting with values:', formValues);

            // First, update the booking with contact info using the original logic
            await originalHandleSubmit(e);

            // Then send manager inquiry
            try {
                console.log('BookingForm: Sending manager inquiry...');

                // Validate customer data
                const validation = managerInquiryService.validateCustomerData(formValues);
                if (!validation.isValid) {
                    throw new Error(validation.errors.join(', '));
                }

                // Format customer data including newsletter consent
                const customerData = {
                    ...managerInquiryService.formatCustomerData(formValues),
                    newsletterConsent: formValues.newsletterConsent || false
                };

                // Send inquiry (we'll pass default prices for now, they'll be updated in QuoteActions)
                await managerInquiryService.sendCustomerInquiry(
                  customerData,
                  bookingId,
                  0, // Will be updated with actual prices in QuoteActions
                  0  // Will be updated with actual prices in QuoteActions
                );

                setInquiryStatus({ sent: true, sending: false, error: null });
                console.log('BookingForm: Manager inquiry sent successfully');

            } catch (inquiryError) {
                console.warn('BookingForm: Manager inquiry failed but continuing:', inquiryError);
                setInquiryStatus({ sent: false, sending: false, error: inquiryError.message });
                // Don't block the main flow - inquiry is supplementary
            }

            // Call the parent's onSubmit with form data including newsletter consent
            if (onSubmit) {
                onSubmit({
                    ...formValues,
                    newsletterConsent: formValues.newsletterConsent || false
                });
            }

        } catch (error) {
            console.error('BookingForm: Main submission error:', error);
            setInquiryStatus({ sent: false, sending: false, error: error.message });
        }
    };

    return (
      <div className="booking-form-clean">
          {/* Contact form intro */}
          <div className="contact-form-description">
              <span>📋</span>
              <span>
                    {t(
                      'contactDescription',
                      'Please provide your contact information for a personalized quote'
                    )}
                </span>
          </div>

          {/* Inquiry Status Display */}
          {inquiryStatus.sending && (
            <div className="inquiry-status sending" style={{
                background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
                border: '2px solid #3b82f6',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '1rem',
                color: '#1e40af',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
            }}>
                <div className="loading-spinner" style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '50%',
                    borderTopColor: '#3b82f6',
                    animation: 'spin 1s linear infinite'
                }}></div>
                <span>Notifying our team...</span>
            </div>
          )}

          {inquiryStatus.sent && (
            <div className="inquiry-status sent" style={{
                background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
                border: '2px solid #10b981',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '1rem',
                color: '#065f46',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
            }}>
                <span style={{ fontSize: '1.25rem' }}>✅</span>
                <span>Our team has been notified and will assist you!</span>
            </div>
          )}

          {inquiryStatus.error && (
            <div className="inquiry-status error" style={{
                background: 'linear-gradient(135deg, #fee2e2, #fecaca)',
                border: '2px solid #ef4444',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '1rem',
                color: '#991b1b',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
            }}>
                <span style={{ fontSize: '1.25rem' }}>⚠️</span>
                <div>
                    <div>Notification failed, but you can still continue</div>
                    <small style={{ opacity: 0.8 }}>Error: {inquiryStatus.error}</small>
                </div>
            </div>
          )}

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
                    disabled={isSubmitting || inquiryStatus.sending}
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
                    disabled={isSubmitting || inquiryStatus.sending}
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
                    disabled={isSubmitting || inquiryStatus.sending}
                    required
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              {/* Newsletter Consent Toggle */}
              <div className="form-group newsletter-consent-group">
                  <div className="newsletter-toggle-container">
                      <label className="newsletter-toggle" htmlFor="newsletterConsent">
                          <input
                            type="checkbox"
                            id="newsletterConsent"
                            name="newsletterConsent"
                            checked={formValues.newsletterConsent || false}
                            onChange={handleNewsletterToggle}
                            disabled={isSubmitting || inquiryStatus.sending}
                            className="newsletter-checkbox"
                          />
                          <span className="newsletter-toggle-slider"></span>
                          <div className="newsletter-content">
                              <span className="newsletter-title">
                                  {t('booking.newsletterTitle', 'Get Better Deals & Updates')}
                              </span>
                              <span className="newsletter-description">
                                  {t('booking.newsletterDescription', 'Receive exclusive discounts, moving tips, and special offers. Unsubscribe anytime.')}
                              </span>
                          </div>
                      </label>
                  </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!isValid || isSubmitting || inquiryStatus.sending}
                className="submit-button-clean"
              >
                  {(isSubmitting || inquiryStatus.sending) ? (
                    <>
                        <div className="loading-spinner"></div>
                        <span>{t('booking.submitting', 'Processing...')}</span>
                    </>
                  ) : (
                    <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                        <span>{t('booking.continueToPayment', 'Continue to Pricing')}</span>
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
                    {t('booking.securityNotice', 'Your information is secure and our team will assist you')}
                </span>
          </div>

          {/* Alternative Contact */}
          <div className="alternative-contact-clean">
              <h4>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20,15.5C18.8,15.5 17.5,15.3 16.4,14.9...Z" />
                  </svg>
                  {t('booking.orContact', 'Need Help? Contact Us Directly')}
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