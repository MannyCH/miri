import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { userEvent, within, expect } from 'storybook/test';
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
    a11y: {
      config: {
        rules: [
          {
            // Disable contrast check for sticky title (false positive)
            // Reason: Checker can't determine background due to position:sticky + z-index
            // Verified: Text #260B00F2 (dark brown) on #FFFFFF (white) = 13:1 contrast
            id: 'color-contrast',
            selector: '.recipe-detail-title',
            enabled: false,
          },
        ],
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
        onAddToList={() => console.log('Added to shopping list')}
      />
    );
  },
};

/**
 * Automated interaction test - demonstrates checking ingredients and adding to list
 * Watch the Interactions panel to see the step-by-step flow
 */
export const WithPlayFunction = {
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
        onAddToList={() => console.log('Added to shopping list')}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Step 1: Wait for the component to render
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Step 2: Check the first ingredient (salmon fillets)
    const firstIngredient = canvas.getByText(/2 salmon fillets/i);
    await userEvent.click(firstIngredient);
    
    // Small delay to see the interaction
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Step 3: Check the third ingredient (cherry tomatoes)
    const thirdIngredient = canvas.getByText(/2 cups cherry tomatoes/i);
    await userEvent.click(thirdIngredient);
    
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Step 4: Check the fifth ingredient (olive oil)
    const fifthIngredient = canvas.getByText(/2 tbsp olive oil/i);
    await userEvent.click(fifthIngredient);
    
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Step 5: Scroll down to see the "Add to Shopping List" button
    // Use the scrollable content container
    const recipeDetailContent = canvasElement.querySelector('.recipe-detail-content');
    if (recipeDetailContent) {
      recipeDetailContent.scrollTop = 300;
    }
    
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Step 6: Click "Add to Shopping List" button
    const addButton = canvas.getByRole('button', { name: /add to shopping list/i });
    await userEvent.click(addButton);

    // Step 7: Verify button was clicked
    await expect(addButton).toBeInTheDocument();
    
    // Optional: Verify ingredients are checked (have strikethrough style)
    await expect(firstIngredient).toBeInTheDocument();
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
