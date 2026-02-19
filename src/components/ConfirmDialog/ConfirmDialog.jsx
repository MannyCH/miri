import React from 'react';
import { motion } from 'motion/react';
import './ConfirmDialog.css';

/**
 * ConfirmDialog - Modal confirmation dialog
 * Used for destructive or important actions
 */
export function ConfirmDialog({ 
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'default' // 'default' or 'warning'
}) {
  if (!isOpen) return null;
  
  return (
    <motion.div 
      className="confirm-dialog-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onCancel}
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
        <h3 className="confirm-dialog-title text-h3-bold">
          {title}
        </h3>
        
        <p className="confirm-dialog-message text-body-regular">
          {message}
        </p>
        
        <div className="confirm-dialog-actions">
          <button 
            className="confirm-dialog-button confirm-dialog-button-cancel"
            onClick={onCancel}
          >
            <span className="text-body-small-bold">{cancelLabel}</span>
          </button>
          
          <button 
            className={`confirm-dialog-button confirm-dialog-button-confirm ${variant === 'warning' ? 'warning' : ''}`}
            onClick={onConfirm}
          >
            <span className="text-body-small-bold">{confirmLabel}</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

ConfirmDialog.displayName = 'ConfirmDialog';
