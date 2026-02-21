import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../Button';
import './ConfirmDialog.css';

/**
 * ConfirmDialog - Modal confirmation dialog
 * Uses Button component variants: secondary for actions, tertiary-delete for cancel
 */
export function ConfirmDialog({ 
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  secondaryLabel,
  tertiaryLabel,
  onConfirm,
  onSecondary,
  onTertiary,
  onCancel,
}) {
  if (!isOpen) return null;
  
  const handleOverlayClick = onCancel || onTertiary;
  
  return (
    <motion.div 
      className="confirm-dialog-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={handleOverlayClick}
    >
      <motion.div 
        className="confirm-dialog"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ 
          type: "spring",
          bounce: 0.2,
          duration: 0.3
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="confirm-dialog-header">
          <h3 className="confirm-dialog-title text-h3-bold">
            {title}
          </h3>
          <button 
            className="confirm-dialog-close"
            onClick={handleOverlayClick}
            aria-label="Close dialog"
          >
            <CloseIcon />
          </button>
        </div>
        
        <p className="confirm-dialog-message text-body-regular">
          {message}
        </p>
        
        <div className="confirm-dialog-actions">
          <div className="confirm-dialog-actions-row">
            <Button variant="secondary" onClick={onConfirm}>
              {confirmLabel}
            </Button>

            {secondaryLabel && onSecondary && (
              <Button variant="secondary" onClick={onSecondary}>
                {secondaryLabel}
              </Button>
            )}
          </div>

          {tertiaryLabel && (onTertiary || onCancel) && (
            <Button variant="tertiary-delete" onClick={onTertiary || onCancel}>
              {tertiaryLabel}
            </Button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

ConfirmDialog.displayName = 'ConfirmDialog';
