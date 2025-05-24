// src/common/hooks/useForm.js
import { useState } from 'react';

/**
 * Custom hook for managing form state
 *
 * @param {Object} initialValues - Initial form values
 * @returns {Array} [values, handleChange, resetForm, setFieldValue]
 */
export const useForm = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setValues(prevValues => ({
      ...prevValues,
      [name]: fieldValue
    }));

    // Mark field as touched
    setTouched(prevTouched => ({
      ...prevTouched,
      [name]: true
    }));
  };

  const setFieldValue = (name, value) => {
    setValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prevTouched => ({
      ...prevTouched,
      [name]: true
    }));
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  const validateForm = (validationSchema) => {
    if (!validationSchema) return true;

    const newErrors = {};
    let isValid = true;

    // Simple validation example - expand as needed
    Object.keys(validationSchema).forEach(field => {
      const rules = validationSchema[field];
      const value = values[field];

      if (rules.required && !value) {
        newErrors[field] = rules.errorMessage || 'This field is required';
        isValid = false;
      }

      if (rules.minLength && value.length < rules.minLength) {
        newErrors[field] = `Minimum length is ${rules.minLength} characters`;
        isValid = false;
      }

      if (rules.pattern && !rules.pattern.test(value)) {
        newErrors[field] = rules.errorMessage || 'Invalid format';
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    resetForm,
    validateForm
  };
};

export default useForm;
