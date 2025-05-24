// src/common/components/modals/ConfirmationModal.js
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { Button } from '../ui';
import './Modal.css';

/**
 * Confirmation modal component for user confirmation dialogs
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Callback when modal is closed
 * @param {Function} props.onConfirm - Callback when user confirms
 * @param {string} props.title - Modal title
 * @param {string} props.message - Confirmation message
 * @param {string} props.confirmText - Text for confirm button
 * @param {string} props.cancelText - Text for cancel button
 * @param {string} props.variant - Modal variant (danger, warning, info)
 * @param {boolean} props.isLoading - Whether confirm action is loading
 * @param {React.ReactNode} props.children - Custom content instead of message
 */
const ConfirmationModal = ({
                             isOpen,
                             onClose,
                             onConfirm,
                             title = 'Confirm Action',
                             message = 'Are you sure you want to proceed?',
                             confirmText = 'Confirm',
                             cancelText = 'Cancel',
                             variant = 'info',
                             isLoading = false,
                             children
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
        case 'Enter':
          // Allow Enter on buttons to work normally
          if (event.target.tagName === 'BUTTON') {
            return;
          }
          event.preventDefault();
          onConfirm();
          break;
        default:
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Store current active element
      previousActiveElement.current = document.activeElement;
      // Focus the modal
      setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.focus();
        }
      }, 100);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, onConfirm]);

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
      // Shift + Tab
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab
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

  // Get variant-specific styles
  const getVariantStyles = () => {
    const variants = {
      danger: {
        iconClass: 'modal-icon-danger',
        confirmVariant: 'error'
      },
      warning: {
        iconClass: 'modal-icon-warning',
        confirmVariant: 'warning'
      },
      info: {
        iconClass: 'modal-icon-info',
        confirmVariant: 'primary'
      }
    };

    return variants[variant] || variants.info;
  };

  const variantStyles = getVariantStyles();

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        ref={modalRef}
        className={`modal-container confirmation-modal`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-message"
        tabIndex={-1}
      >
        <div className="modal-header">
          <div className={`modal-icon ${variantStyles.iconClass}`}>
            {variant === 'danger' && '⚠️'}
            {variant === 'warning' && '⚠️'}
            {variant === 'info' && 'ℹ️'}
          </div>
          <h2 id="modal-title" className="modal-title">
            {title}
          </h2>
          <button
            className="modal-close-button"
            onClick={onClose}
            aria-label="Close modal"
            disabled={isLoading}
          >
            ×
          </button>
        </div>

        <div className="modal-body">
          {children ? (
            children
          ) : (
            <p id="modal-message" className="modal-message">
              {message}
            </p>
          )}
        </div>

        <div className="modal-footer">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="modal-button-cancel"
          >
            {cancelText}
          </Button>
          <Button
            variant={variantStyles.confirmVariant}
            onClick={onConfirm}
            disabled={isLoading}
            className="modal-button-confirm"
          >
            {isLoading ? 'Processing...' : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );

  // Render modal using portal
  return createPortal(modalContent, document.body);
};

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  variant: PropTypes.oneOf(['danger', 'warning', 'info']),
  isLoading: PropTypes.bool,
  children: PropTypes.node
};

export default ConfirmationModal;