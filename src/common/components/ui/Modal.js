// src/common/components/ui/Modal.js
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

/**
 * Modal component with backdrop, keyboard handling, and focus management
 */
const Modal = ({
                 isOpen,
                 onClose,
                 title,
                 children,
                 size = 'md',
                 closeOnBackdrop = true,
                 closeOnEscape = true,
                 showCloseButton = true,
                 className = '',
                 ...props
               }) => {
  const modalRef = useRef(null);
  const previousFocus = useRef(null);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Store previously focused element
      previousFocus.current = document.activeElement;

      // Focus the modal
      if (modalRef.current) {
        modalRef.current.focus();
      }

      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll
      document.body.style.overflow = '';

      // Restore focus to previous element
      if (previousFocus.current) {
        previousFocus.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Keyboard handling
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && closeOnEscape && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closeOnEscape, onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && closeOnBackdrop) {
      onClose();
    }
  };

  const sizeClasses = {
    sm: 'modal-sm',
    md: 'modal-md',
    lg: 'modal-lg',
    xl: 'modal-xl'
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      {...props}
    >
      <div
        ref={modalRef}
        className={`modal-dialog ${sizeClasses[size] || sizeClasses.md} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        tabIndex={-1}
      >
        <div className="modal-content">
          {(title || showCloseButton) && (
            <div className="modal-header">
              {title && (
                <h3 id="modal-title" className="modal-title">
                  {title}
                </h3>
              )}
              {showCloseButton && (
                <button
                  type="button"
                  className="modal-close"
                  onClick={onClose}
                  aria-label="Close modal"
                >
                  ×
                </button>
              )}
            </div>
          )}
          <div className="modal-body">
            {children}
          </div>
        </div>
      </div>
    </div>
  );

  // Render modal in a portal to avoid z-index issues
  return createPortal(modalContent, document.body);
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  closeOnBackdrop: PropTypes.bool,
  closeOnEscape: PropTypes.bool,
  showCloseButton: PropTypes.bool,
  className: PropTypes.string
};

export default Modal;