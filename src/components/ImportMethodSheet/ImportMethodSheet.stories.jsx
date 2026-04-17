import React from 'react';
import { ImportMethodSheet } from './ImportMethodSheet';

export default {
  title: 'Components/ImportMethodSheet',
  component: ImportMethodSheet,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `A bottom sheet modal for choosing how to import a recipe into Miri. Slides up from the bottom with a spring animation over a dimmed backdrop. Dismissable by tapping the backdrop or pressing Escape.

## Import options
- **Paste URL** — user pastes a recipe page URL; Miri fetches and parses it
- **Take a Photo** — user picks/captures an image; Claude Vision extracts the recipe
- **Import File** — existing TXT file import flow

## When to use
- As the entry point for the recipe import flow — shown when the user taps an "Add recipe" or "Import" action
- Use this exact component rather than a custom modal; it already handles animation, backdrop, keyboard dismissal, and focus management

## When NOT to use
- Do not use for unrelated action sheets — this component is tightly scoped to recipe import
- Do not use inline (embedded in a page) — it is always a modal overlay triggered by user intent

## Pairs well with
- A trigger Button labeled "Import recipe" or a floating action button
- The URL import dialog, camera picker, or file picker that opens after a selection

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
  parameters: {
    docs: {
      description: {
        story: 'The sheet in its open state — how it appears after the user triggers the import flow. All three import methods are visible.',
      },
    },
  },
};

export const Closed = {
  args: {
    isOpen: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'The sheet in its closed state — nothing is rendered. Use this story to verify that the component renders nothing (not even a hidden backdrop) when isOpen is false.',
      },
    },
  },
};
