import React from 'react';
import { IngredientList } from '../../components/IngredientList';
import { Button } from '../../components/Button';
import { NavigationBarConnected } from '../../components/NavigationBar/NavigationBarConnected';
import './RecipeDetailView.css';

/**
 * RecipeDetailView Pattern - Complete recipe view with ingredients and directions
 * Composition of: IngredientList, NavigationBar, scrollable directions
 * Combines ingredients and cooking instructions in one scrollable view
 */
export const RecipeDetailView = ({
  recipe = {
    title: 'Salmon with tomato and asparagus',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
    ingredients: [],
    directions: [],
  },
  checkedIngredients = {},
  onIngredientCheck,
  onIngredientDelete,
  onAddToList,
  ...props
}) => {
  return (
    <div className="recipe-detail-view" {...props}>
      {/* Recipe Title - Fixed at top */}
      <h1 className="text-h1-bold recipe-detail-title">{recipe.title}</h1>

      {/* Scrollable Content Area */}
      <div className="recipe-detail-content">
        {/* Hero Image */}
        <div className="recipe-detail-image">
          <img src={recipe.image} alt={recipe.title} />
        </div>

        {/* Ingredients Section */}
        <div className="recipe-detail-section">
          <h2 className="text-annotation-bold recipe-detail-section-title">
            INGREDIENTS
          </h2>
          
          <IngredientList
            ingredients={recipe.ingredients}
            checkedItems={checkedIngredients}
            onCheckedChange={onIngredientCheck}
            onDelete={onIngredientDelete}
          />
          
          {/* Add to Shopping List Button */}
          {onAddToList && (
            <div className="recipe-detail-add-button">
              <Button variant="primary" onClick={onAddToList}>
                Add to Shopping List
              </Button>
            </div>
          )}
        </div>

        {/* Directions Section */}
        <div className="recipe-detail-section">
          <h2 className="text-annotation-bold recipe-detail-section-title">
            DIRECTIONS
          </h2>
          
          {/* Numbered instruction steps */}
          <ol className="recipe-directions-list">
            {recipe.directions.map((direction, index) => (
              <li key={index} className="recipe-direction-item">
                <span className="recipe-direction-number text-body-small-bold">
                  {index + 1}
                </span>
                <p className="recipe-direction-text text-body-small-regular">
                  {direction}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Bottom Navigation */}
      <NavigationBarConnected activeItem="recipes" />
    </div>
  );
};

RecipeDetailView.displayName = 'RecipeDetailView';
