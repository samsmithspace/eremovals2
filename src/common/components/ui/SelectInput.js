// src/common/components/ui/SelectInput.js
import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Select input component with label, error handling, and validation
 */
const SelectInput = forwardRef(({
                                  id,
                                  name,
                                  label,
                                  options = [],
                                  value,
                                  defaultValue,
                                  onChange,
                                  onBlur,
                                  onFocus,
                                  error,
                                  helpText,
                                  placeholder = 'Select an option...',
                                  required = false,
                                  disabled = false,
                                  className = '',
                                  selectClassName = '',
                                  labelClassName = '',
                                  ...props
                                }, ref) => {
  const selectId = id || name;
  const hasError = Boolean(error);

  const selectClasses = [
    'form-control',
    hasError ? 'is-invalid' : '',
    selectClassName
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
          htmlFor={selectId}
          className={labelClasses}
        >
          {label}
          {required && <span className="text-error ml-1" aria-label="required">*</span>}
        </label>
      )}

      <select
        ref={ref}
        id={selectId}
        name={name}
        className={selectClasses}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        required={required}
        disabled={disabled}
        aria-invalid={hasError}
        aria-describedby={
          error ? `${selectId}-error` :
            helpText ? `${selectId}-help` :
              undefined
        }
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option, index) => {
          // Handle both string arrays and object arrays
          if (typeof option === 'string') {
            return (
              <option key={index} value={option}>
                {option}
              </option>
            );
          }

          // Handle object format: { value, label, disabled }
          return (
            <option
              key={option.value || index}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label || option.value}
            </option>
          );
        })}
      </select>

      {error && (
        <div id={`${selectId}-error`} className="invalid-feedback" role="alert">
          {error}
        </div>
      )}

      {helpText && !error && (
        <div id={`${selectId}-help`} className="form-text text-muted">
          {helpText}
        </div>
      )}
    </div>
  );
});

SelectInput.displayName = 'SelectInput';

SelectInput.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        label: PropTypes.string.isRequired,
        disabled: PropTypes.bool
      })
    ])
  ),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  error: PropTypes.string,
  helpText: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  selectClassName: PropTypes.string,
  labelClassName: PropTypes.string
};

export default SelectInput;