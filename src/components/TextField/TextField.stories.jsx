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
  parameters: {
    docs: {
      description: {
        component: `
**The standard text input component.** Handles label, variant state, font class, and — for \`type="password"\` — an eye toggle, all automatically.

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
};

export const Filled = {
  render: () => (
    <TextField label="Your name" value="Manuel" onChange={() => {}} />
  ),
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
};
