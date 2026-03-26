import React from 'react';
import { ShareSheet } from './ShareSheet';

export default {
  title: 'Components/ShareSheet',
  component: ShareSheet,
  parameters: {
    docs: {
      description: {
        component: `
Bottom sheet for sharing a shopping list. Shows copy-link and native-share actions,
plus a members list with remove capability.

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
};

export const Closed = {
  name: 'Closed',
  args: {
    isOpen: false,
    listName: 'Test',
    members: sampleMembers,
  },
};
