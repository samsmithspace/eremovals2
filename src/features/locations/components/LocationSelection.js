// src/features/locations/components/LocationSelection.js
import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import GoogleMapComponent from './GoogleMapComponent';
import { Button } from '../../../common/components/ui';
import routes from '../../../config/routes';
import '../../../styles/LocationSelection.css';
/**
 * Main location selection component for choosing pickup and destination locations
 */
const LocationSelection = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { lang } = useParams();
    const { t } = useTranslation();

    const [startLocation, setStartLocation] = useState(null);
    const [destinationLocation, setDestinationLocation] = useState(null);

    // Get location type from navigation state
    const locationType = location.state || {};

    const handleStartLocationSelected = (place) => {
        setStartLocation(place);
    };

    const handleDestinationLocationSelected = (place) => {
        setDestinationLocation(place);
    };

    const handleConfirm = () => {
        if (startLocation && destinationLocation) {
            navigate(routes.generate.quote(lang), {
                state: {
                    startLocation,
                    destinationLocation,
                    locationType
                }
            });
        }
    };

    const canProceed = startLocation && destinationLocation;

    return (
        <div className="location-selection">
            {/* Start Location Section */}
            <LocationSelectionSection
                title={t('moveFrom', 'Where are you moving from?')}
                onLocationSelected={handleStartLocationSelected}
                className="start-location-section"
            />

            {/* Destination Location Section - Animated entry */}
            <LocationSelectionSection
                title={t('moveTo', 'Where are you moving to?')}
                onLocationSelected={handleDestinationLocationSelected}
                className={`destination-location-section ${startLocation ? 'slide-up' : ''}`}
                isVisible={!!startLocation}
            />

            {/* Confirmation Button */}
            {canProceed && (
                <div className="confirmation-section">
                    <Button
                        onClick={handleConfirm}
                        variant="primary"
                        size="large"
                        className="confirm-button"
                    >
                        {t('confirmLocations', 'Confirm Locations')}
                    </Button>
                </div>
            )}
        </div>
    );
};

/**
 * Individual location selection section component
 */
const LocationSelectionSection = ({
                                      title,
                                      onLocationSelected,
                                      className = '',
                                      isVisible = true
                                  }) => {
    if (!isVisible) return null;

    return (
        <div className={`location-section ${className}`}>
            <h2 className="section-title">{title}</h2>
            <GoogleMapComponent onPlaceSelected={onLocationSelected} />
        </div>
    );
};

LocationSelectionSection.propTypes = {
    title: PropTypes.string.isRequired,
    onLocationSelected: PropTypes.func.isRequired,
    className: PropTypes.string,
    isVisible: PropTypes.bool
};

export default LocationSelection;