import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PreferencesProvider } from './context/PreferencesContext';
import { ToastContainer } from './components/ToastContainer';
import './index.css';

const MealPlanningPage = lazy(() => import('./pages/MealPlanningPage').then((module) => ({ default: module.MealPlanningPage })));
const RecipesPage = lazy(() => import('./pages/RecipesPage').then((module) => ({ default: module.RecipesPage })));
const RecipeDetailPage = lazy(() => import('./pages/RecipeDetailPage').then((module) => ({ default: module.RecipeDetailPage })));
const ShoppingListPage = lazy(() => import('./pages/ShoppingListPage').then((module) => ({ default: module.ShoppingListPage })));
const AuthPage = lazy(() => import('./pages/AuthPage').then((module) => ({ default: module.AuthPage })));
const AccountPage = lazy(() => import('./pages/AccountPage').then((module) => ({ default: module.AccountPage })));

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
      <Suspense fallback={<div>Loading page...</div>}>
        <Routes>
          <Route path="/" element={<Navigate to={isAuthenticated ? '/planning' : '/auth'} replace />} />
          <Route
            path="/auth"
            element={isAuthenticated ? <Navigate to="/planning" replace /> : <AuthPage />}
          />
          <Route
            path="/auth/reset-password"
            element={isAuthenticated ? <Navigate to="/planning" replace /> : <AuthPage />}
          />
          <Route
            path="/auth/verify-email"
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
      </Suspense>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <PreferencesProvider>
        <AppProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </AppProvider>
      </PreferencesProvider>
    </AuthProvider>
  );
}

export default App;
