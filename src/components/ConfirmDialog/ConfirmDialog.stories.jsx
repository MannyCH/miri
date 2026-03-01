import React from 'react';
import { ConfirmDialog } from './ConfirmDialog';

export default {
  title: 'Components/ConfirmDialog',
  component: ConfirmDialog,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Modal confirmation dialog used in Meal Planning when adding meals to a non-empty shopping list.

## Structure
- Overlay backdrop + centered dialog surface
- Header with title and close affordance
- Message body
- Action group with optional secondary and tertiary actions

## Token mapping
| Layer | Token(s) |
|---|---|
| Dialog surface | \`Background/Raised\`, \`Corner radius/16\` |
| Title text | \`Text/Strong\` |
| Message text | \`Text/Weak\` |
| Close icon | \`Icon/Neutral\` |
| Close hover | \`Fill/Hover\` |
| Outer spacing | \`Spacing/16\` |
| Inner spacing | \`Spacing/16\`, \`Spacing/12\`, \`Spacing/4\` |
| Actions | Reuses \`Button\` variants (\`secondary\`, \`tertiary-delete\`) |

Notes:
- Overlay and shadow opacity/blur currently follow implementation values from code.
- Design source in Figma: page \`Dialog\`, component \`Dialog\`.
- This story documents current behavior and token intent without introducing new design-system tokens.
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: 'boolean' },
    title: { control: 'text' },
    message: { control: 'text' },
    confirmLabel: { control: 'text' },
    secondaryLabel: { control: 'text' },
    tertiaryLabel: { control: 'text' },
    onConfirm: { action: 'confirm' },
    onSecondary: { action: 'secondary' },
    onTertiary: { action: 'tertiary' },
    onCancel: { action: 'cancel' },
  },
};

export const ThreeActions = {
  args: {
    isOpen: true,
    title: 'Update shopping list?',
    message: 'You have ingredients from 3 recipes in your shopping list.',
    confirmLabel: 'Replace',
    secondaryLabel: 'Add',
    tertiaryLabel: 'Cancel',
  },
};

export const TwoActions = {
  args: {
    isOpen: true,
    title: 'Delete meal plan?',
    message: 'This will remove your planned meals for the whole week.',
    confirmLabel: 'Delete',
    secondaryLabel: 'Keep',
    tertiaryLabel: undefined,
  },
};

export const OnePrimaryAction = {
  args: {
    isOpen: true,
    title: 'Done',
    message: 'Your shopping list has been updated successfully.',
    confirmLabel: 'Okay',
    secondaryLabel: undefined,
    tertiaryLabel: undefined,
  },
};
