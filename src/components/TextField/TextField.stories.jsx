import React, { useState } from 'react';
import { TextField } from './TextField';

export default {
  title: 'Components/TextField',
  component: TextField,
  parameters: {
    docs: {
      description: {
        component:
          'Text input field with label, auto-derived variant state, and optional eye toggle for password fields. Use instead of composing FormField + raw input manually.',
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
