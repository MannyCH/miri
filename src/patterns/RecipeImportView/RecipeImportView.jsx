import React, { useLayoutEffect, useRef, useState } from 'react';
import { Badge } from '../../components/Badge';
import { Stepper } from '../../components/Stepper/Stepper';
import './RecipeImportView.css';

/**
 * RecipeImportView Pattern
 * Full-screen editable form for reviewing and adjusting an imported recipe
 * before saving. Accepts an `initialRecipe` parsed from a TXT file.
 *
 * Props:
 *   initialRecipe  – pre-populated recipe fields (all optional)
 *   onSave(data)   – called with { title, ingredients, directions, servings, categories, imageFile }
 *   onCancel()     – called when user taps Cancel
 *   isSaving       – disables Save button while async save is in progress
 */

// Split a raw ingredient string into { quantity, name }.
// Handles both attached units ("320g Asparagus") and separate units ("2 kg Asparagus").
const INGREDIENT_UNITS = new Set([
  'g', 'kg', 'mg',
  'ml', 'l', 'dl', 'cl',
  'pcs', 'pc', 'piece', 'pieces',
  'tbsp', 'tsp', 'cup', 'cups',
  'oz', 'lb', 'lbs',
  'bunch', 'pinch', 'slice', 'slices',
  'can', 'cans', 'bottle', 'bottles',
  'dash', 'handful',
]);

const parseIngredient = (str) => {
  const parts = String(str).trim().split(/\s+/);
  if (parts.length < 2) return { quantity: '', name: str };
  const [first, second, ...rest] = parts;
  // "2 kg Asparagus" → quantity includes the unit token
  if (/^\d/.test(first) && INGREDIENT_UNITS.has(second.toLowerCase()) && rest.length > 0) {
    return { quantity: `${first} ${second}`, name: rest.join(' ') };
  }
  // "320g Asparagus" or fallback
  return { quantity: first, name: parts.slice(1).join(' ') };
};

const parseServings = (val) => {
  const n = parseInt(val, 10);
  return isNaN(n) || n < 1 ? null : n;
};

// Scale a quantity string by a numeric factor.
// Handles attached units ("320g"), space-separated units ("2 kg"), plain numbers ("3"), fractions ("1/2").
const scaleQuantity = (quantityStr, factor) => {
  if (!quantityStr || factor === 1) return quantityStr;
  const match = quantityStr.match(/^(\d+\/\d+|\d+(?:[.,]\d+)?)(\s*.*)$/);
  if (!match) return quantityStr;
  const [, numStr, rest] = match;
  const num = numStr.includes('/')
    ? (() => { const [a, b] = numStr.split('/'); return parseFloat(a) / parseFloat(b); })()
    : parseFloat(numStr.replace(',', '.'));
  if (isNaN(num) || num === 0) return quantityStr;
  const scaled = num * factor;
  const formatted = Number.isInteger(scaled) ? String(scaled) : parseFloat(scaled.toFixed(2)).toString();
  return formatted + rest;
};

