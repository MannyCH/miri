import React from 'react';
import { CalendarWeek } from './CalendarWeek';

export default {
  title: 'Components/CalendarWeek',
  component: CalendarWeek,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Calendar week view with 7 day buttons. Exactly as designed in Figma.',
      },
    },
  },
};

export const Default = {
  args: {
    days: [22, 23, 24, 25, 26, 27, 28],
    selectedDay: 23,
  },
};

export const Interactive = () => {
  const [selected, setSelected] = React.useState(23);
  
  return (
    <div style={{ width: '358px' }}>
      <CalendarWeek
        days={[22, 23, 24, 25, 26, 27, 28]}
        selectedDay={selected}
        onDayClick={setSelected}
      />
    </div>
  );
};
