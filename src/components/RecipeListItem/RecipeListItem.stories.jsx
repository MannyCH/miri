import React from 'react';
import { RecipeListItem } from './RecipeListItem';

export default {
  title: 'Components/RecipeListItem',
  component: RecipeListItem,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Recipe list item with thumbnail image and title. Includes optional dividers.',
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Recipe title',
    },
    thumbnail: {
      control: 'text',
      description: 'Thumbnail image URL',
    },
    showUpperDivider: {
      control: 'boolean',
      description: 'Show divider above',
    },
    showBelowDivider: {
      control: 'boolean',
      description: 'Show divider below',
    },
  },
};

export const Default = {
  args: {
    title: 'Salmon with tomato and asparagus',
    thumbnail: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=200&h=200&fit=crop',
    showUpperDivider: true,
    showBelowDivider: true,
  },
};

export const WithoutDividers = {
  args: {
    title: 'Salmon with tomato and asparagus',
    thumbnail: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=200&h=200&fit=crop',
    showUpperDivider: false,
    showBelowDivider: false,
  },
};

export const List = () => (
  <div style={{ width: '358px', background: 'var(--color-background-raised)' }}>
    <RecipeListItem 
      title="Spaghetti Carbonara"
      thumbnail="https://images.unsplash.com/photo-1612874742237-6526221588e3?w=200&h=200&fit=crop"
      showUpperDivider={true}
      showBelowDivider={false}
    />
    <RecipeListItem 
      title="Salmon with tomato and asparagus"
      thumbnail="https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=200&h=200&fit=crop"
      showUpperDivider={false}
      showBelowDivider={false}
    />
    <RecipeListItem 
      title="Chicken Tikka Masala"
      thumbnail="https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200&h=200&fit=crop"
      showUpperDivider={false}
      showBelowDivider={true}
    />
  </div>
);
