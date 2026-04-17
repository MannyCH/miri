import React from 'react';
import { SettingsSection } from './SettingsSection';
import { Stepper } from '../Stepper/Stepper';
import { SelectField } from '../SelectField/SelectField';

export default {
  title: 'Components/SettingsSection',
  component: SettingsSection,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Section container with a bold title header and a bottom divider. Groups related settings fields into a named block.

## When to use
- Organising settings or preferences into labelled groups (e.g. "Eating preferences", "Advanced - Health")
- Any time multiple \`SelectField\`, \`Stepper\`, or \`UnitField\` controls belong to the same topic
- Account and preferences screens where visual separation between topics improves scannability

## When NOT to use
- As a generic card or content container — this component is specifically for settings groups
- When only a single control exists with no siblings — a standalone label on the control is sufficient
- In forms outside the settings context — use a fieldset with a legend instead

## Pairs well with
- \`SelectField\` — dropdown preferences within the section
- \`Stepper\` — numeric preferences like serving size
- \`UnitField\` — metric inputs like weight, height, or BMR

## spacing prop
| Value | Top padding | When to use |
|-------|-------------|-------------|
| \`normal\` | 8px | First section or tightly grouped sections |
| \`section\` | 32px | Secondary/advanced sections that need visual breathing room |
        `.trim(),
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
  parameters: {
    docs: {
      description: {
        story: 'Minimal section with a title and placeholder content — shows the header + divider structure.',
      },
    },
  },
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
  parameters: {
    docs: {
      description: {
        story: 'Realistic composition — a Stepper and SelectField grouped under a shared section title, as seen on the account settings screen.',
      },
    },
  },
};

export const SectionSpacing = {
  name: 'spacing="section" (Advanced sections)',
  parameters: {
    docs: {
      description: {
        story: 'Two adjacent sections — the second uses spacing="section" (32px top padding) to create a clear visual separation between topic groups.',
      },
    },
  },
  render: () => (
    <div>
      <SettingsSection title="Eating preferences">
        <p style={{ margin: 0, color: 'var(--color-text-weak)' }}>First section</p>
      </SettingsSection>
      <SettingsSection title="Advanced - Health" spacing="section">
        <p style={{ margin: 0, color: 'var(--color-text-weak)' }}>
          Second section — 32px top padding separates it from the first
        </p>
      </SettingsSection>
    </div>
  ),
};
