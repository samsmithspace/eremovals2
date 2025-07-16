// src/features/marketing/components/HeroSection.js - SEO Updated (Layout & Style Unchanged)
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FaPhone, FaCalculator, FaShieldAlt, FaStar, FaHeart } from 'react-icons/fa';
import { useScrollPosition } from 'common/hooks/useScrollPosition';
import './HeroSection.css';

const HeroSection = () => {
  const { lang } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [slideIn, setSlideIn] = useState(false);
  const scrollPosition = useScrollPosition();

  // Get current language - handle both /en routes and / root route
  const getCurrentLanguage = () => {
    // If lang from params exists, use it
    if (lang && ['en', 'zh'].includes(lang)) {
      return lang;
    }

    // If on root path, check current path
    if (location.pathname === '/') {
      return 'en'; // Default to English for root path
    }

    // Fallback to current i18n language or default to English
    return i18n.language || 'en';
  };

  const currentLang = getCurrentLanguage();

  useEffect(() => {
    const timer = setTimeout(() => setSlideIn(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Set language based on URL parameter
    if (lang && ['en', 'zh'].includes(lang)) {
      if (i18n.language !== lang) {
        i18n.changeLanguage(lang);
      }
    }
  }, [lang, i18n]);

  const handleServiceNavigation = (serviceType, locationType = null) => {
    console.log('Navigation triggered:', { serviceType, locationType, currentLang, currentPath: location.pathname });

    if (locationType) {
      // Navigate to location selection with proper language prefix
      const targetPath = `/${currentLang}/location`;
      console.log('Navigating to:', targetPath);

      navigate(targetPath, {
        state: { locationType: { locationType } }
      });
    } else {
      // Navigate to contact with proper language prefix
      const targetPath = `/${currentLang}/contact`;
      console.log('Navigating to:', targetPath);

      navigate(targetPath);
    }
  };

  const handleGetQuote = () => {
    const targetPath = `/${currentLang}/contact`;
    console.log('Get quote - navigating to:', targetPath);
    navigate(targetPath);
  };

  return (
    <div className="hero-container">
      {/* Fun floating shapes */}
      <div className="floating-shapes">
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
      </div>

      <div className="hero-section">
        <div className="hero-content">
          {/* Hero Header - H1 with SEO keywords */}
          <h1 className="main-heading">
            {t('marketing.heroTitle', 'Professional Removal Services Scotland | House Relocations')}
          </h1>

          <p className="hero-subtitle">
            {t('marketing.heroSubtitle', 'Expert house relocations, student moves, and comprehensive removal services throughout Edinburgh, Glasgow, and all of Scotland')}
          </p>

          <div className="services-container">
            {/* Main Moving Services - H2 with keywords */}
            <div className="service-group">
              <h2 className="service-heading">
                {t('marketing.movingServicesTitle', '🚛 Student Moves & House Relocations Scotland')}
              </h2>
              <div className="move-buttons-container">
                <button
                  className="btn2 st"
                  onClick={() => handleServiceNavigation('move', 'student')}
                >
                  <span className="service-emoji">🎓</span>
                  <div className="btn-text">
                    {t('common.studentMove', 'Student Moves')}
                  </div>
                  <div className="service-description">
                    {t('services.student.shortDesc', 'Quick, affordable moves for students and young professionals')}
                  </div>
                  <span className="service-price">
                    {t('services.student.price', 'From £50')}
                  </span>
                </button>

                <button
                  className="btn2 hm"
                  onClick={() => handleServiceNavigation('move', 'house')}
                >
                  <span className="service-emoji">🏠</span>
                  <div className="btn-text">
                    {t('common.homeMove', 'Home Moves')}
                  </div>
                  <div className="service-description">
                    {t('services.home.shortDesc', 'Full house relocations with care and professionalism')}
                  </div>
                  <span className="service-price">
                    {t('services.home.price', 'From £200')}
                  </span>
                </button>

                <button
                  className="btn2 sd"
                  onClick={() => handleServiceNavigation('courier')}
                >
                  <span className="service-emoji">⚡</span>
                  <div className="btn-text-cur">
                    {t('common.sameDayMove', 'Same Day')}
                  </div>
                  <div className="service-description">
                    {t('services.courier.shortDesc', 'Urgent delivery and small moves - fast & reliable')}
                  </div>
                  <span className="service-price">
                    {t('services.courier.price', 'From £60')}
                  </span>
                </button>
              </div>
            </div>

            {/* Additional Services - H2 with removal services keyword */}
            <div className="service-group additional">
              <h2 className="service-heading">
                {t('marketing.additionalServicesTitle', '✨ Complete Removal Services & Storage Solutions')}
              </h2>
              <div className="additional-services-container">
                <button
                  className="service-btn storage"
                  onClick={() => handleServiceNavigation('storage')}
                >
                  <span className="additional-emoji">📦</span>
                  <div className="service-name">
                    {t('common.storage', 'Storage')}
                  </div>
                  <div className="additional-service-desc">
                    {t('services.storage.shortDesc', 'Safe keeping for your stuff')}
                  </div>
                </button>

                <button
                  className="service-btn clearance"
                  onClick={() => handleServiceNavigation('clearance')}
                >
                  <span className="additional-emoji">♻️</span>
                  <div className="service-name">
                    {t('common.clearanceDisposal', 'Clearance')}
                  </div>
                  <div className="additional-service-desc">
                    {t('services.clearance.shortDesc', 'Eco-friendly disposal')}
                  </div>
                </button>

                <button
                  className="service-btn cleaning"
                  onClick={() => handleServiceNavigation('cleaning')}
                >
                  <span className="additional-emoji">✨</span>
                  <div className="service-name">
                    {t('common.cleaningService', 'Cleaning')}
                  </div>
                  <div className="additional-service-desc">
                    {t('services.cleaning.shortDesc', 'Sparkling clean spaces')}
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Call to Action - H2 with local SEO focus */}
          <div className="cta-section">
            <h2 className="cta-title">
              {t('marketing.ctaTitle', 'Get Your Free Scotland Removal Services Quote! 🚀')}
            </h2>
            <p className="cta-subtitle">
              {t('marketing.ctaSubtitle', 'Professional house relocations and student moves with transparent pricing - no hidden fees!')}
            </p>

            <div className="cta-buttons">
              <a
                href="tel:+447404228217"
                className="cta-btn cta-btn-primary"
                aria-label={t('common.callUs', 'Call us now')}
              >
                <FaPhone />
                {t('marketing.callNowCTA', 'Call Now!')}
              </a>
              <button
                onClick={handleGetQuote}
                className="cta-btn cta-btn-secondary"
                aria-label={t('marketing.getFreeQuote', 'Get free quote')}
              >
                <FaCalculator />
                {t('marketing.getQuoteCTA', 'Quick Quote')}
              </button>
            </div>

            <div className="trust-indicators">
              <div className="trust-item">
                <FaShieldAlt className="trust-icon" />
                <span>{t('footer.fullyInsured', 'Fully Insured')}</span>
              </div>
              <div className="trust-item">
                <FaStar className="trust-icon" />
                <span>{t('footer.ratedService', '5★ Rated')}</span>
              </div>
              <div className="trust-item">
                <FaHeart className="trust-icon" />
                <span>{t('marketing.happyMoves', '1000+ Happy Moves')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;