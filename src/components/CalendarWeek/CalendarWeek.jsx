import React from 'react';
import { CalendarButton } from '../CalendarButton';
import './CalendarWeek.css';

/**
 * CalendarWeek component - Exactly as designed in Figma
 * Week view with 7 calendar buttons
 */
export const CalendarWeek = ({ 
  days = [22, 23, 24, 25, 26, 27, 28],
  selectedDay,
  onDayClick,
  ...props 
}) => {
  return (
    <div className="calendar-week" {...props}>
      {days.map((day, index) => {
        let state = 'default';
        if (index === 0) state = 'no-background';
        if (day === selectedDay) state = 'pressed';
        
        return (
          <CalendarButton
            key={day}
            state={state}
            onClick={() => onDayClick?.(day)}
          >
            {day}
          </CalendarButton>
        );
      })}
    </div>
  );
};

CalendarWeek.displayName = 'CalendarWeek';
