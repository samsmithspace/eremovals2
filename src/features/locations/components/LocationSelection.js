// src/features/locations/components/LocationSelection.js
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import GoogleMapComponent from './GoogleMapComponent';
import { Button } from 'common/components/ui';
import routes from 'config/routes';
import config from 'config/config';
import './LocationSelection.css';
import './GoogleMapComponent.css';
import { locationService } from '../services/locationService';

/**
 * Fixed Location Selection Component with proper flow control
 */
const LocationSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { lang } = useParams();
  const { t } = useTranslation();
  const [showDestinationSection, setShowDestinationSection] = useState(false);
  const [startLocation, setStartLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Add state to track if we're waiting for detailed address selection
  const [waitingForDetailedAddress, setWaitingForDetailedAddress] = useState(false);

  // Get location type from navigation state
  const locationType = location.state || {};

  // Animation and UX effects
  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsAnimating(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Show destination section when start location is FULLY selected
    if (startLocation && !waitingForDetailedAddress) {
      const timer = setTimeout(() => {
        setShowDestinationSection(true);
        const destinationSection = document.querySelector('.destination-location-section');
        if (destinationSection) {
          destinationSection.classList.add('slide-up');
        }
      }, 300);
      return () => clearTimeout(timer);
    } else {
      // Hide destination section if we're waiting for detailed address
      setShowDestinationSection(false);
    }
  }, [startLocation, waitingForDetailedAddress]);

  useEffect(() => {
    // Show confirmation when both locations are selected
    if (startLocation && destinationLocation && !waitingForDetailedAddress) {
      setShowConfirmation(true);
    } else {
      setShowConfirmation(false);
    }
  }, [startLocation, destinationLocation, waitingForDetailedAddress]);

  const handleEditStart = () => {
    setStartLocation(null);
    setWaitingForDetailedAddress(false);
    setValidationErrors(prev => ({ ...prev, startLocation: null, sameLocation: null }));

    // Scroll back to start location section
    setTimeout(() => {
      const startSection = document.querySelector('.start-location-section');
      if (startSection) {
        startSection.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }, 100);
  };

  const handleEditDestination = () => {
    setDestinationLocation(null);
    setValidationErrors(prev => ({ ...prev, destinationLocation: null, sameLocation: null }));

    // Scroll back to destination location section
    setTimeout(() => {
      const destinationSection = document.querySelector('.destination-location-section');
      if (destinationSection) {
        destinationSection.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }, 100);
  };

  const validateLocations = () => {
    const errors = {};

    if (!startLocation) {
      errors.startLocation = t('locationRequired', 'Start location is required');
    }

    if (!destinationLocation) {
      errors.destinationLocation = t('locationRequired', 'Destination location is required');
    }

    // Check if locations are the same
    if (startLocation && destinationLocation &&
      startLocation.toLowerCase().trim() === destinationLocation.toLowerCase().trim()) {
      errors.sameLocation = t('sameLocationError', 'Pickup and destination cannot be the same');
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleStartLocationSelected = (place) => {
    console.log('handleStartLocationSelected called with:', place);

    if (place === null) {
      setStartLocation(null);
      setWaitingForDetailedAddress(false);
      return;
    }

    const locationString = typeof place === 'string' ? place : place.formatted_address || place.name;

    // In production mode, if this is just the initial Google Maps selection,
    // don't set as final location yet - wait for detailed address
    if (!config.isDevelopment && typeof place === 'object') {
      console.log('Production mode: Waiting for detailed address selection');
      setWaitingForDetailedAddress(true);
      setStartLocation(null); // Don't set location yet
      return;
    }

    // This is either development mode OR a detailed address selection
    console.log('Setting start location:', locationString);
    setStartLocation(locationString);
    setWaitingForDetailedAddress(false);
    setValidationErrors(prev => ({ ...prev, startLocation: null, sameLocation: null }));

    // Smooth scroll to destination section after a delay
    setTimeout(() => {
      const destinationSection = document.querySelector('.destination-location-section');
      if (destinationSection) {
        destinationSection.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }, 500);
  };

  const handleDestinationLocationSelected = (place) => {
    console.log('handleDestinationLocationSelected called with:', place);

    if (place === null) {
      setDestinationLocation(null);
      return;
    }

    const locationString = typeof place === 'string' ? place : place.formatted_address || place.name;

    // In production mode, if this is just the initial Google Maps selection,
    // don't set as final location yet - wait for detailed address
    if (!config.isDevelopment && typeof place === 'object') {
      console.log('Production mode: Waiting for detailed address selection');
      return; // Don't set destination yet
    }

    console.log('Setting destination location:', locationString);
    setDestinationLocation(locationString);
    setValidationErrors(prev => ({ ...prev, destinationLocation: null, sameLocation: null }));

    // Smooth scroll to confirmation after a delay
    setTimeout(() => {
      const confirmationSection = document.querySelector('.confirmation-section');
      if (confirmationSection) {
        confirmationSection.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }, 500);
  };

  const handleConfirm = async () => {
    if (!validateLocations()) {
      return;
    }

    // Add loading animation
    const confirmButton = document.querySelector('.confirm-button');
    if (confirmButton) {
      confirmButton.style.transform = 'scale(0.95)';
      confirmButton.innerHTML = `
                <div class="loading-spinner"></div>
                ${t('processing', 'Processing...')}
            `;
    }

    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      navigate(routes.generate.quote(lang), {
        state: {
          startLocation,
          destinationLocation,
          locationType
        }
      });
    } catch (error) {
      console.error('Navigation error:', error);
      // Reset button state
      if (confirmButton) {
        confirmButton.style.transform = '';
        confirmButton.innerHTML = t('confirmLocations', 'Confirm Locations');
      }
    }
  };

  const getProgressSteps = () => {
    const steps = [];
    steps.push(startLocation ? 'completed' : waitingForDetailedAddress ? 'active' : 'inactive');
    steps.push(destinationLocation ? 'completed' : startLocation ? 'active' : 'inactive');
    steps.push(startLocation && destinationLocation ? 'active' : 'inactive');
    return steps;
  };

  return (
    <div className={`location-selection ${isAnimating ? 'animated' : ''}`}>
      {/* Progress Indicator */}
      <ProgressIndicator steps={getProgressSteps()} />

      {/* Debug Info */}
      {config.isDevelopment && (
        <div style={{
          padding: '10px',
          background: '#f0f0f0',
          margin: '10px auto',
          borderRadius: '4px',
          fontSize: '12px',
          maxWidth: '600px'
        }}>
          <div>Start Location: {startLocation || 'None'}</div>
          <div>Waiting for detailed: {waitingForDetailedAddress ? 'Yes' : 'No'}</div>
          <div>Show destination: {showDestinationSection ? 'Yes' : 'No'}</div>
        </div>
      )}

      {/* Start Location Section */}
      <LocationCard
        title={t('locations.moveFrom', 'Where are you moving from?')}
        icon="🏠"
        onLocationSelected={handleStartLocationSelected}
        selectedLocation={startLocation}
        className="start-location-section"
        isActive={true}
        error={validationErrors.startLocation}
        isWaitingForDetails={waitingForDetailedAddress}
      />

      {/* Destination Location Section - Show only when start is fully completed */}
      {showDestinationSection && (
        <LocationCard
          title={t('locations.moveTo', 'Where are you moving to?')}
          icon="📍"
          onLocationSelected={handleDestinationLocationSelected}
          selectedLocation={destinationLocation}
          className="destination-location-section slide-up"
          isActive={true}
          error={validationErrors.destinationLocation}
        />
      )}

      {/* Same Location Error */}
      {validationErrors.sameLocation && (
        <div className="error-message">
          {validationErrors.sameLocation}
        </div>
      )}

      {/* Confirmation Section */}
      {showConfirmation && (
        <ConfirmationSection
          startLocation={startLocation}
          destinationLocation={destinationLocation}
          onConfirm={handleConfirm}
          isVisible={showConfirmation}
          onEditStart={handleEditStart}
          onEditDestination={handleEditDestination}
        />
      )}
    </div>
  );
};

/**
 * Progress Indicator Component
 */
const ProgressIndicator = ({ steps }) => {
  return (
    <div className="progress-indicator">
      {steps.map((status, index) => (
        <div
          key={index}
          className={`progress-step ${status}`}
          role="progressbar"
          aria-valuenow={status === 'completed' ? 100 : status === 'active' ? 50 : 0}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      ))}
    </div>
  );
};

/**
 * Enhanced Location Card Component
 */
const LocationCard = ({
                        title,
                        icon,
                        onLocationSelected,
                        selectedLocation,
                        className,
                        isActive,
                        error,
                        isWaitingForDetails = false
                      }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const handleLocationSelected = async (place) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    onLocationSelected(place);
    setIsLoading(false);
  };

  if (!isActive) return null;

  return (
    <div className={`location-section ${className} ${selectedLocation ? 'has-selection' : ''} ${isWaitingForDetails ? 'waiting-details' : ''}`}>
      <h2 className="section-title">
        <span className="location-icon">{icon}</span>
        {title}
      </h2>

      {isWaitingForDetails && (
        <div className="waiting-message">
          <p>📍 Please select a detailed address from the dropdown below</p>
        </div>
      )}

      {selectedLocation ? (
        <LocationPreview
          location={selectedLocation}
          onEdit={() => onLocationSelected(null)}
        />
      ) : (
        <>
          <GoogleMapComponent
            onPlaceSelected={handleLocationSelected}
            isLoading={isLoading}
          />
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </>
      )}
    </div>
  );
};

/**
 * Location Preview Component
 */
const LocationPreview = ({ location, onEdit }) => {
  const { t } = useTranslation();

  return (
    <div className="location-preview">
      <div className="selected-location">
        <div className="location-text">
          <strong>{location}</strong>
        </div>
        <button
          className="edit-location-btn"
          onClick={onEdit}
          type="button"
        >
          {t('locations.edit', 'Edit')}
        </button>
      </div>
      <div className="location-actions">
        <div className="success-message">
          ✅ {t('locations.locationSelected', 'Location selected successfully')}
        </div>
      </div>
    </div>
  );
};

/**
 * Confirmation Section Component
 */
const ConfirmationSection = ({
                               startLocation,
                               destinationLocation,
                               onConfirm,
                               isVisible,
                               onEditStart,
                               onEditDestination
                             }) => {
  const { t } = useTranslation();
  const [showSection, setShowSection] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setShowSection(true), 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  return (
    <div className={`confirmation-section ${showSection ? 'show' : ''}`}>
      {/* Location Summary */}
      <div className="location-summary">
        <SummaryCard
          icon="🏠"
          label={t('locations.from', 'From')}
          location={startLocation}
          type="pickup"
          onEdit={onEditStart}
        />
        <SummaryCard
          icon="📍"
          label={t('locations.to', 'To')}
          location={destinationLocation}
          type="destination"
          onEdit={onEditDestination}
        />
      </div>

      {/* Route Information */}
      <RouteInformation
        startLocation={startLocation}
        destinationLocation={destinationLocation}
      />

      {/* Confirm Button */}
      <Button
        onClick={onConfirm}
        variant="primary"
        size="large"
        className="confirm-button"
      >
        {t('locations.confirmLocations', 'Confirm Locations')}
      </Button>
    </div>
  );
};

/**
 * Summary Card Component
 */
const SummaryCard = ({ icon, label, location, type, onEdit }) => {
  const { t } = useTranslation();

  return (
    <div
      className={`location-card summary-card ${type} clickable`}
      onClick={onEdit}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onEdit();
        }
      }}
    >
      <div className="location-header">
        <span className="location-icon">{icon}</span>
        <h3 className="location-label">{label}</h3>
      </div>
      <div className="location-content">
        <p className="location-address">{location}</p>
        <span className="edit-hint">
          {type === 'pickup'
            ? t('locations.clickToChangePickup', '🔄 Click to change pickup')
            : t('locations.clickToChangeDestination', '🔄 Click to change destination')
          }
        </span>
      </div>
    </div>
  );
};

