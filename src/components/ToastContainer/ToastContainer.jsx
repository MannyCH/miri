import React from 'react';
import { AnimatePresence } from 'motion/react';
import { Toast } from '../Toast';
import './ToastContainer.css';

/**
 * ToastContainer - Manages display of multiple toast notifications
 * Positions toasts at bottom of screen above navigation
 * Uses Motion's AnimatePresence for exit animations
 */
export function ToastContainer({ toasts, onDismiss }) {
  return (
    <div className="toast-container">
      <AnimatePresence mode="popLayout">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            variant={toast.variant}
            message={toast.message}
            onClose={() => onDismiss(toast.id)}
            showCloseButton={true}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

ToastContainer.displayName = 'ToastContainer';
