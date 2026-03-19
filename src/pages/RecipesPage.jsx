import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecipesView } from '../patterns/RecipesView';
import { ImportMethodSheet } from '../components/ImportMethodSheet';
import './RecipesPage.css';
import { useApp } from '../context/AppContext';
import { parseRecipeTxt } from '../lib/recipeParser';
import { compressImageToDataUrl } from '../lib/recipeParser';

/**
 * Recipes Page
 * - Browse all available recipes (static + user-imported)
 * - Search recipes
 * - Import a recipe via URL, photo, or TXT file
 * - Navigate to recipe details
 */
export function RecipesPage() {
  const navigate = useNavigate();
  const { userRecipes, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);

  // Build available filters from recipes (meal_type + categories)
  const availableFilters = React.useMemo(() => {
    const MEAL_TYPE_LABELS = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', any: 'Any' };
    const mealTypes = new Set();
    const categories = new Set();
    userRecipes.forEach(r => {
      if (r.meal_type && r.meal_type !== 'any') mealTypes.add(r.meal_type);
      (r.categories ?? []).forEach(c => categories.add(c));
    });
    const mealFilters = [...mealTypes].map(v => ({ value: `meal:${v}`, label: MEAL_TYPE_LABELS[v] ?? v, type: 'meal_type' }));
    const categoryFilters = [...categories].map(v => ({ value: `cat:${v}`, label: v, type: 'category' }));
    return [...mealFilters, ...categoryFilters];
  }, [userRecipes]);

  const handleFilterToggle = (value) => {
    setActiveFilters(prev =>
      prev.includes(value) ? prev.filter(f => f !== value) : [...prev, value]
    );
  };

  // Import sheet
  const [showImportSheet, setShowImportSheet] = useState(false);

  // URL import
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlValue, setUrlValue] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const urlInputRef = useRef(null);

  // File inputs
  const fileInputRef = useRef(null);
  const photoInputRef = useRef(null);

  const filteredRecipes = React.useMemo(() => {
    let result = userRecipes;
    if (searchQuery) {
      result = result.filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (activeFilters.length > 0) {
      const mealFilters = activeFilters.filter(f => f.startsWith('meal:')).map(f => f.slice(5));
      const catFilters = activeFilters.filter(f => f.startsWith('cat:')).map(f => f.slice(4));
      result = result.filter(r => {
        const mealMatch = mealFilters.length === 0 || mealFilters.includes(r.meal_type);
        const catMatch = catFilters.length === 0 || catFilters.some(c => (r.categories ?? []).includes(c));
        return mealMatch && catMatch;
      });
    }
    return result;
  }, [userRecipes, searchQuery, activeFilters]);

  const handleRecipeClick = (recipeId) => navigate(`/recipes/${recipeId}`);

  // ── Import sheet ──────────────────────────────────────────────────────────

  const handleImportRequest = () => setShowImportSheet(true);
  const handleSheetClose = () => setShowImportSheet(false);

  // ── URL import ────────────────────────────────────────────────────────────

  const handleSelectUrl = () => {
    setShowImportSheet(false);
    setUrlValue('');
    setShowUrlInput(true);
    // Focus the input after the sheet exit animation
    setTimeout(() => urlInputRef.current?.focus(), 150);
  };

  const handleUrlImport = async () => {
    const url = urlValue.trim();
    if (!url) return;
    setIsImporting(true);
    try {
      const res = await fetch('/api/import-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({}));
        throw new Error(error || `Server error ${res.status}`);
      }
      const recipe = await res.json();
      setShowUrlInput(false);
      navigate('/recipes/import', { state: { recipe } });
    } catch (err) {
      showToast('error', `Could not import recipe: ${err.message}`);
    } finally {
      setIsImporting(false);
    }
  };

  const handleUrlKeyDown = (e) => {
    if (e.key === 'Enter') handleUrlImport();
    if (e.key === 'Escape') { setShowUrlInput(false); setUrlValue(''); }
  };

  // ── Photo import ──────────────────────────────────────────────────────────

  const handleSelectPhoto = () => {
    setShowImportSheet(false);
    photoInputRef.current?.click();
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setIsImporting(true);
    try {
      const dataUrl = await compressImageToDataUrl(file);
      // dataUrl = "data:image/jpeg;base64,<data>"
      const [header, base64] = dataUrl.split(',');
      const mediaType = header.match(/data:([^;]+)/)?.[1] ?? 'image/jpeg';

      const res = await fetch('/api/import-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, mediaType }),
      });
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({}));
        throw new Error(error || `Server error ${res.status}`);
      }
      const recipe = await res.json();
      navigate('/recipes/import', { state: { recipe } });
    } catch (err) {
      showToast('error', `Could not import recipe: ${err.message}`);
    } finally {
      setIsImporting(false);
    }
  };

  // ── File import ───────────────────────────────────────────────────────────

  const handleSelectFile = () => {
    setShowImportSheet(false);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    const text = await file.text();
    const parsed = parseRecipeTxt(text);
    navigate('/recipes/import', { state: { recipe: parsed } });
  };

  return (
    <>
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handlePhotoChange}
      />

      <RecipesView
        recipes={filteredRecipes}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onRecipeClick={handleRecipeClick}
        onImportRequest={handleImportRequest}
        availableFilters={availableFilters}
        activeFilters={activeFilters}
        onFilterToggle={handleFilterToggle}
      />

      <ImportMethodSheet
        isOpen={showImportSheet}
        onClose={handleSheetClose}
        onSelectUrl={handleSelectUrl}
        onSelectPhoto={handleSelectPhoto}
        onSelectFile={handleSelectFile}
      />

      {/* URL input overlay */}
      {showUrlInput && (
        <div className="recipes-url-overlay" role="dialog" aria-label="Import recipe from URL" aria-modal="true">
          <div className="recipes-url-sheet">
            <div className="recipes-url-sheet-handle" aria-hidden="true" />
            <h2 className="text-h3-bold recipes-url-title">Paste Recipe URL</h2>
            <input
              ref={urlInputRef}
              type="url"
              inputMode="url"
              value={urlValue}
              onChange={(e) => setUrlValue(e.target.value)}
              onKeyDown={handleUrlKeyDown}
              placeholder="https://..."
              className="text-body-regular recipes-url-input"
              aria-label="Recipe URL"
              disabled={isImporting}
            />
            <div className="recipes-url-actions">
              <button
                type="button"
                className="recipes-url-cancel"
                onClick={() => { setShowUrlInput(false); setUrlValue(''); }}
                disabled={isImporting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="recipes-url-import-btn"
                onClick={handleUrlImport}
                disabled={!urlValue.trim() || isImporting}
              >
                {isImporting ? 'Importing…' : 'Import'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full-screen loading overlay for photo import */}
      {isImporting && !showUrlInput && (
        <div className="recipes-import-loading" aria-live="polite" aria-label="Importing recipe…">
          <span className="text-body-regular recipes-import-loading-text">Importing recipe…</span>
        </div>
      )}
    </>
  );
}
