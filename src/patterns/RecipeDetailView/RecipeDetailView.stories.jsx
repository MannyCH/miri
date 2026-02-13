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
        component: 'Complete recipe view with scrollable ingredients and cooking directions.',
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
 * Default RecipeDetailView with ingredients and directions
 */
export const Default = {
  args: {
    recipe: sampleRecipe,
    checkedIngredients: {},
  },
};

/**
 * Interactive demo with ingredient checking and deletion
 */
export const Interactive = {
  render: () => {
    const [checkedIngredients, setCheckedIngredients] = React.useState({});
    const [ingredients, setIngredients] = React.useState(sampleRecipe.ingredients);

    const handleIngredientCheck = (index, checked) => {
      setCheckedIngredients((prev) => ({
        ...prev,
        [index]: checked,
      }));
    };

    const handleIngredientDelete = (index) => {
      setIngredients((prev) => prev.filter((_, i) => i !== index));
      setCheckedIngredients((prev) => {
        const newChecked = { ...prev };
        delete newChecked[index];
        return newChecked;
      });
    };

    return (
      <RecipeDetailView
        recipe={{
          ...sampleRecipe,
          ingredients,
        }}
        checkedIngredients={checkedIngredients}
        onIngredientCheck={handleIngredientCheck}
        onIngredientDelete={handleIngredientDelete}
      />
    );
  },
};

/**
 * With some ingredients checked
 */
export const WithCheckedIngredients = {
  args: {
    recipe: sampleRecipe,
    checkedIngredients: {
      0: true,
      2: true,
      4: true,
    },
  },
};
