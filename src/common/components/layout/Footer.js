// src/common/components/layout/Footer.js
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * Footer component for the application
 * Displays contact links, terms and social media icons
 */
const Footer = ({ socialIcons = [] }) => {
    const { lang } = useParams();
    const { t } = useTranslation();

    return (
        <footer className="footer">
            <div className="footer-content">
                <p>
                    <a href="mailto:eremovalsscot@gmail.com" style={{ textDecoration: 'none', color: 'inherit' }}>
                        {t('emailUs', 'Email Us')}
                    </a>
                    {' | '}
                    <a href="tel:+447404228217" style={{ textDecoration: 'none', color: 'inherit' }}>
                        {t('callUs', 'Call Us')}
                    </a>
                    {' | '}
                    <Link
                        to={`/${lang}/terms-and-conditions`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        {t('termsAndConditions', 'Terms and Conditions')}
                    </Link>
                </p>
                <div className="social-icons">
                    {socialIcons.map((icon, index) => (
                        <a
                            key={index}
                            href={icon.url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img src={icon.image} alt={icon.name} />
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
};

export default Footer;