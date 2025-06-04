// src/features/marketing/components/HeroSection.js
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPhone, FaCalculator, FaShieldAlt, FaStar, FaHeart } from 'react-icons/fa';
import { useScrollPosition } from 'common/hooks/useScrollPosition';
import './HeroSection.css';

const HeroSection = () => {
  const { lang } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [slideIn, setSlideIn] = useState(false);
  const scrollPosition = useScrollPosition();

  useEffect(() => {
    const timer = setTimeout(() => setSlideIn(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Set language based on URL parameter
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  const handleServiceNavigation = (serviceType, locationType = null) => {
    if (locationType) {
      navigate(`/${lang}/location`, {
        state: { locationType: { locationType } }
      });
    } else {
      navigate(`/${lang}/contact`);
    }
  };

  const handleGetQuote = () => {
    navigate(`/${lang}/contact`);
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
          {/* Hero Header */}
          <h1 className="main-heading">
            {t('marketing.heroTitle', 'Moving Made Easy & Fun! 🚚')}
          </h1>

          <p className="hero-subtitle">
            {t('marketing.heroSubtitle', 'From student digs to dream homes - we\'ve got your back with affordable, reliable moving services across Scotland!')}
          </p>

          <div className="services-container">
            {/* Main Moving Services */}
            <div className="service-group">
              <h2 className="service-heading">
                {t('common.movingServices', '🚛 Moving Services')}
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

            {/* Additional Services */}
            <div className="service-group additional">
              <h2 className="service-heading">
                {t('common.additionalServices', '✨ Extra Services')}
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

          {/* Call to Action */}
          <div className="cta-section">
            <h2 className="cta-title">
              {t('marketing.ctaTitle', 'Ready to Move? Let\'s Go! 🚀')}
            </h2>
            <p className="cta-subtitle">
              {t('marketing.ctaSubtitle', 'Get your free quote in seconds - no hidden fees, just honest pricing!')}
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