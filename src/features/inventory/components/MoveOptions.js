// src/features/inventory/components/MoveOptions.js
import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useInventoryForm } from '../hooks/useInventoryForm';
import BoxSelection from './BoxSelection';
import FurnitureSelection from './FurnitureSelection';
import ApplianceSelection from './ApplianceSelection';
import SpecialItems from './SpecialItems';
import './MoveOptions.css';

/**
 * Modern inventory selection component with enhanced UX
 */
const MoveOptions = ({
                         onDetailsChange,
                         onDateChange, // Add this prop
                         onTimeChange, // Add this prop
                         initialDetails = {},
                         onValidationChange
                     }) => {
    const { t } = useTranslation();
    const {
        inventoryData,
        floorDetails,
        updateBoxDetails,
        updateFurnitureDetails,
        updateApplianceDetails,
        updateSpecialItems,
        updateFloorDetails,
        isValid
    } = useInventoryForm(initialDetails, onDetailsChange);

    // Notify parent about validation state changes
    React.useEffect(() => {
        if (onValidationChange) {
            onValidationChange(isValid);
        }
    }, [isValid, onValidationChange]);

    // Helper function to get floor display name
    const getFloorDisplayName = (floorNumber) => {
        if (floorNumber === 0) return 'Ground';
        return floorNumber.toString();
    };

    // Helper function to handle floor increment
    const incrementFloor = (field, currentValue) => {
        const newValue = Math.min(currentValue + 1, 20); // Max 20 floors
        updateFloorDetails(field, newValue);
    };

    // Helper function to handle floor decrement
    const decrementFloor = (field, currentValue) => {
        const newValue = Math.max(currentValue - 1, 0); // Min 0 (Ground)
        updateFloorDetails(field, newValue);
    };

    return (
      <div className="move-options">
          {/* Header Section */}
          <div className="move-options-header">
              <h3>{t('selectYourItems', 'Select Your Items')}</h3>
              <p className="move-options-description">
                  {t('itemSelectionDescription', 'Please select all items you need to move to get an accurate quote.')}
              </p>
          </div>

          {/* Box Selection Section */}
          <div className="inventory-section">
              <div className="section-header">
                  <h4>
                      <span className="section-icon">📦</span>
                      {t('boxes', 'Boxes & Containers')}
                  </h4>
              </div>
              <div className="section-content">
                  <BoxSelection
                    boxDetails={inventoryData.boxDetails}
                    onBoxDetailsChange={updateBoxDetails}
                  />
              </div>
          </div>

          {/* Furniture Selection Section */}
          <div className="inventory-section">
              <div className="section-header">
                  <h4>
                      <span className="section-icon">🛋️</span>
                      {t('furniture', 'Furniture & Large Items')}
                  </h4>
              </div>
              <div className="section-content">
                  <FurnitureSelection
                    furnitureDetails={inventoryData.furnitureDetails}
                    onFurnitureChange={updateFurnitureDetails}
                  />
              </div>
          </div>

          {/* Appliance Selection Section */}
          <div className="inventory-section">
              <div className="section-header">
                  <h4>
                      <span className="section-icon">🔌</span>
                      {t('appliances', 'Appliances & Electronics')}
                  </h4>
              </div>
              <div className="section-content">
                  <ApplianceSelection
                    applianceDetails={inventoryData.applianceDetails}
                    onApplianceChange={updateApplianceDetails}
                  />
              </div>
          </div>

          {/* Special Items Section */}
          <div className="inventory-section">
              <div className="section-header">
                  <h4>
                      <span className="section-icon">⭐</span>
                      {t('specialItems', 'Special Items')}
                  </h4>
              </div>
              <div className="section-content">
                  <SpecialItems
                    specialItems={inventoryData.specialItems}
                    onSpecialItemsChange={updateSpecialItems}
                  />
              </div>
          </div>

          {/* Floor Access Details Section */}
          <div className="floor-details-section">
              <h4>{t('floorAccess', 'Floor Access Information')}</h4>

              <div className="floor-access-group">
                  <div className="pickup-access">
                      <h5>{t('pickupLocation', 'Pickup Location')}</h5>

                      <label className="checkbox-container">
                          <input
                            type="checkbox"
                            checked={floorDetails.liftAvailable}
                            onChange={(e) => updateFloorDetails('liftAvailable', e.target.checked)}
                            className="checkbox-input"
                          />
                          <span>{t('liftAvailable', 'Lift Available')}</span>
                      </label>

                      <div className="stairs-input">
                          <label>
                              {t('floorLevel', 'Floor Level')}:
                          </label>
                          <div className="floor-input-group">
                              <button
                                type="button"
                                className="floor-btn"
                                onClick={() => decrementFloor('numberOfStairs', floorDetails.numberOfStairs || 0)}
                                disabled={floorDetails.numberOfStairs <= 0}
                                aria-label="Decrease floor"
                              >
                                  −
                              </button>
                              <div className="floor-display">
                                  {getFloorDisplayName(floorDetails.numberOfStairs || 0)}
                              </div>
                              <button
                                type="button"
                                className="floor-btn"
                                onClick={() => incrementFloor('numberOfStairs', floorDetails.numberOfStairs || 0)}
                                disabled={floorDetails.numberOfStairs >= 20}
                                aria-label="Increase floor"
                              >
                                  +
                              </button>
                          </div>
                      </div>
                  </div>

                  <div className="destination-access">
                      <h5>{t('destinationLocation', 'Destination Location')}</h5>

                      <label className="checkbox-container">
                          <input
                            type="checkbox"
                            checked={floorDetails.liftAvailabledest}
                            onChange={(e) => updateFloorDetails('liftAvailabledest', e.target.checked)}
                            className="checkbox-input"
                          />
                          <span>{t('liftAvailable', 'Lift Available')}</span>
                      </label>

                      <div className="stairs-input">
                          <label>
                              {t('floorLevel', 'Floor Level')}:
                          </label>
                          <div className="floor-input-group">
                              <button
                                type="button"
                                className="floor-btn"
                                onClick={() => decrementFloor('numberofstairsright', floorDetails.numberofstairsright || 0)}
                                disabled={floorDetails.numberofstairsright <= 0}
                                aria-label="Decrease floor"
                              >
                                  −
                              </button>
                              <div className="floor-display">
                                  {getFloorDisplayName(floorDetails.numberofstairsright || 0)}
                              </div>
                              <button
                                type="button"
                                className="floor-btn"
                                onClick={() => incrementFloor('numberofstairsright', floorDetails.numberofstairsright || 0)}
                                disabled={floorDetails.numberofstairsright >= 20}
                                aria-label="Increase floor"
                              >
                                  +
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    );
};

MoveOptions.propTypes = {
    onDetailsChange: PropTypes.func.isRequired,
    onDateChange: PropTypes.func.isRequired, // Add this
    onTimeChange: PropTypes.func.isRequired, // Add this
    initialDetails: PropTypes.object,
    onValidationChange: PropTypes.func
};

export default MoveOptions;