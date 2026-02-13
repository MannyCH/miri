# Miri - Smart Meal Planning App

A mobile-first meal planning app built with React, Base UI, and Storybook as the single source of truth.

## ✨ Features

### 🗓️ Meal Planning
- **Auto-generate 7-day meal plans** from available recipes
- Each day includes breakfast, lunch, and dinner
- **Calendar week navigation** - tap any date to see daily meals
- **"Add all to list"** button adds all ingredients from the 7-day plan to shopping list

### 🍳 Recipe Browser
- Browse all available recipes with thumbnails
- Search recipes by name
- Tap on any recipe to see full details

### 📖 Recipe Details
- View recipe image, title, ingredients, and step-by-step directions
- **"Add to Shopping List"** button adds all recipe ingredients
- Check off ingredients as you shop
- Swipe to delete individual ingredients

### 🛒 Shopping List
- **List View**: Flat list of all ingredients
- **Recipe View**: Ingredients grouped by recipe
- Check off items as you shop (tap anywhere on item)
- **Swipe to delete** individual ingredients
- **Delete entire recipes** (removes all ingredients)
- Clear entire shopping list

## 🚀 Quick Start

### Development Mode
```bash
npm run dev
# Opens at http://localhost:5173
```

### Storybook (Component Documentation)
```bash
npm run storybook
# Opens at http://localhost:6006
```

### Visual Testing (Chromatic)
```bash
npm run chromatic
# Automated visual regression + accessibility testing
# Review results at https://www.chromatic.com
```

### Production Build
```bash
npm run build
npm run preview
# Opens at http://localhost:4173
```

## 🏗️ Architecture

### Storybook as Single Source of Truth
All UI components and patterns are documented in Storybook:
- **Foundations**: Design tokens (colors, typography, spacing, elevation)
- **Components**: Button, SearchBar, NavigationBar, etc.
- **Patterns**: Full-screen mobile layouts (MealPlanningView, RecipesView, etc.)

### Tech Stack
- **React 18** - UI library
- **React Router** - Navigation
- **Base UI** - Accessible component primitives
- **Vite** - Build tool
- **Storybook** - Component documentation
- **Chromatic** - Visual regression & accessibility testing
- **CSS Variables** - Design tokens from Figma

### Project Structure
```
src/
├── components/          # Reusable components (Base UI + custom)
├── patterns/            # Full-screen layouts
├── pages/               # App pages (connect patterns with state)
├── context/             # App state management
├── data/                # Mock recipes database
├── design-tokens.css    # Figma design tokens
├── typography-tokens.css
└── elevation-tokens.css
```

## 📱 App Flow

```
┌─────────────────┐
│  Meal Planning  │ ← Default route (/)
│                 │
│ Auto-generate   │ → Regenerate 7-day plan
│ Select day      │ → See daily meals
│ Add all to list │ → Navigate to Shopping List
└─────────────────┘
         │
         ↓
┌─────────────────┐
│     Recipes     │
│                 │
│ Browse/Search   │
│ Click recipe    │ → Recipe Details
└─────────────────┘
         │
         ↓
┌─────────────────┐
│ Recipe Details  │
│                 │
│ View ingredients│
│ View directions │
│ Add to list     │ → Navigate to Shopping List
└─────────────────┘
         │
         ↓
┌─────────────────┐
│ Shopping List   │
│                 │
│ List / Recipe   │ ← Toggle views
│ Check off items │
│ Swipe to delete │
│ Delete recipes  │
└─────────────────┘
```

## 🎨 Design System

All components use design tokens from Figma:
- **Colors**: `var(--color-text-strong)`, `var(--color-background-base)`, etc.
- **Spacing**: `var(--spacing-8)`, `var(--spacing-16)`, etc.
- **Typography**: `.text-h1-bold`, `.text-body-regular`, etc.
- **Border Radius**: `var(--corner-radius-8)`, etc.

## 🔧 Adding New Features

1. **Add new component to Storybook** first
2. **Document in Storybook** with stories and props
3. **Import and use** in your app pages
4. **Use design tokens** for styling

## 📦 Deployment

### Deploy to Vercel
```bash
git push origin main
# Auto-deploys to https://miri.vercel.app
```

Or manually:
```bash
vercel
```

## 🧪 Testing Locally

```bash
# Run development server
npm run dev

# Test with sample data:
# 1. Visit http://localhost:5173/planning
# 2. Click "Plan meals this week" to generate new plan
# 3. Click calendar dates to see daily meals
# 4. Click "Add meals to list" → goes to shopping list
# 5. Go to Recipes tab → browse recipes
# 6. Click a recipe → see details
# 7. Click "Add to Shopping List" → adds ingredients
# 8. Shopping List tab → toggle between list/recipe views
# 9. Tap ingredients to check off
# 10. Swipe left to delete
```

## 📝 Sample Recipes

The app includes 8 sample recipes across categories:
- **Breakfast**: Greek Yogurt Parfait, Garden Veggie Omelette
- **Lunch**: Chicken Fajita Salad, Mediterranean Quinoa Bowl, Caprese Panini
- **Dinner**: Salmon with Asparagus, Spicy Shrimp Tacos, Thai Green Curry

## 🎯 Roadmap

Future enhancements:
- [ ] User authentication
- [ ] Save custom recipes
- [ ] Backend API integration
- [ ] Nutritional information
- [ ] Grocery store integration
- [ ] Meal prep instructions
- [ ] Share meal plans

## 🧪 Testing

### Visual Regression & Accessibility Testing

This project uses **Chromatic** for automated testing:

```bash
# Run Chromatic tests
npm run chromatic
```

**What Chromatic Tests:**
- ✅ **Visual Regression**: Pixel-perfect comparison with previous versions
- ✅ **Accessibility**: WCAG 2.1 Level AA compliance, color contrast, ARIA
- ✅ **Interactions**: Component behavior and user flows
- ✅ **Cross-browser**: Consistent rendering across browsers

**Automated Testing:**
- Runs automatically on every push to GitHub
- Tests only Storybook components (not web app pages)
- Notifies you of visual changes and accessibility issues
- Review results at: https://www.chromatic.com

**Setup Guide:** See `.github/CHROMATIC_SETUP.md`

## 📚 Documentation

- **Component Docs**: Run `npm run storybook`
- **Chromatic Setup**: See `.github/CHROMATIC_SETUP.md`
- **Development Guide**: See `DEVELOPMENT.md`
- **Deployment Guide**: See `DEPLOYMENT.md`

## 🤝 Contributing

All components should be documented in Storybook before integration into the app.

## 📄 License

MIT
