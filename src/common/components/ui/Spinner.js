// src/common/components/ui/Spinner.js
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Loading spinner component with different sizes and variants
 */
const Spinner = ({
                   size = 'base',
                   variant = 'primary',
                   className = '',
                   ...props
                 }) => {
  const sizeClasses = {
    sm: 'spinner-sm',
    base: 'spinner',
    lg: 'spinner-lg'
  };

  const variantClasses = {
    primary: 'spinner-primary',
    secondary: 'spinner-secondary',
    white: 'spinner-white',
    dark: 'spinner-dark'
  };

  const classes = [
    sizeClasses[size] || sizeClasses.base,
    variantClasses[variant] || '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      role="status"
      aria-label="Loading"
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

Spinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'base', 'lg']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'white', 'dark']),
  className: PropTypes.string
};

export default Spinner;