export const RecipeImportView = ({
  initialRecipe = {},
  onSave,
  onCancel,
  isSaving = false,
  preferredServings,
}) => {
  const [title, setTitle] = useState(initialRecipe.title ?? '');

  const originalServings = parseServings(initialRecipe.servings);
  const targetServings = preferredServings ?? originalServings ?? 2;

  const [ingredients, setIngredients] = useState(() => {
    const parsed = initialRecipe.ingredients?.length
      ? initialRecipe.ingredients.map(parseIngredient)
      : [{ quantity: '', name: '' }];
    if (originalServings && originalServings !== targetServings) {
      const factor = targetServings / originalServings;
      return parsed.map((ing) => ({ ...ing, quantity: scaleQuantity(ing.quantity, factor) }));
    }
    return parsed;
  });
  const [directions, setDirections] = useState(
    initialRecipe.directions?.length ? initialRecipe.directions : ['']
  );
  const [servings, setServings] = useState(targetServings);
  const prevServingsRef = useRef(targetServings);
  const [categories, setCategories] = useState(
    initialRecipe.categories?.length ? [...initialRecipe.categories] : []
  );
  const [categoryInput, setCategoryInput] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);
  const categoryInputRef = useRef(null);
  const directionsListRef = useRef(null);

  // Auto-resize all direction textareas when content is pre-filled on mount
  useLayoutEffect(() => {
    directionsListRef.current?.querySelectorAll('textarea').forEach((el) => {
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    });
  }, [directions]);

  const handleImageFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    handleImageFile(e.dataTransfer.files?.[0]);
  };

  // ── Ingredient helpers ──────────────────────────────────────────────────
  const updateIngredientQuantity = (i, val) =>
    setIngredients((prev) => prev.map((item, idx) => idx === i ? { ...item, quantity: val } : item));
  const updateIngredientName = (i, val) =>
    setIngredients((prev) => prev.map((item, idx) => idx === i ? { ...item, name: val } : item));
  const addIngredient = () => setIngredients((prev) => [...prev, { quantity: '', name: '' }]);
  const removeIngredient = (i) => setIngredients((prev) => prev.filter((_, idx) => idx !== i));

  // ── Direction helpers ───────────────────────────────────────────────────
  const updateDirection = (i, val) =>
    setDirections((prev) => prev.map((item, idx) => (idx === i ? val : item)));
  const addDirection = () => setDirections((prev) => [...prev, '']);
  const removeDirection = (i) => setDirections((prev) => prev.filter((_, idx) => idx !== i));

  // ── Servings change: scale quantities relative to previous value ─────────
  const handleServingsChange = (newServings) => {
    const factor = newServings / prevServingsRef.current;
    setIngredients((prev) =>
      prev.map((ing) => ({ ...ing, quantity: scaleQuantity(ing.quantity, factor) }))
    );
    prevServingsRef.current = newServings;
    setServings(newServings);
  };

  // ── Category helpers ────────────────────────────────────────────────────
  const addCategory = (value) => {
    const tag = value.trim();
    if (tag && !categories.includes(tag)) {
      setCategories((prev) => [...prev, tag]);
    }
    setCategoryInput('');
  };
  const removeCategory = (i) => setCategories((prev) => prev.filter((_, idx) => idx !== i));
  const handleCategoryKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addCategory(categoryInput);
    } else if (e.key === 'Backspace' && categoryInput === '' && categories.length > 0) {
      removeCategory(categories.length - 1);
    }
  };

  const handleSave = () => {
    onSave?.({
      title: title.trim(),
      ingredients: ingredients
        .map(({ quantity, name }) => [quantity, name].filter(Boolean).join(' ').trim())
        .filter(Boolean),
      directions: directions.filter((s) => s.trim()),
      servings: String(servings),
      categories,
      imageFile,
    });
  };

  return (
    <div
      className="recipe-import-view"
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
    >
      {/* ── Fixed header ─────────────────────────────────────────────── */}
      <header className="recipe-import-header">
        <button type="button" className="recipe-import-nav-btn" onClick={onCancel}>
          Cancel
        </button>
        <span className="recipe-import-header-title">Import Recipe</span>
        <button
          type="button"
          className="recipe-import-nav-btn recipe-import-save-btn"
          onClick={handleSave}
          disabled={!title.trim() || isSaving}
        >
          {isSaving ? 'Saving…' : 'Save'}
        </button>
      </header>

      {/* ── Scrollable content ───────────────────────────────────────── */}
      <div className="recipe-import-content">

        {/* Image zone */}
        <div
          className={[
            'recipe-import-image-zone',
            isDragOver && 'recipe-import-image-zone--drag-over',
            imagePreviewUrl && 'recipe-import-image-zone--has-image',
          ].filter(Boolean).join(' ')}
          role="button"
          tabIndex={0}
          aria-label={imagePreviewUrl ? 'Change recipe photo' : 'Add recipe photo'}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="recipe-import-file-input"
            onChange={(e) => handleImageFile(e.target.files?.[0])}
          />
          {imagePreviewUrl ? (
            <img src={imagePreviewUrl} alt="Recipe preview" className="recipe-import-image-preview" />
          ) : (
            <div className="recipe-import-image-placeholder">
              <CameraIcon />
              <span className="recipe-import-image-label">Add photo</span>
            </div>
          )}
        </div>

        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Recipe title"
          className="text-h1-bold recipe-import-title-input"
          aria-label="Recipe title"
        />

        {/* Ingredients */}
        <div className="recipe-import-section">
          <h2 className="text-tiny-bold recipe-import-section-title">INGREDIENTS</h2>
          <ul className="recipe-import-list">
            {ingredients.map((ingredient, i) => (
              <li key={i} className="recipe-import-ingredient-row">
                <input
                  type="text"
                  value={ingredient.quantity}
                  onChange={(e) => updateIngredientQuantity(i, e.target.value)}
                  placeholder="Qty"
                  className="recipe-import-field recipe-import-ingredient-quantity"
                  aria-label={`Quantity for ingredient ${i + 1}`}
                />
                <input
                  type="text"
                  value={ingredient.name}
                  onChange={(e) => updateIngredientName(i, e.target.value)}
                  placeholder="Ingredient name"
                  className="recipe-import-field recipe-import-ingredient-name"
                  aria-label={`Ingredient ${i + 1} name`}
                />
                <button
                  type="button"
                  className="recipe-import-remove-btn"
                  onClick={() => removeIngredient(i)}
                  aria-label={`Remove ingredient ${i + 1}`}
                >
                  <RemoveIcon />
                </button>
              </li>
            ))}
          </ul>
          <button type="button" className="recipe-import-add-btn" onClick={addIngredient}>
            <AddIcon /> Add ingredient
          </button>
        </div>

        {/* Directions */}
        <div className="recipe-import-section">
          <h2 className="text-tiny-bold recipe-import-section-title">DIRECTIONS</h2>
          <ol ref={directionsListRef} className="recipe-import-list recipe-import-directions-list">
            {directions.map((direction, i) => (
              <li key={i} className="recipe-import-direction-item">
                <Badge>{i + 1}</Badge>
                <textarea
                  value={direction}
                  onChange={(e) => {
                    e.target.style.height = 'auto';
                    e.target.style.height = `${e.target.scrollHeight}px`;
                    updateDirection(i, e.target.value);
                  }}
                  placeholder="Describe this step…"
                  className="recipe-import-field recipe-import-textarea"
                  rows={1}
                  aria-label={`Direction step ${i + 1}`}
                />
                <button
                  type="button"
                  className="recipe-import-remove-btn"
                  onClick={() => removeDirection(i)}
                  aria-label={`Remove step ${i + 1}`}
                >
                  <RemoveIcon />
                </button>
              </li>
            ))}
          </ol>
          <button type="button" className="recipe-import-add-btn" onClick={addDirection}>
            <AddIcon /> Add step
          </button>
        </div>

        {/* Servings */}
        <div className="recipe-import-section">
          <h2 className="text-tiny-bold recipe-import-section-title">SERVINGS</h2>
          <Stepper value={servings} min={1} max={99} onChange={handleServingsChange} />
        </div>

        {/* Categories */}
        <div className="recipe-import-section">
          <h2 className="text-tiny-bold recipe-import-section-title">CATEGORIES</h2>
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
          <div
            className="recipe-import-categories-field"
            onClick={() => categoryInputRef.current?.focus()}
            role="group"
            aria-label="Categories"
          >
            {categories.map((cat, i) => (
              <span key={cat} className="recipe-import-category-chip">
                <span className="text-body-small-regular recipe-import-category-chip-label">{cat}</span>
                <button
                  type="button"
                  className="recipe-import-category-chip-remove"
                  onClick={(e) => { e.stopPropagation(); removeCategory(i); }}
                  aria-label={`Remove category ${cat}`}
                >
                  <RemoveIcon />
                </button>
              </span>
            ))}
            <input
              ref={categoryInputRef}
              type="text"
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
              onKeyDown={handleCategoryKeyDown}
              onBlur={() => addCategory(categoryInput)}
              placeholder={categories.length === 0 ? 'e.g. healthy, vegetarian' : 'Add category…'}
              className="recipe-import-categories-input"
              aria-label="Add category"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

const CameraIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);

const RemoveIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const AddIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);


RecipeImportView.displayName = 'RecipeImportView';
