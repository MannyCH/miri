import React from 'react';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { NavigationBarConnected } from '../../components/NavigationBar/NavigationBarConnected';
import './RecipeDetailView.css';

/**
 * RecipeDetailView Pattern - Matches Figma "Recipes - Detailed" pattern
 * Structure: Title → Image → Ingredients (non-interactive) → Directions (with Badge) → Button
 */
export const RecipeDetailView = ({
  recipe = {
    title: 'Salmon with tomato and asparagus',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
    ingredients: [],
    directions: [],
  },
  onAddToList,
  isAdded = false,
  ...props
}) => {
  return (
    <div className="recipe-detail-view" {...props}>
      {/* Scrollable Content Area */}
      <div className="recipe-detail-content">
        {/* Recipe Title */}
        <h1 className="text-h1-bold recipe-detail-title">{recipe.title}</h1>

        {/* Hero Image */}
        {recipe.image && (
          <div className="recipe-detail-image">
            <img src={recipe.image} alt={recipe.title} />
          </div>
        )}

        {/* Ingredients Section — non-interactive list */}
        <div className="recipe-detail-section recipe-ingredients-section">
          <h2 className="text-tiny-bold recipe-detail-section-title">
            INGREDIENTS
          </h2>

          <ul className="recipe-ingredient-list">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="recipe-ingredient-item text-body-small-regular">
                {typeof ingredient === 'string' ? ingredient : `${ingredient.quantity} ${ingredient.name}`}
              </li>
            ))}
          </ul>
        </div>

        {/* Directions Section — Badge numbers + instruction text */}
        <div className="recipe-detail-section">
          <h2 className="text-tiny-bold recipe-detail-section-title">
            DIRECTIONS
          </h2>

          <ol className="recipe-directions-list">
            {recipe.directions.map((direction, index) => (
              <li key={index} className="recipe-direction-item">
                <Badge>{index + 1}</Badge>
                <p className="recipe-direction-text text-body-small-regular">
                  {direction}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {/* Add to list button — at bottom after all content */}
        {onAddToList && (
          <div className="recipe-detail-add-button">
            <Button
              variant="primary"
              icon={isAdded ? <CheckIcon /> : <CartIcon />}
              onClick={onAddToList}
              className={isAdded ? 'button-added' : ''}
              disabled={isAdded}
            >
              {isAdded ? 'Added' : 'Add to list'}
            </Button>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <NavigationBarConnected activeItem="recipes" />
    </div>
  );
};

const CartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/>
    <circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

RecipeDetailView.displayName = 'RecipeDetailView';
