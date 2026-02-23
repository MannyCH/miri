import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { RecipeDetailView } from './RecipeDetailView';

export default {
  title: 'Patterns/RecipeDetailView',
  component: RecipeDetailView,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/recipes/1']}>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Recipe detail view matching Figma "Recipes - Detailed" pattern. Non-interactive ingredient list, Badge-numbered directions, and full-width "Add to list" button at bottom.',
      },
    },
  },
  tags: ['autodocs'],
};

const sampleRecipe = {
  title: 'Salmon with tomato and asparagus',
  image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
  ingredients: [
    '2 salmon fillets (about 6 oz each)',
    '1 bunch asparagus',
    '2 cups cherry tomatoes',
    '3 cloves garlic, minced',
    '2 tbsp olive oil',
    'Salt and pepper to taste',
    '1 lemon, zested and juiced',
  ],
  directions: [
    'Preheat the oven to 200 °C / 400 °F. Line a large baking sheet with parchment (or lightly oil it) so the salmon doesn\'t stick. While the oven heats, take the salmon out of the fridge so it can lose some chill — this helps it cook more evenly.',
    'Pat the salmon fillets dry with paper towels and place them skin-side down on the sheet. Snap or cut the woody ends off the asparagus, then spread the spears around the fish in a single layer so they roast instead of steaming.',
    'Drizzle everything generously with olive oil. Season with salt and freshly ground pepper, then add garlic (powder or minced), lemon zest, and a good squeeze of lemon juice. If you like herbs, tuck a few sprigs of dill or thyme around the fillets.',
    'Roast for 12–15 minutes, depending on thickness, until the salmon just flakes with a fork and the asparagus is tender with lightly browned tips. For extra color, broil 1–2 minutes at the end. Rest the salmon briefly, then serve with more lemon and a drizzle of olive oil or a small knob of butter.',
  ],
};

/**
 * Default view with image, ingredients, directions, and add-to-list button
 */
export const Default = {
  args: {
    recipe: sampleRecipe,
    onAddToList: () => console.log('Added to list'),
  },
};

/**
 * Without image — fallback when no recipe image is available
 */
export const WithoutImage = {
  args: {
    recipe: {
      ...sampleRecipe,
      image: null,
    },
    onAddToList: () => console.log('Added to list'),
  },
};

/**
 * Short recipe with fewer ingredients and steps
 */
export const ShortRecipe = {
  args: {
    recipe: {
      title: 'Quick Avocado Toast',
      image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400&h=300&fit=crop',
      ingredients: [
        '2 slices sourdough bread',
        '1 ripe avocado',
        'Salt and pepper',
        'Red pepper flakes',
      ],
      directions: [
        'Toast the bread until golden and crispy.',
        'Mash the avocado with a fork, season with salt and pepper. Spread on toast and top with red pepper flakes.',
      ],
    },
    onAddToList: () => console.log('Added to list'),
  },
};
