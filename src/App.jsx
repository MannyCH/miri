import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { MealPlanningPage } from './pages/MealPlanningPage';
import { RecipesPage } from './pages/RecipesPage';
import { RecipeDetailPage } from './pages/RecipeDetailPage';
import { ShoppingListPage } from './pages/ShoppingListPage';
import './index.css';

/**
 * Miri - Meal Planning App
 * 
 * Features:
 * - Auto-generate 7-day meal plans
 * - Browse recipes
 * - View recipe details with ingredients and directions
 * - Add ingredients to shopping list
 * - Manage shopping list (list view or grouped by recipe)
 * 
 * Built with Storybook patterns as single source of truth
 */
function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/planning" replace />} />
          <Route path="/planning" element={<MealPlanningPage />} />
          <Route path="/recipes" element={<RecipesPage />} />
          <Route path="/recipes/:id" element={<RecipeDetailPage />} />
          <Route path="/shopping-list" element={<ShoppingListPage />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
