// src/features/inventory/components/ApplianceSelection.js - Fixed Button size prop
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { inventoryService } from '../services/inventoryService';
import { Button, SelectInput } from '../../../common/components/ui';

/**
 * Component for selecting appliance items
 */
const ApplianceSelection = ({ applianceDetails, onApplianceChange }) => {
    const { t } = useTranslation();
    const [applianceOptions, setApplianceOptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplianceOptions = async () => {
            try {
                const options = await inventoryService.getApplianceOptions();
                setApplianceOptions(options);
            } catch (error) {
                //  console.error('Error fetching appliance options:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchApplianceOptions();
    }, []);

    const handleApplianceChange = (index, field, value) => {
        const newApplianceDetails = [...applianceDetails];
        newApplianceDetails[index] = {
            ...newApplianceDetails[index],
            [field]: value
        };
        onApplianceChange(newApplianceDetails);
    };

    const addApplianceItem = () => {
        const newApplianceDetails = [...applianceDetails, { item: '', quantity: 1 }];
        onApplianceChange(newApplianceDetails);
    };

    const removeApplianceItem = (index) => {
        const newApplianceDetails = applianceDetails.filter((_, i) => i !== index);
        onApplianceChange(newApplianceDetails);
    };

    const hasItems = applianceDetails.length > 0;

    if (loading) {
        return (
          <div className="appliance-selection loading">
              <h4>{t('appliances', 'Appliances')}</h4>
              <p>{t('loadingOptions', 'Loading options...')}</p>
          </div>
        );
    }

    return (
      <div className={`appliance-selection ${hasItems ? 'has-items' : 'empty'}`}>
          <div className="appliance-header">
              <h4>{t('appliances', 'Appliances')}</h4>
              <p className="appliance-description">
                  {t('applianceDescription', 'Add electrical appliances and electronics to be moved.')}
              </p>
          </div>

          {!hasItems ? (
            <div className="no-items-compact">
                <div className="no-items-content">
                    <span className="no-items-icon">📺</span>
                    <span className="no-items-text">{t('noAppliancesSelected', 'No appliances selected')}</span>
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={addApplianceItem}
                  className="add-appliance-btn-compact"
                  size="sm"
                >
                    {t('addAppliance', 'Add Appliance')}
                </Button>
            </div>
          ) : (
            <>
                <div className="appliance-items">
                    {applianceDetails.map((appliance, index) => (
                      <div key={index} className="appliance-item">
                          <SelectInput
                            value={appliance.item}
                            onChange={(e) => handleApplianceChange(index, 'item', e.target.value)}
                            options={[
                                { value: '', label: t('selectAppliance', 'Select Appliance') },
                                ...applianceOptions.map(option => ({
                                    value: option,
                                    label: option
                                }))
                            ]}
                            className="appliance-select"
                          />

                          {/* Updated Quantity Input with Plus/Minus Buttons */}
                          <div className="quantity-input-wrapper">
                              <label>{t('quantity', 'Quantity')}:</label>
                              <div className="quantity-input-group">
                                  <button
                                    type="button"
                                    className="quantity-btn"
                                    onClick={() => handleApplianceChange(index, 'quantity', Math.max(1, appliance.quantity - 1))}
                                    disabled={appliance.quantity <= 1}
                                    aria-label="Decrease quantity"
                                  >
                                      −
                                  </button>
                                  <input
                                    type="number"
                                    min="1"
                                    max="50"
                                    value={appliance.quantity}
                                    onChange={(e) => handleApplianceChange(index, 'quantity', parseInt(e.target.value) || 1)}
                                    className="quantity-display"
                                    readOnly // Make it read-only so only buttons control the value
                                  />
                                  <button
                                    type="button"
                                    className="quantity-btn"
                                    onClick={() => handleApplianceChange(index, 'quantity', Math.min(50, appliance.quantity + 1))}
                                    disabled={appliance.quantity >= 50}
                                    aria-label="Increase quantity"
                                  >
                                      +
                                  </button>
                              </div>
                          </div>

                          <Button
                            type="button"
                            variant="danger"
                            size="sm"
                            onClick={() => removeApplianceItem(index)}
                            className="remove-btn"
                          >
                              {t('remove', 'Remove')}
                          </Button>
                      </div>
                    ))}
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={addApplianceItem}
                  className="add-appliance-btn"
                >
                    {t('addAppliance', 'Add Appliance')}
                </Button>
            </>
          )}
      </div>
    );
};

ApplianceSelection.propTypes = {
    applianceDetails: PropTypes.arrayOf(PropTypes.shape({
        item: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired
    })).isRequired,
    onApplianceChange: PropTypes.func.isRequired
};

export default ApplianceSelection;