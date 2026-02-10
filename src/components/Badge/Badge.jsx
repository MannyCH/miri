import React from 'react';
import './Badge.css';

/**
 * Badge component - Exactly as designed in Figma
 * Single variant: light brown background with stroke
 */
export const Badge = ({ 
  children = '1',
  ...props 
}) => {
  return (
    <span 
      className="badge"
      {...props}
    >
      {children}
    </span>
  );
};

Badge.displayName = 'Badge';
