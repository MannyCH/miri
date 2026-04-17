import React from 'react';
import { ConfirmDialog } from './ConfirmDialog';

export default {
  title: 'Components/ConfirmDialog',
  component: ConfirmDialog,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `Modal confirmation dialog that interrupts the current flow to ask the user to choose between two or three explicit actions before proceeding. Animated entrance via spring transition, dismissible via overlay tap or close button.

## When to use
- Before a consequential or irreversible action that cannot be undone by a simple undo (e.g. delete, replace, clear)
- When the user must choose between two meaningful alternatives — not just "OK / Cancel" (for that, a toast with an undo action is often better)
- Shopping list conflicts: "Replace / Add / Cancel" when a non-empty list exists
- Destructive account actions: "Delete / Keep"

## When NOT to use
- Don't use for simple acknowledgements with no decision — a toast or inline message is less disruptive
- Don't use when the action is easily reversible — just do it and offer an undo toast
- Don't use for form-heavy confirmation steps — a dedicated page or bottom sheet is more appropriate
- Don't stack multiple dialogs — resolve one before triggering another

## Pairs well with
- \`Button variant="secondary"\` for the confirm action (and optional secondary action)
- \`Button variant="tertiary-delete"\` for the cancel/dismiss action (rendered internally by this component)
- Triggered from within meal planning flows, shopping list updates, or account deletion

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
| Elevation | \`--elevation-overlay\` |
| Outer spacing | \`Spacing/16\` |
| Inner spacing | \`Spacing/16\`, \`Spacing/12\`, \`Spacing/4\` |
| Actions | Reuses \`Button\` variants (\`secondary\`, \`tertiary-delete\`) |

Notes:
- Overlay fill uses \`Fill/Overlay\`; dialog shadow uses \`--elevation-overlay\`.
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
  parameters: {
    docs: {
      description: {
        story: 'Three-action layout — two primary-weight options (Replace / Add) plus a tertiary-delete Cancel. Use this when the user must choose between two meaningful alternatives, not just confirm or dismiss.',
      },
    },
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
  parameters: {
    docs: {
      description: {
        story: 'Two-action layout without a tertiary dismiss — used when the overlay tap alone is enough to cancel. Both options are secondary-weight, making neither feel dominant.',
      },
    },
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
  parameters: {
    docs: {
      description: {
        story: 'Single-action acknowledgement — no decision required, just dismiss. Consider using a toast for this case instead, as a dialog interrupts flow unnecessarily when there is nothing to decide.',
      },
    },
  },
};
