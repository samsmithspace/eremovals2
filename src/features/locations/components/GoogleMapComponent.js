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

  // Debug logging for addresses
  useEffect(() => {
    console.log('Postcode changed:', postcode);
    console.log('Addresses:', addresses);
    console.log('Loading:', addressesLoading);
  }, [postcode, addresses, addressesLoading]);

  const onLoad = useCallback((autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  }, []);

  const onPlaceChanged = useCallback(() => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      console.log('Selected place:', place); // Debug log

      if (!place.geometry) {
        console.warn('No geometry data available for the selected place');
        return;
      }

      const location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      };

      setCenter(location);
      setMarkerPosition(location);

      // Enhanced postcode extraction with better logging
      const addressComponents = place.address_components;
      console.log('Address components:', addressComponents); // Debug log

      let extractedPostcode = null;

      if (addressComponents) {
        // Try multiple postcode component types
        const postalCodeComponent = addressComponents.find(
          component =>
            component.types.includes("postal_code") ||
            component.types.includes("postal_code_prefix")
        );

        console.log('Found postal code component:', postalCodeComponent); // Debug log

        if (postalCodeComponent) {
          extractedPostcode = postalCodeComponent.long_name;
          console.log('Extracted postcode from components:', extractedPostcode); // Debug log
        }
      }

      // Fallback: try to extract postcode from formatted_address
      if (!extractedPostcode && place.formatted_address) {
        extractedPostcode = extractPostcodeFromAddress(place.formatted_address);
        if (extractedPostcode) {
          console.log('Postcode extracted from formatted address:', extractedPostcode);
        }
      }

      // Fallback: try to extract from place.name
      if (!extractedPostcode && place.name) {
        extractedPostcode = extractPostcodeFromAddress(place.name);
        if (extractedPostcode) {
          console.log('Postcode extracted from place name:', extractedPostcode);
        }
      }

      if (extractedPostcode) {
        setPostcode(extractedPostcode);
      } else {
        console.warn('Could not extract postcode from place:', place);
        setPostcode(''); // Clear postcode if none found
      }

      // Handle different modes (development vs production)
      if (config.isDevelopment) {
        // In development, immediately call onPlaceSelected
        onPlaceSelected(place);
      } else {
        // In production, only call onPlaceSelected after detailed address is selected
        // Don't call onPlaceSelected here - wait for dropdown selection
        console.log("Production mode - waiting for detailed address selection");
        console.log("Not calling onPlaceSelected yet - waiting for dropdown");
      }
    }
  }, [autocomplete, onPlaceSelected]);

  // Helper function to extract UK postcode from formatted address
  const extractPostcodeFromAddress = (address) => {
    if (!address) return null;

    // Enhanced UK postcode regex patterns
    const postcodeRegexes = [
      // Standard UK postcode: SW1A 1AA, M1 1AA, B33 8TH
      /\b[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}\b/i,
      // Partial postcodes: SW1A, M1, B33
      /\b[A-Z]{1,2}[0-9][A-Z0-9]?\b/i
    ];

    for (const regex of postcodeRegexes) {
      const match = address.match(regex);
      if (match) {
        const postcode = match[0].replace(/\s+/g, ' ').trim().toUpperCase();
        console.log(`Extracted postcode "${postcode}" from address: ${address}`);
        return postcode;
      }
    }

    console.log(`No postcode pattern found in address: ${address}`);
    return null;
  };

  const handleAddressChange = useCallback((event) => {
    const selectedAddress = event.target.value;
    console.log('Selected detailed address:', selectedAddress); // Debug log

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

      {/* Debug Information - Remove in production */}
      {config.isDevelopment && (
        <div style={{
          padding: '10px',
          background: '#f0f0f0',
          margin: '10px 0',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#333'
        }}>
          <div>Postcode: {postcode || 'Not extracted'}</div>
          <div>Addresses count: {addresses.length}</div>
          <div>Loading: {addressesLoading ? 'Yes' : 'No'}</div>
        </div>
      )}

      {/* Detailed Address Selection (Production mode) */}
      {!config.isDevelopment && postcode && postcode.length >= 3 && (
        <AddressDropdown
          addresses={addresses}
          onAddressChange={handleAddressChange}
          isLoading={addressesLoading}
          placeholder={t('selectDetailedAddress', 'Click here to select detailed address...')}
          postcode={postcode} // Pass postcode for debugging
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
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

/**
 * Enhanced Dropdown component for detailed address selection
 */
const AddressDropdown = ({
                           addresses,
                           onAddressChange,
                           isLoading,
                           placeholder,
                           postcode // Add this prop for debugging
                         }) => {
  const { t } = useTranslation();

  // Debug logging for the dropdown
  useEffect(() => {
    console.log('AddressDropdown rendered with:', {
      postcode,
      addressesCount: addresses.length,
      isLoading,
      addresses: addresses.slice(0, 3) // Log first 3 addresses
    });
  }, [addresses, isLoading, postcode]);

  return (
    <div className="address-dropdown">
      <select
        className="address-select"
        onChange={onAddressChange}
        disabled={isLoading}
        style={{
          color: '#333333',
          backgroundColor: '#ffffff',
          border: '1px solid #ddd'
        }}
      >
        <option value="" style={{ color: '#666666' }}>
          {isLoading
            ? t('loadingAddresses', 'Loading addresses...')
            : addresses.length > 0
              ? placeholder
              : t('noAddressesFound', 'No detailed addresses found for this postcode')
          }
        </option>
        {addresses.map((address, index) => (
          <option key={index} value={address} style={{ color: '#333333' }}>
            {address.replace(/,/g, ', ')}
          </option>
        ))}
      </select>

      {/* Debug info - Remove in production */}
      {config.isDevelopment && (
        <div style={{
          fontSize: '11px',
          color: '#666',
          marginTop: '5px',
          padding: '5px',
          background: '#f9f9f9',
          borderRadius: '3px'
        }}>
          Postcode: {postcode}, Found {addresses.length} addresses
        </div>
      )}
    </div>
  );
};

AddressDropdown.propTypes = {
  addresses: PropTypes.arrayOf(PropTypes.string).isRequired,
  onAddressChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  placeholder: PropTypes.string,
  postcode: PropTypes.string
};

GoogleMapComponent.propTypes = {
  onPlaceSelected: PropTypes.func.isRequired,
  selectedLocation: PropTypes.string,
  defaultLocation: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired
  }),
  zoom: PropTypes.number
};

export default GoogleMapComponent;