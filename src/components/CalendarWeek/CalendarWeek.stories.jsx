import React from 'react';
import { CalendarWeek } from './CalendarWeek';

export default {
  title: 'Components/CalendarWeek',
  component: CalendarWeek,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `A static row of exactly 7 \`CalendarButton\` cells representing one calendar week. Handles the \`isPast\` flag to visually de-emphasise past days and highlights the selected day.

## When to use
- When you need a single-week date selector with no horizontal scroll (e.g. a compact week header inside a card)
- As the presentational week row inside \`CalendarModule\` or any other scrollable container you manage externally

## When NOT to use
- Don't use when the user needs to browse beyond a single week — use \`CalendarModule\` instead, which includes pagination and auto-scroll
- Don't use for arbitrary option selection — use \`ChoiceTile\` for non-date choices

## Pairs well with
- \`CalendarModule\` uses its own scroll logic rather than composing CalendarWeek, but CalendarWeek is the right building block when you need a standalone week row
- Week-header patterns inside meal cards or summary widgets`,
      },
    },
  },
};

const sampleDays = [
  { date: 17, weekday: 'Mo', isPast: false },
  { date: 18, weekday: 'Tu', isPast: false },
  { date: 19, weekday: 'We', isPast: false },
  { date: 20, weekday: 'Th', isPast: false },
  { date: 21, weekday: 'Fr', isPast: false },
  { date: 22, weekday: 'Sa', isPast: false },
  { date: 23, weekday: 'Su', isPast: false },
];

export const Default = {
  args: {
    days: sampleDays,
    selectedDay: 20,
  },
  parameters: {
    docs: {
      description: {
        story: 'Thursday (day 20) is selected. All days in this sample are in the future so none use the no-background (past) state.',
      },
    },
  },
};

export const Interactive = () => {
  const [selected, setSelected] = React.useState(20);
  
  return (
    <div style={{ width: '358px' }}>
      <CalendarWeek
        days={sampleDays}
        selectedDay={selected}
        onDayClick={setSelected}
      />
    </div>
  );
};
