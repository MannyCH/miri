import React from 'react';
import { SettingsSection } from './SettingsSection';
import { Stepper } from '../Stepper/Stepper';
import { SelectField } from '../SelectField/SelectField';

export default {
  title: 'Components/SettingsSection',
  component: SettingsSection,
  parameters: {
    docs: {
      description: {
        component: 'Section container with a bold title and a bottom border divider. Used to group related settings.',
      },
    },
  },
};

export const Default = {
  render: () => (
    <SettingsSection title="Eating preferences">
      <p style={{ margin: 0, color: 'var(--color-text-weak)' }}>Section content goes here</p>
    </SettingsSection>
  ),
};

export const WithFields = {
  render: () => (
    <SettingsSection title="Eating preferences">
      <Stepper
        label="How many people are you usually cooking for?"
        value={2}
        min={1}
        max={20}
        onChange={() => {}}
      />
      <SelectField
        label="How do you like to eat?"
        options={[
          { value: 'plant-forward', label: 'Plant-forward' },
          { value: 'high-protein', label: 'High protein' },
        ]}
        value=""
        onChange={() => {}}
      />
    </SettingsSection>
  ),
};
