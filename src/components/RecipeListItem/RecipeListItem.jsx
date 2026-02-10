import React from 'react';
import { Button } from '@base-ui/react/button';
import { Divider } from '../Divider';
import './RecipeListItem.css';

/**
 * RecipeListItem component - Exactly as designed in Figma
 * List item with thumbnail image and recipe title
 * Built with Base UI Button for accessibility
 */
export const RecipeListItem = ({ 
  title = 'Salmon with tomato and asparagus',
  thumbnail,
  showUpperDivider = true,
  showBelowDivider = true,
  ...props 
}) => {
  return (
    <div className="recipe-list-item">
      {showUpperDivider && <Divider />}
      <Button className="recipe-list-item-content" {...props}>
        {thumbnail && (
          <div className="recipe-list-item-thumbnail">
            <img src={thumbnail} alt={title} />
          </div>
        )}
        <h3 className="recipe-list-item-title">{title}</h3>
      </Button>
      {showBelowDivider && <Divider />}
    </div>
  );
};

RecipeListItem.displayName = 'RecipeListItem';
