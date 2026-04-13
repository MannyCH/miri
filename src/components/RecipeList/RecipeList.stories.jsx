import React from 'react';
import { RecipeList } from './RecipeList';

export default {
  title: 'Components/RecipeList',
  component: RecipeList,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `Container that renders a vertical list of \`RecipeListItem\` rows from an array of recipe objects. Handles divider placement, empty state, and click routing automatically.

## When to use
- On the /recipes page to display the user's saved recipe collection
- Whenever you need to render a scrollable list of recipes with consistent thumbnail + title rows
- Prefer this over mapping \`RecipeListItem\` yourself — it manages dividers and keys

## When NOT to use
- Do not use for horizontal recipe carousels or grid layouts — those need a different container
- Do not use if the rows need additional interactive elements (e.g. swipe-to-delete) not supported by this component; manage RecipeListItems directly in that case

## Pairs well with
- A search or filter bar above the list
- \`RecipeListItem\` — rendered internally; no need to import separately
- An "Import recipe" button or FAB below or above the list`,
      },
    },
  },
};

export const Empty = {
  args: {
    recipes: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state — shown when the user has no saved recipes yet. The component renders a prompt to import the first recipe.',
      },
    },
  },
};

export const Default = {
  args: {
    recipes: [
      {
        title: 'Salmon with tomato and asparagus',
        thumbnail: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=200&h=200&fit=crop',
      },
      {
        title: 'Salmon with tomato and asparagus',
        thumbnail: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=200&h=200&fit=crop',
      },
      {
        title: 'Grilled chicken with quinoa and broccoli',
        thumbnail: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=200&h=200&fit=crop',
      },
      {
        title: 'Vegetable stir-fry with tofu and rice',
        thumbnail: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=200&h=200&fit=crop',
      },
      {
        title: 'Beef tacos with guacamole and salsa',
        thumbnail: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=200&h=200&fit=crop',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Five recipes with real thumbnails — representative of the populated state on the /recipes page.',
      },
    },
  },
};
