// src/features/locations/components/LocationSummary.js
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import routes from '../../../config/routes';
// In src/features/locations/components/LocationSummary.js
import './LocationSummary.css'; // Add this import at the top
/**
 * Component to display selected locations with edit functionality
 * @param {Object} props
 * @param {string} props.startLocation - Pickup location address
 * @param {string} props.destinationLocation - Destination address
 * @param {Function} props.onEdit - Optional custom edit handler
 */
const LocationSummary = ({
                             startLocation,
                             destinationLocation,
                             onEdit
                         }) => {
    const navigate = useNavigate();
    const { lang } = useParams();
    const { t } = useTranslation();

    const handleEditLocation = (locationType) => {
        if (onEdit) {
            onEdit(locationType);
        } else {
            // Default behavior - navigate back to location selection
            navigate(routes.generate.location(lang), {
                state: { editLocation: locationType }
            });
        }
    };

    return (
        <div className="location-summary">
            <LocationCard
                label={t('from', 'From')}
                address={startLocation}
                onEdit={() => handleEditLocation('start')}
                icon="📍"
            />

            <LocationCard
                label={t('to', 'To')}
                address={destinationLocation}
                onEdit={() => handleEditLocation('destination')}
                icon="🏠"
            />
        </div>
    );
};

/**
 * Individual location card component
 */
const LocationCard = ({ label, address, onEdit, icon }) => {
    return (
        <div className="location-card" onClick={onEdit}>
            <div className="location-header">
                <span className="location-icon">{icon}</span>
                <h3 className="location-label">{label}</h3>
            </div>
            <div className="location-content">
                <p className="location-address editable-location">
                    {address}
                </p>
                <span className="edit-hint">Click to edit</span>
            </div>
        </div>
    );
};

LocationCard.propTypes = {
    label: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    onEdit: PropTypes.func.isRequired,
    icon: PropTypes.string
};

LocationSummary.propTypes = {
    startLocation: PropTypes.string.isRequired,
    destinationLocation: PropTypes.string.isRequired,
    onEdit: PropTypes.func
};

export default LocationSummary;