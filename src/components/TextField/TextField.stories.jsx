import React, { useState } from 'react';
import { TextField } from './TextField';

/**
 * TextField is the go-to component for all text, email, and password inputs.
 *
 * It replaces the old pattern of composing FormField + <input> manually.
 * Use this everywhere a user types freeform text — never FormField + raw input.
 *
 * For dropdowns use SelectField. For number + unit inputs use UnitField.
 * For completely custom controls (e.g. date pickers) use FormField as a wrapper.
 */
export default {
  title: 'Components/TextField',
  component: TextField,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
**The standard text input component.** Handles label, variant state, font class, and — for \`type="password"\` — an eye toggle, all automatically.

## When to use
- Any freeform text entry: name, email, password, search query
- Auth screens (login, signup, verify)
- Any place the user types a string value with a label above it

## When NOT to use
- For numeric inputs that pair with a physical unit (kg, cm, kcal) — use \`UnitField\`
- For choosing from a list of options — use \`SelectField\`
- For incrementing/decrementing a small integer — use \`Stepper\`
- Never compose a raw \`<input>\` + separate label by hand — always use this component

## Pairs well with
- \`Button\` as the submit/CTA below the field
- \`SelectField\` and \`UnitField\` in multi-field settings forms

| Need | Use |
|------|-----|
| Text / email / password input | **\`TextField\`** ← you are here |
| Dropdown select | [\`SelectField\`](?path=/docs/components-selectfield--docs) |
| Number + unit (e.g. kg, cm, kcal) | [\`UnitField\`](?path=/docs/components-unitfield--docs) |
| Custom / composite control | Compose your own using the same CSS tokens |

> ⚠️ Never use \`FormField + <input>\` for plain text inputs. Use \`TextField\` instead.
        `.trim(),
      },
    },
  },
};

function Controlled({ type, label, placeholder, disabled, readOnly, defaultValue = '' }) {
  const [value, setValue] = useState(defaultValue);
  return (
    <TextField
      label={label}
      type={type}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      onChange={setValue}
    />
  );
}

export const Default = {
  render: () => <Controlled label="Your name" placeholder="Enter your name" />,
  parameters: {
    docs: {
      description: {
        story: 'Empty state — placeholder is shown. This is the initial state when a form field has not yet been touched.',
      },
    },
  },
};

export const Filled = {
  render: () => (
    <TextField label="Your name" value="Manuel" onChange={() => {}} />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Filled state — a value is present. The field styling changes automatically when value is non-empty.',
      },
    },
  },
};

export const Email = {
  render: () => (
    <Controlled
      type="email"
      label="Email address"
      placeholder="you@example.com"
      autoComplete="email"
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Email input with autocomplete hint — keyboard shows "@" on mobile. Used on auth screens.',
      },
    },
  },
};

export const Password = {
  render: () => (
    <Controlled
      type="password"
      label="Password"
      placeholder="Enter password"
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Password type automatically adds an eye toggle to reveal/hide the value.',
      },
    },
  },
};

export const WithError = {
  render: () => (
    <TextField
      label="Email address"
      type="email"
      value="not-an-email"
      error="Enter a valid email address."
      onChange={() => {}}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Error state — an error message appears below the label with a warning icon. The field border switches to the error color automatically.',
      },
    },
  },
};

export const Disabled = {
  render: () => (
    <TextField
      label="Email address"
      type="email"
      value="manuel@example.com"
      disabled
      onChange={() => {}}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Disabled state — value is visible but cannot be edited.',
      },
    },
  },
};

export const ReadOnly = {
  render: () => (
    <TextField
      label="Email address"
      type="email"
      value="manuel@example.com"
      readOnly
      onChange={() => {}}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Read-only state — value is visible and selectable but cannot be changed. Use for displaying account data that cannot be edited inline (e.g. the verified email address).',
      },
    },
  },
};
