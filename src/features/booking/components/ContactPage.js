// ContactPage.js - Professional Layout
import React from 'react';
import { useTranslation } from 'react-i18next';
import './ContactPage.css';

const ContactPage = () => {
  const { t } = useTranslation();

  const getTranslation = (key, fallback) => {
    try {
      const translation = t(key);
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
        <div className="contact-content">
          {/* Header Section */}
          <div className="contact-header">
            <h1 className="contact-title">
              {getTranslation('contact.title', 'Get in Touch')}
            </h1>
            <p className="contact-subtitle">
              {getTranslation(
                'contact.subtitle',
                'We\'re here to help. Choose your preferred method of communication.'
              )}
            </p>
          </div>

          {/* Contact Cards Grid */}
          <div className="contact-grid">
            {/* Phone Card */}
            <a href="tel:07404228217" className="contact-card phone-card">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <div className="card-content">
                <h3 className="card-title">
                  {getTranslation('contact.phone.label', 'Phone')}
                </h3>
                <p className="card-info">
                  {getTranslation('contact.phone.number', '07404 228217')}
                </p>
                <span className="card-action">
                  {getTranslation('contact.phone.action', 'Call now')} →
                </span>
              </div>
            </a>

            {/* WhatsApp Card */}
            <a
              href="https://wa.me/447404228217"
              className="contact-card whatsapp-card"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              </div>
              <div className="card-content">
                <h3 className="card-title">
                  {getTranslation('contact.whatsapp.label', 'WhatsApp')}
                </h3>
                <p className="card-info">
                  {getTranslation('contact.whatsapp.text', 'Quick response')}
                </p>
                <span className="card-action">
                  {getTranslation('contact.whatsapp.action', 'Start chat')} →
                </span>
              </div>
            </a>

            {/* Email Card */}
            <a href="mailto:eremovalsscot@gmail.com" className="contact-card email-card">
              <div className="card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <div className="card-content">
                <h3 className="card-title">
                  {getTranslation('contact.email.label', 'Email')}
                </h3>
                <p className="card-info">
                  {getTranslation('contact.email.address', 'eremovalsscot@gmail.com')}
                </p>
                <span className="card-action">
                  {getTranslation('contact.email.action', 'Send email')} →
                </span>
              </div>
            </a>
          </div>

          {/* Additional Info */}
          <div className="contact-footer">
            <div className="availability-badge">
              <span className="availability-dot"></span>
              {getTranslation('contact.availability', 'Available Mon-Sat, 8AM-8PM')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;


