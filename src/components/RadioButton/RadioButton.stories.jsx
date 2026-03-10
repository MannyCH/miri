import React, { useState } from 'react';
import { RadioButton } from './RadioButton';

export default {
  title: 'Components/RadioButton',
  component: RadioButton,
  parameters: {
    layout: 'centered',
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
};

export const Checked = {
  args: {
    label: 'Male',
    value: 'male',
    checked: true,
    name: 'gender',
    onChange: () => {},
  },
};

export const WithoutLabel = {
  args: {
    value: 'option',
    checked: false,
    name: 'standalone',
    onChange: () => {},
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
};
