import React, { useRef, useEffect } from 'react';
import { animate } from 'motion';
import { motion } from 'motion/react';
import { CalendarButton } from '../CalendarButton';
import './CalendarModule.css';

const DAYS_PER_VIEW = 7;
const LAST_DAY_WEEK_SHIFT_PX = 15;
const SCROLL_ANIMATION_DURATION_S = 0.28;

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
  const scrollAnimationRef = useRef(null);
  const selectedIndex = days.findIndex(d => d.fullDate === selectedDay);
  const isLastDayInWeekSelected = selectedIndex >= 0 && selectedIndex % DAYS_PER_VIEW === DAYS_PER_VIEW - 1;

  useEffect(() => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    if (selectedIndex < 0) return;

    scrollAnimationRef.current?.stop?.();

    const currentScroll = container.scrollLeft;
    const containerWidth = container.clientWidth;
    const maxScroll = Math.max(0, container.scrollWidth - containerWidth);
    const pageIndex = Math.floor(selectedIndex / DAYS_PER_VIEW);
    const nextScroll = pageIndex * containerWidth;
    const clampedNextScroll = Math.min(Math.max(nextScroll, 0), maxScroll);
    if (Math.abs(clampedNextScroll - currentScroll) < 1) return;

    scrollAnimationRef.current = animate(currentScroll, clampedNextScroll, {
      duration: SCROLL_ANIMATION_DURATION_S,
      ease: [0.22, 0.61, 0.36, 1],
      onUpdate: (value) => {
        container.scrollLeft = value;
      },
    });

    return () => {
      scrollAnimationRef.current?.stop?.();
    };
  }, [selectedIndex, days]);

  return (
    <div className="calendar-module" {...props}>
      <h2 className="calendar-module-title text-h4-bold">
        {title}
      </h2>
      <div className="calendar-scroll" ref={scrollRef}>
        <motion.div
          className="calendar-scroll-track"
          animate={{ x: isLastDayInWeekSelected ? -LAST_DAY_WEEK_SHIFT_PX : 0 }}
          transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
        >
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
        </motion.div>
      </div>
    </div>
  );
};

CalendarModule.displayName = 'CalendarModule';
