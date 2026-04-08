import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PusherProvider } from './context/PusherContext';
import { PreferencesProvider, usePreferences } from './context/PreferencesContext';
import { ToastContainer } from './components/ToastContainer';
import './index.css';

const MealPlanningPage = lazy(() => import('./pages/MealPlanningPage').then((module) => ({ default: module.MealPlanningPage })));
const RecipesPage = lazy(() => import('./pages/RecipesPage').then((module) => ({ default: module.RecipesPage })));
const RecipeDetailPage = lazy(() => import('./pages/RecipeDetailPage').then((module) => ({ default: module.RecipeDetailPage })));
const ShoppingListPage = lazy(() => import('./pages/ShoppingListPage').then((module) => ({ default: module.ShoppingListPage })));
const AuthPage = lazy(() => import('./pages/AuthPage').then((module) => ({ default: module.AuthPage })));
const AccountPage = lazy(() => import('./pages/AccountPage').then((module) => ({ default: module.AccountPage })));
const OnboardingPage = lazy(() => import('./pages/OnboardingPage').then((module) => ({ default: module.OnboardingPage })));
const RecipeImportPage = lazy(() => import('./pages/RecipeImportPage').then((module) => ({ default: module.RecipeImportPage })));
const JoinListPage = lazy(() => import('./pages/JoinListPage').then((module) => ({ default: module.JoinListPage })));

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
function useNeedsOnboarding() {
  const { user } = useAuth();
  const { preferences, isLoading } = usePreferences();
  if (!user) return false;
  if (isLoading) return null; // Still determining — don't make a routing decision yet
  const done = localStorage.getItem(`miri_onboarding_${user.id}`);
  if (done) return false;
  return !preferences.goal && !preferences.eatingStyle;
}

function AppContent() {
  const { toasts, dismissToast } = useApp();
  const { isAuthenticated, isAuthReady, user } = useAuth();
  const needsOnboarding = useNeedsOnboarding();

  if (!isAuthReady) {
    return <div>Loading authentication...</div>;
  }

  // While authenticated and preferences are still loading, hold off routing decisions
  // to avoid sending new users to /planning instead of /onboarding.
  if (isAuthenticated && needsOnboarding === null) {
    return null;
  }

  // Don't redirect away from /auth until the user's email is verified.
  // signUp() creates a session immediately (before OTP entry), so isAuthenticated
  // becomes true while the user still needs to enter their verification code.
  const isEmailVerified = Boolean(user?.emailVerified);
  const canRedirectFromAuth = isAuthenticated && isEmailVerified;

  const defaultRoute = canRedirectFromAuth
    ? (needsOnboarding ? '/onboarding' : '/planning')
    : '/auth';

  return (
    <>
      <Suspense fallback={<div>Loading page...</div>}>
        <Routes>
          <Route path="/" element={<Navigate to={defaultRoute} replace />} />
          <Route
            path="/auth"
            element={canRedirectFromAuth && needsOnboarding !== null ? <Navigate to={needsOnboarding ? '/onboarding' : '/planning'} replace /> : <AuthPage />}
          />
          <Route
            path="/onboarding"
            element={isAuthenticated ? <OnboardingPage /> : <Navigate to="/auth" replace />}
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
            path="/recipes/import"
            element={isAuthenticated ? <RecipeImportPage /> : <Navigate to="/auth" replace />}
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
            path="/join/:token"
            element={isAuthenticated ? <JoinListPage /> : <Navigate to="/auth" replace />}
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
      <PusherProvider>
        <PreferencesProvider>
          <AppProvider>
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </AppProvider>
        </PreferencesProvider>
      </PusherProvider>
    </AuthProvider>
  );
}

export default App;
