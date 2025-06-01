// src/common/components/layout/Header.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaPhone, FaGlobe } from 'react-icons/fa';
import './Header.css';

/**
 * Header component for the application
 * Displays site title, professional call button and language selector
 */
const Header = () => {
    const { lang } = useParams();
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [scrollPosition, setScrollPosition] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleScroll = () => {
        const position = window.pageYOffset;
        setScrollPosition(position);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleLanguageChange = (newLang) => {
        // Change the language in i18n
        i18n.changeLanguage(newLang);

        // Update the URL to reflect the language change
        const currentPath = window.location.pathname;
        const pathWithoutLang = currentPath.replace(`/${lang}`, '');
        const newPath = `/${newLang}${pathWithoutLang}`;

        navigate(newPath, { replace: true });
        setIsMenuOpen(false);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
      <header className={`header ${scrollPosition > 50 ? 'header-scrolled' : ''}`}>
          <div className="header-container">
              <div className="header-left">
                  <Link to={`/${lang || 'en'}`} className="header-logo">
                        <span className="logo-text">
                            {t('common.siteTitle', 'Eremovals')}
                        </span>
                      <span className="logo-tagline">
                            {t('common.tagline', 'Professional Removal Services')}
                        </span>
                  </Link>
              </div>

              <div className="header-right">
                  {/* Professional Call Button */}
                  <a
                    href="tel:+447404228217"
                    className="call-button"
                    aria-label={t('common.callUs', 'Call us now')}
                  >
                      <div className="call-button-icon">
                          <FaPhone />
                      </div>
                      <div className="call-button-content">
                            <span className="call-button-text">
                                {t('common.callNow', 'Call Now')}
                            </span>
                          <span className="call-button-number">
                                07404 228217
                            </span>
                      </div>
                  </a>

                  {/* Language Selector */}
                  <div className="language-selector">
                      <button
                        className="language-toggle"
                        onClick={toggleMenu}
                        aria-label={t('common.selectLanguage', 'Select language')}
                        aria-expanded={isMenuOpen}
                      >
                          <FaGlobe className="language-icon" />
                          <span className="language-current">
                                {i18n.language === 'zh' ? '中文' : 'EN'}
                            </span>
                      </button>

                      {isMenuOpen && (
                        <div className="language-dropdown">
                            <button
                              className={`language-option ${i18n.language === 'en' ? 'active' : ''}`}
                              onClick={() => handleLanguageChange('en')}
                            >
                                <span className="language-flag">🇬🇧</span>
                                English
                            </button>
                            <button
                              className={`language-option ${i18n.language === 'zh' ? 'active' : ''}`}
                              onClick={() => handleLanguageChange('zh')}
                            >
                                <span className="language-flag">🇨🇳</span>
                                中文
                            </button>
                        </div>
                      )}
                  </div>
              </div>
          </div>
      </header>
    );
};

export default Header;