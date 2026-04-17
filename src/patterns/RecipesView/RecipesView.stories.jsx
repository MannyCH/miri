import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { RecipesView } from './RecipesView';

export default {
  title: 'Patterns/RecipesView',
  component: RecipesView,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/recipes']}>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Full-screen recipe browsing view for the \`/recipes\` route. Displays the user's recipe collection with category filter chips and an overlay search bar triggered by a floating action button.

## When to use
Use for the \`/recipes\` route. Rendered when the user taps the Recipes tab in the NavigationBar. Tapping a recipe card navigates to RecipeDetailView (\`/recipes/:id\`).

## When NOT to use
Do not use for showing a single recipe — use RecipeDetailView for that. Do not use for importing or editing a recipe — use RecipeImportView.

## Composed of
- **RecipeList** — scrollable list of recipe cards
- **SearchBar** — appears as an overlay slide-in when the FAB is tapped; includes filter chips when \`availableFilters\` is provided
- **NavigationBarConnected** — bottom tab bar with "recipes" tab active
- **Import button** (optional) — Plus icon in the header that triggers a file import flow; only rendered when \`onImportRequest\` is provided

## Key props
- \`recipes\` — array of recipe objects to display (each with \`title\` and optional \`thumbnail\`)
- \`searchQuery\` / \`onSearchChange\` — controlled search input state
- \`onRecipeClick\` — callback when a recipe card is tapped; typically navigates to \`/recipes/:id\`
- \`onImportRequest\` — when provided, shows a Plus icon button in the header to trigger the import flow
- \`availableFilters\` / \`activeFilters\` / \`onFilterToggle\` — category filter chip system shown in the search overlay and as active-filter pills below the header

## Elevation token usage
- Floating search FAB uses \`--elevation-overlay\`.
        `,
      },
    },
  },
};

const sampleRecipes = [
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
];

export const Default = {
  parameters: {
    docs: {
      description: {
        story: 'Standard recipe list with four sample recipes. No import button. Represents a returning user browsing their saved recipes.',
      },
    },
  },
  args: {
    recipes: sampleRecipes,
    searchQuery: '',
  },
};

/**
 * With import button — shows the Plus icon in the header that triggers TXT file import
 */
export const WithImportButton = {
  parameters: {
    docs: {
      description: {
        story: 'Import button visible in the header — shown when \`onImportRequest\` is provided. Tapping the Plus icon opens the RecipeImportView flow.',
      },
    },
  },
  args: {
    recipes: sampleRecipes,
    searchQuery: '',
    onImportRequest: () => console.log('Import requested'),
  },
};

export const Interactive = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const filteredRecipes = sampleRecipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <RecipesView
      recipes={filteredRecipes}
      searchQuery={searchQuery}
      onSearch={setSearchQuery}
      onRecipeClick={(recipe) => console.log('Recipe clicked:', recipe)}
    />
  );
};
