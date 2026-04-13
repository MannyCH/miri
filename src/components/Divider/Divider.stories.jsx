import React from 'react';
import { Divider } from './Divider';

export default {
  title: 'Components/Divider',
  component: Divider,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `A thin horizontal rule rendered as a semantic \`<hr>\` element for separating content sections.

## When to use
- Between items in a vertical list (ingredient list, recipe list, settings rows) where visual separation aids scannability
- To divide distinct sections within a card or sheet (e.g. above and below a grouped block)
- Whenever a full-bleed line separator is called for in the Figma design

## When NOT to use
- Do not use as a spacer — use margin/padding tokens instead
- Do not use between items that already have sufficient visual separation through background color or card borders
- Do not use for vertical (column) separation — CSS gap or borders are more appropriate

## Pairs well with
- \`IngredientListItem\` — each item manages its own upper/lower divider via \`showUpperDivider\` / \`showBelowDivider\` props
- \`RecipeListItem\` — same divider-managed pattern
- Any card-like surface (\`Background/Raised\`) that groups multiple rows`,
      },
    },
  },
};

export const Default = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'The divider at its default width. Place inside a padded container to see how it spans the full available width.',
      },
    },
  },
};

export const InList = () => (
  <div style={{
    background: 'var(--color-background-raised)',
    borderRadius: 'var(--corner-radius-12)',
    padding: 'var(--spacing-16)',
    maxWidth: '300px'
  }}>
    <div className="text-body-small-bold" style={{ 
      padding: 'var(--spacing-8) 0',
      color: 'var(--color-text-strong)'
    }}>
      Item 1
    </div>
    <Divider />
    <div className="text-body-small-bold" style={{ 
      padding: 'var(--spacing-8) 0',
      color: 'var(--color-text-strong)'
    }}>
      Item 2
    </div>
    <Divider />
    <div className="text-body-small-bold" style={{ 
      padding: 'var(--spacing-8) 0',
      color: 'var(--color-text-strong)'
    }}>
      Item 3
    </div>
  </div>
);

InList.parameters = {
  docs: {
    description: {
      story: 'Typical usage: dividers placed between list items inside a raised-background card. The first and last items each receive one divider; items between them receive a divider below.',
    },
  },
};
