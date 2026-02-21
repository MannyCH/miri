import React from 'react';
import { CalendarButton } from './CalendarButton';

export default {
  title: 'Components/CalendarButton',
  component: CalendarButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Calendar date button with weekday label and day number. Three states: No background (past/inactive), Default (available), and Pressed (selected/today). Matches Figma Calendar Button component set.',
      },
    },
  },
  argTypes: {
    state: {
      control: 'select',
      options: ['no-background', 'default', 'pressed'],
      description: 'Visual state of the button',
    },
    day: {
      control: 'number',
      description: 'Day number to display',
    },
    weekday: {
      control: 'text',
      description: 'Weekday abbreviation (Mo, Tu, We, etc.)',
    },
  },
};

export const NoBackground = {
  args: {
    state: 'no-background',
    day: 22,
    weekday: 'Mo',
  },
};

export const Default = {
  args: {
    state: 'default',
    day: 23,
    weekday: 'Tu',
  },
};

export const Pressed = {
  args: {
    state: 'pressed',
    day: 25,
    weekday: 'Th',
  },
};

export const AllStates = () => (
  <div style={{ display: 'flex', gap: 'var(--spacing-16)' }}>
    <CalendarButton state="no-background" day={22} weekday="Mo" />
    <CalendarButton state="default" day={23} weekday="Tu" />
    <CalendarButton state="pressed" day={25} weekday="Th" />
  </div>
);
