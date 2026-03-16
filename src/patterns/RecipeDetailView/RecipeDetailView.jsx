import React, { useState } from 'react';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Stepper } from '../../components/Stepper/Stepper';
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
  const [servings, setServings] = useState(() => {
    const n = parseInt(recipe.servings, 10);
    return isNaN(n) || n < 1 ? 2 : n;
  });
  const fractionMap = {
    '1/2': '½',
    '1/3': '⅓',
    '2/3': '⅔',
    '1/4': '¼',
    '3/4': '¾',
    '1/8': '⅛',
    '3/8': '⅜',
    '5/8': '⅝',
    '7/8': '⅞',
  };

  const formatFractions = (value = '') =>
    Object.entries(fractionMap).reduce(
      (acc, [raw, glyph]) => acc.replaceAll(raw, glyph),
      value
    );

  const splitIngredient = (ingredient) => {
    if (typeof ingredient !== 'string') {
      const quantity = ingredient?.quantity ? formatFractions(String(ingredient.quantity)) : '';
      const name = ingredient?.name ? formatFractions(String(ingredient.name)) : '';
      return { amount: quantity, name };
    }

    const text = ingredient.trim();
    const knownUnits = new Set([
      'g', 'kg', 'mg', 'ml', 'l', 'oz', 'lb', 'lbs',
      'cup', 'cups', 'tbsp', 'tsp',
      'pc', 'pcs', 'piece', 'pieces',
      'clove', 'cloves', 'bunch', 'bunches',
      'can', 'cans', 'slice', 'slices', 'roll', 'rolls',
    ]);

    const compactMatch = text.match(/^(\d+(?:[./]\d+)?)\s*([a-zA-Z]+)\b\s*(.*)$/);
    if (compactMatch && knownUnits.has(compactMatch[2].toLowerCase())) {
      const amountRaw = `${compactMatch[1]} ${compactMatch[2]}`.trim();
      const nameRaw = compactMatch[3].trim();
      return {
        amount: formatFractions(amountRaw),
        name: formatFractions(nameRaw),
      };
    }

    const numberMatch = text.match(/^(\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?)(?:\s+(.+))?$/);
    if (!numberMatch) {
      return { amount: '', name: formatFractions(text) };
    }

    const quantity = numberMatch[1];
    const rest = (numberMatch[2] || '').trim();
    if (!rest) {
      return { amount: formatFractions(quantity), name: '' };
    }

    const [firstWord, ...remainingWords] = rest.split(/\s+/);
    const hasUnit = knownUnits.has(firstWord.toLowerCase().replace('.', ''));
    const amountRaw = hasUnit ? `${quantity} ${firstWord}` : quantity;
    const nameRaw = hasUnit ? remainingWords.join(' ') : rest;

    const amount = formatFractions(amountRaw.trim());
    const name = formatFractions(nameRaw.trim());
    return { amount, name };
  };

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

        {/* Servings Section */}
        <div className="recipe-detail-section">
          <h2 className="text-tiny-bold recipe-detail-section-title">SERVINGS</h2>
          <Stepper value={servings} min={1} max={99} onChange={setServings} />
        </div>

        {/* Ingredients Section — non-interactive list */}
        <div className="recipe-detail-section recipe-ingredients-section">
          <h2 className="text-tiny-bold recipe-detail-section-title">
            INGREDIENTS
          </h2>

          <ul className="recipe-ingredient-list">
            {recipe.ingredients.map((ingredient, index) => {
              const { amount, name } = splitIngredient(ingredient);
              return (
                <li key={index} className="recipe-ingredient-item text-body-regular">
                  <span className="recipe-ingredient-amount">{amount}</span>
                  <span className="recipe-ingredient-name">{name}</span>
                </li>
              );
            })}
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
                <p className="recipe-direction-text text-body-regular">
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
