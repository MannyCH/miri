import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ShoppingListView } from './ShoppingListView';

export default {
  title: 'Patterns/ShoppingListView',
  component: ShoppingListView,
  tags: ['autodocs'],
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
Full-screen shopping list view for the \`/shopping-list\` route. Supports three view modes (list, recipe-grouped, smart AI-organised) and real-time multi-user collaboration via AvatarRow.

## When to use
Use for the \`/shopping-list\` route. Navigated to from MealPlanningView ("Add week to list") or directly via the NavigationBar.

## When NOT to use
Do not embed this inside other views or use it for recipe browsing. Each view mode is controlled by the \`viewMode\` prop — do not try to merge them into one render.

## Composed of
- **IngredientList** — renders the checklist of items (used in both list and recipe-grouped modes)
- **ListSwitcher** — toggle control that switches between list / recipe / smart view modes
- **AvatarRow** — shows collaborators on shared lists (multi-list feature)
- **SearchBar** — search overlay triggered by the floating action button
- **Button** — "Add item" CTA and smart-refresh action
- **Divider** — separates recipe groups and sections
- **NavigationBarConnected** — bottom tab bar with "shopping-list" tab active

## Key props
- \`viewMode\` — \`'list'\` | \`'recipe'\` | \`'smart'\`; controls which layout renders
- \`items\` / \`checkedItems\` / \`onItemCheck\` / \`onItemDelete\` — list mode: flat array of ingredient strings with local check state
- \`recipeGroups\` — recipe mode: array of \`{ recipeName, ingredients, checkedItems, onIngredientCheck, onIngredientDelete, onDelete }\`
- \`smartGroups\` / \`smartStatus\` — smart mode: AI-organised groups by supermarket category; \`smartStatus\` can be \`'idle'\` | \`'loading'\`
- \`members\` / \`listName\` / \`lists\` / \`activeListId\` — multi-list collaboration props
- \`onAddIngredient\` — opens the add-item input

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
  parameters: {
    docs: {
      description: {
        story: 'Simple list mode — flat checklist of ingredient strings. The default view when a user opens the shopping list.',
      },
    },
  },
  args: {
    viewMode: 'list',
    items: sampleListItems,
    checkedItems: {},
  },
};

export const WithSuggestions = {
  parameters: {
    docs: {
      description: {
        story: 'Shows the unified overlay card — suggestion list and search bar connected as one card, matching Figma node 604-2577. The card height is fixed to always accommodate 3 items even when fewer match.',
      },
    },
  },
  args: {
    viewMode: 'list',
    items: sampleListItems,
    checkedItems: {},
    initialSearchQuery: 'Car',
  },
};

export const RecipeView = {
  parameters: {
    docs: {
      description: {
        story: 'Recipe-grouped mode — ingredients are organised under the recipe they belong to. Useful when shopping for multiple planned meals and the user wants to keep track by dish.',
      },
    },
  },
  args: {
    viewMode: 'recipe',
    recipeGroups: sampleRecipeGroups,
  },
};

const sampleSmartGroups = [
  {
    category: 'Vegetables',
    emoji: '🥦',
    items: [
      { name: 'Onions', quantity: '3' },
      { name: 'Asparagus', quantity: '320g' },
      { name: 'Cherry tomatoes', quantity: '2 cups' },
      { name: 'Garlic', quantity: '3 cloves' },
    ],
  },
  {
    category: 'Fruits',
    emoji: '🍎',
    items: [
      { name: 'Lemon', quantity: '2' },
    ],
  },
  {
    category: 'Meat & Fish',
    emoji: '🥩',
    items: [
      { name: 'Salmon fillets', quantity: '2' },
    ],
  },
  {
    category: 'Dairy & Eggs',
    emoji: '🥛',
    items: [
      { name: 'Milk', quantity: '1.5l' },
      { name: 'Butter', quantity: '50g' },
    ],
  },
];

/**
 * Smart AI-organised view — deduplicated and grouped by supermarket category
 */
export const SmartView = {
  parameters: {
    docs: {
      description: {
        story: 'Smart view idle state — AI has already organised ingredients into supermarket sections (Vegetables, Fruits, Meat & Fish, Dairy & Eggs) with emoji category headers. Items are deduplicated and quantities merged across recipes.',
      },
    },
  },
  args: {
    viewMode: 'smart',
    smartGroups: sampleSmartGroups,
    smartStatus: 'idle',
  },
};

/**
 * Smart view loading state — while the API call is in progress
 */
export const SmartViewLoading = {
  parameters: {
    docs: {
      description: {
        story: 'Smart view while the AI organisation request is in flight — shows a loading skeleton or spinner before groups are available. \`smartStatus: \'loading\'\` with an empty groups array.',
      },
    },
  },
  args: {
    viewMode: 'smart',
    smartGroups: [],
    smartStatus: 'loading',
  },
};

export const InteractiveListView = () => {
  const [items, setItems] = React.useState(sampleListItems);
  const [itemKeys, setItemKeys] = React.useState(sampleListItems.map((_, i) => `key-${i}`));
  const [itemIds, setItemIds] = React.useState(sampleListItems.map((_, i) => `id-${i}`));
  const [checkedItems, setCheckedItems] = React.useState({});

  const handleItemCheck = (index, checked) => {
    setCheckedItems(prev => ({ ...prev, [index]: checked }));
  };

  const handleItemDelete = (index) => {
    setItems(prev => prev.filter((_, i) => i !== index));
    setItemKeys(prev => prev.filter((_, i) => i !== index));
    setItemIds(prev => prev.filter((_, i) => i !== index));
    setCheckedItems(prev => {
      const newChecked = {};
      Object.entries(prev).forEach(([key, value]) => {
        const idx = parseInt(key);
        if (idx < index) newChecked[idx] = value;
        else if (idx > index) newChecked[idx - 1] = value;
      });
      return newChecked;
    });
  };

  const handleAddIngredient = (name) => {
    const id = `id-${Date.now()}`;
    setItems(prev => [...prev, name]);
    setItemKeys(prev => [...prev, `key-${id}`]);
    setItemIds(prev => [...prev, id]);
  };

  const handleClearList = () => {
    setItems([]);
    setItemKeys([]);
    setItemIds([]);
    setCheckedItems({});
  };

  return (
    <ShoppingListView
      viewMode="list"
      items={items}
      itemKeys={itemKeys}
      itemIds={itemIds}
      checkedItems={checkedItems}
      onItemCheck={handleItemCheck}
      onItemDelete={handleItemDelete}
      onClearList={handleClearList}
      onAddIngredient={handleAddIngredient}
    />
  );
};

InteractiveListView.parameters = {
  docs: {
    description: {
      story: 'Fully interactive list view. Type in the search bar at the bottom to see up to 3 ingredient suggestions — tap a suggestion to add it. Press Enter to add exactly what you typed. Check items and swipe (on touch devices) to delete.',
    },
  },
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

/**
 * Swipe-gesture pattern — swipe RIGHT to toggle pantry staple, swipe LEFT to delete.
 * Each SmartListItem is an independent swipe target.
 *
 * Swipe mechanics:
 * - Touch/pointer drag reveals a coloured action zone behind the row.
 * - Dragging past the threshold (≥ 60px) auto-commits the action on release.
 * - Dragging below the threshold snaps the row back to rest.
 * - Zone buttons are keyboard-accessible via tabIndex (only focusable when zone is open).
 *
 * Use this pattern when destructive or toggling actions should be available per-item
 * without cluttering the row with visible buttons. Always provide keyboard access via
 * the zone buttons (tabIndex controlled by swipe progress).
 */
export const SwipeGesture = () => {
  const [pantryStaples, setPantryStaples] = React.useState([]);
  const [groups, setGroups] = React.useState(sampleSmartGroups);

  const handlePantryToggle = (itemName) => {
    const lower = itemName?.toLowerCase();
    setPantryStaples(prev =>
      prev.includes(lower) ? prev.filter(s => s !== lower) : [...prev, lower]
    );
  };

  const handleItemDelete = (itemName) => {
    setGroups(prev => prev
      .map(g => ({ ...g, items: g.items.filter(i => i.name !== itemName) }))
      .filter(g => g.items.length > 0)
    );
  };

  return (
    <ShoppingListView
      viewMode="smart"
      smartGroups={groups}
      smartStatus="idle"
      checkedItems={{}}
      pantryStaples={pantryStaples}
      onTogglePantryStaple={handlePantryToggle}
      onSmartItemDelete={handleItemDelete}
      onSmartRefresh={() => setGroups(sampleSmartGroups)}
    />
  );
};

SwipeGesture.parameters = {
  docs: {
    description: {
      story: `
Swipe-gesture interaction on smart list items. **Swipe right** to mark/unmark a pantry staple (green zone). **Swipe left** to delete the item (red zone).

Each swipe zone is also keyboard-accessible: the zone button receives \`tabIndex={0}\` once the swipe is open, so keyboard users can tab into the action.

This is a distinct UI pattern from the \`Button\` component — the zone elements have no visible label and are only revealed by gesture or equivalent keyboard interaction. It is documented here rather than as a \`Button\` variant because it has its own gesture state machine (\`swipeX\`, \`isSwiping\`, threshold logic).
      `,
    },
  },
};
