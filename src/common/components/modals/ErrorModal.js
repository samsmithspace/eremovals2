// src/common/components/modals/ErrorModal.js
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { Button, Alert } from '../ui';
import './Modal.css';

/**
 * Error modal component for displaying error messages and details
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Callback when modal is closed
 * @param {Function} props.onRetry - Optional retry callback
 * @param {string} props.title - Error title
 * @param {string} props.message - Error message
 * @param {Object} props.error - Error object with details
 * @param {boolean} props.showDetails - Whether to show error details
 * @param {string} props.retryText - Text for retry button
 * @param {boolean} props.canRetry - Whether retry option is available
 */
const ErrorModal = ({
                      isOpen,
                      onClose,
                      onRetry,
                      title = 'An Error Occurred',
                      message = 'Something went wrong. Please try again.',
                      error,
                      showDetails = false,
                      retryText = 'Try Again',
                      canRetry = true
                    }) => {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  // Handle keyboard interactions
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          onClose();
          break;
        case 'Tab':
          handleTabKey(event);
          break;
        default:
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      previousActiveElement.current = document.activeElement;
      setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.focus();
        }
      }, 100);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Restore focus when modal closes
  useEffect(() => {
    if (!isOpen && previousActiveElement.current) {
      previousActiveElement.current.focus();
    }
  }, [isOpen]);

  // Handle tab key for focus trapping
  const handleTabKey = (event) => {
    if (!modalRef.current) return;

    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // Format error details for display
  const getErrorDetails = () => {
    if (!error) return null;

    return {
      message: error.message || 'Unknown error',
      stack: error.stack,
      code: error.code,
      status: error.status,
      timestamp: new Date().toISOString()
    };
  };

  const errorDetails = getErrorDetails();

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        ref={modalRef}
        className="modal-container error-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="error-modal-title"
        aria-describedby="error-modal-message"
        tabIndex={-1}
      >
        <div className="modal-header">
          <div className="modal-icon modal-icon-error">
            ❌
          </div>
          <h2 id="error-modal-title" className="modal-title error-title">
            {title}
          </h2>
          <button
            className="modal-close-button"
            onClick={onClose}
            aria-label="Close error modal"
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          <Alert variant="error" className="error-alert">
            <p id="error-modal-message" className="error-message">
              {message}
            </p>
          </Alert>

          {showDetails && errorDetails && (
            <details className="error-details">
              <summary className="error-details-summary">
                Technical Details
              </summary>
              <div className="error-details-content">
                <div className="error-detail-item">
                  <strong>Error:</strong> {errorDetails.message}
                </div>
                {errorDetails.code && (
                  <div className="error-detail-item">
                    <strong>Code:</strong> {errorDetails.code}
                  </div>
                )}
                {errorDetails.status && (
                  <div className="error-detail-item">
                    <strong>Status:</strong> {errorDetails.status}
                  </div>
                )}
                <div className="error-detail-item">
                  <strong>Time:</strong> {new Date(errorDetails.timestamp).toLocaleString()}
                </div>
                {errorDetails.stack && (
                  <div className="error-detail-item">
                    <strong>Stack Trace:</strong>
                    <pre className="error-stack">{errorDetails.stack}</pre>
                  </div>
                )}
              </div>
            </details>
          )}

          <div className="error-help">
            <p>If this problem persists, please contact support:</p>
            <ul>
              <li>Email: <a href="mailto:eremovalsscot@gmail.com">eremovalsscot@gmail.com</a></li>
              <li>Phone: <a href="tel:+447404228217">07404 228217</a></li>
              <li>WhatsApp: <a href="https://wa.me/447404228217" target="_blank" rel="noopener noreferrer">Message us</a></li>
            </ul>
          </div>
        </div>

        <div className="modal-footer">
          <Button
            variant="outline"
            onClick={onClose}
            className="modal-button-close"
          >
            Close
          </Button>
          {canRetry && onRetry && (
            <Button
              variant="primary"
              onClick={onRetry}
              className="modal-button-retry"
            >
              {retryText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

ErrorModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onRetry: PropTypes.func,
  title: PropTypes.string,
  message: PropTypes.string,
  error: PropTypes.object,
  showDetails: PropTypes.bool,
  retryText: PropTypes.string,
  canRetry: PropTypes.bool
};

export default ErrorModal;