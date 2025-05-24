// src/features/booking/components/BookingSummary.js
import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

/**
 * Component to display a summary of booking details
 * @param {Object} props
 * @param {Object} props.bookingData - Booking information to display
 * @param {boolean} props.showActions - Whether to show action buttons
 * @param {Function} props.onEdit - Callback when edit is requested
 * @param {Function} props.onConfirm - Callback when confirmation is requested
 */
const BookingSummary = ({
                            bookingData,
                            showActions = false,
                            onEdit,
                            onConfirm
                        }) => {
    const { t } = useTranslation();

    const {
        startLocation,
        destinationLocation,
        moveType,
        date,
        time,
        distance,
        price,
        details = {}
    } = bookingData;

    const formatMoveType = (type) => {
        const moveTypes = {
            student: t('studentMove', 'Student Move'),
            house: t('houseMove', 'House Move'),
            courier: t('courierDelivery', 'Courier Delivery')
        };
        return moveTypes[type] || type;
    };

    return (
        <div className="booking-summary">
            <div className="summary-header">
                <h3>{t('bookingSummary', 'Booking Summary')}</h3>
            </div>

            <div className="summary-content">
                {/* Location Details */}
                <div className="summary-section">
                    <h4>{t('locations', 'Locations')}</h4>
                    <div className="location-item">
                        <span className="label">{t('from', 'From')}:</span>
                        <span className="value">{startLocation}</span>
                    </div>
                    <div className="location-item">
                        <span className="label">{t('to', 'To')}:</span>
                        <span className="value">{destinationLocation}</span>
                    </div>
                    {distance && (
                        <div className="location-item">
                            <span className="label">{t('distance', 'Distance')}:</span>
                            <span className="value">{distance}</span>
                        </div>
                    )}
                </div>

                {/* Move Details */}
                <div className="summary-section">
                    <h4>{t('moveDetails', 'Move Details')}</h4>
                    <div className="detail-item">
                        <span className="label">{t('moveType', 'Move Type')}:</span>
                        <span className="value">{formatMoveType(moveType)}</span>
                    </div>
                    <div className="detail-item">
                        <span className="label">{t('date', 'Date')}:</span>
                        <span className="value">{date}</span>
                    </div>
                    <div className="detail-item">
                        <span className="label">{t('time', 'Time')}:</span>
                        <span className="value">{time}</span>
                    </div>
                </div>

                {/* Item Details */}
                {details.boxDetails && details.boxDetails.length > 0 && (
                    <div className="summary-section">
                        <h4>{t('items', 'Items')}</h4>
                        {details.boxDetails.map((box, index) => (
                            box.numberOfBoxes > 0 && (
                                <div key={index} className="item-detail">
                                    <span>{box.numberOfBoxes} {t(box.boxSize, box.boxSize)} {t('boxes', 'boxes')}</span>
                                </div>
                            )
                        ))}
                    </div>
                )}

                {/* Access Details */}
                {(details.liftAvailable !== undefined || details.numberOfStairs) && (
                    <div className="summary-section">
                        <h4>{t('accessDetails', 'Access Details')}</h4>
                        <div className="access-detail">
                            <span className="label">{t('pickup', 'Pickup')}:</span>
                            <span className="value">
                {details.liftAvailable ? t('liftAvailable', 'Lift Available') : t('noLift', 'No Lift')}
                                {details.numberOfStairs > 0 && `, ${details.numberOfStairs} ${t('floors', 'floors')}`}
              </span>
                        </div>
                        <div className="access-detail">
                            <span className="label">{t('destination', 'Destination')}:</span>
                            <span className="value">
                {details.liftAvailabledest ? t('liftAvailable', 'Lift Available') : t('noLift', 'No Lift')}
                                {details.numberofstairsright > 0 && `, ${details.numberofstairsright} ${t('floors', 'floors')}`}
              </span>
                        </div>
                    </div>
                )}

                {/* Price */}
                {price && (
                    <div className="summary-section price-section">
                        <div className="price-item">
                            <span className="label">{t('estimatedPrice', 'Estimated Price')}:</span>
                            <span className="price-value">£{price}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            {showActions && (
                <div className="summary-actions">
                    {onEdit && (
                        <button type="button" onClick={onEdit} className="btn-secondary">
                            {t('edit', 'Edit')}
                        </button>
                    )}
                    {onConfirm && (
                        <button type="button" onClick={onConfirm} className="btn-primary">
                            {t('confirm', 'Confirm')}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

BookingSummary.propTypes = {
    bookingData: PropTypes.shape({
        startLocation: PropTypes.string.isRequired,
        destinationLocation: PropTypes.string.isRequired,
        moveType: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        time: PropTypes.string.isRequired,
        distance: PropTypes.string,
        price: PropTypes.number,
        details: PropTypes.object
    }).isRequired,
    showActions: PropTypes.bool,
    onEdit: PropTypes.func,
    onConfirm: PropTypes.func
};

export default BookingSummary;
