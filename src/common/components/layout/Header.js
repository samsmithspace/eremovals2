// src/common/components/layout/Header.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaPhone } from 'react-icons/fa';

/**
 * Header component for the application
 * Displays site title, phone link and language selector
 */
const Header = () => {
    const { lang } = useParams();
    const { t, i18n } = useTranslation();
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

    const handleLanguageChange = (e) => {
        i18n.changeLanguage(e.target.value);
    };

    return (
        <header className={`header ${scrollPosition > 0 ? 'scrolled' : ''}`}>
            <div className="container d-flex align-items-center justify-content-between">
                <div className="header-left d-flex align-items-center">
                    <Link to={`/${lang}`} className="site-title">
                        {t('siteTitle')}
                    </Link>
                </div>
                <div className="header-right d-flex align-items-center">
                    <a href="tel:07404228217" className="phone-link">
                        <FaPhone className="phone-icon" />
                    </a>
                    <select
                        value={i18n.language}
                        onChange={handleLanguageChange}
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