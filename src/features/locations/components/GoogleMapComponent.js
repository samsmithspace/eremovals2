// src/features/locations/components/GoogleMapComponent.js
import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useLocationSearch } from '../hooks/useLocationSearch';
import { useAddressLookup } from '../hooks/useAddressLookup';
import config from '../../../config/config';
import './GoogleMapComponent.css';
const libraries = ['places', 'marker'];

/**
 * Google Maps component with address autocomplete and selection
 * @param {Object} props
 * @param {Function} props.onPlaceSelected - Callback when a place is selected
 * @param {Object} props.defaultLocation - Default map center
 * @param {number} props.zoom - Map zoom level
 */

const GoogleMapComponent = ({
                                onPlaceSelected,
                                selectedLocation,
                                defaultLocation = config.map.defaultCenter,
                                zoom = config.map.defaultZoom
                            }) => {
    const { t } = useTranslation();
    const [autocomplete, setAutocomplete] = useState(null);
    const [center, setCenter] = useState(defaultLocation);
    const [markerPosition, setMarkerPosition] = useState(null);
    const [postcode, setPostcode] = useState('');

    // Custom hooks for location functionality
    const { isLoaded, loadError } = useLocationSearch();
    const { addresses, isLoading: addressesLoading } = useAddressLookup(postcode);

    // Load Google Maps script
    const { isLoaded: mapsLoaded, loadError: mapsLoadError } = useJsApiLoader({
        googleMapsApiKey: config.apiKeys.googleMaps,
        libraries,
    });

    const onLoad = useCallback((autocompleteInstance) => {
        setAutocomplete(autocompleteInstance);
    }, []);

    const onPlaceChanged = useCallback(() => {
        if (autocomplete !== null) {
            const place = autocomplete.getPlace();

            if (!place.geometry) {
             //   console.warn('No geometry data available for the selected place');
                return;
            }

            const location = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
            };

            setCenter(location);
            setMarkerPosition(location);

            // Extract postcode for address lookup
            const addressComponents = place.address_components;
            const postalCodeComponent = addressComponents?.find(
                component => component.types.includes("postal_code")
            );

            if (postalCodeComponent) {
                setPostcode(postalCodeComponent.long_name);
            }

            // Handle different modes (development vs production)
            if (config.isDevelopment) {
                onPlaceSelected(place);
            } else {
                // In production, wait for detailed address selection
                console.log("production--------------")
                onPlaceSelected(place.formatted_address || place.name);
            }
        }
    }, [autocomplete, onPlaceSelected]);

    const handleAddressChange = useCallback((event) => {
        const selectedAddress = event.target.value;
        if (selectedAddress && onPlaceSelected) {
            onPlaceSelected(selectedAddress);
        }
    }, [onPlaceSelected]);

    // Handle loading and error states
    if (loadError || mapsLoadError) {

        return (
            <div className="map-error">
                <p>{t('mapLoadError', 'Error loading Google Maps')}</p>
            </div>
        );
    }

    if (!isLoaded || !mapsLoaded) {
        return (
            <div className="map-loading">
                <p>{t('locations.loadingMap', 'Loading map...')}</p>
            </div>
        );
    }

    return (
      <div className="google-map-component">
          {/* Address Input with Autocomplete */}
          <div className="map-input-container">
              <Autocomplete
                onLoad={onLoad}
                onPlaceChanged={onPlaceChanged}
                className="map-autocomplete"
              >
                  <input
                    type="text"
                    placeholder={selectedLocation || t('locations.enterLocation', 'Enter Location')}
                    className="map-input"
                  />
              </Autocomplete>
          </div>

          {/* Detailed Address Selection (Production mode) */}
          {!config.isDevelopment && postcode && addresses.length > 0 && (
            <AddressDropdown
              addresses={addresses}
              onAddressChange={handleAddressChange}
              isLoading={addressesLoading}
              placeholder={t('selectDetailedAddress', 'Click here to select detailed address...')}
            />
          )}

          {/* Map Display */}
          {markerPosition && (
            <div className="map-container">
                <GoogleMap
                  mapContainerStyle={{ height: '100%', width: '100%' }}
                  center={center}
                  zoom={zoom}
                  options={{ mapId: config.map.mapId }}
                  onLoad={(map) => {
                      // Add advanced marker if available
                      const { AdvancedMarkerElement } = window.google.maps.marker || {};
                      if (AdvancedMarkerElement) {
                          new AdvancedMarkerElement({
                              map,
                              position: markerPosition,
                          });
                      } else {
                          //  console.warn("AdvancedMarkerElement not available");
                      }
                  }}
                />
            </div>
          )}
      </div>
    );
};

/**
 * Dropdown component for detailed address selection
 */
const AddressDropdown = ({
                             addresses,
                             onAddressChange,
                             isLoading,
                             placeholder,
                         }) => {
    return (
      <div className="address-dropdown">
          <select
            className="address-select"
            onChange={onAddressChange}
            disabled={isLoading}
          >
                <option value="">
                    {isLoading ? 'Loading addresses...' : placeholder}
                </option>
                {addresses.map((address, index) => (
                    <option key={index} value={address}>
                        {address.replace(/,/g, ', ')}
                    </option>
                ))}
            </select>
        </div>
    );
};

AddressDropdown.propTypes = {
    addresses: PropTypes.arrayOf(PropTypes.string).isRequired,
    onAddressChange: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
    placeholder: PropTypes.string
};

GoogleMapComponent.propTypes = {
    onPlaceSelected: PropTypes.func.isRequired,
    defaultLocation: PropTypes.shape({
        lat: PropTypes.number.isRequired,
        lng: PropTypes.number.isRequired
    }),
    zoom: PropTypes.number
};

export default GoogleMapComponent;