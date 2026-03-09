import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MealPlanningPage } from './pages/MealPlanningPage';
import { RecipesPage } from './pages/RecipesPage';
import { RecipeDetailPage } from './pages/RecipeDetailPage';
import { ShoppingListPage } from './pages/ShoppingListPage';
import { AuthPage } from './pages/AuthPage';
import { AccountPage } from './pages/AccountPage';
import { ToastContainer } from './components/ToastContainer';
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
function AppContent() {
  const { toasts, dismissToast } = useApp();
  const { isAuthenticated, isAuthReady } = useAuth();

  if (!isAuthReady) {
    return <div>Loading authentication...</div>;
  }
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to={isAuthenticated ? '/planning' : '/auth'} replace />} />
        <Route
          path="/auth"
          element={isAuthenticated ? <Navigate to="/planning" replace /> : <AuthPage />}
        />
        <Route
          path="/planning"
          element={isAuthenticated ? <MealPlanningPage /> : <Navigate to="/auth" replace />}
        />
        <Route
          path="/recipes"
          element={isAuthenticated ? <RecipesPage /> : <Navigate to="/auth" replace />}
        />
        <Route
          path="/recipes/:id"
          element={isAuthenticated ? <RecipeDetailPage /> : <Navigate to="/auth" replace />}
        />
        <Route
          path="/shopping-list"
          element={isAuthenticated ? <ShoppingListPage /> : <Navigate to="/auth" replace />}
        />
        <Route
          path="/account"
          element={isAuthenticated ? <AccountPage /> : <Navigate to="/auth" replace />}
        />
      </Routes>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
