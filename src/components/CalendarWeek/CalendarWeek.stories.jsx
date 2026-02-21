import React from 'react';
import { CalendarWeek } from './CalendarWeek';

export default {
  title: 'Components/CalendarWeek',
  component: CalendarWeek,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Calendar week view with 7 day buttons showing weekday labels and day numbers. Matches Figma Calendar week component.',
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
