// src/features/booking/hooks/useBookingForm.js
import { useState, useCallback, useEffect } from 'react';
import { bookingService } from '../services/bookingService';
import { useBookingContext } from '../context/BookingContext';

/**
 * Custom hook for managing booking form state and validation
 * @param {string} bookingId - ID of the booking
 * @param {Function} onSubmitSuccess - Callback when form submission succeeds
 * @returns {Object} Form state and handlers
 */
export const useBookingForm = (bookingId, onSubmitSuccess) => {
    const { setContactInfo, setError, clearError } = useBookingContext();

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
                if (!value.trim()) return 'Name is required';
                if (value.trim().length < 2) return 'Name must be at least 2 characters';
                return null;

            case 'phone':
                if (!value.trim()) return 'Phone number is required';
                const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                if (!phoneRegex.test(value.replace(/\s/g, ''))) return 'Please enter a valid phone number';
                return null;

            case 'email':
                if (!value.trim()) return 'Email is required';
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) return 'Please enter a valid email address';
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
            if (error) newErrors[field] = error;
        });
        return newErrors;
    }, [formValues, validateField]);

    // Handle input change
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;

        setFormValues(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }

        // Validate field if it has been touched
        if (touched[name]) {
            const error = validateField(name, value);
            setErrors(prev => ({
                ...prev,
                [name]: error
            }));
        }

        clearError();
    }, [errors, touched, validateField, clearError]);

    // Handle field blur
    const handleBlur = useCallback((e) => {
        const { name, value } = e.target;

        setTouched(prev => ({
            ...prev,
            [name]: true
        }));

        const error = validateField(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    }, [validateField]);

    // Handle form submission
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();

        const formErrors = validateForm();
        setErrors(formErrors);

        if (Object.keys(formErrors).length > 0) {
            setTouched({
                name: true,
                phone: true,
                email: true
            });
            return;
        }

        setIsSubmitting(true);
        clearError();

        try {
            await bookingService.updateContactInfo(bookingId, formValues);
            setContactInfo(formValues);

            if (onSubmitSuccess) {
                onSubmitSuccess(formValues);
            }
        } catch (error) {
            console.error('Error updating contact information:', error);
            setError(error.message || 'Failed to update contact information');
        } finally {
            setIsSubmitting(false);
        }
    }, [bookingId, formValues, validateForm, setContactInfo, onSubmitSuccess, clearError, setError]);

    // Check if form is valid
    const isValid = Object.keys(validateForm()).length === 0 &&
        formValues.name.trim() &&
        formValues.phone.trim() &&
        formValues.email.trim();

    return {
        formValues,
        errors,
        isSubmitting,
        isValid,
        handleChange,
        handleBlur,
        handleSubmit,
        setFormValues
    };
};