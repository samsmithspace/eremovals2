// Updated DateTimePicker.js with dynamic page extension
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
 * Custom hook to dynamically extend page height when calendar is open
 */
const useDynamicPageExtension = () => {
  const originalHeights = React.useRef(null);

  useEffect(() => {
    const handleCalendarResize = () => {
      const calendar = document.querySelector('.rdtPicker');
      const quotePage = document.querySelector('.quote-page');

      if (calendar && quotePage) {
        const calendarRect = calendar.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const footerHeight = 100;

        // Calculate overflow amount
        const overflowAmount = calendarRect.bottom - (windowHeight - footerHeight);

        if (overflowAmount > 0) {
          // Store original heights
          if (!originalHeights.current) {
            originalHeights.current = {
              pageHeight: quotePage.style.minHeight || '',
              bodyHeight: document.body.style.minHeight || ''
            };
          }

          // Calculate new heights
          const currentPageHeight = quotePage.offsetHeight;
          const extensionAmount = Math.max(overflowAmount + 100, 400); // Minimum 400px extension
          const newMinHeight = currentPageHeight + extensionAmount;

          // Apply new heights
          quotePage.style.minHeight = `${newMinHeight}px`;
          document.body.style.minHeight = `${newMinHeight}px`;
          document.body.classList.add('calendar-extended');

          console.log('Calendar extended page by:', extensionAmount, 'px');
        }
      } else {
        // Calendar closed - restore original heights
        if (originalHeights.current && quotePage) {
          quotePage.style.minHeight = originalHeights.current.pageHeight;
          document.body.style.minHeight = originalHeights.current.bodyHeight;
          document.body.classList.remove('calendar-extended');
          originalHeights.current = null;

          console.log('Page height restored');
        }
      }
    };

    // Observer for calendar DOM changes
    const observer = new MutationObserver((mutations) => {
      let shouldCheck = false;

      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const addedNodes = Array.from(mutation.addedNodes);
          const removedNodes = Array.from(mutation.removedNodes);

          const calendarChanged = [...addedNodes, ...removedNodes].some(node =>
              node.nodeType === 1 && (
                node.classList?.contains('rdtPicker') ||
                node.querySelector?.('.rdtPicker')
              )
          );

          if (calendarChanged) {
            shouldCheck = true;
          }
        }
      });

      if (shouldCheck) {
        // Small delay to ensure DOM is fully updated
        setTimeout(handleCalendarResize, 100);
      }
    });

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Handle window resize
    const handleResize = () => {
      setTimeout(handleCalendarResize, 100);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);

      // Restore heights on cleanup
      const quotePage = document.querySelector('.quote-page');
      if (originalHeights.current && quotePage) {
        quotePage.style.minHeight = originalHeights.current.pageHeight;
        document.body.style.minHeight = originalHeights.current.bodyHeight;
        document.body.classList.remove('calendar-extended');
      }
    };
  }, []);
};

/**
 * Enhanced DateTimePicker with dynamic page extension
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

  // Use the dynamic page extension hook
  useDynamicPageExtension();

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

    // Show time picker after date selection
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

      {/* Time Selection */}
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
 * Time slot selector component
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
 * Individual time slot button
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