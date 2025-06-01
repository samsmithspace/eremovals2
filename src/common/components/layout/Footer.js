// src/common/components/layout/Footer.js
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    FaPhone,
    FaEnvelope,
    FaMapMarkerAlt,
    FaClock,
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaWhatsapp,
    FaArrowRight,
    FaCheckCircle,
    FaShieldAlt,
    FaStar,
    FaTruck
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import './Footer.css';

/**
 * Enhanced Footer component for the application
 * Professional layout with company info, services, and contact details
 */
const Footer = ({ socialIcons = [] }) => {
    const { lang } = useParams();
    const { t } = useTranslation();
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [newsletterStatus, setNewsletterStatus] = useState(''); // 'loading', 'success', 'error'

    const handleNewsletterSubmit = async (e) => {
        e.preventDefault();
        if (!newsletterEmail) return;

        setNewsletterStatus('loading');

        // Simulate API call - replace with actual newsletter subscription logic
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setNewsletterStatus('success');
            setNewsletterEmail('');
            setTimeout(() => setNewsletterStatus(''), 3000);
        } catch (error) {
            setNewsletterStatus('error');
            setTimeout(() => setNewsletterStatus(''), 3000);
        }
    };

    const currentYear = new Date().getFullYear();

    // Enhanced social icons with more platforms
    const enhancedSocialIcons = [
        {
            name: 'WhatsApp',
            icon: FaWhatsapp,
            url: 'https://wa.me/447404228217',
            color: '#25d366'
        },
        {
            name: 'Facebook',
            icon: FaFacebookF,
            url: 'https://facebook.com/eremovals',
            color: '#1877f2'
        },
        {
            name: 'Instagram',
            icon: FaInstagram,
            url: 'https://instagram.com/eremovals',
            color: '#e4405f'
        },
        {
            name: 'LinkedIn',
            icon: FaLinkedinIn,
            url: 'https://linkedin.com/company/eremovals',
            color: '#0077b5'
        },
        {
            name: 'X',
            icon: FaXTwitter,
            url: 'https://x.com/eremovals',
            color: '#000000'
        }
    ];

    const serviceLinks = [
        { key: 'domesticRemovals', path: '/services/domestic' },
        { key: 'officeRemovals', path: '/services/office' },
        { key: 'packingServices', path: '/services/packing' },
        { key: 'storage', path: '/services/storage' },
        { key: 'internationalRemovals', path: '/services/international' }
    ];

    const companyLinks = [
        { key: 'about', path: '/about' },
        { key: 'testimonials', path: '/testimonials' },
        { key: 'faq', path: '/faq' },
        { key: 'blog', path: '/blog' },
        { key: 'careers', path: '/careers' }
    ];

    return (
      <footer className="footer">
          {/* Main Footer Content */}
          <div className="footer-main">
              <div className="footer-container">
                  {/* Company Info Section */}
                  <div className="footer-section footer-company">
                      <div className="footer-logo">
                          <h3 className="footer-logo-text">
                              {t('common.siteTitle', 'Eremovals')}
                          </h3>
                          <p className="footer-logo-tagline">
                              {t('common.tagline', 'Professional Removal Services')}
                          </p>
                      </div>

                      <p className="footer-company-description">
                          {t('footer.companyDescription', 'Your trusted removal partner in Scotland. We provide professional, reliable, and affordable moving services for homes and businesses across the UK.')}
                      </p>

                      {/* Trust Indicators */}
                      <div className="footer-trust-indicators">
                          <div className="trust-item">
                              <FaShieldAlt className="trust-icon" />
                              <span>{t('footer.fullyInsured', 'Fully Insured')}</span>
                          </div>
                          <div className="trust-item">
                              <FaStar className="trust-icon" />
                              <span>{t('footer.ratedService', '5-Star Rated')}</span>
                          </div>
                          <div className="trust-item">
                              <FaTruck className="trust-icon" />
                              <span>{t('footer.professionalTeam', 'Professional Team')}</span>
                          </div>
                      </div>

                      {/* Social Media */}
                      <div className="footer-social">
                          <h4 className="footer-social-title">
                              {t('footer.followUs', 'Follow Us')}
                          </h4>
                          <div className="social-links">
                              {enhancedSocialIcons.map((social, index) => {
                                  const IconComponent = social.icon;
                                  return (
                                    <a
                                      key={index}
                                      href={social.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="social-link"
                                      style={{ '--social-color': social.color }}
                                      aria-label={`Follow us on ${social.name}`}
                                    >
                                        <IconComponent />
                                    </a>
                                  );
                              })}
                          </div>
                      </div>
                  </div>

                  {/* Services Section */}
                  <div className="footer-section">
                      <h4 className="footer-section-title">
                          {t('footer.services', 'Our Services')}
                      </h4>
                      <ul className="footer-links">
                          {serviceLinks.map((link) => (
                            <li key={link.key}>
                                <Link
                                  to={`/${lang}${link.path}`}
                                  className="footer-link"
                                >
                                    <FaArrowRight className="link-icon" />
                                    {t(`services.${link.key}.title`, link.key)}
                                </Link>
                            </li>
                          ))}
                      </ul>
                  </div>

                  {/* Company Links Section */}
                  <div className="footer-section">
                      <h4 className="footer-section-title">
                          {t('footer.company', 'Company')}
                      </h4>
                      <ul className="footer-links">
                          {companyLinks.map((link) => (
                            <li key={link.key}>
                                <Link
                                  to={`/${lang}${link.path}`}
                                  className="footer-link"
                                >
                                    <FaArrowRight className="link-icon" />
                                    {t(`navigation.${link.key}`, link.key)}
                                </Link>
                            </li>
                          ))}
                      </ul>
                  </div>

                  {/* Contact Info Section */}
                  <div className="footer-section">
                      <h4 className="footer-section-title">
                          {t('footer.contactInfo', 'Contact Information')}
                      </h4>

                      <div className="footer-contact">
                          <div className="contact-item">
                              <FaPhone className="contact-icon" />
                              <div className="contact-content">
                                    <span className="contact-label">
                                        {t('contact.phone', 'Phone')}
                                    </span>
                                  <a href="tel:+447404228217" className="contact-value">
                                      07404 228217
                                  </a>
                              </div>
                          </div>

                          <div className="contact-item">
                              <FaEnvelope className="contact-icon" />
                              <div className="contact-content">
                                    <span className="contact-label">
                                        {t('contact.email', 'Email')}
                                    </span>
                                  <a href="mailto:eremovalsscot@gmail.com" className="contact-value">
                                      eremovalsscot@gmail.com
                                  </a>
                              </div>
                          </div>

                          <div className="contact-item">
                              <FaMapMarkerAlt className="contact-icon" />
                              <div className="contact-content">
                                    <span className="contact-label">
                                        {t('contact.serviceArea', 'Service Area')}
                                    </span>
                                  <span className="contact-value">
                                        {t('footer.serviceArea', 'Scotland & UK Wide')}
                                    </span>
                              </div>
                          </div>

                          <div className="contact-item">
                              <FaClock className="contact-icon" />
                              <div className="contact-content">
                                    <span className="contact-label">
                                        {t('contact.hours', 'Opening Hours')}
                                    </span>
                                  <div className="contact-hours">
                                      <div>{t('contact.mondayToFriday', 'Mon-Fri: 8:00 AM - 6:00 PM')}</div>
                                      <div>{t('contact.saturday', 'Sat: 9:00 AM - 4:00 PM')}</div>
                                      <div className="emergency-service">
                                          {t('contact.emergencyService', '24/7 Emergency Service')}
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Newsletter Section */}
                  <div className="footer-section footer-newsletter">
                      <h4 className="footer-section-title">
                          {t('footer.newsletter.title', 'Stay Updated')}
                      </h4>
                      <p className="newsletter-description">
                          {t('footer.newsletter.description', 'Get moving tips, special offers, and company updates delivered to your inbox.')}
                      </p>

                      <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
                          <div className="newsletter-input-group">
                              <input
                                type="email"
                                className="newsletter-input"
                                placeholder={t('footer.newsletter.placeholder', 'Enter your email address')}
                                value={newsletterEmail}
                                onChange={(e) => setNewsletterEmail(e.target.value)}
                                required
                                disabled={newsletterStatus === 'loading'}
                              />
                              <button
                                type="submit"
                                className={`newsletter-button ${newsletterStatus}`}
                                disabled={newsletterStatus === 'loading' || !newsletterEmail}
                              >
                                  {newsletterStatus === 'loading' ? (
                                    <div className="button-spinner"></div>
                                  ) : newsletterStatus === 'success' ? (
                                    <FaCheckCircle />
                                  ) : (
                                    <FaArrowRight />
                                  )}
                              </button>
                          </div>

                          {newsletterStatus === 'success' && (
                            <p className="newsletter-success">
                                {t('footer.newsletter.success', 'Thank you for subscribing!')}
                            </p>
                          )}

                          {newsletterStatus === 'error' && (
                            <p className="newsletter-error">
                                {t('footer.newsletter.error', 'Please enter a valid email address')}
                            </p>
                          )}
                      </form>
                  </div>
              </div>
          </div>

          {/* Footer Bottom */}
          <div className="footer-bottom">
              <div className="footer-container">
                  <div className="footer-bottom-content">
                      <div className="footer-copyright">
                          <p>
                              © {currentYear} {t('common.siteTitle', 'Eremovals')}. {t('footer.copyright', 'All rights reserved.')}
                          </p>
                      </div>

                      <div className="footer-legal-links">
                          <Link
                            to={`/${lang}/terms-and-conditions`}
                            className="legal-link"
                          >
                              {t('footer.termsAndConditions', 'Terms and Conditions')}
                          </Link>
                          <Link
                            to={`/${lang}/privacy-policy`}
                            className="legal-link"
                          >
                              {t('footer.privacyPolicy', 'Privacy Policy')}
                          </Link>
                          <Link
                            to={`/${lang}/cookie-policy`}
                            className="legal-link"
                          >
                              {t('footer.cookiePolicy', 'Cookie Policy')}
                          </Link>
                      </div>
                  </div>
              </div>
          </div>
      </footer>
    );
};

export default Footer;