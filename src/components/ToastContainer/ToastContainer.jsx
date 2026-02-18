import React from 'react';
import { Toast } from '../Toast';
import './ToastContainer.css';

/**
 * ToastContainer - Manages display of multiple toast notifications
 * Positions toasts at bottom of screen above navigation
 */
export function ToastContainer({ toasts, onDismiss }) {
  if (toasts.length === 0) return null;
  
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          variant={toast.variant}
          message={toast.message}
          onClose={() => onDismiss(toast.id)}
          showCloseButton={true}
        />
      ))}
    </div>
  );
}

ToastContainer.displayName = 'ToastContainer';
