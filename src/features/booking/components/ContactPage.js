// Fixed ContactPage.js - Resolving object rendering error
import React from 'react';
import { useTranslation } from 'react-i18next';
import './ContactPage.css';

const ContactPage = () => {
  const { t } = useTranslation();

  // FIXED: Access translations safely with fallback strings to prevent object rendering
  const getTranslation = (key, fallback) => {
    try {
      const translation = t(key);
      // If translation returns an object or undefined, use fallback
      if (typeof translation === 'object' || translation === key || !translation) {
        return fallback;
      }
      return translation;
    } catch (error) {
      console.warn(`Translation error for key ${key}:`, error);
      return fallback;
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-card">
          {/* Header */}
          <div className="contact-header">
            <h1>{getTranslation('contact.title', 'Contact Us')}</h1>
            <div className="header-line"></div>
          </div>

          {/* Main Message */}
          <div className="contact-message">
            <p>
              {getTranslation(
                'contact.subtitle',
                'Ready to get started? Contact us through phone or WhatsApp to tailor our services to your specific needs.'
              )}
            </p>
          </div>

          {/* Contact Options */}
          <div className="contact-options">
            {/* Phone */}
            <div className="contact-option phone-option">
              <div className="contact-icon">📞</div>
              <div className="contact-details">
                <p className="contact-label">
                  {getTranslation('contact.phone.label', 'Call us directly')}
                </p>
                <a href="tel:07404228217" className="contact-link phone-link">
                  {getTranslation('contact.phone.number', '07404 228217')}
                </a>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="contact-option whatsapp-option">
              <div className="contact-icon">💬</div>
              <div className="contact-details">
                <p className="contact-label">
                  {getTranslation('contact.whatsapp.label', 'Message us on WhatsApp')}
                </p>
                <a
                  href="https://wa.me/447404228217"
                  className="contact-link whatsapp-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {getTranslation('contact.whatsapp.text', 'WhatsApp Chat')}
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="contact-option email-option">
              <div className="contact-icon">✉️</div>
              <div className="contact-details">
                <p className="contact-label">
                  {getTranslation('contact.email.label', 'Send us an email')}
                </p>
                <a href="mailto:eremovalsscot@gmail.com" className="contact-link email-link">
                  {getTranslation('contact.email.address', 'eremovalsscot@gmail.com')}
                </a>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="contact-cta">
            <div className="cta-badge">
              <span className="cta-icon">💬</span>
              {getTranslation(
                'contact.cta.message',
                'We\'re here to help tailor our services for you'
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;