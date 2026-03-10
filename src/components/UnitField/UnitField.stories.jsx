import React, { useState } from 'react';
import { UnitField } from './UnitField';

export default {
  title: 'Components/UnitField',
  component: UnitField,
  parameters: {
    docs: {
      description: {
        component: 'Number input with an inline unit label. Used for health metrics like BMR (kcal), weight (kg), and height (cm).',
      },
    },
  },
};

function UnitFieldWithState({ ...props }) {
  const [value, setValue] = useState('');
  return <UnitField {...props} value={value} onChange={setValue} />;
}

export const BMR = {
  render: () => <UnitFieldWithState label="Metabolic basal rate" unit="kcal" />,
};

export const Weight = {
  render: () => <UnitFieldWithState label="Weight" unit="kg" />,
};

export const Height = {
  render: () => <UnitFieldWithState label="Height" unit="cm" />,
};

export const WithValue = {
  render: () => (
    <UnitField label="Metabolic basal rate" unit="kcal" value="1600" onChange={() => {}} />
  ),
};

export const WeightAndHeight = {
  render: () => (
    <div style={{ display: 'flex', gap: '32px' }}>
      <UnitFieldWithState label="Weight" unit="kg" />
      <UnitFieldWithState label="Height" unit="cm" />
    </div>
  ),
};
