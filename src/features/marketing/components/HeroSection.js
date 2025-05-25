// src/features/marketing/components/HeroSection.js
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPhone } from 'react-icons/fa';
import { useScrollPosition } from '../../../common/hooks/useScrollPosition';
import './HeroSection.css';

// Import hero images
import studentMoveImg from '../../../assets/images/bt21.png';
import homeMoveImg from '../../../assets/images/btn3.png';
import courierImg from '../../../assets/images/courier.png';
import slidingImage from '../../../assets/images/vanb.png';
import shelfImage from '../../../assets/images/shelf.png';

// Service images
import binImg from '../../../assets/images/disp.png';
import cleanImg from '../../../assets/images/clean.png';
import storageImg from '../../../assets/images/shelfwithbox.png';

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

  return (
    <div className="hero-container">
      {/* Header */}
      <header className={`header ${scrollPosition > 0 ? 'scrolled' : ''}`}>
        <div className="container d-flex align-items-center justify-content-between">
          <div className="header-left d-flex align-items-center">
            <h1 className="site-title">{t('common.siteTitle', 'Eremovals')}</h1>
          </div>
          <div className="header-right d-flex align-items-center">
            <a href="tel:07404228217" className="phone-link">
              <FaPhone className="phone-icon" />
            </a>
            <select
              value={i18n.language}
              onChange={(e) => {
                const newLang = e.target.value;
                i18n.changeLanguage(newLang);
                // Update URL to reflect language change
                const currentPath = window.location.pathname;
                const newPath = currentPath.replace(`/${lang}`, `/${newLang}`);
                navigate(newPath);
              }}
              className="lang-select"
            >
              <option value="en">English</option>
              <option value="zh">中文</option>
            </select>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="hero-section d-flex align-items-center justify-content-center">
        <div className="content-card">
          <div className="hero-content text-white">
            <h2 className="main-heading">
              {t('marketing.heroHeading', 'Move at Ease, Move with Confidence')}
            </h2>

            <div className="services-container">
              {/* Moving Services */}
              <div className="service-group">
                <h3 className="service-heading">
                  {t('marketing.movingServices', 'Moving Services')}
                </h3>
                <div className="move-buttons-container">
                  <button
                    className="btn2 st"
                    onClick={() => handleServiceNavigation('move', 'student')}
                  >
                                        <span className="btn-text">
                                            {t('common.studentMove', 'Student Move')}
                                        </span>
                    <img
                      src={studentMoveImg}
                      alt="Student move"
                      className="btn2-img"
                      width="420"
                      height="auto"
                      loading="lazy"
                    />
                  </button>

                  <button
                    className="btn2 hm"
                    onClick={() => handleServiceNavigation('move', 'house')}
                  >
                                        <span className="btn-text">
                                            {t('common.homeMove', 'Home Move')}
                                        </span>
                    <img
                      src={homeMoveImg}
                      alt="Home move"
                      className="btn3-img"
                      width="340"
                      height="auto"
                      loading="lazy"
                    />
                  </button>

                  <button
                    className="btn2 sd"
                    onClick={() => handleServiceNavigation('courier')}
                  >
                                        <span className="btn-text-cur">
                                            {t('common.sameDayMove', 'Same Day Move')}
                                        </span>
                    <img
                      src={courierImg}
                      alt="Same day move"
                      className="btn4-img"
                      width="220"
                      height="auto"
                      loading="lazy"
                    />
                  </button>
                </div>
              </div>

              {/* Additional Services */}
              <div className="service-group additional">
                <h3 className="service-heading">
                  {t('marketing.additionalServices', 'Additional Services')}
                </h3>
                <div className="additional-services-container">
                  <button
                    className="service-btn storage"
                    onClick={() => handleServiceNavigation('storage')}
                  >
                    <img
                      src={storageImg}
                      alt="Storage"
                      className="button-bg-image-store"
                    />
                    <span className="service-name">
                                            {t('common.storage', 'Storage')}
                                        </span>
                  </button>

                  <button
                    className="service-btn clearance"
                    onClick={() => handleServiceNavigation('clearance')}
                  >
                    <img
                      src={binImg}
                      alt="Clearance"
                      className="button-bg-image-width"
                    />
                    <span className="service-name">
                                            {t('common.clearanceDisposal', 'Clearance & Disposal')}
                                        </span>
                  </button>

                  <button
                    className="service-btn cleaning"
                    onClick={() => handleServiceNavigation('cleaning')}
                  >
                    <img
                      src={cleanImg}
                      alt="Cleaning"
                      className="button-bg-image"
                    />
                    <span className="service-name">
                                            {t('common.cleaningService', 'Cleaning Service')}
                                        </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Background Images */}
      <div className="static-images-container">
        <div className="static-image left-image">
          <img
            src={shelfImage}
            alt="Storage shelf"
            className={`animate-image from-left ${slideIn ? 'visible' : ''}`}
            width="600"
            height="auto"
            loading="lazy"
          />
        </div>
        <div className="static-image right-image">
          <img
            src={slidingImage}
            alt="Moving van"
            className={`animate-image from-right ${slideIn ? 'visible' : ''}`}
            width="600"
            height="auto"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;