# Miri Development Guide

## Project Structure

This project separates **design system documentation** (Storybook) from the **production app** (React + Vite).

```
miri/
├── src/
│   ├── components/          # Reusable components (documented in Storybook)
│   ├── patterns/            # Full-screen layouts (documented in Storybook)
│   ├── foundations/         # Design tokens documentation
│   ├── App.jsx             # Main app entry (uses components/patterns)
│   └── main.jsx            # React DOM entry point
├── .storybook/             # Storybook configuration
└── public/                 # Static assets
```

## Development Workflow

### 1. Storybook (Design System - Single Source of Truth)

**Run Storybook locally:**
```bash
npm run storybook
# Opens at http://localhost:6006
```

**What's in Storybook:**
- ✅ All components with interactive demos
- ✅ All patterns (full-screen mobile layouts)
- ✅ Design tokens documentation
- ✅ Usage examples and props

**Deploy Storybook separately (optional):**
- Create a separate Vercel project
- Set build command: `npm run build-storybook`
- Set output directory: `storybook-static`

---

### 2. React App (Production App)

**Run app locally:**
```bash
npm run dev
# Opens at http://localhost:5173
```

**Build for production:**
```bash
npm run build
# Outputs to dist/
```

**Preview production build:**
```bash
npm run preview
# Opens at http://localhost:4173
```

---

## Building the App

### Step 1: Import Components from Storybook
All components are already built and documented in Storybook. Import them directly:

```jsx
// Import individual components
import { Button } from './components/Button';
import { NavigationBar } from './components/NavigationBar';
import { IngredientList } from './components/IngredientList';

// Or import patterns (full screens)
import { MealPlanningView } from './patterns/MealPlanningView';
import { RecipesView } from './patterns/RecipesView';
import { RecipeDetailView } from './patterns/RecipeDetailView';
```

### Step 2: Add Routing (React Router)
```bash
npm install react-router-dom
```

```jsx
// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MealPlanningView, RecipesView, RecipeDetailView } from './patterns';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MealPlanningView />} />
        <Route path="/recipes" element={<RecipesView />} />
        <Route path="/recipe/:id" element={<RecipeDetailView />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Step 3: Add State Management (Optional)
For more complex state, consider:
- **Context API** (built-in React)
- **Zustand** (lightweight)
- **TanStack Query** (for API data)

---

## Deployment

### Deploy to Vercel

**Option 1: Automatic (Recommended)**
1. Connect your GitHub repo to Vercel
2. Vercel auto-detects Vite settings from `vercel.json`
3. Every push to `main` auto-deploys

**Option 2: Manual**
```bash
npm install -g vercel
vercel login
vercel
# Follow prompts
```

**Vercel Configuration:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Framework: `vite`

---

## Design System Integration

### Using Components
All components are already styled with design tokens and Base UI:

```jsx
import { Button } from './components/Button';

// Button automatically uses design tokens
<Button variant="primary">Click me</Button>
```

### Using Patterns
Patterns are complete screen layouts ready to use:

```jsx
import { MealPlanningView } from './patterns/MealPlanningView';

// Pass data and handlers
<MealPlanningView 
  selectedDay={23}
  meals={mealsData}
  onDayClick={handleDayClick}
/>
```

### Accessing Design Tokens
Tokens are available as CSS variables:

```css
.my-custom-component {
  color: var(--color-text-strong);
  padding: var(--spacing-16);
  border-radius: var(--corner-radius-12);
  background: var(--color-background-base);
}
```

---

## Key Principles

1. **Storybook = Source of Truth**
   - All components are developed and documented in Storybook first
   - The app imports and uses these components

2. **Base UI Foundation**
   - All interactive components use Base UI primitives
   - Ensures accessibility and keyboard navigation

3. **Design Tokens**
   - All styling uses CSS variables from Figma
   - Ensures consistency across the entire app

4. **Mobile-First**
   - All patterns are optimized for 390px mobile viewport
   - Can be adapted for responsive layouts

---

## Next Steps

1. **Add Routing:** Install React Router and set up routes
2. **Connect Backend:** Add API integration for recipes/ingredients
3. **Add State:** Implement state management for user data
4. **Add Features:** Build out the meal planning logic
5. **Test:** Add tests for components and patterns
6. **Deploy:** Push to Vercel for production

---

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run storybook        # Start Storybook

# Build
npm run build            # Build app for production
npm run build-storybook  # Build Storybook for production

# Preview
npm run preview          # Preview production app build
```

## Resources

- **Storybook Docs:** Your local Storybook at `http://localhost:6006`
- **Base UI Docs:** https://base-ui.com
- **React Router:** https://reactrouter.com
- **Vercel Docs:** https://vercel.com/docs
