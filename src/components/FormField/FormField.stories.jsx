import React from 'react';
import { FormField } from './FormField';
import { Stepper } from '../Stepper/Stepper';

/**
 * FormField is a low-level layout primitive: label + styled control container + error message.
 *
 * ⚠️  For text, email, and password inputs, use <TextField> instead.
 *     TextField is self-contained and handles font class, variant derivation,
 *     and the eye toggle automatically.
 *
 * Use FormField only when wrapping a control that is NOT a plain text input —
 * for example a custom date picker, color picker, stepper, or any other
 * non-standard control that needs the standard field chrome (label + border box).
 */
export default {
  title: 'Components/FormField',
  component: FormField,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
**Low-level layout primitive.** Renders the field label, styled border box, and optional error message.

> ⚠️ **Do not use this with plain text inputs.** Use [\`TextField\`](?path=/docs/components-textfield--docs) instead — it is self-contained and handles font, variant, and eye toggle automatically.

Use \`FormField\` only when you need to wrap a **custom or composite control** (e.g. a stepper, date picker, color picker) inside the standard field chrome.
        `.trim(),
      },
    },
  },
};

const Wrapper = ({ children }) => (
  <div style={{ width: '356px' }}>
    {children}
  </div>
);

/** Wrapping a Stepper — an example of a custom control that needs field chrome. */
export const WithCustomControl = {
  name: 'With custom control (e.g. Stepper)',
  render: () => {
    const [value, setValue] = React.useState(2);
    return (
      <Wrapper>
        <FormField label="Servings" variant="filled">
          <Stepper value={value} min={1} max={20} onChange={setValue} />
        </FormField>
      </Wrapper>
    );
  },
};

/** Empty state — no value entered, placeholder visible. */
export const Empty = {
  render: () => (
    <Wrapper>
      <FormField label="Custom control" variant="empty">
        <span style={{ color: 'var(--color-text-weak)', fontSize: '14px' }}>
          — place any custom control here —
        </span>
      </FormField>
    </Wrapper>
  ),
};

/** Filled state — a value is present. */
export const Filled = {
  render: () => (
    <Wrapper>
      <FormField label="Custom control" variant="filled">
        <span style={{ fontSize: '14px' }}>Custom value</span>
      </FormField>
    </Wrapper>
  ),
};

/** Error state — shows an inline error message below the label. */
export const Error = {
  render: () => (
    <Wrapper>
      <FormField label="Custom control" variant="error" message="This field is required.">
        <span style={{ fontSize: '14px', color: 'var(--color-text-error)' }}>Invalid value</span>
      </FormField>
    </Wrapper>
  ),
};
