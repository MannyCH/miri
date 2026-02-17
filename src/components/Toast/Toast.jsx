import React from 'react';
import './Toast.css';

/**
 * Toast component - Mobile notification for user feedback
 * Built with design tokens for consistent styling
 * Variants: success, error, warning, info
 */
export const Toast = ({ 
  variant = 'success',
  message = 'Action completed',
  icon,
  showIcon = true,
  ...props 
}) => {
  const variantClass = `toast-${variant}`;
  
  const defaultIcons = {
    success: <CheckIcon />,
    error: <ErrorIcon />,
    warning: <WarningIcon />,
    info: <InfoIcon />
  };
  
  const iconToShow = icon || defaultIcons[variant];
  
  return (
    <div 
      className={`toast ${variantClass}`}
      role="status"
      aria-live="polite"
      {...props}
    >
      {showIcon && iconToShow && (
        <span className="toast-icon" aria-hidden="true">
          {iconToShow}
        </span>
      )}
      <span className="toast-message text-body-small-bold">
        {message}
      </span>
    </div>
  );
};

// Icon components using design system colors
const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const ErrorIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="15" y1="9" x2="9" y2="15"/>
    <line x1="9" y1="9" x2="15" y2="15"/>
  </svg>
);

const WarningIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const InfoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="16" x2="12" y2="12"/>
    <line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);

Toast.displayName = 'Toast';
