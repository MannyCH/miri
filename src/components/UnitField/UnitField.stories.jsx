import React, { useState } from 'react';
import { UnitField } from './UnitField';

export default {
  title: 'Components/UnitField',
  component: UnitField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Number input with a fixed unit label displayed to the right of the input. Designed for health metrics and any measurement that pairs a numeric value with a physical unit.

## When to use
- Entering a measurement that always has a fixed unit: weight (kg), height (cm), calorie target (kcal)
- Settings screens where the user types a number and the unit is contextually obvious
- When \`min\`, \`max\`, and \`step\` constraints make sense for the input

## When NOT to use
- For freeform text without a unit — use \`TextField\`
- For incrementing/decrementing a small integer — use \`Stepper\`
- For choosing from a list — use \`SelectField\`
- When the unit can change (user selects kg vs lb) — a custom composite control is needed

## Pairs well with
- \`SettingsSection\` as the grouping container
- Multiple \`UnitField\` instances side by side (e.g. weight + height in the same row)
- \`SelectField\` and \`Stepper\` in the same settings section
        `.trim(),
      },
    },
  },
};

function UnitFieldWithState({ ...props }) {
  const [value, setValue] = useState('');
  return <UnitField {...props} value={value} onChange={setValue} />;
}

export const BMR = {
  render: () => <UnitFieldWithState label="Metabolic basal rate" unit="kcal" />,
  parameters: {
    docs: {
      description: {
        story: 'Basal metabolic rate input — user enters a calorie target. The "kcal" unit is always visible to avoid ambiguity.',
      },
    },
  },
};

export const Weight = {
  render: () => <UnitFieldWithState label="Weight" unit="kg" />,
  parameters: {
    docs: {
      description: {
        story: 'Body weight input with "kg" unit. Used in the Advanced - Health settings section.',
      },
    },
  },
};

export const Height = {
  render: () => <UnitFieldWithState label="Height" unit="cm" />,
  parameters: {
    docs: {
      description: {
        story: 'Body height input with "cm" unit. Used alongside weight in the Advanced - Health settings section.',
      },
    },
  },
};

export const WithValue = {
  render: () => (
    <UnitField label="Metabolic basal rate" unit="kcal" value="1600" onChange={() => {}} />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Filled state — a value is present. Shows how the input looks once the user has entered their data.',
      },
    },
  },
};

export const WeightAndHeight = {
  render: () => (
    <div style={{ display: 'flex', gap: '32px' }}>
      <UnitFieldWithState label="Weight" unit="kg" />
      <UnitFieldWithState label="Height" unit="cm" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Two UnitField inputs placed side by side in the same row — the standard layout for the health metrics section.',
      },
    },
  },
};
