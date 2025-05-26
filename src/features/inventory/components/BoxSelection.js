// src/features/inventory/components/BoxSelection.js
import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

/**
 * Modern box selection component with enhanced UX
 */
const BoxSelection = ({ boxDetails, onBoxDetailsChange }) => {
    const { t } = useTranslation();

    const boxTypes = [
        {
            key: 'small',
            size: '457mm × 305mm × 305mm',
            description: t('smallBoxDescription', 'carry-on luggage/microwave'),
            icon: '📦',
            weight: '< 10kg'
        },
        {
            key: 'medium',
            size: '457mm × 457mm × 305mm',
            description: t('mediumBoxDescription', 'night stand'),
            icon: '📋',
            weight: '10-15kg'
        },
        {
            key: 'large',
            size: '457mm × 457mm × 457mm',
            description: t('largeBoxDescription', 'or heavier than 20 kg'),
            icon: '📃',
            weight: '15-20kg'
        },
        {
            key: 'extraLarge',
            size: '457mm × 457mm × 610mm',
            description: t('extraLargeBoxDescription', 'small fridge'),
            icon: '🗃️',
            weight: '> 20kg'
        }
    ];

    const handleBoxQuantityChange = (index, quantity) => {
        const newQuantity = Math.max(0, Math.min(99, quantity));
        const newBoxDetails = [...boxDetails];
        newBoxDetails[index] = {
            ...newBoxDetails[index],
            numberOfBoxes: newQuantity
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
          <p className="section-description">
              Choose the boxes that best match your items. Our professional boxes are designed for safe transport.
          </p>

          <div className="box-options">
              {boxTypes.map((boxType, index) => {
                  const currentBox = boxDetails[index] || { boxSize: boxType.key, numberOfBoxes: 0 };
                  const isSelected = currentBox.numberOfBoxes > 0;

                  return (
                    <div
                      key={boxType.key}
                      className={`box-option ${isSelected ? 'selected' : ''}`}
                    >
                        <div className="box-info">
                            <h5>
                                <span className="box-icon">{boxType.icon}</span>
                                {t(boxType.key, boxType.key.charAt(0).toUpperCase() + boxType.key.slice(1))}
                            </h5>

                            <div className="box-specs">
                                <div className="box-size">
                                    <span className="spec-label">Size:</span>
                                    <span className="spec-value">{boxType.size}</span>
                                </div>
                                <div className="box-weight">
                                    <span className="spec-label">Weight:</span>
                                    <span className="spec-value">{boxType.weight}</span>
                                </div>
                            </div>

                            <p className="box-description">
                                <span className="description-icon">💡</span>
                                Perfect for: {boxType.description}
                            </p>
                        </div>

                        <div className="quantity-controls">
                            <label className="quantity-label">
                                {t('quantity', 'Quantity')}
                            </label>

                            <div className="input-group">
                                <button
                                  type="button"
                                  onClick={() => decrementBox(index)}
                                  className="quantity-btn decrement-btn"
                                  aria-label={t('decrease', 'Decrease')}
                                  disabled={currentBox.numberOfBoxes <= 0}
                                >
                                    −
                                </button>

                                <input
                                  type="number"
                                  min="0"
                                  max="99"
                                  value={currentBox.numberOfBoxes || ''}
                                  onChange={(e) => handleBoxQuantityChange(index, parseInt(e.target.value) || 0)}
                                  className="quantity-input"
                                  placeholder="0"
                                />

                                <button
                                  type="button"
                                  onClick={() => incrementBox(index)}
                                  className="quantity-btn increment-btn"
                                  aria-label={t('increase', 'Increase')}
                                >
                                    +
                                </button>
                            </div>

                            {currentBox.numberOfBoxes > 0 && (
                              <div className="quantity-summary">
                                        <span className="summary-text">
                                            {currentBox.numberOfBoxes} {currentBox.numberOfBoxes === 1 ? 'box' : 'boxes'} selected
                                        </span>
                              </div>
                            )}
                        </div>
                    </div>
                  );
              })}
          </div>

          {/* Total Summary */}
          <BoxSummary boxDetails={boxDetails} />
      </div>
    );
};

/**
 * Summary component showing total boxes selected
 */
const BoxSummary = ({ boxDetails }) => {
    const { t } = useTranslation();

    const totalBoxes = boxDetails.reduce((sum, box) => sum + (box.numberOfBoxes || 0), 0);

    if (totalBoxes === 0) {
        return (
          <div className="box-summary empty">
              <div className="summary-icon">📦</div>
              <p>No boxes selected yet. Choose the sizes that match your items.</p>
          </div>
        );
    }

    const selectedBoxes = boxDetails.filter(box => box.numberOfBoxes > 0);

    return (
      <div className="box-summary">
          <div className="summary-header">
              <span className="summary-icon">✅</span>
              <h4>Box Selection Summary</h4>
          </div>

          <div className="summary-content">
              <div className="total-count">
                  <span className="count-number">{totalBoxes}</span>
                  <span className="count-label">{totalBoxes === 1 ? 'Box' : 'Boxes'} Total</span>
              </div>

              <div className="breakdown">
                  {selectedBoxes.map((box, index) => (
                    <div key={box.boxSize} className="breakdown-item">
                        <span className="breakdown-count">{box.numberOfBoxes}×</span>
                        <span className="breakdown-type">
                                {box.boxSize.charAt(0).toUpperCase() + box.boxSize.slice(1)}
                            </span>
                    </div>
                  ))}
              </div>
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

BoxSummary.propTypes = {
    boxDetails: PropTypes.arrayOf(PropTypes.shape({
        boxSize: PropTypes.string.isRequired,
        numberOfBoxes: PropTypes.number.isRequired
    })).isRequired
};

export default BoxSelection;