import React from 'react';
import { CalendarModule } from './CalendarModule';
import { generateCalendarDays, formatDayTitle } from '../../data/recipes';

export default {
  title: 'Components/CalendarModule',
  component: CalendarModule,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Calendar module pattern with dynamic date title and a horizontally swipeable calendar. Matches Figma Calendar Module pattern with fill, padding, and corner radius.',
      },
    },
  },
};

const calendarDays = generateCalendarDays(28);
const todayFullDate = calendarDays[0]?.fullDate;

export const Default = {
  args: {
    title: formatDayTitle(todayFullDate),
    days: calendarDays,
    selectedDay: todayFullDate,
  },
};

export const Interactive = () => {
  const [selected, setSelected] = React.useState(todayFullDate);

  const handleDayClick = (date, fullDate) => {
    setSelected(fullDate);
  };

  return (
    <div style={{ width: '358px' }}>
      <CalendarModule
        title={formatDayTitle(selected)}
        days={calendarDays}
        selectedDay={selected}
        onDayClick={handleDayClick}
      />
      <p style={{ marginTop: '16px', color: 'var(--color-text-weak)' }}>
        Selected: {selected} — Swipe to see more days
      </p>
    </div>
  );
};
