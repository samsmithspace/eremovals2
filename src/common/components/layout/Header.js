// src/common/components/layout/Header.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaPhone } from 'react-icons/fa';

/**
 * Header component for the application
 * Displays site title, phone link and language selector
 */
const Header = () => {
    const { lang } = useParams();
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [scrollPosition, setScrollPosition] = useState(0);

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
    };

    return (
      <header className={`header ${scrollPosition > 0 ? 'scrolled' : ''}`}>
          <div className="container d-flex align-items-center justify-content-between">
              <div className="header-left d-flex align-items-center">
                  <Link to={`/${lang || 'en'}`} className="site-title">
                      {t('common.siteTitle', 'Eremovals')}
                  </Link>
              </div>
              <div className="header-right d-flex align-items-center">
                  <a href="tel:07404228217" className="phone-link">
                      <FaPhone className="phone-icon" />
                  </a>
                  <select
                    value={i18n.language || 'en'}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="lang-select"
                  >
                      <option value="en">English</option>
                      <option value="zh">中文</option>
                  </select>
              </div>
          </div>
      </header>
    );
};

export default Header;