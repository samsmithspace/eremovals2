// src/features/quotes/components/QuotePage.js - Fixed conditional rendering
import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import LocationSummary from '../../locations/components/LocationSummary';
import QuoteSummary from './QuoteSummary';
import QuoteActions from './QuoteActions';
import DateTimePicker from '../../scheduling/components/DateTimePicker';
import { useQuoteCalculation } from '../hooks/useQuoteCalculation';
import MoveOptions from '../../inventory/components/MoveOptions';
import './QuotePage.css';

/**
 * Main quote page component with optimized layout for fixed calendar
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
    const [showDatePicker, setShowDatePicker] = useState(false);
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

    // Check if we should show quote summary (when both date and time are selected)
    useEffect(() => {
        // Show summary when we have all required data AND user has completed scheduling
        const hasAllData = date && time && moveDetails && Object.keys(moveDetails).length > 0;
        console.log('Checking summary conditions:', {
            hasDate: !!date,
            hasTime: !!time,
            hasMoveDetails: Object.keys(moveDetails).length > 0,
            hasAllData
        });

        if (hasAllData) {
            // Add a small delay to ensure the scheduling summary is shown first
            const timer = setTimeout(() => {
                console.log('Setting showSummary to true');
                setShowSummary(true);
            }, 2000); // 2 second delay to let user see the scheduling confirmation

            return () => clearTimeout(timer);
        } else {
            setShowSummary(false);
        }
    }, [date, time, moveDetails]);

    const handleDetailsChange = (details) => {
        console.log('Details changed:', details);
        setMoveDetails(details);
        // Show date picker after details are selected
        setShowDatePicker(true);
        setTriggerUpdate(prev => prev + 1);
    };

    const handleDateChange = (selectedDate) => {
        console.log('Date changed:', selectedDate);
        setDate(selectedDate);
        setTriggerUpdate(prev => prev + 1);
    };

    const handleTimeChange = (selectedTime) => {
        console.log('Time changed:', selectedTime);
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

            console.log('Confirming details with data:', quoteData);
            await calculateQuote(quoteData);
            setIsDetailsConfirmed(true);
        } catch (error) {
            console.error('Error confirming details:', error);
        }
    };

    const hideOptions = () => {
        console.log('Hiding options');
        setShowOptions(false);
    };

    const handleQuoteSubmitted = (bookingData) => {
        console.log('Quote submitted:', bookingData);
    };

    if (!startLocation || !destinationLocation) {
        return (
          <div className="quote-page-error">
              <h2>{t('missingLocationData', 'Missing Location Data')}</h2>
              <p>{t('pleaseSelectLocations', 'Please select your pickup and destination locations first.')}</p>
          </div>
        );
    }

    // Determine what to show based on current state
    const shouldShowMoveOptions = showOptions && !showSummary;
    const shouldShowDatePicker = showDatePicker && showOptions && !showSummary;
    const shouldShowQuoteSummary = showSummary && !isDetailsConfirmed;

    console.log('Render state:', {
        showOptions,
        showSummary,
        showDatePicker,
        isDetailsConfirmed,
        shouldShowMoveOptions,
        shouldShowDatePicker,
        shouldShowQuoteSummary,
        hasDate: !!date,
        hasTime: !!time,
        hasMoveDetails: Object.keys(moveDetails).length > 0
    });

    return (
      <div className="quote-page">
          {/* Header Section - Only show when options are visible */}
          {shouldShowMoveOptions && (
            <div className="quote-header">
                <h2>{t('details', 'Move Details')}</h2>
                <LocationSummary
                  startLocation={startLocation}
                  destinationLocation={destinationLocation}
                />
            </div>
          )}

          {/* Move Options Section */}
          {shouldShowMoveOptions && (
            <div className="move-options-section">
                <MoveOptions
                  locationType={locationType}
                  onDetailsChange={handleDetailsChange}
                  initialDetails={moveDetails}
                />
            </div>
          )}

          {/* Date Time Picker Section - Styled as inventory section with fixed calendar */}
          {shouldShowDatePicker && (
            <div className="move-options-section datetime-picker-wrapper">
                <div className="inventory-section">
                    <div className="section-header">
                        <h4>
                            <span className="section-icon">📅</span>
                            {t('scheduling.selectDateAndTime', 'Select Date & Time')}
                        </h4>
                    </div>
                    <div className="section-content datetime-content">
                        <DateTimePicker
                          onDateChange={handleDateChange}
                          onTimeChange={handleTimeChange}
                          restrictions={{
                              maxDaysInAdvance: 90,
                              excludeWeekends: false
                          }}
                        />
                    </div>
                </div>
            </div>
          )}

          {/* Quote Summary Section */}
          {shouldShowQuoteSummary && (
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

export default QuotePage;