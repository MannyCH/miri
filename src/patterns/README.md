# Miri App Patterns

Full-screen mobile app patterns showing how components compose to create complete screens for the Miri meal planning app.

## 📱 All Patterns Implemented

### 1. MealPlanningView 📅
**Purpose:** Calendar-based meal planning with daily meal breakdown

**Figma Source:** `161:346` (Shopping List / Meal Planning)

**Components Used:**
- CalendarWeek
- Button (Plan meals, Add meals)
- RecipeListItem (Breakfast, Lunch, Dinner)
- NavigationBar

**Key Features:**
- Week calendar view with date selection
- Date range display (22.11 - 28.11)
- Daily meal sections with thumbnails
- Quick actions per meal (refresh, add to cart)
- Active date highlighting

---

### 2. RecipesView 🥘
**Purpose:** Browse and search recipes

**Figma Source:** `157:2549` (Recipes)

**Components Used:**
- RecipeList
- SearchBar
- NavigationBar

**Key Features:**
- Scrollable recipe list with thumbnails
- Search bar at bottom
- Recipe titles and images
- Click to view recipe details

---

### 3. RecipeDetailView 📖
**Purpose:** Complete recipe view with ingredients and cooking directions

**Figma Source:** `146:720` (Recipes - Detailed) - Merged with Directions pattern

**Components Used:**
- IngredientList (interactive)
- NavigationBar
- Custom numbered directions layout

**Key Features:**
- Large hero image
- Recipe title (Heading 1/Bold)
- Interactive ingredients list
  - Tap to check off
  - Swipe left to delete
- Scrollable content with both ingredients AND directions
- Section headers (INGREDIENTS, DIRECTIONS)
- Numbered cooking steps (Body small/Regular text)
- 24px spacing between direction steps

---

### 4. ShoppingListView 🛒
**Purpose:** Manage shopping list with multiple view modes

**Figma Sources:** 
- `146:692` (Shopping List - Ordered by list)
- `166:1108` (Shopping List - Ordered by recipe)

**Components Used:**
- IngredientList (interactive)
- SearchBar
- Button (Clear list, view toggles)
- NavigationBar

**Key Features:**
- **Two View Modes:**
  - **List View:** Simple flat ingredient list
  - **Recipe View:** Ingredients grouped by recipe with delete buttons
- Interactive ingredients (tap to check, swipe to delete)
- View mode toggle buttons (grid/list icons)
- "Clear whole list" action
- Search functionality at bottom

---

## 🎨 Design Principles

1. **Pure Component Composition** - No custom code, only existing components
2. **Mobile-First** - 390px viewport (iPhone standard)
3. **Navigation Consistency** - Bottom nav on every screen
4. **Interaction Rich** - Tap, swipe, keyboard support
5. **Exact Figma Match** - Pixel-perfect implementation

## 📐 Layout Structure

All patterns follow this structure:
```
┌─────────────────────┐
│ Header (Title)      │
├─────────────────────┤
│                     │
│ Main Content        │
│ (Scrollable)        │
│                     │
├─────────────────────┤
│ Search Bar          │ (optional)
├─────────────────────┤
│ Navigation Bar      │ (fixed bottom)
└─────────────────────┘
```

## 🔧 Technical Implementation

### Base UI Components Used
- ✅ Button (navigation, actions)
- ✅ Checkbox (hidden, for accessibility)
- ✅ Field (search input)

### Gesture Support
- **Tap:** Toggle checked state
- **Swipe Left:** Delete ingredient
- **Keyboard:** Tab navigation, Space/Enter to toggle, Delete key to remove

### Responsive Design
- Max width: 390px (mobile)
- Fixed bottom navigation (80px clearance)
- Scrollable content areas
- Touch-optimized hit areas

## 📦 Usage Example

```jsx
import { 
  MealPlanningView,
  RecipesView,
  RecipeDetailView,
  ShoppingListView 
} from './patterns';

// Example: Using in a React app
function App() {
  const [currentView, setCurrentView] = useState('meal-planning');
  
  return (
    <>
      {currentView === 'meal-planning' && (
        <MealPlanningView 
          selectedDay={23}
          meals={myMeals}
          onDayClick={setSelectedDay}
        />
      )}
      
      {currentView === 'recipes' && (
        <RecipesView 
          recipes={myRecipes}
          onRecipeClick={openRecipeDetail}
        />
      )}
      
      {currentView === 'shopping-list' && (
        <ShoppingListView 
          viewMode="recipe"
          recipeGroups={myShoppingList}
        />
      )}
    </>
  );
}
```

## 🎯 Component Dependencies

All patterns depend on these documented components:
- ✅ Button (4 variants)
- ✅ SearchBar
- ✅ NavigationBar
- ✅ NavItem
- ✅ CalendarButton
- ✅ CalendarWeek
- ✅ IngredientListItem
- ✅ IngredientList
- ✅ RecipeListItem
- ✅ RecipeList
- ✅ Divider

Every component is fully documented in Storybook under the "Components" category.
