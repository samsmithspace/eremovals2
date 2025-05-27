// src/features/quotes/components/QuotePage.js
import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import LocationSummary from '../../locations/components/LocationSummary';
import QuoteSummary from './QuoteSummary';
import QuoteActions from './QuoteActions';
import { useQuoteCalculation } from '../hooks/useQuoteCalculation';
import MoveOptions from '../../inventory/components/MoveOptions';
import './QuotePage.css'; // Add this import at the top
/**
 * Main quote page component that orchestrates the quote creation process
 */
const QuotePage = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const quoteActionsRef = useRef(null);
    const childRef = useRef();

    // State management
    const [moveDetails, setMoveDetails] = useState({});
    const [isDetailsConfirmed, setIsDetailsConfirmed] = useState(false);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [showSummary, setShowSummary] = useState(false);
    const [showOptions, setShowOptions] = useState(true);
    const [triggerUpdate, setTriggerUpdate] = useState(0);

    // Extract data from navigation state
    const { startLocation, destinationLocation, locationType } = location.state || {};

    // Custom hook for quote calculation
    const {
        quote,
        isCalculating,
        error: calculationError,
        calculateQuote,
        resetQuote
    } = useQuoteCalculation();

    // Effect to trigger child component updates
    useEffect(() => {
        if (childRef.current) {
            childRef.current.childFunction();
        }
    }, [triggerUpdate]);

    // Effect to scroll to quote actions when confirmed
    useEffect(() => {
        if (isDetailsConfirmed && quoteActionsRef.current) {
            quoteActionsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [isDetailsConfirmed]);

    const handleDetailsChange = (details) => {
        setMoveDetails(details);
        setTriggerUpdate(prev => prev + 1);
    };

    const handleDateChange = (selectedDate) => {
        setDate(selectedDate);
        setShowSummary(true);
        setTriggerUpdate(prev => prev + 1);
    };

    const handleTimeChange = (selectedTime) => {
        setTime(selectedTime);
        setTriggerUpdate(prev => prev + 1);
    };

    const handleConfirmDetails = async () => {
        try {
            const quoteData = {
                startLocation,
                destinationLocation,
                moveType: locationType.locationType,
                details: moveDetails,
                date,
                time
            };

            await calculateQuote(quoteData);
            setIsDetailsConfirmed(true);
        } catch (error) {
          //  console.error('Error confirming details:', error);
        }
    };

    const hideOptions = () => {
        setShowOptions(false);
    };

    const handleQuoteSubmitted = (bookingData) => {
        // Handle successful quote submission
       // console.log('Quote submitted:', bookingData);
    };

    if (!startLocation || !destinationLocation) {
        return (
            <div className="quote-page-error">
                <h2>{t('missingLocationData', 'Missing Location Data')}</h2>
                <p>{t('pleaseSelectLocations', 'Please select your pickup and destination locations first.')}</p>
            </div>
        );
    }

    return (
        <div className="quote-page">
            {/* Header Section - Only show when options are visible */}
            {showOptions && (
                <QuotePageHeader
                    startLocation={startLocation}
                    destinationLocation={destinationLocation}
                />
            )}

            {/* Move Options Section */}
            {showOptions && (
                <MoveOptionsSection
                    locationType={locationType}
                    onDetailsChange={handleDetailsChange}
                    onDateChange={handleDateChange}
                    onTimeChange={handleTimeChange}
                />
            )}

            {/* Quote Summary Section */}
            {showSummary && (
                <QuoteSummary
                    ref={childRef}
                    hideOptions={hideOptions}
                    moveType={locationType.locationType}
                    details={moveDetails}
                    date={date}
                    time={time}
                    startLocation={startLocation}
                    destinationLocation={destinationLocation}
                    onConfirmDetails={handleConfirmDetails}
                    isCalculating={isCalculating}
                    calculationError={calculationError}
                />
            )}

            {/* Quote Actions Section */}
            {isDetailsConfirmed && quote && (
                <div ref={quoteActionsRef}>
                    <QuoteActions
                        bookingId={quote.bookingId}
                        price={quote.price}
                        helperPrice={quote.helperPrice}
                        onSubmitted={handleQuoteSubmitted}
                    />
                </div>
            )}
        </div>
    );
};

/**
 * Header section component for the quote page
 */
const QuotePageHeader = ({ startLocation, destinationLocation }) => {
    const { t } = useTranslation();

    return (
        <header className="quote-header">
            <h2>{t('details', 'Details')}</h2>
            <LocationSummary
                startLocation={startLocation}
                destinationLocation={destinationLocation}
            />
        </header>
    );
};

/**
 * Move options section component
 */
const MoveOptionsSection = ({
                                locationType,
                                onDetailsChange,
                                onDateChange,
                                onTimeChange
                            }) => {
    const { t } = useTranslation();

    return (
        <div className="move-options-section">

            <MoveOptions
                onDetailsChange={onDetailsChange}
                onDateChange={onDateChange}
                onTimeChange={onTimeChange}
                locationType={locationType}
            />
        </div>
    );
};

QuotePageHeader.propTypes = {
    startLocation: PropTypes.string.isRequired,
    destinationLocation: PropTypes.string.isRequired
};

MoveOptionsSection.propTypes = {
    locationType: PropTypes.object.isRequired,
    onDetailsChange: PropTypes.func.isRequired,
    onDateChange: PropTypes.func.isRequired,
    onTimeChange: PropTypes.func.isRequired
};

export default QuotePage;