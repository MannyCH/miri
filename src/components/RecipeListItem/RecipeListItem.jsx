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
        <div className="recipe-list-item-thumbnail">
          {thumbnail
            ? <img src={thumbnail} alt={title} />
            : <RecipePlaceholderIcon />}
        </div>
        <h4 className="recipe-list-item-title text-h4-regular">{title}</h4>
      </Button>
      {showBelowDivider && <Divider />}
    </div>
  );
};

RecipeListItem.displayName = 'RecipeListItem';

const RecipePlaceholderIcon = () => (
  <svg
    className="recipe-list-item-placeholder-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
    <path d="M7 2v20" />
    <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
  </svg>
);
