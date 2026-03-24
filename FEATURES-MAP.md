# Features Map

Quick reference mapping features to their key files. Read this before scanning the codebase.

## Shopping List

| Area | Key Files |
|------|-----------|
| State & actions | `src/context/AppContext.jsx` — shoppingList, lists, members, CRUD actions |
| List API client | `src/lib/shoppingListApi.js` — fetchItems, toggleCheck, createList, etc. |
| Server API (items) | `api/shopping-list-items.js` — GET/POST/PATCH/DELETE items |
| Server API (lists) | `api/shopping-lists.js` — GET/POST lists, membership |
| Server API (members) | `api/shopping-list-members.js` — GET members, invite tokens |
| UI pattern | `src/patterns/ShoppingListView/ShoppingListView.jsx` — list/recipe/smart views |
| Page (wiring) | `src/pages/ShoppingListPage.jsx` — connects pattern to context |
| Smart list (AI) | `api/normalize-shopping-list.js` — AI categorization endpoint |
| Smart list (UI) | `ShoppingListView.jsx:SmartListContent` — renders AI groups |
| Multi-list switcher | `src/components/ListSwitcher/ListSwitcher.jsx` |

## Real-Time Sync

| Area | Key Files |
|------|-----------|
| Pusher client | `src/context/PusherContext.jsx` — connection, channel subscription |
| Pusher auth | `api/pusher-auth.js` — JWT verify + channel authorization |
| Pusher server trigger | `api/_lib/pusher.js` — shared Pusher server instance |
| Event handling | `src/context/AppContext.jsx` — Pusher event listeners (item:added, item:checked, etc.) |

## Meal Planning

| Area | Key Files |
|------|-----------|
| State & actions | `src/context/AppContext.jsx` — mealPlan, generateMealPlan |
| AI generation | `api/generate-meal-plan.js` — AI meal plan endpoint |
| UI pattern | `src/patterns/MealPlanningView/` |
| Page | `src/pages/MealPlanningPage.jsx` |

## Auth

| Area | Key Files |
|------|-----------|
| Auth context | `src/context/AuthContext.jsx` — session, login, signup |
| Auth client | `src/lib/authClient.js` — Neon Auth setup |
| JWT verification | Pattern in all `api/` routes — jose + JWKS |
| Auth page | `src/pages/AuthPage.jsx` |

## Recipes

| Area | Key Files |
|------|-----------|
| State | `src/context/AppContext.jsx` — recipes |
| UI pattern | `src/patterns/RecipesView/`, `src/patterns/RecipeDetailView/` |
| Pages | `src/pages/RecipesPage.jsx`, `src/pages/RecipeDetailPage.jsx` |
| Import | `src/pages/RecipeImportPage.jsx`, `api/parse-recipe.js` |

## Shared Infrastructure

| Area | Key Files |
|------|-----------|
| Design tokens | `src/design-tokens.css`, `src/typography-tokens.css`, `src/elevation-tokens.css` |
| Data client (RLS) | `src/lib/dataClient.js` — client-side Neon Data API |
| App entry & routing | `src/App.jsx` |
| Preferences | `src/context/PreferencesContext.jsx` |
| DB schema | `database/schema.sql` |
