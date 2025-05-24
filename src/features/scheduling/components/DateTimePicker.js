// src/features/scheduling/components/DateTimePicker.js
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import DateTime from 'react-datetime';
import moment from 'moment';
import 'react-datetime/css/react-datetime.css';
import { useAvailableTimeSlots } from '../hooks/useAvailableTimeSlots';
import { Alert, Spinner } from '../../../common/components/ui';

/**
 * Date and time picker component with availability checking
 * @param {Object} props
 * @param {Function} props.onDateChange - Callback when date is selected
 * @param {Function} props.onTimeChange - Callback when time is selected
 * @param {Object} props.restrictions - Date/time restrictions
 * @param {boolean} props.disabled - Whether the picker is disabled
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
        setTimeout(() => setShowTimePicker(true), 100);
    };

    const handleTimeChange = (newTime) => {
        if (!moment(newTime).isValid()) return;

        const timeValue = moment(newTime);

        // Validate if time is within available slots
        if (!isTimeInAvailableSlots(timeValue)) {
            return;
        }

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

    const isTimeInAvailableSlots = (timeValue) => {
        if (!availableTimeSlots.length) return false;

        return availableTimeSlots.some(slot => {
            const [startTime, endTime] = slot.split('-').map(t => moment(t, 'HH:mm'));
            return timeValue.isBetween(startTime, endTime, 'minute', '[]');
        });
    };

    const getTimeConstraints = () => {
        if (!availableTimeSlots.length) {
            return {
                hours: { min: 0, max: 23 },
                minutes: { step: 15 }
            };
        }

        // Get the earliest start time and latest end time
        const allTimes = availableTimeSlots.flatMap(slot =>
            slot.split('-').map(t => moment(t, 'HH:mm').hour())
        );

        return {
            hours: {
                min: Math.min(...allTimes),
                max: Math.max(...allTimes)
            },
            minutes: { step: 15 }
        };
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
                label={t('selectDate', 'Select Date')}
            />

            {/* Time Selection - Only show when date is selected */}
            {showTimePicker && selectedDate && (
                <TimeSelector
                    selectedTime={selectedTime}
                    onTimeChange={handleTimeChange}
                    timeConstraints={getTimeConstraints()}
                    availableTimeSlots={availableTimeSlots}
                    isLoading={isLoading}
                    disabled={disabled}
                    label={t('selectTime', 'Select Time')}
                />
            )}

            {/* Available Time Slots Display */}
            {selectedDate && !isLoading && (
                <AvailableTimeSlotsDisplay
                    timeSlots={availableTimeSlots}
                    selectedTime={selectedTime}
                    onTimeSelect={handleTimeChange}
                />
            )}

            {/* Loading State */}
            {selectedDate && isLoading && (
                <div className="time-loading">
                    <Spinner size="small" />
                    <span>{t('loadingAvailableTimes', 'Loading available times...')}</span>
                </div>
            )}

            {/* No Available Times Message */}
            {selectedDate && !isLoading && availableTimeSlots.length === 0 && (
                <Alert variant="warning">
                    {t('noAvailableTimesForDate', 'No available time slots for the selected date.')}
                </Alert>
            )}
        </div>
    );
};

/**
 * Date selector sub-component
 */
const DateSelector = ({
                          selectedDate,
                          onDateChange,
                          isValidDate,
                          disabled,
                          label
                      }) => {
    return (
        <div className="date-selector-section">
            <label htmlFor="date-input" className="date-label">
                {label}:
            </label>
            <DateTime
                id="date-input"
                value={selectedDate}
                onChange={onDateChange}
                dateFormat="YYYY-MM-DD"
                timeFormat={false}
                isValidDate={isValidDate}
                closeOnSelect={true}
                disabled={disabled}
                inputProps={{
                    id: 'date-input',
                    placeholder: 'Select a date',
                    readOnly: true
                }}
                className="date-picker"
            />
        </div>
    );
};

/**
 * Time selector sub-component
 */
const TimeSelector = ({
                          selectedTime,
                          onTimeChange,
                          timeConstraints,
                          availableTimeSlots,
                          isLoading,
                          disabled,
                          label
                      }) => {
    const { t } = useTranslation();

    if (isLoading) {
        return (
            <div className="time-selector-loading">
                <Spinner size="small" />
                <span>{t('loadingTimes', 'Loading available times...')}</span>
            </div>
        );
    }

    if (!availableTimeSlots.length) {
        return null;
    }

    return (
        <div className="time-selector-section">
            <label htmlFor="time-input" className="time-label">
                {label}:
            </label>
            <DateTime
                id="time-input"
                value={selectedTime}
                onChange={onTimeChange}
                dateFormat={false}
                timeFormat="HH:mm"
                timeConstraints={timeConstraints}
                disabled={disabled}
                inputProps={{
                    id: 'time-input',
                    placeholder: 'Select a time',
                    required: true,
                    readOnly: true
                }}
                className="time-picker"
            />
        </div>
    );
};

/**
 * Available time slots display component
 */
const AvailableTimeSlotsDisplay = ({
                                       timeSlots,
                                       selectedTime,
                                       onTimeSelect
                                   }) => {
    const { t } = useTranslation();

    if (!timeSlots.length) return null;

    return (
        <div className="available-time-slots">
            <h4 className="slots-title">
                {t('availableTimeSlots', 'Available Time Slots')}
            </h4>
            <div className="time-slots-grid">
                {timeSlots.map((slot, index) => {
                    const [startTime, endTime] = slot.split('-');
                    const isSelected = selectedTime &&
                        selectedTime.format('HH:mm') >= startTime &&
                        selectedTime.format('HH:mm') <= endTime;

                    return (
                        <TimeSlotButton
                            key={index}
                            startTime={startTime}
                            endTime={endTime}
                            isSelected={isSelected}
                            onSelect={() => onTimeSelect(moment(startTime, 'HH:mm'))}
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
const TimeSlotButton = ({ startTime, endTime, isSelected, onSelect }) => {
    return (
        <button
            type="button"
            className={`time-slot-button ${isSelected ? 'selected' : ''}`}
            onClick={onSelect}
        >
            {startTime} - {endTime}
        </button>
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

TimeSelector.propTypes = {
    selectedTime: PropTypes.object,
    onTimeChange: PropTypes.func.isRequired,
    timeConstraints: PropTypes.object.isRequired,
    availableTimeSlots: PropTypes.array.isRequired,
    isLoading: PropTypes.bool,
    disabled: PropTypes.bool,
    label: PropTypes.string.isRequired
};

AvailableTimeSlotsDisplay.propTypes = {
    timeSlots: PropTypes.array.isRequired,
    selectedTime: PropTypes.object,
    onTimeSelect: PropTypes.func.isRequired
};

TimeSlotButton.propTypes = {
    startTime: PropTypes.string.isRequired,
    endTime: PropTypes.string.isRequired,
    isSelected: PropTypes.bool.isRequired,
    onSelect: PropTypes.func.isRequired
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