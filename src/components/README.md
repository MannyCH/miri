# Miri Component Library

All components from the Figma design library have been implemented in Storybook using React and Base UI.

## ✅ Completed Components

All components are implemented exactly as designed in Figma, with no additional behaviors or states added.

### Core Components
- ✅ **Button** (4 variants: Primary, Secondary, Tertiary, Tertiary Delete)
  - Figma: `165:971`
  - **Base UI: `Button`** ✅
  - States: Default, Disabled, Focus

- ✅ **Badge**
  - Figma: `149:1085`
  - Native HTML `<span>` (no Base UI equivalent)
  - Single variant with stroke and light background

- ✅ **Divider**
  - Figma: `Divider component`
  - Native HTML `<hr>` (no Base UI equivalent)
  - Simple horizontal line

### Form Components
- ✅ **SearchBar**
  - Figma: `156:970`
  - **Base UI: `Field`** ✅
  - Features: Trailing search icon

### Navigation Components
- ✅ **NavItem** (2 states: Default, Pressed)
  - Figma: `157:2098`
  - **Base UI: `Button`** ✅
  - Icon + text layout

- ✅ **NavigationBar**
  - Figma: `157:2171`
  - **Uses NavItem (Base UI)** ✅
  - 4 items: Recipes, Planning, Shopping list, Account

### Calendar Components
- ✅ **CalendarButton** (3 states: No background, Default, Pressed)
  - Figma: `164:290`
  - **Base UI: `Button`** ✅
  - Date button for calendar

- ✅ **CalendarWeek**
  - Figma: `164:707`
  - **Uses CalendarButton (Base UI)** ✅
  - 7-day week view

### List Components
- ✅ **IngredientListItem**
  - Figma: `157:1502`
  - **Base UI: `Checkbox`** ✅
  - Interactive checkbox for checking off ingredients
  - Includes checkmark indicator and strikethrough when checked

- ✅ **IngredientList**
  - Figma: `157:1577`
  - **Uses IngredientListItem (Base UI Checkbox)** ✅
  - Container with proper state management

- ✅ **RecipeListItem**
  - Figma: `157:2502`
  - **Base UI: `Button`** ✅
  - Clickable item to navigate to recipe details
  - Thumbnail + title layout

- ✅ **RecipeList**
  - Figma: `157:2548`
  - **Uses RecipeListItem (Base UI)** ✅
  - Container with proper divider logic

## Base UI Coverage

**10 out of 12 components** use Base UI primitives:
- ✅ Button (Base UI)
- ✅ CalendarButton (Base UI)
- ✅ NavItem (Base UI Button)
- ✅ NavigationBar (uses NavItem)
- ✅ SearchBar (Base UI Field)
- ✅ **IngredientListItem (Base UI Checkbox)** ✅
- ✅ IngredientList (uses IngredientListItem)
- ✅ RecipeListItem (Base UI Button for navigation)
- ✅ RecipeList (uses RecipeListItem)
- ✅ CalendarWeek (uses CalendarButton)
- ❌ Badge (native span - no Base UI equivalent)
- ❌ Divider (native hr - no Base UI equivalent)

## Benefits of Base UI

All interactive components now benefit from:
- ✅ Built-in keyboard navigation
- ✅ Proper ARIA attributes
- ✅ Focus management
- ✅ Accessible by default
- ✅ Consistent behavior across components
- ✅ **Checkbox for ingredient items** - proper semantic meaning for checkable lists
- ✅ **Button for navigation items** - proper semantic meaning for clickable navigation

## Implementation Notes

- All components use design tokens from `design-tokens.css`, `typography-tokens.css`, and `elevation-tokens.css`
- Base UI provides the foundation for accessibility and keyboard interaction
- **IngredientListItem uses Checkbox** - semantically correct for shopping/ingredient lists
- **RecipeListItem uses Button** - semantically correct for navigation items
- No hover states or behaviors added beyond what's in Figma
- All components follow the exact visual design from Figma
- Each component has Storybook stories showing all documented states

## Design Tokens Used

- **Colors**: Semantic color tokens (`--color-fill-*`, `--color-text-*`, `--color-stroke-*`)
- **Spacing**: Spacing tokens (`--spacing-*`)
- **Corner Radius**: Border radius tokens (`--corner-radius-*`)
- **Typography**: Text style classes (`.text-*`)
- **Elevation**: Shadow tokens (`--elevation-*`)
