import React from 'react';
import { RecipeListItem } from '../RecipeListItem';
import './RecipeList.css';

/**
 * RecipeList component - Exactly as designed in Figma
 * Container for recipe list items
 */
export const RecipeList = ({ 
  recipes = [],
  ...props 
}) => {
  return (
    <div className="recipe-list" {...props}>
      {recipes.map((recipe, index) => (
        <RecipeListItem
          key={index}
          title={recipe.title}
          thumbnail={recipe.thumbnail}
          showUpperDivider={index === 0}
          showBelowDivider={index === recipes.length - 1}
        />
      ))}
    </div>
  );
};

RecipeList.displayName = 'RecipeList';
