import React from 'react';
import { useTranslation } from 'react-i18next';
import './ContactPage.css';

const ContactPage = () => {
  const { t } = useTranslation();

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-card">
          {/* Header */}
          <div className="contact-header">
            <h1>{t('contact', 'Contact Us')}</h1>
            <div className="header-line"></div>
          </div>

          {/* Main Message */}
          <div className="contact-message">
            <p>
              Ready to get started? Contact us through phone or WhatsApp to tailor our services to your specific needs.
            </p>
          </div>

          {/* Contact Options */}
          <div className="contact-options">
            {/* Phone */}
            <div className="contact-option phone-option">
              <div className="contact-icon">📞</div>
              <div className="contact-details">
                <p className="contact-label">Call us directly</p>
                <a href="tel:07404228217" className="contact-link phone-link">
                  07404 228217
                </a>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="contact-option whatsapp-option">
              <div className="contact-icon">💬</div>
              <div className="contact-details">
                <p className="contact-label">Message us on WhatsApp</p>
                <a
                  href="https://wa.me/447404228217"
                  className="contact-link whatsapp-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp Chat
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="contact-option email-option">
              <div className="contact-icon">✉️</div>
              <div className="contact-details">
                <p className="contact-label">Send us an email</p>
                <a href="mailto:eremovalsscot@gmail.com" className="contact-link email-link">
                  eremovalsscot@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="contact-cta">
            <div className="cta-badge">
              <span className="cta-icon">💬</span>
              We're here to help tailor our services for you
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;