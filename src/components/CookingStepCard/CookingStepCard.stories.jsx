import React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';
import { CookingStepCard } from './CookingStepCard';

const meta = {
  title: 'Components/CookingStepCard',
  component: CookingStepCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
One action card in cooking mode. Represents a single self-contained step with an emoji icon,
an action verb, a list of involved ingredients, and an optional duration note.

## When to use
- Inside **CookingModeView** to render the active step and up to two peek cards below it.
- Never stand-alone in recipe detail view — only visible after the user taps "Cook".

## Anatomy
| Element | Token |
|---------|-------|
| Card background | \`--color-fill-brand-weak\` |
| Card radius | \`--corner-radius-card\` |
| Card padding | \`--spacing-inset-md\` |
| Emoji + verb | \`text-h3-bold\` · \`--color-text-weak\` |
| Item qty/name | \`text-body-small-bold\` · \`--color-text-weak\` |
| Item note | \`text-body-small-regular\` · \`--color-text-weak\` |
| Duration | \`text-body-small-regular\` · \`--color-text-weak\` |
| Header → items gap | \`--spacing-stack-sm\` (12 px) |
| Items gap | \`--spacing-gap-md\` (16 px) |

## Props
- \`emoji\` — one emoji character representing the action type
- \`verb\` — imperative verb (e.g. "Wash", "Boil")
- \`items\` — array of \`{ qty?, name?, note? }\` objects
- \`duration\` — \`{ num, unit }\` object or \`null\`
        `,
      },
    },
  },
  argTypes: {
    emoji: {
      control: 'text',
      description: 'Emoji icon representing the action type (e.g. 💧 Wash, 🔪 Prep, 🔥 Boil).',
    },
    verb: {
      control: 'text',
      description: 'Single imperative word describing the action.',
    },
    items: {
      control: 'object',
      description: 'Array of ingredient items involved in this step. Each item has optional qty, name, and note fields.',
    },
    duration: {
      control: 'object',
      description: 'Optional duration, e.g. { num: 10, unit: "min" }. Pass null for steps without a wait time.',
    },
  },
};

export default meta;

export const Default = {
  args: {
    emoji: '💧',
    verb: 'Wash',
    items: [
      { qty: '75g', name: 'yellow lentils', note: 'rinse under cold water until clear' },
    ],
    duration: null,
  },
  parameters: {
    docs: {
      description: {
        story: 'Canonical step 1 from the lentil soup recipe — single ingredient, no duration.',
      },
    },
  },
};

export const MultipleIngredients = {
  args: {
    emoji: '🔪',
    verb: 'Prep',
    items: [
      { qty: '50g', name: 'potato', note: 'cut into quarters' },
      { qty: '½', name: 'onion (60g)', note: 'cut into quarters' },
    ],
    duration: null,
  },
  parameters: {
    docs: {
      description: {
        story: 'Step with two ingredients — shows the gap between list items.',
      },
    },
  },
};

export const WithDuration = {
  args: {
    emoji: '🔥',
    verb: 'Boil',
    items: [],
    duration: { num: 10, unit: 'min' },
  },
  parameters: {
    docs: {
      description: {
        story: 'Step with no ingredients but a required wait time — the duration note appears below the header.',
      },
    },
  },
};

export const ManyIngredients = {
  args: {
    emoji: '🥣',
    verb: 'Add into pan',
    items: [
      { qty: '1l', name: 'water' },
      { qty: '75g', name: 'lentils', note: 'the washed ones' },
      { qty: '50g', name: 'potato', note: 'the quartered pieces' },
      { qty: '½', name: 'onion', note: 'the quartered pieces' },
      { qty: '1 tsp', name: 'salt' },
    ],
    duration: null,
  },
  parameters: {
    docs: {
      description: {
        story: 'Five-ingredient step — verifies vertical rhythm and that the card height expands correctly with more items.',
      },
    },
  },
};

export const NoteOnly = {
  args: {
    emoji: '💪',
    verb: 'Mash',
    items: [
      { note: 'remove from heat' },
      { note: 'mash everything in the pan' },
    ],
    duration: null,
  },
  parameters: {
    docs: {
      description: {
        story: 'Step where items have notes but no qty or name — the note line renders alone.',
      },
    },
  },
};

export const WithDurationAndIngredients = {
  args: {
    emoji: '🌡️',
    verb: 'Simmer',
    items: [
      { note: 'reduce heat' },
      { note: 'skim surface', qty: null, name: null },
    ],
    duration: { num: 25, unit: 'min' },
  },
  parameters: {
    docs: {
      description: {
        story: 'Step combining ingredient notes and a duration — both sections render together.',
      },
    },
  },
};
