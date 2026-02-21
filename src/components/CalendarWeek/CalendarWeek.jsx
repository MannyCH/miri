import React from 'react';
import { CalendarButton } from '../CalendarButton';
import './CalendarWeek.css';

const WEEKDAY_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

/**
 * CalendarWeek component - Matches Figma Calendar week component
 * Horizontal row of 7 CalendarButtons with weekday labels and day numbers
 */
export const CalendarWeek = ({ 
  days = [],
  selectedDay,
  onDayClick,
  ...props 
}) => {
  return (
    <div className="calendar-week" {...props}>
      {days.map((dayData, index) => {
        const { date, weekday, isPast } = typeof dayData === 'object' 
          ? dayData 
          : { date: dayData, weekday: WEEKDAY_LABELS[index], isPast: false };
        
        let state = 'default';
        if (isPast) state = 'no-background';
        if (date === selectedDay) state = 'pressed';
        
        return (
          <CalendarButton
            key={date}
            day={date}
            weekday={weekday}
            state={state}
            onClick={() => onDayClick?.(date)}
          />
        );
      })}
    </div>
  );
};

CalendarWeek.displayName = 'CalendarWeek';
