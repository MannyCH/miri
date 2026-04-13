import React, { useState } from 'react';
import { ChoiceTile } from './ChoiceTile';

export default {
  title: 'Components/ChoiceTile',
  component: ChoiceTile,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `Large tap-target tile for mutually exclusive single-choice selection. Renders a full-width button that toggles between unselected and selected states.

## When to use
- Onboarding question screens where the user picks one option from a short list (e.g. "What's your goal?")
- Any single-select group where options need a large, accessible touch target — especially on mobile
- When choices are simple text labels without icons or extra metadata

## When NOT to use
- Don't use for multi-select — there is no multi-select affordance; use checkboxes instead
- Don't use when options have rich content (icons, descriptions, prices) — a custom card tile is more appropriate
- Don't use inline within body text or alongside other form controls — it expects to be the sole input in a step/screen
- Don't use for Yes/No binary choices that fit neatly in a dialog — use \`ConfirmDialog\` instead

## Pairs well with
- A \`ChoiceTile\` group (map over options array) stacked vertically with \`gap: var(--spacing-8)\`
- A \`Button variant="primary"\` Continue button below the group to advance the onboarding step`,
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
  parameters: {
    docs: {
      description: {
        story: 'Unselected state — neutral background, awaiting user tap.',
      },
    },
  },
};

export const Selected = {
  render: () => (
    <div style={{ width: 320 }}>
      <ChoiceTile label="Lose weight" value="lose-weight" selected onClick={() => {}} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Selected state — highlighted to confirm the active choice.',
      },
    },
  },
};

export const ChoiceGroup = {
  parameters: {
    docs: {
      description: {
        story: 'Typical onboarding usage — a vertical stack of tiles where only one can be active at a time. Click any tile to move the selection.',
      },
    },
  },
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
