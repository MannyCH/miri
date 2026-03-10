import React, { useState } from 'react';
import { SelectField } from './SelectField';

export default {
  title: 'Components/SelectField',
  component: SelectField,
  parameters: {
    docs: {
      description: {
        component: 'Dropdown select field with label. Used in account settings for nutrition and goal preferences.',
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
};

export const GoalSelect = {
  render: () => (
    <SelectWithState
      label="What's your goal?"
      options={GOAL_OPTIONS}
      placeholder="Select"
    />
  ),
};
