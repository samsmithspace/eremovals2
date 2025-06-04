import React from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import PropTypes from 'prop-types';

// Import default social icons
import xLogo from 'assets/images/xlogo.svg';
import waLogo from 'assets/images/Digital_Glyph_Green.svg';
import igLogo from 'assets/images/Instagram_Glyph_White.svg';

/**
 * AppLayout component to provide consistent layout across the application
 * Wraps children components with Header and Footer
 */
const AppLayout = ({ children }) => {
    const { lang } = useParams();

    // Default social icons
    const socialIcons = [
        {
            name: 'X',
            image: xLogo,
            url: 'https://x.com/yourprofile'
        },
        {
            name: 'Instagram',
            image: igLogo,
            url: 'https://instagram.com/yourprofile'
        },
        {
            name: 'WhatsApp',
            image: waLogo,
            url: 'https://wa.me/447404228217'
        }
    ];

    return (
        <div className="app-container">
            <Header />
            <main className="main-content">
                {children}
            </main>
            <Footer socialIcons={socialIcons} />
        </div>
    );
};

AppLayout.propTypes = {
    children: PropTypes.node.isRequired
};

export default AppLayout;