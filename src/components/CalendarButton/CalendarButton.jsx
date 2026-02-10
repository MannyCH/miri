import React from 'react';
import { Button } from '@base-ui/react/button';
import './CalendarButton.css';

/**
 * CalendarButton component - Exactly as designed in Figma
 * Calendar date button with 3 states: No background, Default, Pressed
 */
export const CalendarButton = ({ 
  children = '22',
  state = 'default',
  ...props 
}) => {
  return (
    <Button 
      className={`calendar-button calendar-button-${state}`}
      {...props}
    >
      {children}
    </Button>
  );
};

CalendarButton.displayName = 'CalendarButton';
