import React from 'react';
import { RecipeList } from './RecipeList';

export default {
  title: 'Components/RecipeList',
  component: RecipeList,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Container component for recipe list items. Shows a list of recipes with thumbnails and titles.',
      },
    },
  },
};

export const Default = {
  args: {
    recipes: [
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
      {
        title: 'Beef tacos with guacamole and salsa',
        thumbnail: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=200&h=200&fit=crop',
      },
    ],
  },
};
