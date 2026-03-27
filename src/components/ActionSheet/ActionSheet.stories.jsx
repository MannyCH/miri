import React from 'react';
import { ActionSheet } from './ActionSheet';

export default {
  title: 'Components/ActionSheet',
  component: ActionSheet,
  parameters: {
    docs: {
      description: {
        component: `
Bottom sheet with a list of tappable action items. Slides up from the bottom with spring animation.
Used for share actions, list management, and any context where a full-screen bottom sheet is more appropriate than a dropdown.

## Features
- Slides up with spring animation (same physics as ImportMethodSheet)
- Closes on backdrop tap or Escape
- Supports icons, destructive items, and separators
- Safe area inset for bottom notch devices

## Difference from ContextMenu
- **ContextMenu**: Small dropdown anchored to a trigger button (kebab menu)
- **ActionSheet**: Full-width bottom sheet for larger action sets or when touch targets need to be bigger

## Token mapping
| Element | Token |
|---------|-------|
| Backdrop | \`--color-fill-overlay\` |
| Sheet background | \`--color-background-raised\` |
| Sheet radius | \`--corner-radius-24\` |
| Handle | \`--color-stroke-weak\` |
| Item hover | \`--color-fill-hover\` |
| Icon background | \`--color-fill-brand-weak\` |
| Icon color | \`--color-icon-brand\` |
| Destructive text | \`--color-text-error\` |
        `,
      },
    },
  },
};

export const Default = {
  args: {
    isOpen: true,
    title: 'List actions',
    items: [
      { label: 'Rename list', onAction: () => console.log('rename') },
      { label: 'Share list', onAction: () => console.log('share') },
      { label: 'Create new list', onAction: () => console.log('create') },
    ],
  },
};

export const WithDestructive = {
  name: 'With Destructive & Separator',
  args: {
    isOpen: true,
    title: 'List actions',
    items: [
      { label: 'Rename list', onAction: () => console.log('rename') },
      { label: 'Share list', onAction: () => console.log('share') },
      { label: 'Create new list', onAction: () => console.log('create') },
      '---',
      { label: 'Leave list', destructive: true, onAction: () => console.log('leave') },
    ],
  },
};

const LinkIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

const ShareIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

export const WithIcons = {
  name: 'With Icons',
  args: {
    isOpen: true,
    title: 'Share "Einkaufsliste"',
    items: [
      {
        label: 'Copy link',
        icon: <LinkIcon />,
        onAction: () => console.log('copy'),
      },
      {
        label: 'Share...',
        icon: <ShareIcon />,
        onAction: () => console.log('share'),
      },
    ],
  },
};

export const Closed = {
  args: {
    isOpen: false,
    title: 'Hidden',
    items: [{ label: 'Item', onAction: () => {} }],
  },
};
