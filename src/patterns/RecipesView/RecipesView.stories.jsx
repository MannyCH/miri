import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { RecipesView } from './RecipesView';

export default {
  title: 'Patterns/RecipesView',
  component: RecipesView,
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
        component: 'Recipe browsing screen with search functionality. Composition of SearchBar, RecipeList, and NavigationBar components.',
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
  args: {
    recipes: sampleRecipes,
    searchQuery: '',
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
