// src/common/components/ui/Alert.js
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Alert component for displaying messages with different variants
 */
const Alert = ({
                 children,
                 variant = 'info',
                 title,
                 dismissible = false,
                 onDismiss,
                 className = '',
                 ...props
               }) => {
  const variantClasses = {
    success: 'alert-success',
    warning: 'alert-warning',
    error: 'alert-error',
    info: 'alert-info'
  };

  const classes = [
    'alert',
    variantClasses[variant] || variantClasses.info,
    dismissible ? 'alert-dismissible' : '',
    className
  ].filter(Boolean).join(' ');

  const iconMap = {
    success: '✓',
    warning: '⚠',
    error: '✕',
    info: 'ℹ'
  };

  return (
    <div
      className={classes}
      role="alert"
      {...props}
    >
      <div className="alert-content">
        {title && (
          <div className="alert-header">
            <span className="alert-icon" aria-hidden="true">
              {iconMap[variant]}
            </span>
            <h4 className="alert-title">{title}</h4>
            {dismissible && (
              <button
                type="button"
                className="alert-close"
                onClick={onDismiss}
                aria-label="Close alert"
              >
                ×
              </button>
            )}
          </div>
        )}
        <div className="alert-body">
          {children}
        </div>
      </div>
    </div>
  );
};

Alert.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']),
  title: PropTypes.string,
  dismissible: PropTypes.bool,
  onDismiss: PropTypes.func,
  className: PropTypes.string
};

export default Alert;