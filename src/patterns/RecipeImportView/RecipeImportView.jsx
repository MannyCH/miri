import React, { useRef, useState } from 'react';
import { Badge } from '../../components/Badge';
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
export const RecipeImportView = ({
  initialRecipe = {},
  onSave,
  onCancel,
  isSaving = false,
}) => {
  const [title, setTitle] = useState(initialRecipe.title ?? '');
  const [ingredients, setIngredients] = useState(
    initialRecipe.ingredients?.length ? initialRecipe.ingredients : ['']
  );
  const [directions, setDirections] = useState(
    initialRecipe.directions?.length ? initialRecipe.directions : ['']
  );
  const [servings, setServings] = useState(initialRecipe.servings ?? '');
  const [categories, setCategories] = useState(
    initialRecipe.categories?.length ? initialRecipe.categories.join(', ') : ''
  );
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef(null);

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
  const updateIngredient = (i, val) =>
    setIngredients((prev) => prev.map((item, idx) => (idx === i ? val : item)));
  const addIngredient = () => setIngredients((prev) => [...prev, '']);
  const removeIngredient = (i) => setIngredients((prev) => prev.filter((_, idx) => idx !== i));

  // ── Direction helpers ───────────────────────────────────────────────────
  const updateDirection = (i, val) =>
    setDirections((prev) => prev.map((item, idx) => (idx === i ? val : item)));
  const addDirection = () => setDirections((prev) => [...prev, '']);
  const removeDirection = (i) => setDirections((prev) => prev.filter((_, idx) => idx !== i));

  const handleSave = () => {
    onSave?.({
      title: title.trim(),
      ingredients: ingredients.filter((s) => s.trim()),
      directions: directions.filter((s) => s.trim()),
      servings: servings.trim(),
      categories: categories
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean),
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

        {/* Image zone — above title */}
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
              <li key={i} className="recipe-import-list-item">
                <input
                  type="text"
                  value={ingredient}
                  onChange={(e) => updateIngredient(i, e.target.value)}
                  placeholder="e.g. 200 g tomatoes"
                  className="recipe-import-field"
                  aria-label={`Ingredient ${i + 1}`}
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
          <ol className="recipe-import-list recipe-import-directions-list">
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
                  rows={2}
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
          <input
            type="text"
            value={servings}
            onChange={(e) => setServings(e.target.value)}
            placeholder="e.g. 2 persons"
            className="recipe-import-field"
            aria-label="Servings"
          />
        </div>

        {/* Categories */}
        <div className="recipe-import-section">
          <h2 className="text-tiny-bold recipe-import-section-title">CATEGORIES</h2>
          <input
            type="text"
            value={categories}
            onChange={(e) => setCategories(e.target.value)}
            placeholder="e.g. healthy, vegetarian"
            className="recipe-import-field"
            aria-label="Categories, comma-separated"
          />
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
