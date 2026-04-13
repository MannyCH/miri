import React from 'react';
import { CalendarButton } from './CalendarButton';

export default {
  title: 'Components/CalendarButton',
  component: CalendarButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `Individual day cell in the calendar — shows a weekday abbreviation and day number stacked vertically. Three visual states reflect whether the day is in the past, available to select, or currently selected.

## When to use
- As the building block inside \`CalendarWeek\` or \`CalendarModule\` — do not use standalone
- When you need a tap target that represents a single calendar day with clear selected/unselected feedback

## When NOT to use
- Don't use outside of a calendar row/module context — it carries no label or surrounding context on its own
- Don't use for non-date selection (e.g. choosing a category) — use \`ChoiceTile\` instead

## Pairs well with
- \`CalendarWeek\` — wraps a row of 7 CalendarButtons
- \`CalendarModule\` — adds a title and horizontal scroll behaviour to a sequence of CalendarButtons`,
      },
    },
  },
  argTypes: {
    state: {
      control: 'select',
      options: ['no-background', 'default', 'pressed'],
      description: 'Visual state of the button. `no-background` — past or inactive day, reduced emphasis. `default` — future/available day, normal emphasis. `pressed` — currently selected day, highlighted fill.',
    },
    day: {
      control: 'number',
      description: 'Day number to display (1–31).',
    },
    weekday: {
      control: 'text',
      description: 'Two-letter weekday abbreviation shown above the day number (Mo, Tu, We, Th, Fr, Sa, Su).',
    },
  },
};

export const NoBackground = {
  args: {
    state: 'no-background',
    day: 22,
    weekday: 'Mo',
  },
  parameters: {
    docs: {
      description: {
        story: 'Past or inactive day — reduced visual weight signals the date is not selectable or has already passed.',
      },
    },
  },
};

export const Default = {
  args: {
    state: 'default',
    day: 23,
    weekday: 'Tu',
  },
  parameters: {
    docs: {
      description: {
        story: 'Future/available day — normal emphasis, ready to be selected.',
      },
    },
  },
};

export const Pressed = {
  args: {
    state: 'pressed',
    day: 25,
    weekday: 'Th',
  },
  parameters: {
    docs: {
      description: {
        story: 'Currently selected day — highlighted fill to confirm the active selection.',
      },
    },
  },
};

export const AllStates = () => (
  <div style={{ display: 'flex', gap: 'var(--spacing-16)' }}>
    <CalendarButton state="no-background" day={22} weekday="Mo" />
    <CalendarButton state="default" day={23} weekday="Tu" />
    <CalendarButton state="pressed" day={25} weekday="Th" />
  </div>
);
