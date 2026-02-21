import React from 'react';
import { motion } from 'motion/react';
import './Toast.css';

/**
 * Toast component - Mobile notification from Figma design
 * Variants: Success, Error, Warning, Info
 * Built with design tokens for consistent styling
 * Animated with Motion library
 */
export const Toast = ({ 
  variant = 'Success',
  message,
  onClose,
  showCloseButton = true,
  ...props 
}) => {
  const variantClass = `toast-${variant.toLowerCase()}`;
  
  // Default messages based on variant
  const defaultMessages = {
    Success: 'Added to shopping list',
    Error: 'Could not delete item',
    Warning: 'Low stock warning',
    Info: 'Meal plan updated'
  };
  
  const displayMessage = message || defaultMessages[variant];
  
  // Icons based on variant
  const icons = {
    Success: <CheckIcon />,
    Error: <WarningTriangleIcon />,
    Warning: <WarningCircleIcon />,
    Info: <InfoIcon />
  };
  
  return (
    <motion.div 
      className={`toast ${variantClass}`}
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ 
        type: "spring",
        bounce: 0.2,
        duration: 0.4
      }}
      {...props}
    >
      <span className="toast-icon" aria-hidden="true">
        {icons[variant]}
      </span>
      <span className="toast-message text-body-small-bold">
        {displayMessage}
      </span>
      {showCloseButton && (
        <button 
          className="toast-close"
          onClick={onClose}
          aria-label="Close notification"
        >
          <CloseIcon />
        </button>
      )}
    </motion.div>
  );
};

// Icon components matching Figma design
const CheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const WarningTriangleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const WarningCircleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const InfoIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="16" x2="12" y2="12"/>
    <line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

Toast.displayName = 'Toast';
