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
        component: `Full calendar navigation module — a dynamic title that updates to "Today", "Tomorrow", or the weekday name, combined with a horizontally scrollable strip of \`CalendarButton\` cells. Automatically pages to keep the selected day visible.

## When to use
- As the primary date-picker at the top of the Meal Planning view — one per screen
- When the user needs to navigate across a multi-week range of days and see meal context per day

## When NOT to use
- Don't use when only a single week is needed — \`CalendarWeek\` is lighter and has no scroll logic
- Don't use for date input in a form (e.g. pick a date for a reminder) — a date picker or text input is more appropriate

## Pairs well with
- Meal plan content panels rendered below the module that update when the selected day changes
- \`CalendarButton\` (rendered internally — not composed manually)`,
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
  parameters: {
    docs: {
      description: {
        story: 'Static snapshot with today selected. Title reads "Today". The calendar auto-scrolls to the correct page when selectedDay changes.',
      },
    },
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

Interactive.parameters = {
  docs: {
    description: {
      story: 'Click any day to see the title update and the calendar page to the correct week. Demonstrates the auto-scroll pagination behaviour when selecting a day at the end of a week.',
    },
  },
};
