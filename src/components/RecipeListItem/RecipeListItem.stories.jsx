import React from 'react';
import { RecipeListItem } from './RecipeListItem';

export default {
  title: 'Components/RecipeListItem',
  component: RecipeListItem,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `A tappable row displaying a recipe thumbnail and title. Built on Base UI Button for full keyboard and screen-reader support. Optional dividers above and below integrate with the list layout.

## When to use
- Inside \`RecipeList\` — that container manages divider placement and click handling automatically
- Use this component directly only when you need a one-off recipe row outside the standard list context

## When NOT to use
- Do not use for non-recipe content (e.g. shopping list items) — use \`IngredientListItem\` for those
- Do not use when the row needs interactive sub-actions (e.g. swipe to delete) — add that behaviour at the list level

## Pairs well with
- \`RecipeList\` — the standard container that maps an array of recipes to RecipeListItems with correct divider placement
- \`Divider\` — managed via \`showUpperDivider\` and \`showBelowDivider\` props; do not add extra Dividers around this component`,
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'The recipe name displayed as an h4 heading. Keep concise — long titles wrap to a second line.',
    },
    thumbnail: {
      control: 'text',
      description: 'URL of the square crop thumbnail image. When omitted or falsy, a placeholder fork-and-knife icon is shown instead.',
    },
    showUpperDivider: {
      control: 'boolean',
      description: 'Render a Divider above this row. Set to true only for the first item in a group to avoid double lines between rows.',
    },
    showBelowDivider: {
      control: 'boolean',
      description: 'Render a Divider below this row. Set to true on the last item in a group to close the list visually.',
    },
  },
};

export const Default = {
  args: {
    title: 'Salmon with tomato and asparagus',
    thumbnail: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=200&h=200&fit=crop',
    showUpperDivider: true,
    showBelowDivider: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'A single recipe row with a real thumbnail and both dividers — the typical appearance when the item is the only row in a section.',
      },
    },
  },
};

export const NoThumbnail = {
  args: {
    title: 'Recipe without a photo',
    thumbnail: undefined,
    showUpperDivider: true,
    showBelowDivider: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'When no thumbnail URL is provided, a placeholder icon is shown in the image slot. This is the fallback for recipes imported without images.',
      },
    },
  },
};

export const WithoutDividers = {
  args: {
    title: 'Salmon with tomato and asparagus',
    thumbnail: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=200&h=200&fit=crop',
    showUpperDivider: false,
    showBelowDivider: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'No dividers — use when the surrounding layout already provides visual separation, or when this is a middle item being managed by RecipeList.',
      },
    },
  },
};

export const List = () => (
  <div style={{ width: '358px', background: 'var(--color-background-raised)' }}>
    <RecipeListItem 
      title="Spaghetti Carbonara"
      thumbnail="https://images.unsplash.com/photo-1612874742237-6526221588e3?w=200&h=200&fit=crop"
      showUpperDivider={true}
      showBelowDivider={false}
    />
    <RecipeListItem 
      title="Salmon with tomato and asparagus"
      thumbnail="https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=200&h=200&fit=crop"
      showUpperDivider={false}
      showBelowDivider={false}
    />
    <RecipeListItem 
      title="Chicken Tikka Masala"
      thumbnail="https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200&h=200&fit=crop"
      showUpperDivider={false}
      showBelowDivider={true}
    />
  </div>
);

List.parameters = {
  docs: {
    description: {
      story: 'Three items composed into a list with correct divider placement: upper divider on the first item only, lower divider on the last item only. This pattern is handled automatically by RecipeList.',
    },
  },
};
