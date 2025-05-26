// src/features/scheduling/components/DateTimePicker.js
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import DateTime from 'react-datetime';
import moment from 'moment';
import 'react-datetime/css/react-datetime.css';
import { useAvailableTimeSlots } from '../hooks/useAvailableTimeSlots';
import { Alert, Spinner } from '../../../common/components/ui';
import './DateTimePicker.css';

/**
 * Modern date and time picker component with enhanced UX
 */
const DateTimePicker = ({
                          onDateChange,
                          onTimeChange,
                          restrictions = {},
                          disabled = false
                        }) => {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  // Custom hook for available time slots
  const {
    availableTimeSlots,
    unavailableDates,
    isLoading,
    error,
    fetchTimeSlots
  } = useAvailableTimeSlots();

  useEffect(() => {
    if (selectedDate && moment(selectedDate).isValid()) {
      fetchTimeSlots(selectedDate.format('YYYY-MM-DD'));
    }
  }, [selectedDate, fetchTimeSlots]);

  useEffect(() => {
    setShowSummary(selectedDate && selectedTime);
  }, [selectedDate, selectedTime]);

  const handleDateChange = async (newDate) => {
    if (!moment(newDate).isValid()) return;

    const momentDate = moment(newDate);
    setSelectedDate(momentDate);
    setSelectedTime(null);
    setShowTimePicker(false);

    if (onDateChange) {
      onDateChange(momentDate.format('YYYY-MM-DD'));
    }

    // Automatically show time picker after date selection
    setTimeout(() => setShowTimePicker(true), 500);
  };

  const handleTimeChange = (timeSlot) => {
    if (!timeSlot) return;

    const timeValue = typeof timeSlot === 'string'
      ? moment(timeSlot, 'HH:mm')
      : moment(timeSlot);

    if (!timeValue.isValid()) return;

    setSelectedTime(timeValue);

    if (onTimeChange) {
      onTimeChange(timeValue.format('HH:mm'));
    }
  };

  const isDateUnavailable = (currentDate) => {
    const dateString = moment(currentDate).format('YYYY-MM-DD');
    return unavailableDates.includes(dateString);
  };

  const isValidDate = (currentDate) => {
    const momentDate = moment(currentDate);

    // Must be today or future
    if (!momentDate.isSameOrAfter(moment(), 'day')) {
      return false;
    }

    // Check against unavailable dates
    if (isDateUnavailable(currentDate)) {
      return false;
    }

    // Apply custom restrictions
    if (restrictions.maxDaysInAdvance) {
      const maxDate = moment().add(restrictions.maxDaysInAdvance, 'days');
      if (momentDate.isAfter(maxDate)) {
        return false;
      }
    }

    if (restrictions.excludeWeekends) {
      const dayOfWeek = momentDate.day();
      if (dayOfWeek === 0 || dayOfWeek === 6) { // Sunday = 0, Saturday = 6
        return false;
      }
    }

    return true;
  };

  return (
    <div className="date-time-picker">
      {error && (
        <Alert variant="error" title={t('schedulingError', 'Scheduling Error')}>
          {error}
        </Alert>
      )}

      {/* Date Selection */}
      <DateSelector
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        isValidDate={isValidDate}
        disabled={disabled}
        label={t('selectDate', 'Select your preferred date')}
      />

      {/* Time Selection - Only show when date is selected */}
      {showTimePicker && selectedDate && (
        <TimeSlotSelector
          availableTimeSlots={availableTimeSlots}
          selectedTime={selectedTime}
          onTimeSelect={handleTimeChange}
          isLoading={isLoading}
          disabled={disabled}
          selectedDate={selectedDate}
        />
      )}

      {/* Summary Display */}
      {showSummary && (
        <DateTimeSummary
          selectedDate={selectedDate}
          selectedTime={selectedTime}
        />
      )}
    </div>
  );
};

/**
 * Enhanced date selector component
 */
const DateSelector = ({
                        selectedDate,
                        onDateChange,
                        isValidDate,
                        disabled,
                        label
                      }) => {
  const { t } = useTranslation();

  return (
    <div className="date-selector-section">
      <label htmlFor="date-input" className="date-label">
        {label}
      </label>
      <p className="section-description">
        Choose any date from today onwards. We're available 7 days a week.
      </p>
      <DateTime
        id="date-input"
        value={selectedDate}
        onChange={onDateChange}
        dateFormat="MMMM Do, YYYY"
        timeFormat={false}
        isValidDate={isValidDate}
        closeOnSelect={true}
        disabled={disabled}
        inputProps={{
          id: 'date-input',
          placeholder: 'Click to select a date',
          readOnly: true
        }}
        className="date-picker"
      />
      {selectedDate && (
        <div className="date-preview">
          <span className="preview-icon">📅</span>
          <span className="preview-text">
                        Selected: {selectedDate.format('dddd, MMMM Do, YYYY')}
                    </span>
        </div>
      )}
    </div>
  );
};

