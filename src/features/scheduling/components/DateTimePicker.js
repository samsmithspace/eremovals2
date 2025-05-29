// Updated DateTimePicker.js with custom inline calendar (no React DateTime)
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { useAvailableTimeSlots } from '../hooks/useAvailableTimeSlots';
import { Alert, Spinner } from '../../../common/components/ui';
import './DateTimePicker.css';

/**
 * Enhanced DateTimePicker with custom inline calendar
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
    // Only show summary when both date AND time are selected
    setShowSummary(selectedDate && selectedTime);
  }, [selectedDate, selectedTime]);

  const handleDateChange = async (newDate) => {
    if (!moment(newDate).isValid()) return;

    const momentDate = moment(newDate);
    setSelectedDate(momentDate);
    setSelectedTime(null);
    setShowTimePicker(true);

    if (onDateChange) {
      onDateChange(momentDate.format('YYYY-MM-DD'));
    }
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

  const isDateUnavailable = (date) => {
    const dateString = moment(date).format('YYYY-MM-DD');
    return unavailableDates.includes(dateString);
  };

  const isValidDate = (date) => {
    const momentDate = moment(date);

    // Must be today or future
    if (!momentDate.isSameOrAfter(moment(), 'day')) {
      return false;
    }

    // Check against unavailable dates
    if (isDateUnavailable(date)) {
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
      if (dayOfWeek === 0 || dayOfWeek === 6) {
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

      {/* Custom Inline Calendar */}
      <CustomInlineCalendar
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        isValidDate={isValidDate}
        disabled={disabled}
        label={t('scheduling.selectDate', 'Select your preferred date')}
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
 * Custom inline calendar component
 */
const CustomInlineCalendar = ({
                                selectedDate,
                                onDateChange,
                                isValidDate,
                                disabled,
                                label
                              }) => {
  const { t } = useTranslation();
  const [currentMonth, setCurrentMonth] = useState(moment());

  const today = moment();
  const startOfMonth = moment(currentMonth).startOf('month');
  const endOfMonth = moment(currentMonth).endOf('month');
  const startOfCalendar = moment(startOfMonth).startOf('week');
  const endOfCalendar = moment(endOfMonth).endOf('week');

  // Generate calendar days
  const calendarDays = [];
  const day = moment(startOfCalendar);

  while (day.isSameOrBefore(endOfCalendar)) {
    calendarDays.push(moment(day));
    day.add(1, 'day');
  }

  const handlePreviousMonth = () => {
    setCurrentMonth(prev => moment(prev).subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => moment(prev).add(1, 'month'));
  };

  const handleDateClick = (date) => {
    if (disabled || !isValidDate(date)) return;
    onDateChange(date);
  };

  const isToday = (date) => date.isSame(today, 'day');
  const isSelected = (date) => selectedDate && date.isSame(selectedDate, 'day');
  const isCurrentMonth = (date) => date.isSame(currentMonth, 'month');

  return (
    <div className="date-selector-section custom-inline-calendar">
      <label className="date-label">
        {label}
      </label>
      <p className="section-description">
        Choose any date from today onwards. We're available 7 days a week.
      </p>

      {/* Custom Calendar */}
      <div className="custom-calendar-container">
        <div className="custom-calendar">
          {/* Calendar Header */}
          <div className="calendar-header">
            <button
              type="button"
              className="nav-button prev-button"
              onClick={handlePreviousMonth}
              disabled={disabled}
            >
              ‹
            </button>

            <div className="month-year-display">
              <span className="month-name">{currentMonth.format('MMMM')}</span>
              <span className="year-name">{currentMonth.format('YYYY')}</span>
            </div>

            <button
              type="button"
              className="nav-button next-button"
              onClick={handleNextMonth}
              disabled={disabled}
            >
              ›
            </button>
          </div>

          {/* Day Headers */}
          <div className="calendar-weekdays">
            {moment.weekdaysShort().map(day => (
              <div key={day} className="weekday-header">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="calendar-grid">
            {calendarDays.map((date, index) => (
              <button
                key={index}
                type="button"
                className={`calendar-day ${
                  !isCurrentMonth(date) ? 'other-month' : ''
                } ${
                  isToday(date) ? 'today' : ''
                } ${
                  isSelected(date) ? 'selected' : ''
                } ${
                  !isValidDate(date) ? 'disabled' : ''
                }`}
                onClick={() => handleDateClick(date)}
                disabled={disabled || !isValidDate(date)}
              >
                <span className="day-number">{date.format('D')}</span>
                {isToday(date) && <span className="today-indicator"></span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Date Display */}
      {selectedDate && (
        <div className="selected-date-display">
          <div className="date-preview">
            <span className="preview-icon">📅</span>
            <span className="preview-text">
              Selected: {selectedDate.format('dddd, MMMM Do, YYYY')}
            </span>
          </div>
        </div>
      )}

      {/* Helper Text */}
      <div className="calendar-helper-text">
        <p>Click on any available date above to continue</p>
      </div>
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
        {t('scheduling.availableTimeSlots', 'Available Time Slots')}
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

  // Add null checks to prevent errors
  if (!selectedDate || !selectedTime) {
    return null;
  }

  // Calculate days from now more accurately by comparing start of days
  const today = moment().startOf('day');
  const selectedDay = moment(selectedDate).startOf('day');
  const daysFromNow = selectedDay.diff(today, 'days');

  const isToday = daysFromNow === 0;
  const isTomorrow = daysFromNow === 1;

  // Debug logging (remove in production)
  console.log('Today:', today.format('YYYY-MM-DD'));
  console.log('Selected:', selectedDay.format('YYYY-MM-DD'));
  console.log('Days from now:', daysFromNow);
  console.log('Is today:', isToday, 'Is tomorrow:', isTomorrow);

  return (
    <div className="datetime-summary">
      <div className="summary-header">
        <span className="summary-check-icon">✅</span>
        <h4>{t('schedulingSummary', 'Scheduling Confirmed')}</h4>
      </div>

      <div className="summary-content">
        <div className="summary-main-info">
          <div className="date-time-display">
            <span className="date-display">
              {selectedDate.format('dddd, MMMM Do, YYYY')}
            </span>
            <span className="time-display">
              at {selectedTime.format('h:mm A')}
            </span>
          </div>

          <div className="timing-badge">
            {isToday && <span className="badge today-badge">Today</span>}
            {isTomorrow && <span className="badge tomorrow-badge">Tomorrow</span>}
            {!isToday && !isTomorrow && daysFromNow > 0 && (
              <span className="badge future-badge">
                In {daysFromNow} {daysFromNow === 1 ? 'day' : 'days'}
              </span>
            )}
            {daysFromNow < 0 && (
              <span className="badge past-badge">Past Date</span>
            )}
          </div>
        </div>

        <div className="summary-confirmation">
          <p>
            Perfect! We'll be ready for your move on{' '}
            <strong>{selectedDate.format('dddd, MMMM Do')}</strong> at{' '}
            <strong>{selectedTime.format('h:mm A')}</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};

// PropTypes
CustomInlineCalendar.propTypes = {
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