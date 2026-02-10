import React from 'react';
import './Divider.css';

/**
 * Divider component - Exactly as designed in Figma
 * Simple horizontal line separator
 */
export const Divider = ({ ...props }) => {
  return (
    <hr 
      className="divider"
      {...props}
    />
  );
};

Divider.displayName = 'Divider';
