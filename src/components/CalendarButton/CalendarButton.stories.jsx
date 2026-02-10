import React from 'react';
import { CalendarButton } from './CalendarButton';

export default {
  title: 'Components/CalendarButton',
  component: CalendarButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Calendar date button with 3 states: No background, Default, and Pressed.',
      },
    },
  },
  argTypes: {
    state: {
      control: 'select',
      options: ['no-background', 'default', 'pressed'],
      description: 'Button state',
    },
    children: {
      control: 'text',
      description: 'Date number',
    },
  },
};

export const NoBackground = {
  args: {
    state: 'no-background',
    children: '22',
  },
};

export const Default = {
  args: {
    state: 'default',
    children: '22',
  },
};

export const Pressed = {
  args: {
    state: 'pressed',
    children: '22',
  },
};

export const AllStates = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-16)' }}>
    <CalendarButton state="no-background">22</CalendarButton>
    <CalendarButton state="default">22</CalendarButton>
    <CalendarButton state="pressed">22</CalendarButton>
  </div>
);
