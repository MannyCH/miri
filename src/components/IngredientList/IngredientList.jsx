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
  onDelete,
  pantryStaples = [],     // optional — array of staple name strings
  onPantryToggle,         // optional — (index, ingredientText) => void
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
          onPantryToggle={onPantryToggle ? () => onPantryToggle(index, ingredient) : undefined}
          isPantryStaple={pantryStaples.some(s => ingredient?.toLowerCase().includes(s))}
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