/**
 * Modern time slot selector component
 */
const TimeSlotSelector = ({
                            availableTimeSlots,
                            selectedTime,
                            onTimeSelect,
                            isLoading,
                            disabled,
                            selectedDate
                          }) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="time-selector-loading">
        <div className="loading-spinner"></div>
        <span className="loading-text">
                    {t('loadingAvailableTimes', 'Finding available times...')}
                </span>
      </div>
    );
  }

  if (!availableTimeSlots.length) {
    return (
      <div className="no-available-times">
        <span>{t('noAvailableTimesForDate', 'No available time slots for this date.')}</span>
        <p>Please select a different date or contact us directly.</p>
      </div>
    );
  }

  return (
    <div className="available-time-slots">
      <h4 className="slots-title">
        {t('availableTimeSlots', 'Available Time Slots')}
      </h4>
      <p className="section-description">
        Choose the time that works best for you on {selectedDate.format('MMMM Do')}.
      </p>

      <div className="time-slots-grid">
        {availableTimeSlots.map((slot, index) => {
          const [startTime, endTime] = slot.split('-');
          const startMoment = moment(startTime, 'HH:mm');
          const endMoment = moment(endTime, 'HH:mm');

          const isSelected = selectedTime &&
            selectedTime.format('HH:mm') === startTime;

          return (
            <TimeSlotButton
              key={index}
              startTime={startTime}
              endTime={endTime}
              startMoment={startMoment}
              endMoment={endMoment}
              isSelected={isSelected}
              onSelect={() => onTimeSelect(startTime)}
              disabled={disabled}
            />
          );
        })}
      </div>
    </div>
  );
};

/**
 * Individual time slot button with enhanced styling
 */
const TimeSlotButton = ({
                          startTime,
                          endTime,
                          startMoment,
                          endMoment,
                          isSelected,
                          onSelect,
                          disabled
                        }) => {
  const duration = endMoment.diff(startMoment, 'hours');
  const period = startMoment.format('A');

  return (
    <button
      type="button"
      className={`time-slot-button ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
      disabled={disabled}
    >
      <div className="slot-main-time">
        {startMoment.format('h:mm')} - {endMoment.format('h:mm')}
      </div>
      <div className="slot-period">{period}</div>
      <div className="slot-duration">{duration}h window</div>
    </button>
  );
};

/**
 * Summary component showing selected date and time
 */
const DateTimeSummary = ({ selectedDate, selectedTime }) => {
  const { t } = useTranslation();

  return (
    <div className="datetime-summary">
      <h4>{t('schedulingSummary', 'Your Scheduling Summary')}</h4>

      <div className="summary-details">
        <div className="summary-item">
          <div className="summary-item-label">Date</div>
          <div className="summary-item-value">
            {selectedDate.format('dddd, MMM Do')}
          </div>
        </div>

        <div className="summary-item">
          <div className="summary-item-label">Time</div>
          <div className="summary-item-value">
            {selectedTime.format('h:mm A')}
          </div>
        </div>

        <div className="summary-item">
          <div className="summary-item-label">Days from now</div>
          <div className="summary-item-value">
            {selectedDate.diff(moment(), 'days') === 0
              ? 'Today'
              : `${selectedDate.diff(moment(), 'days')} days`
            }
          </div>
        </div>
      </div>

      <div className="summary-note">
        <p>
          ✅ Perfect! We'll be ready for your move on{' '}
          <strong>{selectedDate.format('dddd, MMMM Do')}</strong> at{' '}
          <strong>{selectedTime.format('h:mm A')}</strong>.
        </p>
      </div>
    </div>
  );
};

// PropTypes
DateSelector.propTypes = {
  selectedDate: PropTypes.object,
  onDateChange: PropTypes.func.isRequired,
  isValidDate: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  label: PropTypes.string.isRequired
};

TimeSlotSelector.propTypes = {
  availableTimeSlots: PropTypes.array.isRequired,
  selectedTime: PropTypes.object,
  onTimeSelect: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  selectedDate: PropTypes.object.isRequired
};

TimeSlotButton.propTypes = {
  startTime: PropTypes.string.isRequired,
  endTime: PropTypes.string.isRequired,
  startMoment: PropTypes.object.isRequired,
  endMoment: PropTypes.object.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

DateTimeSummary.propTypes = {
  selectedDate: PropTypes.object.isRequired,
  selectedTime: PropTypes.object.isRequired
};

DateTimePicker.propTypes = {
  onDateChange: PropTypes.func.isRequired,
  onTimeChange: PropTypes.func.isRequired,
  restrictions: PropTypes.shape({
    maxDaysInAdvance: PropTypes.number,
    excludeWeekends: PropTypes.bool
  }),
  disabled: PropTypes.bool
};

export default DateTimePicker;