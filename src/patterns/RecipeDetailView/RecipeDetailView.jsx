import React, { useState } from 'react';
import { Coffee, ShoppingCart, Check } from 'react-feather';
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
  onCook,
  ...props
}) => {
  const originalServings = (() => {
    const n = parseInt(recipe.servings, 10);
    return isNaN(n) || n < 1 ? null : n;
  })();
  const [servings, setServings] = useState(originalServings ?? 2);

  const scaleQuantity = (quantityStr, factor) => {
    if (!quantityStr || factor === 1) return quantityStr;
    // normalizeFractions is defined below but called at render time — safe to reference here
    const normalized = normalizeFractions(quantityStr);
    const match = normalized.match(/^(\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:[.,]\d+)?)(\s*.*)$/);
    if (!match) return quantityStr;
    const [, numStr, rest] = match;
    let num;
    if (numStr.includes(' ')) {
      const [whole, frac] = numStr.split(' ');
      const [a, b] = frac.split('/');
      num = parseFloat(whole) + parseFloat(a) / parseFloat(b);
    } else if (numStr.includes('/')) {
      const [a, b] = numStr.split('/');
      num = parseFloat(a) / parseFloat(b);
    } else {
      num = parseFloat(numStr.replace(',', '.'));
    }
    if (isNaN(num) || num === 0) return quantityStr;
    const scaled = num * factor;
    const whole = Math.floor(scaled);
    const dec = scaled - whole;
    let formatted;
    if (dec < 0.03) {
      formatted = String(whole || Math.round(scaled));
    } else if (dec > 0.97) {
      formatted = String(whole + 1);
    } else {
      // Always snap decimal part to nearest standard cooking fraction.
      // List is ascending so ties (equidistant) resolve to the larger fraction — safer for cooking.
      const cookingFracs = [[1,8],[1,4],[1,3],[1,2],[2,3],[3,4],[7,8]];
      let bestFrac = cookingFracs[0];
      let bestDist = Infinity;
      for (const [n, d] of cookingFracs) {
        const dist = Math.abs(dec - n / d);
        if (dist <= bestDist) { bestDist = dist; bestFrac = [n, d]; }
      }
      const fracStr = `${bestFrac[0]}/${bestFrac[1]}`;
      formatted = whole > 0 ? `${whole} ${fracStr}` : fracStr;
    }
    return formatFractions(formatted) + rest;
  };

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

  // Normalize Unicode fraction glyphs back to ASCII so the parser can handle them.
  // Also inserts a space for runs like "1½" → "1 1/2".
  const normalizeFractions = (value = '') => {
    const reverseMap = Object.fromEntries(
      Object.entries(fractionMap).map(([raw, glyph]) => [glyph, raw])
    );
    return Object.entries(reverseMap).reduce((acc, [glyph, raw]) => {
      return acc
        .replace(new RegExp(`(\\d)(${glyph})`, 'g'), `$1 ${raw}`)
        .replaceAll(glyph, raw);
    }, value);
  };

  const splitIngredient = (ingredient) => {
    if (typeof ingredient !== 'string') {
      const quantityRaw = ingredient?.amount || ingredient?.quantity;
      if (quantityRaw) {
        const unit = ingredient?.unit ? ` ${ingredient.unit}` : '';
        const quantity = formatFractions(String(quantityRaw)) + unit;
        const name = ingredient?.name ? formatFractions(String(ingredient.name)) : '';
        return { amount: quantity.trim(), name };
      }
      // No structured amount — parse the name string
      return splitIngredient(ingredient?.name ?? '');
    }

    const text = normalizeFractions(ingredient.trim());
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
        <div className="recipe-detail-image">
          {recipe.image
            ? <img src={recipe.image} alt={recipe.title} />
            : <RecipeDetailPlaceholder />}
        </div>

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
              const scaledAmount = originalServings
                ? scaleQuantity(amount, servings / originalServings)
                : amount;
              return (
                <li key={index} className="recipe-ingredient-item text-body-regular">
                  <span className="recipe-ingredient-amount">{scaledAmount}</span>
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

        {/* CTA buttons — "Add to list" (primary) + "Cook" (secondary) side by side */}
        {(onAddToList || (onCook && recipe.directions?.length > 0)) && (
          <div className="recipe-detail-actions">
            {onAddToList && (
              <Button
                variant="primary"
                icon={isAdded ? <Check size={20} /> : <ShoppingCart size={20} />}
                onClick={onAddToList}
                disabled={isAdded}
              >
                {isAdded ? 'Added' : 'Add to list'}
              </Button>
            )}
            {onCook && recipe.directions?.length > 0 && (
              <Button
                variant="secondary"
                icon={<Coffee size={20} />}
                showIcon
                onClick={onCook}
              >
                Cook
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <NavigationBarConnected activeItem="recipes" />
    </div>
  );
};


const RecipeDetailPlaceholder = () => (
  <svg
    className="recipe-detail-placeholder-icon"
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

RecipeDetailView.displayName = 'RecipeDetailView';
