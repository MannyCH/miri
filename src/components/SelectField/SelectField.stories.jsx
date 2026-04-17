import React, { useState } from 'react';
import { SelectField } from './SelectField';

export default {
  title: 'Components/SelectField',
  component: SelectField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Labelled dropdown select field. Wraps a native \`<select>\` element with a styled chevron indicator.

## When to use
- Choosing one value from a short, known set of options (eating style, health goal, dietary preference)
- Settings screens where a full-page picker would be overkill
- When options are pre-defined and do not require freeform input

## When NOT to use
- For freeform text input — use \`TextField\`
- For numeric values with a unit (weight, height, BMR) — use \`UnitField\`
- For incrementing/decrementing a number — use \`Stepper\`
- When the option list is very long or needs search — consider a dedicated picker pattern

## Pairs well with
- \`SettingsSection\` as the grouping container
- \`Stepper\` for adjacent settings rows (e.g. serving size next to eating style)
        `.trim(),
      },
    },
  },
};

const EATING_OPTIONS = [
  { value: 'no-preference', label: 'No preference' },
  { value: 'plant-forward', label: 'Plant-forward' },
  { value: 'high-protein', label: 'High protein' },
  { value: 'intermittent-fasting', label: 'Intermittent fasting' },
  { value: 'mediterranean', label: 'Mediterranean' },
];

const GOAL_OPTIONS = [
  { value: 'lose-weight', label: 'Lose weight' },
  { value: 'maintain', label: 'Maintain' },
  { value: 'gain-muscle', label: 'Gain muscle' },
  { value: 'eat-healthier', label: 'Eat healthier' },
];

function SelectWithState({ options, label, placeholder }) {
  const [value, setValue] = useState('');
  return (
    <SelectField
      label={label}
      options={options}
      value={value}
      placeholder={placeholder}
      onChange={setValue}
    />
  );
}

export const Default = {
  render: () => (
    <SelectWithState
      label="How do you like to eat?"
      options={EATING_OPTIONS}
      placeholder="Select"
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Unselected state — placeholder is shown. This is the initial state when a user opens account settings for the first time.',
      },
    },
  },
};

export const WithSelection = {
  render: () => (
    <SelectField
      label="How do you like to eat?"
      options={EATING_OPTIONS}
      value="plant-forward"
      onChange={() => {}}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'A value is already selected — the chosen option label replaces the placeholder.',
      },
    },
  },
};

export const GoalSelect = {
  render: () => (
    <SelectWithState
      label="What's your goal?"
      options={GOAL_OPTIONS}
      placeholder="Select"
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Same component used for the health goal preference — only the label and options change.',
      },
    },
  },
};
