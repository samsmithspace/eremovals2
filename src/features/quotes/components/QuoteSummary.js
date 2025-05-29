// src/features/quotes/components/QuoteSummary.js - Fixed translation usage
import React, { forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import BookingSummary from '../../booking/components/BookingSummary';
import { Button, Spinner, Alert } from '../../../common/components/ui';
import './QuoteSummary.css';

// Add inline styles for the simple booking details
const styles = {
    bookingDetails: {
        background: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    },
    detailSection: {
        marginBottom: '1.5rem'
    },
    detailSectionH3: {
        color: '#2d3748',
        fontSize: '1.25rem',
        fontWeight: '600',
        marginBottom: '1rem',
        borderBottom: '2px solid #e2e8f0',
        paddingBottom: '0.5rem'
    },
    detailItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.5rem 0',
        borderBottom: '1px solid #f7fafc'
    },
    label: {
        fontWeight: '600',
        color: '#4a5568'
    },
    value: {
        color: '#2d3748'
    }
};

/**
 * Quote summary component that displays all booking details and allows confirmation
 */
const QuoteSummary = forwardRef(({
                                     hideOptions,
                                     moveType,
                                     details,
                                     date,
                                     time,
                                     startLocation,
                                     destinationLocation,
                                     onConfirmDetails,
                                     isCalculating,
                                     calculationError
                                 }, ref) => {
    const { t } = useTranslation();

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
        childFunction: () => {
            console.log('QuoteSummary child function called');
        }
    }));

    // Prepare booking data for display
    const bookingData = {
        startLocation,
        destinationLocation,
        moveType,
        date,
        time,
        details,
        // Add any additional fields needed for display
        boxDetails: details.boxDetails || [],
        furnitureDetails: details.furnitureDetails || [],
        applianceDetails: details.applianceDetails || [],
        specialItems: details.specialItems || [],
        liftAvailable: details.liftAvailable || false,
        numberOfStairs: details.numberOfStairs || 0,
        liftAvailabledest: details.liftAvailabledest || false,
        numberofstairsright: details.numberofstairsright || 0
    };

    const handleConfirm = async () => {
        console.log('Confirming quote with data:', bookingData);

        // Hide the options sections
        if (hideOptions) {
            hideOptions();
        }

        // Call the parent's confirm handler
        if (onConfirmDetails) {
            await onConfirmDetails();
        }
    };

    const handleEdit = () => {
        console.log('Edit requested - this would go back to options');
        // This could navigate back to edit mode if needed
    };

    return (
      <div className="quote-summary">
          <div className="summary-header">
              <h1>{t('reviewYourBooking', 'Review Your Booking')}</h1>
              <p className="summary-description">
                  {t('reviewDescription', 'Please review all details before confirming your booking.')}
              </p>
          </div>

          {calculationError && (
            <Alert variant="error" title={t('calculationError', 'Calculation Error')}>
                {calculationError}
            </Alert>
          )}

          <div className="quote-details-container">
              {/* Simple summary display instead of BookingSummary to avoid translation issues */}
              <div className="booking-details" style={styles.bookingDetails}>
                  <div className="detail-section" style={styles.detailSection}>
                      <h3 style={styles.detailSectionH3}>Move Details</h3>
                      <div className="detail-item" style={styles.detailItem}>
                          <span className="label" style={styles.label}>From:</span>
                          <span className="value" style={styles.value}>{startLocation}</span>
                      </div>
                      <div className="detail-item" style={styles.detailItem}>
                          <span className="label" style={styles.label}>To:</span>
                          <span className="value" style={styles.value}>{destinationLocation}</span>
                      </div>
                      <div className="detail-item" style={styles.detailItem}>
                          <span className="label" style={styles.label}>Move Type:</span>
                          <span className="value" style={styles.value}>{moveType}</span>
                      </div>
                      <div className="detail-item" style={styles.detailItem}>
                          <span className="label" style={styles.label}>Date:</span>
                          <span className="value" style={styles.value}>{date}</span>
                      </div>
                      <div className="detail-item" style={styles.detailItem}>
                          <span className="label" style={styles.label}>Time:</span>
                          <span className="value" style={styles.value}>{time}</span>
                      </div>
                  </div>

                  {/* Items Summary */}
                  {details.boxDetails && details.boxDetails.some(box => box.numberOfBoxes > 0) && (
                    <div className="detail-section" style={styles.detailSection}>
                        <h3 style={styles.detailSectionH3}>Boxes</h3>
                        {details.boxDetails.map((box, index) =>
                            box.numberOfBoxes > 0 && (
                              <div key={index} className="detail-item" style={styles.detailItem}>
                                  <span className="label" style={styles.label}>{box.boxSize}:</span>
                                  <span className="value" style={styles.value}>{box.numberOfBoxes} boxes</span>
                              </div>
                            )
                        )}
                    </div>
                  )}

                  {details.furnitureDetails && details.furnitureDetails.length > 0 && (
                    <div className="detail-section" style={styles.detailSection}>
                        <h3 style={styles.detailSectionH3}>Furniture</h3>
                        {details.furnitureDetails.map((furniture, index) => (
                          <div key={index} className="detail-item" style={styles.detailItem}>
                              <span className="label" style={styles.label}>{furniture.item}:</span>
                              <span className="value" style={styles.value}>{furniture.quantity}</span>
                          </div>
                        ))}
                    </div>
                  )}

                  {details.applianceDetails && details.applianceDetails.length > 0 && (
                    <div className="detail-section" style={styles.detailSection}>
                        <h3 style={styles.detailSectionH3}>Appliances</h3>
                        {details.applianceDetails.map((appliance, index) => (
                          <div key={index} className="detail-item" style={styles.detailItem}>
                              <span className="label" style={styles.label}>{appliance.item}:</span>
                              <span className="value" style={styles.value}>{appliance.quantity}</span>
                          </div>
                        ))}
                    </div>
                  )}
              </div>

              {/* Confirmation Section */}
              <div className="confirm-button-container">
                  <Button
                    onClick={handleConfirm}
                    variant="primary"
                    size="lg"
                    disabled={isCalculating}
                    className="confirm-button"
                  >
                      {isCalculating ? (
                        <>
                            <Spinner size="sm" />
                            {t('calculating', 'Calculating...')}
                        </>
                      ) : (
                        t('confirmAndGetQuote', 'Confirm & Get Quote')
                      )}
                  </Button>
              </div>

              {/* Additional Information */}
              <div className="quote-info">
                  <p className="info-text">
                      {t('quoteInfoText', 'After confirmation, you\'ll receive a detailed quote with pricing information.')}
                  </p>
              </div>
          </div>
      </div>
    );
});

QuoteSummary.displayName = 'QuoteSummary';

QuoteSummary.propTypes = {
    hideOptions: PropTypes.func,
    moveType: PropTypes.string.isRequired,
    details: PropTypes.object.isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    startLocation: PropTypes.string.isRequired,
    destinationLocation: PropTypes.string.isRequired,
    onConfirmDetails: PropTypes.func.isRequired,
    isCalculating: PropTypes.bool,
    calculationError: PropTypes.string
};

export default QuoteSummary;