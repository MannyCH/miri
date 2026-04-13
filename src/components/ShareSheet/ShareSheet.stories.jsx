import React from 'react';
import { ShareSheet } from './ShareSheet';

export default {
  title: 'Components/ShareSheet',
  component: ShareSheet,
  parameters: {
    docs: {
      description: {
        component: `
Dedicated bottom sheet for sharing a shopping list and managing its members. Combines share-link actions with an inline members list.

## When to use
- When the user taps the share or "+" invite button on a shopping list
- When the current user needs to view who has access to a list and optionally remove members
- This is the only surface for list sharing — do not build ad-hoc share flows elsewhere

## When NOT to use
- For generic sharing that is not about shopping list membership — use \`ActionSheet\` with share items instead
- When you only need share actions without member management — use a simpler \`ActionSheet\`
- For features unrelated to list membership (e.g. exporting, printing)

## Pairs well with
- \`AvatarRow\` in the shopping list header — tapping it opens this ShareSheet
- \`ListSwitcher\` — the active list being shared comes from the list switcher context

## Behavior (from shopping-list-flow.json)
- Opens from share button or avatar row tap
- "Copy link" copies invite URL to clipboard
- "Share..." triggers native OS share sheet (if available)
- Members list shows initials, name, "(you)" for self
- Non-self members have a remove (✕) button

## Token mapping
| Element | Token |
|---------|-------|
| Backdrop | \`--color-fill-overlay\` |
| Sheet bg | \`--color-background-raised\` |
| Handle | \`--color-stroke-weak\` |
| Title | \`--color-text-strong\` |
| Description | \`--color-text-weak\` |
| Avatar bg | \`--color-fill-brand-weak\` |
| Avatar text | \`--color-text-brand\` |
| Remove hover | \`--color-text-error\` |
        `,
      },
    },
  },
};

const sampleMembers = [
  { id: 'user-1', name: 'Manuel R.', isSelf: true },
  { id: 'user-2', name: 'Anna K.' },
  { id: 'user-3', name: 'Thomas B.' },
];

export const Default = {
  name: 'Default (open)',
  args: {
    isOpen: true,
    listName: 'Einkaufsliste',
    members: sampleMembers,
    onClose: () => console.log('close'),
    onCopyLink: () => console.log('copy link'),
    onNativeShare: () => console.log('native share'),
    onRemoveMember: (id) => console.log('remove', id),
  },
  parameters: {
    docs: {
      description: {
        story: 'Full sheet with 3 members — one self (no remove button) and two others (with remove buttons). The "Share..." button appears on devices that support the Web Share API.',
      },
    },
  },
};

export const NoMembers = {
  name: 'No Members',
  args: {
    isOpen: true,
    listName: 'Ski Trip',
    members: [],
    onClose: () => console.log('close'),
    onCopyLink: () => console.log('copy link'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Newly created list with no members yet — only the share actions are shown, the members section is hidden.',
      },
    },
  },
};

export const SingleMember = {
  name: 'Single Member (self only)',
  args: {
    isOpen: true,
    listName: 'Christmas Dinner',
    members: [{ id: 'user-1', name: 'Manuel R.', isSelf: true }],
    onClose: () => console.log('close'),
    onCopyLink: () => console.log('copy link'),
    onRemoveMember: (id) => console.log('remove', id),
  },
  parameters: {
    docs: {
      description: {
        story: 'Only the current user is a member — no remove buttons are shown (you cannot remove yourself). Share link is still available to invite others.',
      },
    },
  },
};

export const Closed = {
  name: 'Closed',
  args: {
    isOpen: false,
    listName: 'Test',
    members: sampleMembers,
  },
  parameters: {
    docs: {
      description: {
        story: 'isOpen=false — the sheet is fully hidden. Verifies AnimatePresence removes it from the DOM when not open.',
      },
    },
  },
};
