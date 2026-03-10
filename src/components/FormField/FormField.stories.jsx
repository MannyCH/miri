import React from 'react';
import { FormField } from './FormField';

export default {
  title: 'Components/FormField',
  component: FormField,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Form field component from Figma `Form fields` set with variants: Empty, Filled, and Error.',
      },
    },
  },
};

const Wrapper = ({ children }) => (
  <div style={{ width: '356px' }}>
    {children}
  </div>
);

export const Empty = {
  render: () => (
    <Wrapper>
      <FormField label="Email" variant="empty">
        <input className="text-body-regular" type="email" placeholder="name@email.com" readOnly />
      </FormField>
    </Wrapper>
  ),
};

export const Filled = {
  render: () => (
    <Wrapper>
      <FormField label="Email" variant="filled">
        <input className="text-body-regular" type="email" value="laura@anicelydone.club" readOnly />
      </FormField>
    </Wrapper>
  ),
};

export const Error = {
  render: () => (
    <Wrapper>
      <FormField label="Email" variant="error" message="Wrong format. Please use name@email.com.">
        <input className="text-body-regular" type="email" value="laura@anicelydone.club" readOnly />
      </FormField>
    </Wrapper>
  ),
};

