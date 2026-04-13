import React, { useState } from 'react';
import { RadioButton } from './RadioButton';

export default {
  title: 'Components/RadioButton',
  component: RadioButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `A single radio button input with an optional text label. Renders a native \`<input type="radio">\` styled to the Miri design system.

## When to use
- When the user must pick exactly one option from a small, fixed set (2–5 options)
- Always use multiple RadioButtons sharing the same \`name\` prop so the browser enforces mutual exclusivity
- Prefer RadioButton over a Select/dropdown when all options should be visible simultaneously and there are 5 or fewer choices

## When NOT to use
- Do not use for binary on/off choices — use a Toggle or Checkbox instead
- Do not use a single RadioButton in isolation (a lone radio has no mutual-exclusivity semantics); always group two or more
- Do not use for more than ~6 options — a Select dropdown scales better

## Pairs well with
- Other RadioButtons sharing the same \`name\` — always render as a group
- A \`<fieldset>\` + \`<legend>\` to give the group an accessible label (required for WCAG 2.1 AA)`,
      },
    },
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Visible text label rendered next to the radio circle. Omit (or pass undefined) only when an external label element already describes the option.',
    },
    checked: {
      control: 'boolean',
      description: 'Whether this radio option is currently selected. Always manage this externally — RadioButton is a controlled component.',
    },
    value: {
      control: 'text',
      description: 'The value emitted to onChange when this option is selected. Should be unique within the radio group.',
    },
    name: {
      control: 'text',
      description: 'HTML name attribute shared by all RadioButtons in the same group. Browsers use this to enforce mutual exclusivity.',
    },
  },
};

export const Unchecked = {
  args: {
    label: 'Female',
    value: 'female',
    checked: false,
    name: 'gender',
    onChange: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'The unselected state — the ring is empty. This is how all non-active options in a group appear.',
      },
    },
  },
};

export const Checked = {
  args: {
    label: 'Male',
    value: 'male',
    checked: true,
    name: 'gender',
    onChange: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'The selected state — the ring contains a filled dot. Exactly one RadioButton per group should be in this state at any time.',
      },
    },
  },
};

export const WithoutLabel = {
  args: {
    value: 'option',
    checked: false,
    name: 'standalone',
    onChange: () => {},
  },
  parameters: {
    docs: {
      description: {
        story: 'A radio button without a visible label — only use when an external label element (e.g. a table row header) already describes the option. Always provide an aria-label in this case.',
      },
    },
  },
};

export const Group = {
  render: () => {
    const [selected, setSelected] = useState('female');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <RadioButton
          label="Female"
          value="female"
          name="gender-group"
          checked={selected === 'female'}
          onChange={setSelected}
        />
        <RadioButton
          label="Male"
          value="male"
          name="gender-group"
          checked={selected === 'male'}
          onChange={setSelected}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Two RadioButtons sharing a name — the typical usage. Selecting one automatically deselects the other. In production, always wrap the group in a fieldset + legend for accessibility.',
      },
    },
  },
};
