import React from 'react';
import { ListSwitcher } from './ListSwitcher';

export default {
  title: 'Components/ListSwitcher',
  component: ListSwitcher,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Tappable list name pill in the shopping list header. Shows the active list name, and when the user has 2+ lists, opens a dropdown to switch between them or create a new one.

## When to use
- In the shopping list screen header to display and switch the active list
- Only in contexts where the user manages multiple shopping lists

## When NOT to use
- As a generic tab switcher or segmented control — reach for a tab component
- When there is only one list and switching is never needed — the component already handles this by disabling the pill, but do not add it where multi-list is architecturally not supported
- For switching between non-list contexts (views, screens) — use navigation components

## Pairs well with
- \`AvatarRow\` displayed alongside the pill to show shared list members
- \`ActionSheet\` or \`ContextMenu\` for additional list management actions (rename, delete)
- \`ShareSheet\` for inviting members to the active list

## Behavior (from shopping-list-flow.json)
- **1 list**: Plain text title, no chevron, no dropdown
- **2+ lists**: Tappable pill with chevron, dropdown shows all lists + "New list"
- Active list has a checkmark
- Shared lists show member count icon
- Remembers last-used list

## Token mapping
| Element | Token |
|---------|-------|
| Pill text | \`--color-text-strong\` |
| Chevron | \`--color-icon-neutral\` |
| Dropdown bg | \`--color-background-raised\` |
| Dropdown shadow | \`--elevation-overlay\` |
| Active item | \`--color-text-brand\` |
| Create action | \`--color-text-brand\` |
        `,
      },
    },
  },
};

const singleList = [
  { id: 'list-1', name: 'Einkaufsliste' },
];

const multipleLists = [
  { id: 'list-1', name: 'Einkaufsliste', isShared: true, memberCount: 2 },
  { id: 'list-2', name: 'Ski Trip' },
  { id: 'list-3', name: 'Christmas Dinner', isShared: true, memberCount: 4 },
];

export const SingleList = {
  name: 'Single List (no dropdown)',
  args: {
    lists: singleList,
    activeListId: 'list-1',
  },
  parameters: {
    docs: {
      description: {
        story: 'Only one list exists — the pill shows the list name as plain text with no chevron and no dropdown. The button is disabled.',
      },
    },
  },
};

export const MultipleLists = {
  name: 'Multiple Lists',
  args: {
    lists: multipleLists,
    activeListId: 'list-1',
    onSwitch: (id) => console.log('switch to', id),
    onCreateNew: () => console.log('create new'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Three lists — the pill is tappable, shows a chevron, and the dropdown lists all options. Shared lists display a member count icon.',
      },
    },
  },
};

export const SecondActive = {
  name: 'Second List Active',
  args: {
    lists: multipleLists,
    activeListId: 'list-2',
    onSwitch: (id) => console.log('switch to', id),
    onCreateNew: () => console.log('create new'),
  },
  parameters: {
    docs: {
      description: {
        story: 'A non-first list is active — the active list name appears in the pill, and a checkmark appears next to it in the dropdown.',
      },
    },
  },
};
