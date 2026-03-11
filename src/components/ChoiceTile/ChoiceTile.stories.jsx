import React, { useState } from 'react';
import { ChoiceTile } from './ChoiceTile';

export default {
  title: 'Components/ChoiceTile',
  component: ChoiceTile,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Large tap-target tile for single-choice selection. Used in onboarding flows.',
      },
    },
  },
  tags: ['autodocs'],
};

export const Default = {
  render: () => (
    <div style={{ width: 320 }}>
      <ChoiceTile label="Lose weight" value="lose-weight" selected={false} onClick={() => {}} />
    </div>
  ),
};

export const Selected = {
  render: () => (
    <div style={{ width: 320 }}>
      <ChoiceTile label="Lose weight" value="lose-weight" selected onClick={() => {}} />
    </div>
  ),
};

export const ChoiceGroup = {
  render: () => {
    const [selected, setSelected] = useState('maintain');
    const options = [
      { value: 'lose-weight', label: 'Lose weight' },
      { value: 'maintain', label: 'Maintain' },
      { value: 'gain-muscle', label: 'Gain muscle' },
      { value: 'eat-healthier', label: 'Eat healthier' },
    ];
    return (
      <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)' }}>
        {options.map((o) => (
          <ChoiceTile
            key={o.value}
            label={o.label}
            value={o.value}
            selected={selected === o.value}
            onClick={setSelected}
          />
        ))}
      </div>
    );
  },
};
