import React from 'react';
import { ListSwitcher } from './ListSwitcher';

export default {
  title: 'Components/ListSwitcher',
  component: ListSwitcher,
  parameters: {
    docs: {
      description: {
        component: `
Tappable list name pill that opens a dropdown for switching between shopping lists.
Only shows chevron and dropdown when user has 2+ lists.

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
};

export const MultipleLists = {
  name: 'Multiple Lists',
  args: {
    lists: multipleLists,
    activeListId: 'list-1',
    onSwitch: (id) => console.log('switch to', id),
    onCreateNew: () => console.log('create new'),
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
};
