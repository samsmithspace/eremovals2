// src/features/inventory/components/FurnitureSelection.js
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { inventoryService } from '../services/inventoryService';
import { Button, SelectInput } from '../../../common/components/ui';

/**
 * Component for selecting furniture items
 */
const FurnitureSelection = ({ furnitureDetails, onFurnitureChange }) => {
    const { t } = useTranslation();
    const [furnitureOptions, setFurnitureOptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFurnitureOptions = async () => {
            try {
                const options = await inventoryService.getFurnitureOptions();
                setFurnitureOptions(options);
            } catch (error) {
                console.error('Error fetching furniture options:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFurnitureOptions();
    }, []);

    const handleFurnitureChange = (index, field, value) => {
        const newFurnitureDetails = [...furnitureDetails];
        newFurnitureDetails[index] = {
            ...newFurnitureDetails[index],
            [field]: value
        };
        onFurnitureChange(newFurnitureDetails);
    };

    const addFurnitureItem = () => {
        const newFurnitureDetails = [...furnitureDetails, { item: '', quantity: 1 }];
        onFurnitureChange(newFurnitureDetails);
    };

    const removeFurnitureItem = (index) => {
        const newFurnitureDetails = furnitureDetails.filter((_, i) => i !== index);
        onFurnitureChange(newFurnitureDetails);
    };

    if (loading) {
        return (
            <div className="furniture-selection loading">
                <h4>{t('furniture', 'Furniture')}</h4>
                <p>{t('loadingOptions', 'Loading options...')}</p>
            </div>
        );
    }

    return (
        <div className="furniture-selection">
            <h4>{t('furniture', 'Furniture')}</h4>

            {furnitureDetails.length === 0 ? (
                <div className="no-items">
                    <p>{t('noFurnitureSelected', 'No furniture items selected')}</p>
                </div>
            ) : (
                <div className="furniture-items">
                    {furnitureDetails.map((furniture, index) => (
                        <div key={index} className="furniture-item">
                            <SelectInput
                                value={furniture.item}
                                onChange={(e) => handleFurnitureChange(index, 'item', e.target.value)}
                                options={[
                                    { value: '', label: t('selectFurniture', 'Select Furniture') },
                                    ...furnitureOptions.map(option => ({
                                        value: option,
                                        label: option
                                    }))
                                ]}
                                className="furniture-select"
                            />

                            <div className="quantity-input-wrapper">
                                <label>{t('quantity', 'Quantity')}:</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="50"
                                    value={furniture.quantity}
                                    onChange={(e) => handleFurnitureChange(index, 'quantity', parseInt(e.target.value) || 1)}
                                    className="quantity-input"
                                />
                            </div>

                            <Button
                                type="button"
                                variant="danger"
                                size="small"
                                onClick={() => removeFurnitureItem(index)}
                                className="remove-btn"
                            >
                                {t('remove', 'Remove')}
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            <Button
                type="button"
                variant="secondary"
                onClick={addFurnitureItem}
                className="add-furniture-btn"
            >
                {t('addFurniture', 'Add Furniture')}
            </Button>
        </div>
    );
};

FurnitureSelection.propTypes = {
    furnitureDetails: PropTypes.arrayOf(PropTypes.shape({
        item: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired
    })).isRequired,
    onFurnitureChange: PropTypes.func.isRequired
};

export default FurnitureSelection;