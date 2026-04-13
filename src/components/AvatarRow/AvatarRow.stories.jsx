import React from 'react';
import { AvatarRow } from './AvatarRow';

export default {
  title: 'Components/AvatarRow',
  component: AvatarRow,
  parameters: {
    docs: {
      description: {
        component: `
Horizontal row of member avatars for shared shopping lists. Shows initials when no avatar URL is provided. Overflow beyond \`maxVisible\` collapses into a "+N" indicator.

## When to use
- In the shopping list header to show who has access to a shared list
- Anywhere a compact representation of a group of 2+ people is needed
- When a "+" invite button should appear inline with the member avatars

## When NOT to use
- When there is only one member — the component renders nothing for single-member lists by design
- As a standalone user avatar (single person) — use a plain avatar element instead
- When the full member list needs to be visible — use \`ShareSheet\` which shows all members with names

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
  parameters: {
    docs: {
      description: {
        story: 'Minimum visible state — two avatars shown side by side. The component becomes visible at exactly 2 members.',
      },
    },
  },
};

export const ThreeMembers = {
  name: '3 Members',
  args: {
    members: mockMembers.slice(0, 3),
    onInvite: () => console.log('invite'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Three members fills the default maxVisible limit — all avatars shown, no overflow indicator.',
      },
    },
  },
};

export const Overflow = {
  name: '5 Members (overflow)',
  args: {
    members: mockMembers,
    maxVisible: 3,
    onInvite: () => console.log('invite'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Five members with maxVisible=3 — the first 3 avatars are shown and "+2" indicates the remaining members.',
      },
    },
  },
};

export const NoInvite = {
  name: 'Without Invite Button',
  args: {
    members: mockMembers.slice(0, 3),
  },
  parameters: {
    docs: {
      description: {
        story: 'No onInvite handler — the "+" invite button is omitted. Use when the current user does not have permission to invite others.',
      },
    },
  },
};

export const SingleMember = {
  name: '1 Member (hidden)',
  args: {
    members: mockMembers.slice(0, 1),
    onInvite: () => console.log('invite'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Single member — the component renders nothing. This is intentional: a solo list has no need for a member row.',
      },
    },
  },
};
