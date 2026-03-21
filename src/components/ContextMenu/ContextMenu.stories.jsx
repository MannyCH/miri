import React from 'react';
import { ContextMenu } from './ContextMenu';

export default {
  title: 'Components/ContextMenu',
  component: ContextMenu,
  parameters: {
    docs: {
      description: {
        component: `
Dropdown menu anchored to a three-dot (kebab) trigger button.
Extracted from MealPlanningView for reuse across the app.

## Features
- Closes on outside click or Escape
- Supports destructive items (red text)
- Supports separators (\`'---'\` in items array)
- Supports icons per item
- Accessible: \`role="menu"\` / \`role="menuitem"\`, \`aria-expanded\`, \`aria-haspopup\`

## Token mapping
| Element | Token |
|---------|-------|
| Trigger background (hover) | \`--color-fill-hover\` |
| Menu background | \`--color-background-raised\` |
| Menu shadow | \`--elevation-overlay\` |
| Menu radius | \`--corner-radius-8\` |
| Item text | \`--color-text-strong\` |
| Destructive item text | \`--color-text-error\` |
| Separator | \`--color-stroke-weak\` |
        `,
      },
    },
  },
};

export const Default = {
  args: {
    items: [
      { label: 'Rename list', onAction: () => console.log('rename') },
      { label: 'Share list', onAction: () => console.log('share') },
      { label: 'Create new list', onAction: () => console.log('create') },
    ],
  },
};

export const WithDestructive = {
  name: 'With Destructive Item',
  args: {
    items: [
      { label: 'Rename list', onAction: () => console.log('rename') },
      { label: 'Share list', onAction: () => console.log('share') },
      { label: 'Create new list', onAction: () => console.log('create') },
      '---',
      { label: 'Leave list', destructive: true, onAction: () => console.log('leave') },
    ],
  },
};

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const ShareIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

export const WithIcons = {
  name: 'With Icons',
  args: {
    items: [
      {
        label: 'Rename list',
        icon: <EditIcon />,
        onAction: () => console.log('rename'),
      },
      {
        label: 'Share list',
        icon: <ShareIcon />,
        onAction: () => console.log('share'),
      },
      '---',
      {
        label: 'Delete list',
        icon: <TrashIcon />,
        destructive: true,
        onAction: () => console.log('delete'),
      },
    ],
  },
};

export const MealPlanMenu = {
  name: 'Meal Plan (Original Use)',
  args: {
    items: [
      { label: 'Replan week', onAction: () => console.log('replan') },
      { label: 'Clear week', destructive: true, onAction: () => console.log('clear') },
    ],
  },
};
