import React from 'react';
import { ImportMethodSheet } from './ImportMethodSheet';

export default {
  title: 'Components/ImportMethodSheet',
  component: ImportMethodSheet,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Bottom sheet for selecting a recipe import method. Slides up from the bottom
over a dimmed backdrop. Dismissable via backdrop tap or Escape key.

## Options
- **Paste URL** — user pastes a recipe page URL; Miri fetches and parses it
- **Take a Photo** — user picks/captures an image; Claude Vision extracts the recipe
- **Import File** — existing TXT file import flow

## Token mapping
| Layer | Token(s) |
|---|---|
| Sheet surface | \`Background/Raised\`, \`Corner radius/24\` (top corners) |
| Backdrop | \`Fill/Overlay\` |
| Handle | \`Stroke/Weak\`, \`Corner radius/4\` |
| Option icon bg | \`Fill/Brand/Weak\`, \`Corner radius/12\` |
| Option icon | \`Icon/Brand\` |
| Option hover | \`Fill/Hover\` |
| Chevron | \`Icon/Neutral\` |
| Elevation | \`--elevation-overlay\` |
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: { control: 'boolean' },
    onClose: { action: 'close' },
    onSelectUrl: { action: 'selectUrl' },
    onSelectPhoto: { action: 'selectPhoto' },
    onSelectFile: { action: 'selectFile' },
  },
};

export const Default = {
  args: {
    isOpen: true,
  },
};

export const Closed = {
  args: {
    isOpen: false,
  },
};
