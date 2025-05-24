// src/features/inventory/components/SpecialItems.js
import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button, SelectInput } from '../../../common/components/ui';

/**
 * Component for selecting special items that need extra care
 */
const SpecialItems = ({ specialItems, onSpecialItemsChange }) => {
    const { t } = useTranslation();
    const [showSpecialItemFields, setShowSpecialItemFields] = React.useState(specialItems.length > 0);

    const specialItemTypes = [
        { value: 'fragile', label: t('fragile', 'Fragile') },
        { value: 'bulky', label: t('bulky', 'Bulky') },
        { value: 'valuable', label: t('valuable', 'Valuable') },
        { value: 'hazardous', label: t('hazardous', 'Hazardous') },
        { value: 'antique', label: t('antique', 'Antique') },
        { value: 'artwork', label: t('artwork', 'Artwork') },
        { value: 'other', label: t('other', 'Other (Specify Below)') }
    ];

    const handleItemTypeChange = (index, value) => {
        const updatedItems = [...specialItems];
        updatedItems[index] = {
            ...updatedItems[index],
            type: value
        };
        onSpecialItemsChange(updatedItems);
    };

    const handleItemDescriptionChange = (index, value) => {
        const updatedItems = [...specialItems];
        updatedItems[index] = {
            ...updatedItems[index],
            description: value
        };
        onSpecialItemsChange(updatedItems);
    };

    const addSpecialItem = () => {
        setShowSpecialItemFields(true);
        const newItems = [...specialItems, { type: '', description: '' }];
        onSpecialItemsChange(newItems);
    };

    const removeSpecialItem = (index) => {
        const updatedItems = specialItems.filter((_, i) => i !== index);
        onSpecialItemsChange(updatedItems);

        if (updatedItems.length === 0) {
            setShowSpecialItemFields(false);
        }
    };

    return (
        <div className="special-items">
            <h4>{t('specialItems', 'Special Items')}</h4>
            <p className="special-items-description">
                {t('specialItemsDescription', 'Items that require special handling, extra care, or have unique characteristics.')}
            </p>

            {!showSpecialItemFields && specialItems.length === 0 ? (
                <div className="no-special-items">
                    <p>{t('noSpecialItems', 'No special items selected')}</p>
                </div>
            ) : null}

            {showSpecialItemFields && (
                <div className="special-items-list">
                    {specialItems.map((item, index) => (
                        <div key={index} className="special-item">
                            <div className="special-item-fields">
                                <SelectInput
                                    value={item.type}
                                    onChange={(e) => handleItemTypeChange(index, e.target.value)}
                                    options={[
                                        { value: '', label: t('selectItemType', 'Select Item Type') },
                                        ...specialItemTypes
                                    ]}
                                    className="item-type-select"
                                />

                                <div className="description-wrapper">
                                    <label htmlFor={`description-${index}`}>
                                        {t('description', 'Description')}:
                                    </label>
                                    <textarea
                                        id={`description-${index}`}
                                        placeholder={t('describeItem', 'Describe the item in detail...')}
                                        value={item.description}
                                        onChange={(e) => handleItemDescriptionChange(index, e.target.value)}
                                        rows="3"
                                        className="description-textarea"
                                    />
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="danger"
                                size="small"
                                onClick={() => removeSpecialItem(index)}
                                className="remove-special-item-btn"
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
                onClick={addSpecialItem}
                className="add-special-item-btn"
            >
                {showSpecialItemFields ?
                    t('addAnotherSpecialItem', 'Add Another Special Item') :
                    t('addSpecialItem', 'Add Special Item')
                }
            </Button>
        </div>
    );
};

SpecialItems.propTypes = {
    specialItems: PropTypes.arrayOf(PropTypes.shape({
        type: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired
    })).isRequired,
    onSpecialItemsChange: PropTypes.func.isRequired
};

export default SpecialItems;