import React from 'react';
import { BmrCalculatorCard } from './BmrCalculatorCard';

export default {
  title: 'Components/BmrCalculatorCard',
  component: BmrCalculatorCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `Expandable helper card that estimates a user's Basal Metabolic Rate (BMR) from height, weight, and gender using the Mifflin-St Jeor equation. Collapses after the user saves, calling \`onSave({ bmr, weight, height, gender })\`.

## When to use
- On the account/preferences page alongside a calorie goal input, when the user may not know their calorie target and needs a guided calculation
- Only render one per screen — it is a standalone helper, not a reusable form tile

## When NOT to use
- Don't use to collect body metrics as primary data storage — it is a one-shot calculator; persist the result, not the inputs
- Don't use if the user has already saved a calorie goal and doesn't need recalculation — hide or de-emphasise it in that case

## Pairs well with
- A calorie/kcal goal input field directly above or below — the BMR result flows directly into that field
- \`AccountCard\` as part of the account page stack`,
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
  parameters: {
    docs: {
      description: {
        story: 'Collapsed state — shows the prompt text and the expand link. Click "Calculate from height & weight" to reveal the form.',
      },
    },
  },
};

export const Expanded = {
  render: () => (
    <div style={{ maxWidth: 390, padding: 'var(--spacing-16)' }}>
      <BmrCalculatorCard onSave={(data) => console.log('BMR saved:', data)} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Click the link in this story to expand the form and see the weight, height, and gender fields. "Save and close" is disabled until all three fields are filled in.',
      },
    },
  },
};
