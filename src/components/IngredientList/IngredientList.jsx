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
  itemKeys = [],
  itemIds = [],
  checkedItems = {},
  onCheckedChange,
  onDelete, // Callback when item is deleted (swipe or keyboard)
  ...props 
}) => {
  return (
    <div className="ingredient-list" {...props}>
      {ingredients.map((ingredient, index) => (
        <IngredientListItem
          key={itemKeys[index] ?? itemIds[index] ?? `${ingredient}-${index}`}
          checked={checkedItems[index]}
          onCheckedChange={(checked) => onCheckedChange?.(index, checked, itemIds[index])}
          onDelete={() => onDelete?.(index, itemIds[index])}
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
