// src/common/utils/validationUtils.js
/**
 * Validate an email address
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if email is valid
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

/**
 * Validate a UK phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if phone number is valid
 */
export const isValidUKPhone = (phone) => {
    // Basic UK phone validation - starts with 0, followed by 10 more digits
    // This is a simplified version; adjust as needed for your requirements
    const phoneRegex = /^0\d{10}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
};

/**
 * Validate a postcode using a simplified UK format
 * @param {string} postcode - Postcode to validate
 * @returns {boolean} - True if postcode is valid
 */
export const isValidUKPostcode = (postcode) => {
    // Simplified UK postcode regex
    const postcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;
    return postcodeRegex.test(postcode);
};

/**
 * Validate that a string has a minimum length
 * @param {string} value - String to validate
 * @param {number} minLength - Minimum required length
 * @returns {boolean} - True if string meets minimum length
 */
export const hasMinLength = (value, minLength) => {
    return value && value.length >= minLength;
};

/**
 * Validate form fields with custom rules
 * @param {Object} values - Form values to validate
 * @param {Object} rules - Validation rules keyed by field name
 * @returns {Object} - Object containing errors keyed by field name
 */
export const validateForm = (values, rules) => {
    const errors = {};

    Object.keys(rules).forEach(fieldName => {
        const fieldRules = rules[fieldName];
        const value = values[fieldName];

        // Check required
        if (fieldRules.required && (!value || value.trim() === '')) {
            errors[fieldName] = 'This field is required';
            return; // Skip further validation for this field
        }

        // Only validate if there's a value
        if (value) {
            // Check email
            if (fieldRules.email && !isValidEmail(value)) {
                errors[fieldName] = 'Please enter a valid email address';
            }

            // Check UK phone
            if (fieldRules.ukPhone && !isValidUKPhone(value)) {
                errors[fieldName] = 'Please enter a valid UK phone number';
            }

            // Check UK postcode
            if (fieldRules.ukPostcode && !isValidUKPostcode(value)) {
                errors[fieldName] = 'Please enter a valid UK postcode';
            }

            // Check min length
            if (fieldRules.minLength && !hasMinLength(value, fieldRules.minLength)) {
                errors[fieldName] = `Must be at least ${fieldRules.minLength} characters`;
            }

            // Check custom validation
            if (fieldRules.validate && typeof fieldRules.validate === 'function') {
                const customError = fieldRules.validate(value, values);
                if (customError) {
                    errors[fieldName] = customError;
                }
            }
        }
    });

    return errors;
};