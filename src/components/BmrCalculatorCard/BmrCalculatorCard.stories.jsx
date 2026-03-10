import React from 'react';
import { BmrCalculatorCard } from './BmrCalculatorCard';

export default {
  title: 'Components/BmrCalculatorCard',
  component: BmrCalculatorCard,
  parameters: {
    docs: {
      description: {
        component:
          'Expandable card for calculating Metabolic Basal Rate from height, weight, and gender. Click "Calculate from height & weight" to expand the form. On save, calls onSave({ bmr, weight, height, gender }) and collapses. Uses Mifflin-St Jeor equation.',
      },
    },
  },
};

export const Default = {
  render: () => (
    <div style={{ maxWidth: 390, padding: 'var(--spacing-16)' }}>
      <BmrCalculatorCard onSave={(data) => console.log('BMR saved:', data)} />
    </div>
  ),
};

export const Expanded = {
  render: () => (
    <div style={{ maxWidth: 390, padding: 'var(--spacing-16)' }}>
      <BmrCalculatorCard onSave={(data) => console.log('BMR saved:', data)} />
    </div>
  ),
};
