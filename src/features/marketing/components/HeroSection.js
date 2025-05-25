// src/features/marketing/components/HeroSection.js
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button } from '../../../common/components/ui';
import { useScrollPosition } from '../../../common/hooks/useScrollPosition';
import routes from '../../../config/routes';
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

/**
 * Hero section component with service selection and animations
 */
const HeroSection = () => {
    const { lang } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [slideIn, setSlideIn] = useState(false);
    const scrollPosition = useScrollPosition();

    useEffect(() => {
        const timer = setTimeout(() => setSlideIn(true), 500);
        return () => clearTimeout(timer);
    }, []);

    const handleServiceNavigation = (serviceType, locationType = null) => {
        if (locationType) {
            navigate(routes.generate.location(lang), {
                state: { locationType: { locationType } }
            });
        } else {
            navigate(routes.generate.contact(lang));
        }
    };

    return (
        <div className="hero-container">
            {/* Hero Section */}
            <div className="hero-section d-flex align-items-center justify-content-center">
                <div className="content-card">
                    <div className="hero-content text-white">
                        <h2 className="main-heading">{t('heroHeading')}</h2>

                        <div className="services-container">
                            {/* Moving Services */}
                            <ServiceGroup
                                title={t('movingServices', 'Moving Services')}
                                services={[
                                    {
                                        key: 'student',
                                        label: t('studentMove'),
                                        image: studentMoveImg,
                                        onClick: () => handleServiceNavigation('move', 'student'),
                                        className: 'btn2 st'
                                    },
                                    {
                                        key: 'home',
                                        label: t('homeMove'),
                                        image: homeMoveImg,
                                        onClick: () => handleServiceNavigation('move', 'house'),
                                        className: 'btn2 hm'
                                    },
                                    {
                                        key: 'courier',
                                        label: t('sameDayMove'),
                                        image: courierImg,
                                        onClick: () => handleServiceNavigation('courier'),
                                        className: 'btn2 sd'
                                    }
                                ]}
                            />

                            {/* Additional Services */}
                            <ServiceGroup
                                title={t('additionalServices', 'Additional Services')}
                                services={[
                                    {
                                        key: 'storage',
                                        label: t('storage', 'Storage'),
                                        image: storageImg,
                                        onClick: () => handleServiceNavigation('storage'),
                                        isAdditional: true
                                    },
                                    {
                                        key: 'clearance',
                                        label: t('clearanceDisposal', 'Clearance & Disposal'),
                                        image: binImg,
                                        onClick: () => handleServiceNavigation('clearance'),
                                        isAdditional: true
                                    },
                                    {
                                        key: 'cleaning',
                                        label: t('cleaningService', 'Cleaning Service'),
                                        image: cleanImg,
                                        onClick: () => handleServiceNavigation('cleaning'),
                                        isAdditional: true
                                    }
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Animated Background Images */}
            <AnimatedImages slideIn={slideIn} />
        </div>
    );
};

/**
 * Service group component for organizing related services
 */
const ServiceGroup = ({ title, services }) => {
    return (
        <div className="service-group">
            <h3 className="service-heading">{title}</h3>
            <div className={services[0]?.isAdditional ? 'additional-services-container' : 'move-buttons-container'}>
                {services.map((service) => (
                    <ServiceButton key={service.key} {...service} />
                ))}
            </div>
        </div>
    );
};

/**
 * Individual service button component
 */
const ServiceButton = ({
                           label,
                           image,
                           onClick,
                           className,
                           isAdditional = false
                       }) => {
    const baseClass = isAdditional ? 'service-btn' : className;

    return (
        <button className={baseClass} onClick={onClick}>
      <span className={isAdditional ? 'service-name' : 'btn-text'}>
        {label}
      </span>
            <img
                src={image}
                alt={label}
                className={getImageClassName(isAdditional, image)}
                width={getImageWidth(isAdditional)}
                height="auto"
                loading="lazy"
            />
        </button>
    );
};

/**
 * Animated background images component
 */
const AnimatedImages = ({ slideIn }) => {
    return (
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
    );
};

// Helper functions
const getImageClassName = (isAdditional, image) => {
    if (!isAdditional) {
        if (image.includes('btn3')) return 'btn3-img';
        if (image.includes('courier')) return 'btn4-img';
        return 'btn2-img';
    }

    if (image.includes('shelfwithbox')) return 'button-bg-image-store';
    if (image.includes('disp')) return 'button-bg-image-width';
    return 'button-bg-image';
};

const getImageWidth = (isAdditional) => {
    return isAdditional ? undefined : "420";
};

// PropTypes
ServiceGroup.propTypes = {
    title: PropTypes.string.isRequired,
    services: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired,
        className: PropTypes.string,
        isAdditional: PropTypes.bool
    })).isRequired
};

ServiceButton.propTypes = {
    label: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string,
    isAdditional: PropTypes.bool
};

AnimatedImages.propTypes = {
    slideIn: PropTypes.bool.isRequired
};

export default HeroSection;