/**
 * Route Information Component - Uses real distance calculation
 */
const RouteInformation = ({ startLocation, destinationLocation }) => {
  const { t } = useTranslation();
  const [routeInfo, setRouteInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculateRoute = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const distanceData = await locationService.calculateDistance(
        startLocation,
        destinationLocation
      );

      setRouteInfo({
        distance: distanceData.distance,
        distanceValue: distanceData.distanceValue
      });
    } catch (error) {
      console.error('Route calculation error:', error);
      setError(error.message);
      // Fallback to show something rather than nothing
      setRouteInfo({
        distance: t('locations.distanceCalculationFailed', 'Distance calculation unavailable')
      });
    } finally {
      setLoading(false);
    }
  }, [startLocation, destinationLocation, t]);

  useEffect(() => {
    if (startLocation && destinationLocation) {
      calculateRoute();
    }
  }, [startLocation, destinationLocation, calculateRoute]);

  if (loading) {
    return (
      <div className="route-info loading">
        <div className="loading-spinner"></div>
        <span>{t('locations.calculatingRoute', 'Calculating route...')}</span>
      </div>
    );
  }

  if (error && !routeInfo) {
    return (
      <div className="route-info error">
        <span className="route-icon">⚠️</span>
        <span className="route-label">{t('locations.routeError', 'Route calculation failed')}</span>
      </div>
    );
  }

  if (!routeInfo) return null;

  return (
    <div className="route-info">
      <span className="route-icon">📏</span>
      <span className="route-label">{t('locations.distance', 'Distance')}:</span>
      <span className="route-value">{routeInfo.distance}</span>
    </div>
  );
};

// PropTypes
ProgressIndicator.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.string).isRequired
};

LocationCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  onLocationSelected: PropTypes.func.isRequired,
  selectedLocation: PropTypes.string,
  className: PropTypes.string,
  isActive: PropTypes.bool.isRequired,
  error: PropTypes.string,
  isWaitingForDetails: PropTypes.bool
};

LocationPreview.propTypes = {
  location: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired
};

ConfirmationSection.propTypes = {
  startLocation: PropTypes.string.isRequired,
  destinationLocation: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
  onEditStart: PropTypes.func.isRequired,
  onEditDestination: PropTypes.func.isRequired
};

SummaryCard.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['pickup', 'destination']).isRequired,
  onEdit: PropTypes.func.isRequired
};

RouteInformation.propTypes = {
  startLocation: PropTypes.string.isRequired,
  destinationLocation: PropTypes.string.isRequired
};

export default LocationSelection;