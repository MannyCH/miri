import React, { useRef, useEffect } from 'react';
import { CalendarButton } from '../CalendarButton';
import './CalendarModule.css';

const DAYS_PER_VIEW = 7;

/**
 * CalendarModule component - Matches Figma Calendar Module pattern
 * Title dynamically updates based on selected day (Today/Tomorrow/day name)
 * Calendar is horizontally swipeable to browse more days
 */
export const CalendarModule = ({
  title,
  days = [],
  selectedDay,
  onDayClick,
  ...props
}) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    const selectedIndex = days.findIndex(d => d.fullDate === selectedDay);
    if (selectedIndex < 0) return;

    const container = scrollRef.current;
    const buttonWidth = 45;
    const containerWidth = container.clientWidth;
    const gap = (containerWidth - buttonWidth * DAYS_PER_VIEW) / (DAYS_PER_VIEW - 1);
    const pageIndex = Math.floor(selectedIndex / DAYS_PER_VIEW);
    const targetScroll = pageIndex * containerWidth;

    container.scrollTo({ left: targetScroll, behavior: 'smooth' });
  }, [selectedDay, days]);

  return (
    <div className="calendar-module" {...props}>
      <h2 className="calendar-module-title text-h4-bold">
        {title}
      </h2>
      <div className="calendar-scroll" ref={scrollRef}>
        <div className="calendar-scroll-track">
          {days.map((dayData) => {
            let state = 'default';
            if (dayData.fullDate === selectedDay) state = 'pressed';

            return (
              <CalendarButton
                key={dayData.fullDate}
                day={dayData.date}
                weekday={dayData.weekday}
                state={state}
                onClick={() => onDayClick?.(dayData.date, dayData.fullDate)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

CalendarModule.displayName = 'CalendarModule';
