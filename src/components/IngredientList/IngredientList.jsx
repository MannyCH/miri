import React from 'react';
import { IngredientListItem } from '../IngredientListItem';
import './IngredientList.css';

/**
 * IngredientList component - Exactly as designed in Figma
 * Container for interactive ingredient list items
 * Supports tap to toggle and swipe to delete
 */
export const IngredientList = ({ 
  ingredients = [],
  checkedItems = {},
  onCheckedChange,
  onDelete, // Callback when item is deleted (swipe or keyboard)
  ...props 
}) => {
  return (
    <div className="ingredient-list" {...props}>
      {ingredients.map((ingredient, index) => (
        <IngredientListItem
          key={index}
          checked={checkedItems[index]}
          onCheckedChange={(checked) => onCheckedChange?.(index, checked)}
          onDelete={() => onDelete?.(index)}
          showUpperDivider={index === 0}
          showBelowDivider={true}
        >
          {ingredient}
        </IngredientListItem>
      ))}
    </div>
  );
};

IngredientList.displayName = 'IngredientList';
