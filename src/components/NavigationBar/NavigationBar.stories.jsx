import React from 'react';
import { NavigationBar } from './NavigationBar';

export default {
  title: 'Components/NavigationBar',
  component: NavigationBar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `The app's persistent bottom navigation bar with four fixed tabs: Recipes, Planning, Shopping list, and Account.

## When to use
- Place this once at the bottom of every authenticated app screen — it is the primary wayfinding chrome for Miri
- Use the \`activeItem\` prop to highlight the tab that matches the current route; wire \`onItemClick\` to your router

## When NOT to use
- Do not render this on the \`/auth\` route or any unauthenticated screen
- Do not use for contextual navigation within a single page — reach for Tabs or a secondary nav pattern instead
- Do not render multiple NavigationBars — there is always exactly one

## Pairs well with
- \`NavItem\` — rendered internally; no need to import or manage NavItems separately
- React Router \`useLocation\` — derive \`activeItem\` from the current pathname`,
      },
    },
  },
  argTypes: {
    activeItem: {
      control: 'select',
      options: ['recipes', 'planning', 'shopping-list', 'account'],
      description: 'The tab that is currently selected. Pass the route key that matches the current page: `recipes` → /recipes, `planning` → /planning, `shopping-list` → /shopping-list, `account` → /account.',
    },
  },
};

export const RecipesActive = {
  args: {
    activeItem: 'recipes',
  },
  parameters: {
    docs: {
      description: {
        story: 'Recipes tab active — shown when the user is on /recipes or /recipes/:id.',
      },
    },
  },
};

export const PlanningActive = {
  args: {
    activeItem: 'planning',
  },
  parameters: {
    docs: {
      description: {
        story: 'Planning tab active — shown when the user is on /planning.',
      },
    },
  },
};

export const ShoppingListActive = {
  args: {
    activeItem: 'shopping-list',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shopping list tab active — the default landing tab shown when the user is on /shopping-list.',
      },
    },
  },
};

export const AccountActive = {
  args: {
    activeItem: 'account',
  },
  parameters: {
    docs: {
      description: {
        story: 'Account tab active — shown when the user is on /account.',
      },
    },
  },
};

export const Interactive = () => {
  const [active, setActive] = React.useState('shopping-list');
  
  return (
    <div style={{ width: '390px' }}>
      <div style={{
        padding: 'var(--spacing-24)',
        minHeight: '200px',
        background: 'var(--color-background-base)'
      }}>
        <h2 className="text-h3-bold" style={{ color: 'var(--color-text-strong)' }}>
          {active === 'recipes' && 'Recipes'}
          {active === 'planning' && 'Planning'}
          {active === 'shopping-list' && 'Shopping List'}
          {active === 'account' && 'Account'}
        </h2>
      </div>
      <NavigationBar 
        activeItem={active}
        onItemClick={setActive}
      />
    </div>
  );
};

Interactive.parameters = {
  docs: {
    description: {
      story: 'Click any tab to switch the active state and see the page heading update — simulating how NavigationBar and the router interact in the real app.',
    },
  },
};
