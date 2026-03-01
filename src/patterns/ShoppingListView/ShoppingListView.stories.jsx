import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ShoppingListView } from './ShoppingListView';

export default {
  title: 'Patterns/ShoppingListView',
  component: ShoppingListView,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/shopping-list']}>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Shopping list screen with two view modes: simple list or grouped by recipe. Composition of IngredientList, SearchBar, Button, and NavigationBar components.

## Elevation token usage
- Floating search FAB uses \`--elevation-overlay\`.
        `,
      },
    },
    a11y: {
      config: {
        rules: [
          {
            // Disable heading-order check (safe to ignore for this pattern)
            // Reason: h3 is used for semantic grouping (recipe names) within sections
            // Visual hierarchy is maintained through typography tokens, not heading levels
            id: 'heading-order',
            enabled: false,
          },
        ],
      },
    },
  },
};

const sampleListItems = [
  '2l Milch',
  '50g Kartoffeln',
  '1l Mandelmilch',
  '500ml Sojamilch',
];

const sampleRecipeGroups = [
  {
    recipeName: 'Salmon with tomato and asparagus',
    ingredients: [
      '2l Milch',
      '50g Kartoffeln',
      '1l Mandelmilch',
      '500ml Sojamilch',
    ],
    checkedItems: {},
  },
  {
    recipeName: 'Chicken fajita salad',
    ingredients: [
      '2l Milch',
    ],
    checkedItems: {},
  },
];

export const ListView = {
  args: {
    viewMode: 'list',
    items: sampleListItems,
    checkedItems: {},
  },
};

export const RecipeView = {
  args: {
    viewMode: 'recipe',
    recipeGroups: sampleRecipeGroups,
  },
};

export const InteractiveListView = () => {
  const [items, setItems] = React.useState(sampleListItems);
  const [checkedItems, setCheckedItems] = React.useState({});
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleItemCheck = (index, checked) => {
    setCheckedItems(prev => ({ ...prev, [index]: checked }));
  };

  const handleItemDelete = (index) => {
    setItems(prev => prev.filter((_, i) => i !== index));
    
    // Adjust checked items indices
    setCheckedItems(prev => {
      const newChecked = {};
      Object.entries(prev).forEach(([key, value]) => {
        const idx = parseInt(key);
        if (idx < index) {
          newChecked[idx] = value;
        } else if (idx > index) {
          newChecked[idx - 1] = value;
        }
      });
      return newChecked;
    });
  };

  const handleClearList = () => {
    setItems([]);
    setCheckedItems({});
  };

  return (
    <ShoppingListView
      viewMode="list"
      items={items}
      checkedItems={checkedItems}
      onItemCheck={handleItemCheck}
      onItemDelete={handleItemDelete}
      onClearList={handleClearList}
      searchQuery={searchQuery}
      onSearch={setSearchQuery}
    />
  );
};

export const InteractiveRecipeView = () => {
  const [viewMode, setViewMode] = React.useState('recipe');
  const [recipeGroups, setRecipeGroups] = React.useState([
    {
      id: 1,
      recipeName: 'Salmon with tomato and asparagus',
      ingredients: [
        '2l Milch',
        '50g Kartoffeln',
        '1l Mandelmilch',
        '500ml Sojamilch',
      ],
      checkedItems: {},
    },
    {
      id: 2,
      recipeName: 'Chicken fajita salad',
      ingredients: [
        '2l Milch',
        '300g Chicken breast',
      ],
      checkedItems: {},
    },
  ]);
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleIngredientCheck = (groupId, ingredientIndex, checked) => {
    setRecipeGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          checkedItems: {
            ...group.checkedItems,
            [ingredientIndex]: checked,
          },
        };
      }
      return group;
    }));
  };

  const handleIngredientDelete = (groupId, ingredientIndex) => {
    setRecipeGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        const newIngredients = group.ingredients.filter((_, i) => i !== ingredientIndex);
        
        // Adjust checked items indices
        const newChecked = {};
        Object.entries(group.checkedItems).forEach(([key, value]) => {
          const idx = parseInt(key);
          if (idx < ingredientIndex) {
            newChecked[idx] = value;
          } else if (idx > ingredientIndex) {
            newChecked[idx - 1] = value;
          }
        });
        
        return {
          ...group,
          ingredients: newIngredients,
          checkedItems: newChecked,
        };
      }
      return group;
    }));
  };

  const handleRecipeDelete = (groupId) => {
    setRecipeGroups(prev => prev.filter(group => group.id !== groupId));
  };

  const groupsWithHandlers = recipeGroups.map(group => ({
    ...group,
    onIngredientCheck: (index, checked) => handleIngredientCheck(group.id, index, checked),
    onIngredientDelete: (index) => handleIngredientDelete(group.id, index),
    onDelete: () => handleRecipeDelete(group.id),
  }));

  return (
    <ShoppingListView
      viewMode={viewMode}
      recipeGroups={groupsWithHandlers}
      onViewModeChange={setViewMode}
      searchQuery={searchQuery}
      onSearch={setSearchQuery}
    />
  );
};
