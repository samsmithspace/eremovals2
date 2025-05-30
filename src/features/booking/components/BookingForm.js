// Fixed useBookingForm.js - Proper validation and form state management
import { useState, useCallback, useEffect } from 'react';
import { bookingService } from '../services/bookingService';
import { useBookingContext } from '../context/BookingContext';

/**
 * Custom hook for managing booking form state and validation
 * Fixed to properly enable submit button when form is valid
 * @param {string} bookingId - ID of the booking
 * @param {Function} onSubmitSuccess - Callback when form submission succeeds
 * @returns {Object} Form state and handlers
 */
export const useBookingForm = (bookingId, onSubmitSuccess) => {
    // Try to use context, but don't fail if it's not available
    let setContactInfo, setError, clearError;
    try {
        const context = useBookingContext();
        setContactInfo = context.setContactInfo;
        setError = context.setError;
        clearError = context.clearError;
    } catch (error) {
        // Context not available, use local state management
        console.warn('BookingContext not available, using local state');
        setContactInfo = () => {};
        setError = () => {};
        clearError = () => {};
    }

    const [formValues, setFormValues] = useState({
        name: '',
        phone: '',
        email: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [touched, setTouched] = useState({});

    // Validation rules
    const validateField = useCallback((name, value) => {
        switch (name) {
            case 'name':
                if (!value || !value.trim()) return 'Name is required';
                if (value.trim().length < 2) return 'Name must be at least 2 characters';
                return null;

            case 'phone':
                if (!value || !value.trim()) return 'Phone number is required';
                // More flexible phone validation
                const cleanPhone = value.replace(/\s/g, '').replace(/[^\d+]/g, '');
                if (cleanPhone.length < 10) return 'Please enter a valid phone number';
                return null;

            case 'email':
                if (!value || !value.trim()) return 'Email is required';
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value.trim())) return 'Please enter a valid email address';
                return null;

            default:
                return null;
        }
    }, []);

    // Validate all fields
    const validateForm = useCallback(() => {
        const newErrors = {};

        Object.keys(formValues).forEach(field => {
            const error = validateField(field, formValues[field]);
            if (error) {
                newErrors[field] = error;
            }
        });

        return newErrors;
    }, [formValues, validateField]);

    // Calculate if form is valid
    const isValid = useCallback(() => {
        // Check if all required fields have values
        const hasName = formValues.name && formValues.name.trim().length >= 2;
        const hasPhone = formValues.phone && formValues.phone.trim().length >= 10;
        const hasEmail = formValues.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email.trim());

        // Check if there are any validation errors
        const formErrors = validateForm();
        const hasNoErrors = Object.keys(formErrors).length === 0;

        const valid = hasName && hasPhone && hasEmail && hasNoErrors;

        console.log('Form validation check:', {
            hasName,
            hasPhone,
            hasEmail,
            hasNoErrors,
            valid,
            formValues,
            formErrors
        });

        return valid;
    }, [formValues, validateForm]);

    // Handle input change
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;

        console.log('Field changed:', { name, value });

        setFormValues(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }

        // Mark field as touched
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));

        clearError();
    }, [errors, clearError]);

    // Handle field blur for validation
    const handleBlur = useCallback((e) => {
        const { name, value } = e.target;

        setTouched(prev => ({
            ...prev,
            [name]: true
        }));

        // Validate field on blur
        const error = validateField(name, value);
        if (error) {
            setErrors(prev => ({
                ...prev,
                [name]: error
            }));
        }
    }, [validateField]);

    // Handle form submission
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();

        console.log('Form submitted with values:', formValues);

        // Validate all fields
        const formErrors = validateForm();

        if (Object.keys(formErrors).length > 0) {
            console.log('Form has errors:', formErrors);
            setErrors(formErrors);
            setTouched({
                name: true,
                phone: true,
                email: true
            });
            return;
        }

        if (!isValid()) {
            console.log('Form is not valid');
            return;
        }

        setIsSubmitting(true);
        clearError();

        try {
            // Only call booking service if we have a valid bookingId
            if (bookingId) {
                console.log('Updating contact info for booking:', bookingId);
                await bookingService.updateContactInfo(bookingId, formValues);
            }

            // Update context if available
            setContactInfo(formValues);

            console.log('Form submission successful');

            if (onSubmitSuccess) {
                onSubmitSuccess(formValues);
            }
        } catch (error) {
            console.error('Error updating contact information:', error);
            setError(error.message || 'Failed to update contact information');
        } finally {
            setIsSubmitting(false);
        }
    }, [bookingId, formValues, validateForm, isValid, setContactInfo, onSubmitSuccess, clearError, setError]);

    // Update errors when form values change
    useEffect(() => {
        // Only validate touched fields to avoid showing errors immediately
        const newErrors = {};

        Object.keys(touched).forEach(field => {
            if (touched[field]) {
                const error = validateField(field, formValues[field]);
                if (error) {
                    newErrors[field] = error;
                }
            }
        });

        setErrors(newErrors);
    }, [formValues, touched, validateField]);

    return {
        formValues,
        errors,
        isSubmitting,
        isValid: isValid(),
        handleChange,
        handleBlur,
        handleSubmit,
        setFormValues
    };
};