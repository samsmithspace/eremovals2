// src/common/utils/dateUtils.js
/**
 * Format a date string to a more user-friendly format
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @param {string} locale - Locale for date formatting (e.g., 'en-US', 'zh-CN')
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString, locale = 'en-US') => {
    try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString; // Return original string if formatting fails
    }
};

/**
 * Format a time string to a more user-friendly format
 * @param {string} timeString - Time string in HH:MM format
 * @param {string} locale - Locale for time formatting (e.g., 'en-US', 'zh-CN')
 * @returns {string} - Formatted time string
 */
export const formatTime = (timeString, locale = 'en-US') => {
    try {
        // Create a date object with today's date and the time string
        const [hours, minutes] = timeString.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);

        return new Intl.DateTimeFormat(locale, {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        }).format(date);
    } catch (error) {
        console.error('Error formatting time:', error);
        return timeString; // Return original string if formatting fails
    }
};

/**
 * Check if a date is in the future
 * @param {string} dateString - Date string in YYYY-MM-DD format
 * @returns {boolean} - True if date is in the future
 */
export const isDateInFuture = (dateString) => {
    try {
        const inputDate = new Date(dateString);
        inputDate.setHours(0, 0, 0, 0); // Set to beginning of day

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to beginning of day

        return inputDate >= today;
    } catch (error) {
        console.error('Error checking date:', error);
        return false;
    }
};

/**
 * Get the next N days from today
 * @param {number} days - Number of days to include
 * @returns {Array<string>} - Array of date strings in YYYY-MM-DD format
 */
export const getNextDays = (days = 7) => {
    const result = [];
    const today = new Date();

    for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(today.getDate() + i);
        result.push(date.toISOString().split('T')[0]); // Format as YYYY-MM-DD
    }

    return result;
};