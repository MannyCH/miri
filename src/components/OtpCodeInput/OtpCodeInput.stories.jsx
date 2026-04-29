import React from 'react';
import { OtpCodeInput } from './OtpCodeInput';

export default {
  title: 'Components/OtpCodeInput',
  component: OtpCodeInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Six single-character digit boxes for OTP / email verification codes.

## When to use
- Email or SMS verification flows where the user enters a one-time code
- Always paired with a \`role="group"\` container (built in) and \`aria-label\`

## When NOT to use
- General text input — use \`TextField\`
- Passwords — use \`TextField\` with \`type="password"\`

## Behaviour
- Typing a digit auto-advances focus to the next box
- Backspace on an empty box moves focus to the previous box
- Pasting a full code (e.g. from clipboard) fills all boxes at once
- \`error\` prop switches borders to \`--color-stroke-error-strong\`

## Token mapping
| Element | State | Token |
|---------|-------|-------|
| Digit box border | default | \`--color-stroke-weak\` |
| Digit box border | focused | \`--color-stroke-focus\` |
| Digit box border | error | \`--color-stroke-error-strong\` |
| Digit box fill | focused | \`--color-fill-brand-weak\` |
| Digit text | — | \`--color-text-strong\` · \`text-body-regular\` |
| Helper text | — | \`--color-text-weak\` · \`text-body-small-regular\` |
| Box radius | — | \`--corner-radius-8\` |
| Box padding | — | \`--spacing-8\`, \`--spacing-16\` |
        `,
      },
    },
  },
  argTypes: {
    length: {
      control: { type: 'number', min: 4, max: 8 },
      description: 'Number of digit boxes',
      table: { defaultValue: { summary: '6' } },
    },
    value: {
      control: 'text',
      description: 'Current OTP value string',
    },
    error: {
      control: 'boolean',
      description: 'Error state — red border on all boxes',
      table: { defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
      table: { defaultValue: { summary: 'false' } },
    },
  },
};

export const Empty = {
  args: { length: 6, value: '' },
  parameters: {
    docs: { description: { story: 'Default state — all boxes empty, waiting for user input.' } },
  },
};

export const PartiallyFilled = {
  args: { length: 6, value: '482' },
  parameters: {
    docs: { description: { story: 'User has entered three of six digits. Focus would be on the fourth box.' } },
  },
};

export const Filled = {
  args: { length: 6, value: '482916' },
  parameters: {
    docs: { description: { story: 'All six boxes filled — ready to submit.' } },
  },
};

export const Error = {
  args: { length: 6, value: '482916', error: true },
  parameters: {
    docs: { description: { story: 'Invalid code — all boxes filled but verification failed. Borders switch to error red.' } },
  },
};

export const Disabled = {
  args: { length: 6, value: '', disabled: true },
  parameters: {
    docs: { description: { story: 'Disabled state — inputs are not interactive.' } },
  },
};

export const Interactive = {
  parameters: {
    docs: { description: { story: 'Live demo — type digits to see auto-advance, backspace to go back, paste a 6-digit code to fill all boxes.' } },
  },
  render: () => {
    const [value, setValue] = React.useState('');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-16)' }}>
        <OtpCodeInput length={6} value={value} onChange={setValue} />
        <span className="text-body-small-regular" style={{ color: 'var(--color-text-weak)' }}>
          {value.length === 6 ? `Code: ${value}` : `${value.length} / 6 digits`}
        </span>
      </div>
    );
  },
};
