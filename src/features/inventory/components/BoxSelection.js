// src/features/inventory/components/BoxSelection.js
import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

/**
 * Component for selecting box quantities
 */
const BoxSelection = ({ boxDetails, onBoxDetailsChange }) => {
    const { t } = useTranslation();

    const boxTypes = [
        {
            key: 'small',
            size: '457mm x 305mm x 305mm',
            description: t('smallBoxDescription', 'carry-on luggage/microwave')
        },
        {
            key: 'medium',
            size: '457mm x 457mm x 305mm',
            description: t('mediumBoxDescription', 'night stand')
        },
        {
            key: 'large',
            size: '457mm x 457mm x 457mm',
            description: t('largeBoxDescription', 'or heavier than 20 kg')
        },
        {
            key: 'extraLarge',
            size: '457mm x 457mm x 610mm',
            description: t('extraLargeBoxDescription', 'small fridge')
        }
    ];

    const handleBoxQuantityChange = (index, quantity) => {
        const newBoxDetails = [...boxDetails];
        newBoxDetails[index] = {
            ...newBoxDetails[index],
            numberOfBoxes: quantity
        };
        onBoxDetailsChange(newBoxDetails);
    };

    const incrementBox = (index) => {
        const currentQuantity = boxDetails[index]?.numberOfBoxes || 0;
        handleBoxQuantityChange(index, currentQuantity + 1);
    };

    const decrementBox = (index) => {
        const currentQuantity = boxDetails[index]?.numberOfBoxes || 0;
        if (currentQuantity > 0) {
            handleBoxQuantityChange(index, currentQuantity - 1);
        }
    };

    return (
        <div className="box-selection">
            <h4>{t('boxes', 'Boxes')}</h4>
            <div className="box-options">
                {boxTypes.map((boxType, index) => {
                    const currentBox = boxDetails[index] || { boxSize: boxType.key, numberOfBoxes: 0 };

                    return (
                        <div key={boxType.key} className="box-option">
                            <div className="box-info">
                                <h5>{t(boxType.key, boxType.key.charAt(0).toUpperCase() + boxType.key.slice(1))}</h5>
                                <p className="box-size">{boxType.size}</p>
                                <p className="box-description">({boxType.description})</p>
                            </div>

                            <div className="quantity-controls">
                                <label className="quantity-label">
                                    {t('quantity', 'Quantity')}:
                                </label>
                                <div className="input-group">
                                    <input
                                        type="number"
                                        min="0"
                                        max="99"
                                        value={currentBox.numberOfBoxes || ''}
                                        onChange={(e) => handleBoxQuantityChange(index, parseInt(e.target.value) || 0)}
                                        className="quantity-input"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => incrementBox(index)}
                                        className="quantity-btn increment-btn"
                                        aria-label={t('increase', 'Increase')}
                                    >
                                        +
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => decrementBox(index)}
                                        className="quantity-btn decrement-btn"
                                        aria-label={t('decrease', 'Decrease')}
                                    >
                                        -
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

BoxSelection.propTypes = {
    boxDetails: PropTypes.arrayOf(PropTypes.shape({
        boxSize: PropTypes.string.isRequired,
        numberOfBoxes: PropTypes.number.isRequired
    })).isRequired,
    onBoxDetailsChange: PropTypes.func.isRequired
};

export default BoxSelection;