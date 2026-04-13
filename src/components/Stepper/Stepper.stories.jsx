import React, { useState } from 'react';
import { Stepper } from './Stepper';

export default {
  title: 'Components/Stepper',
  component: Stepper,
  parameters: {
    docs: {
      description: {
        component: `
Increment/decrement control for selecting a small integer value. Shows the current value between − and + buttons, with bounds enforcement.

## When to use
- Selecting a quantity that has natural integer steps and a clear min/max (e.g. number of people cooking for: 1–20)
- Settings screens where the user nudges a number rather than typing it
- When freeform numeric input would be error-prone or out-of-range values are undesirable

## When NOT to use
- For continuous values or decimals — use \`UnitField\` (type="number" with step/min/max)
- For values with a physical unit (kg, cm, kcal) — use \`UnitField\`
- For choosing from a named list — use \`SelectField\`
- When the range is very large (e.g. 0–10 000) — a text input is more practical

## Pairs well with
- \`SettingsSection\` as the grouping container
- \`SelectField\` for adjacent preference controls
        `.trim(),
      },
    },
  },
};

function StepperWithState({ initialValue = 2, ...props }) {
  const [value, setValue] = useState(initialValue);
  return <Stepper {...props} value={value} onChange={setValue} />;
}

export const Default = {
  render: () => (
    <StepperWithState
      label="How many people are you usually cooking for?"
      initialValue={2}
      min={1}
      max={20}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Primary use case — default serving size in account settings. Value starts at 2, bounded between 1 and 20.',
      },
    },
  },
};

export const WithoutLabel = {
  render: () => <StepperWithState initialValue={4} min={1} max={20} />,
  parameters: {
    docs: {
      description: {
        story: 'Stepper without a label — valid when context makes the value obvious (e.g. the label is provided by a parent row).',
      },
    },
  },
};

export const AtMinimum = {
  render: () => <StepperWithState initialValue={1} min={1} max={20} label="Servings" />,
  parameters: {
    docs: {
      description: {
        story: 'Value is at the minimum — the decrement button is disabled so the user cannot go below 1.',
      },
    },
  },
};

export const AtMaximum = {
  render: () => <StepperWithState initialValue={20} min={1} max={20} label="Servings" />,
  parameters: {
    docs: {
      description: {
        story: 'Value is at the maximum — the increment button is disabled so the user cannot exceed 20.',
      },
    },
  },
};
