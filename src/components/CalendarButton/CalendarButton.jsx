import React from 'react';
import { Button } from '@base-ui/react/button';
import './CalendarButton.css';

/**
 * CalendarButton component - Matches Figma Calendar Button component set
 * Three variants: No background (past/inactive), Default (future days), Pressed (selected/today)
 * Each button shows weekday abbreviation + day number in a vertical stack
 */
export const CalendarButton = ({ 
  day = 22,
  weekday = 'Mo',
  state = 'default',
  onClick,
  ...props 
}) => {
  return (
    <Button 
      className={`calendar-button calendar-button-${state}`}
      onClick={onClick}
      aria-label={`${weekday} ${day}`}
      aria-pressed={state === 'pressed'}
      {...props}
    >
      <span className="calendar-button-weekday text-tiny-regular">{weekday}</span>
      <span className="calendar-button-day text-body-small-regular">{day}</span>
    </Button>
  );
};

CalendarButton.displayName = 'CalendarButton';
