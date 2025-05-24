import { fetchApi } from '../../../common/utils/apiUtils';
import config from '../../../config/config';

export const schedulingService = {
    async getAvailableTimeSlots(date) {
        try {
            // Mock data for now - replace with actual API call
            const timeSlots = [
                '08:00-10:00',
                '10:00-12:00',
                '12:00-14:00',
                '14:00-16:00',
                '16:00-18:00',
                '18:00-20:00'
            ];

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));

            return timeSlots;
        } catch (error) {
            console.error('Error fetching time slots:', error);
            throw new Error('Failed to fetch available time slots');
        }
    },

    async getUnavailableDates() {
        try {
            // Mock data for now - replace with actual API call
            const unavailableDates = [
                // Add some example unavailable dates
                '2025-12-25', // Christmas
                '2025-01-01'  // New Year
            ];

            return unavailableDates;
        } catch (error) {
            console.error('Error fetching unavailable dates:', error);
            return [];
        }
    },

    async bookTimeSlot(date, timeSlot) {
        try {
            // Mock booking - replace with actual API call
            return {
                success: true,
                bookingId: `booking_${Date.now()}`,
                date,
                timeSlot
            };
        } catch (error) {
            console.error('Error booking time slot:', error);
            throw new Error('Failed to book time slot');
        }
    }
};

export default schedulingService;