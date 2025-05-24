// src/common/components/ui/FormInput.js
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Form input component with label, error handling, and validation
 */
const FormInput = forwardRef(({
                                id,
                                name,
                                type = 'text',
                                label,
                                placeholder,
                                value,
                                defaultValue,
                                onChange,
                                onBlur,
                                onFocus,
                                error,
                                helpText,
                                required = false,
                                disabled = false,
                                readOnly = false,
                                className = '',
                                inputClassName = '',
                                labelClassName = '',
                                autoComplete,
                                maxLength,
                                minLength,
                                pattern,
                                min,
                                max,
                                step,
                                ...props
                              }, ref) => {
  const inputId = id || name;
  const hasError = Boolean(error);

  const inputClasses = [
    'form-control',
    hasError ? 'is-invalid' : '',
    inputClassName
  ].filter(Boolean).join(' ');

  const labelClasses = [
    'form-label',
    required ? 'required' : '',
    labelClassName
  ].filter(Boolean).join(' ');

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className={labelClasses}
        >
          {label}
          {required && <span className="text-error ml-1" aria-label="required">*</span>}
        </label>
      )}

      <input
        ref={ref}
        id={inputId}
        name={name}
        type={type}
        className={inputClasses}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        autoComplete={autoComplete}
        maxLength={maxLength}
        minLength={minLength}
        pattern={pattern}
        min={min}
        max={max}
        step={step}
        aria-invalid={hasError}
        aria-describedby={
          error ? `${inputId}-error` :
            helpText ? `${inputId}-help` :
              undefined
        }
        {...props}
      />

      {error && (
        <div id={`${inputId}-error`} className="invalid-feedback" role="alert">
          {error}
        </div>
      )}

      {helpText && !error && (
        <div id={`${inputId}-help`} className="form-text text-muted">
          {helpText}
        </div>
      )}
    </div>
  );
});

FormInput.displayName = 'FormInput';

FormInput.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  error: PropTypes.string,
  helpText: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  autoComplete: PropTypes.string,
  maxLength: PropTypes.number,
  minLength: PropTypes.number,
  pattern: PropTypes.string,
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  step: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default FormInput;