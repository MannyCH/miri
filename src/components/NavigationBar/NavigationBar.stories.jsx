import React from 'react';
import { NavigationBar } from './NavigationBar';

export default {
  title: 'Components/NavigationBar',
  component: NavigationBar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Bottom navigation bar with 4 items. Exactly as designed in Figma.',
      },
    },
  },
  argTypes: {
    activeItem: {
      control: 'select',
      options: ['recipes', 'planning', 'shopping-list', 'account'],
      description: 'Currently active navigation item',
    },
  },
};

export const RecipesActive = {
  args: {
    activeItem: 'recipes',
  },
};

export const PlanningActive = {
  args: {
    activeItem: 'planning',
  },
};

export const ShoppingListActive = {
  args: {
    activeItem: 'shopping-list',
  },
};

export const AccountActive = {
  args: {
    activeItem: 'account',
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
