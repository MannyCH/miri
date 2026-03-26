import React from 'react';
import { AvatarRow } from './AvatarRow';

export default {
  title: 'Components/AvatarRow',
  component: AvatarRow,
  parameters: {
    docs: {
      description: {
        component: `
Horizontal row of member avatars for shared shopping lists.
Shows initials when no avatar URL is provided. Overflow shows "+N".

## Display rules (from shopping-list-flow.json)
- Only shown when list has 2+ members
- Max 3 visible avatars, then "+N"
- "+" button triggers share sheet

## Token mapping
| Element | Token |
|---------|-------|
| Avatar background | \`--color-fill-brand-weak\` |
| Avatar text | \`--color-text-brand\` |
| Avatar border | \`--color-background-base\` |
| Overflow background | \`--color-fill-neutral-weak\` |
| Invite border | \`--color-stroke-brand\` (dashed) |
| Invite icon | \`--color-icon-brand\` |
        `,
      },
    },
  },
};

const mockMembers = [
  { id: '1', name: 'Manuel R' },
  { id: '2', name: 'Sarah K' },
  { id: '3', name: 'Tom B' },
  { id: '4', name: 'Lisa M' },
  { id: '5', name: 'Jan W' },
];

export const TwoMembers = {
  name: '2 Members',
  args: {
    members: mockMembers.slice(0, 2),
    onInvite: () => console.log('invite'),
  },
};

export const ThreeMembers = {
  name: '3 Members',
  args: {
    members: mockMembers.slice(0, 3),
    onInvite: () => console.log('invite'),
  },
};

export const Overflow = {
  name: '5 Members (overflow)',
  args: {
    members: mockMembers,
    maxVisible: 3,
    onInvite: () => console.log('invite'),
  },
};

export const NoInvite = {
  name: 'Without Invite Button',
  args: {
    members: mockMembers.slice(0, 3),
  },
};

export const SingleMember = {
  name: '1 Member (hidden)',
  args: {
    members: mockMembers.slice(0, 1),
    onInvite: () => console.log('invite'),
  },
};
