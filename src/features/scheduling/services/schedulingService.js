// src/features/scheduling/hooks/useAvailableTimeSlots.js
import { useState, useEffect, useCallback } from 'react';
import { schedulingService } from '../services/schedulingService';

/**
 * Hook for managing available time slots and unavailable dates
 * @returns {Object} Time slots data and management functions
 */
export const useAvailableTimeSlots = () => {
    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
    const [unavailableDates, setUnavailableDates] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch unavailable dates on component mount
    useEffect(() => {
        const fetchUnavailableDates = async () => {
            try {
                const dates = await schedulingService.getUnavailableDates();
                setUnavailableDates(dates);
            } catch (err) {
                console.error('Error fetching unavailable dates:', err);
                setError('Failed to load unavailable dates');
            }
        };

        fetchUnavailableDates();
    }, []);

    const fetchTimeSlots = useCallback(async (date) => {
        if (!date) {
            setAvailableTimeSlots([]);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const timeSlots = await schedulingService.getAvailableTimeSlots(date);
            setAvailableTimeSlots(timeSlots);

            // Set default time to the start of first available slot
            if (timeSlots.length > 0) {
                const firstSlot = timeSlots[0];
                const startTime = firstSlot.split('-')[0];
                return startTime; // Return for potential use by caller
            }
        } catch (err) {
            console.error('Error fetching time slots:', err);
            setError('Failed to load available time slots');
            setAvailableTimeSlots([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const refreshAvailability = useCallback(async () => {
        try {
            const dates = await schedulingService.getUnavailableDates();
            setUnavailableDates(dates);
        } catch (err) {
            console.error('Error refreshing availability:', err);
        }
    }, []);

    const isDateAvailable = useCallback((date) => {
        const dateString = typeof date === 'string' ? date : date.format('YYYY-MM-DD');
        return !unavailableDates.includes(dateString);
    }, [unavailableDates]);

    const isTimeSlotAvailable = useCallback((date, time) => {
        if (!isDateAvailable(date)) return false;

        // Additional logic can be added here for time-specific availability
        return availableTimeSlots.some(slot => {
            const [startTime, endTime] = slot.split('-');
            return time >= startTime && time <= endTime;
        });
    }, [availableTimeSlots, isDateAvailable]);

    const getNextAvailableDate = useCallback(() => {
        const today = new Date();
        let checkDate = new Date(today);

        // Look ahead up to 30 days for next available date
        for (let i = 0; i < 30; i++) {
            const dateString = checkDate.toISOString().split('T')[0];
            if (isDateAvailable(dateString)) {
                return dateString;
            }
            checkDate.setDate(checkDate.getDate() + 1);
        }

        return null;
    }, [isDateAvailable]);

    return {
        availableTimeSlots,
        unavailableDates,
        isLoading,
        error,
        fetchTimeSlots,
        refreshAvailability,
        isDateAvailable,
        isTimeSlotAvailable,
        getNextAvailableDate
    };
};
