# Figma <> Storybook Component Mapping

This file documents a license-free mapping strategy between Figma and Storybook.

- Figma source file: `Design Library - Smartly` (`FJcw5Rdkp6B5NlYiBC0G7b`)
- Storybook source: `http://localhost:6006/index.json`
- Mapping method: normalized name matching + manual confirmation

## Pairings (Storybook -> Figma)

| Storybook | Figma | Confidence | Notes |
|---|---|---:|---|
| `Components/Button` | `Button` (component set) | High | Variant axes align (`Primary/Secondary/Tertiary`, `State`) |
| `Components/CalendarButton` | `Calendar Button` (component set) | High | Name matches directly |
| `Components/CalendarModule` | `Calendar Module` (`FRAME`) | High | Direct name match |
| `Components/CalendarWeek` | `Calendar week` (`COMPONENT`, `164:707`) | High | Direct name match |
| `Components/ConfirmDialog` | `Dialog` (`COMPONENT`, `232:2337`) | High | Canonical source confirmed by provided Figma node |
| `Components/Divider` | `Divider` (`INSTANCE` inside list structures) | Medium | Reused instance, no top-level component set found |
| `Components/FormField` | `Form fields` (`COMPONENT_SET`, `295:637`) | High | Variant axis `Field=Empty/Filled/Error` |
| `Components/IngredientList` | `Ingredient List` (`COMPONENT`, `157:1577`) | High | Direct name match |
| `Components/IngredientListItem` | `Ingredient List item` (`COMPONENT`, `157:1502`) | High | Direct name match |
| `Components/NavItem` | `Nav item` (component set) | High | Name matches directly |
| `Components/NavigationBar` | `Navigation Bar` (`COMPONENT`, `157:2171`) | High | Direct name match |
| `Components/RecipeList` | `Recipe List` (`COMPONENT`, `157:2548`) | High | Direct name match |
| `Components/RecipeListItem` | `Recipe List Item` (`COMPONENT`, `157:2502`) | High | Direct name match |
| `Components/SearchBar` | `Search bar` (`COMPONENT`, `156:970`) | High | Direct name match |
| `Components/Toast` | `Toast` (component set) | High | Name matches directly |
| `Components/Badge` | `Badge` (`INSTANCE`, `149:1085`) | High | Canonical source confirmed by provided Figma node |
| `Patterns/Auth Modules` | `Auth Components` (`SECTION`, `273:1638`) | High | Contains Sign In/Sign Up/Verify/Reset modules |
| `Patterns/MealPlanningView` | `Meal Section` / related meal frames in `PATTERNS` | Medium | Semantic match, naming differs |
| `Patterns/RecipeDetailView` | `Recipes - Detailed` (`FRAME`) | Medium | Semantic match, naming differs |
| `Patterns/RecipesView` | `Recipes` (`FRAME`, `157:2549`) | Medium | View-level frame, not component set |
| `Patterns/ShoppingListView` | `Shopping List - Ordered by list` (`FRAME`) and `Shopping List` (`FRAME`) | Medium | View-level frame match |

## Storybook Inventory (Current)

### Components

- `Components/Badge`
- `Components/Button`
- `Components/CalendarButton`
- `Components/CalendarModule`
- `Components/CalendarWeek`
- `Components/ConfirmDialog`
- `Components/Divider`
- `Components/IngredientList`
- `Components/IngredientListItem`
- `Components/NavItem`
- `Components/NavigationBar`
- `Components/RecipeList`
- `Components/RecipeListItem`
- `Components/SearchBar`
- `Components/Toast`

### Patterns

- `Patterns/Auth Modules`
- `Patterns/MealPlanningView`
- `Patterns/RecipeDetailView`
- `Patterns/RecipesView`
- `Patterns/ShoppingListView`

## Remaining Ambiguities

- View patterns map to frame-level artifacts in `PATTERNS` rather than component sets, which is expected but should be treated as pattern mapping (not primitive component mapping).

## Canonical Figma References (User Confirmed)

- Badge: node `149:1085`
- Dialog: node `232:2337`
- Form fields: node `295:637`

## Repeatable Workflow

1. Pull Storybook inventory from `/index.json`.
2. Pull Figma inventory from both:
   - `figma_search_components` (cached design-system catalog)
   - `figma_execute` node scan (component/frame/section names)
3. Auto-pair by normalized names.
4. Manually review medium/low-confidence matches.
5. Keep this file updated as the source of truth for design parity references.

