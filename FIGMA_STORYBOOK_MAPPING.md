# Figma <> Storybook Component Mapping

This file documents a license-free mapping strategy between Figma and Storybook.

- Figma source file: `Design Library - Smartly` (`FJcw5Rdkp6B5NlYiBC0G7b`)
- Storybook source: `http://localhost:6006/index.json`
- Mapping method: normalized name matching + manual confirmation

## Pairings (Storybook -> Figma)

| Storybook | Figma | Confidence | Notes |
|---|---|---:|---|
| `Components/AccountCard` | `Card` (`COMPONENT_SET`, `313:3079`) | High | Collapsed `313:3413`, Expanded `313:3144` — on Cards page |
| `Components/Badge` | `Badges` (`COMPONENT`, `149:1085`) | High | Canonical source confirmed |
| `Components/Button` | `Button` (`COMPONENT_SET`, `225:1762`) | High | Variant axes align (`Primary/Secondary/Tertiary`, `State`) — 20 variants |
| `Components/CalendarButton` | `Calendar Button` (`COMPONENT_SET`, `164:290`) | High | 3 variants: Default, Pressed, No background |
| `Components/CalendarModule` | `Calendar Module` (`FRAME`) | High | Direct name match |
| `Components/CalendarWeek` | `Calendar week` (`COMPONENT`, `164:707`) | High | Direct name match |
| `Components/ConfirmDialog` | `Dialog` (`COMPONENT`, `232:2337`) | High | Canonical source confirmed |
| `Components/ActionSheet` | `ActionSheet` (`COMPONENT_SET`, `570:2945`) | High | Created 2026-04-23 — Default + With Destructive + With Chevron variants, all values token-bound |
| `Components/ImportMethodSheet` | `ActionSheet` / `State=With Chevron` (`COMPONENT`, `570:3070`) | High | Merged into ActionSheet as a variant — same bottom-sheet structure with trailing chevrons per row |
| `Components/Chip` | `Chip` (`COMPONENT_SET`, `570:2878`) | High | Created 2026-04-23 — Default + Active variants, all values token-bound |
| `Components/ContextMenu` | `Context menu` (`COMPONENT_SET`, `232:2631`) | High | 3 variants: Default, Hover, Focus — on Context Menu page |
| `Components/Divider` | `Divider` (`COMPONENT`, `54:531`) | High | Standalone component found |
| `Components/IngredientList` | `Ingredient List` (`COMPONENT`, `157:1577`) | High | Direct name match |
| `Components/IngredientListItem` | `Ingredient List item` (`COMPONENT`, `157:1502`) | High | Direct name match |
| `Components/NavItem` | `Nav item` (`COMPONENT_SET`, `157:2098`) | High | 2 variants: Default, Pressed |
| `Components/NavigationBar` | `Navigation Bar` (`COMPONENT`, `157:2171`) | High | Direct name match |
| `Components/RadioButton` | `Radio button` (`COMPONENT_SET`, `318:4689`) | High | 2 variants: Checked, Unchecked — on Fields page |
| `Components/RecipeList` | `Recipe List` (`COMPONENT`, `157:2548`) | High | Direct name match |
| `Components/RecipeListItem` | `Recipe List Item` (`COMPONENT`, `157:2502`) | High | Direct name match |
| `Components/SearchBar` | `Search bar` (`COMPONENT`, `156:970`) | High | Direct name match |
| `Components/SearchFab` | `SearchFab` (`COMPONENT`, `568:2067`) | High | Created 2026-04-23 — page: SearchFab, all values token-bound |
| `Components/SelectField` | `Dropdown` (`COMPONENT_SET`, `313:4136`) | Medium | 2 variants: Selected, Expanded — visual match, naming differs |
| `Components/Stepper` | `Counter` (`COMPONENT`, `313:4111`) | Medium | Increment/decrement control — naming differs, needs token audit |
| `Components/TextField` | `Form fields` (`COMPONENT_SET`, `295:637`) | High | 4 variants: Empty, Filled, Error, unit — was mapped as `FormField` |
| `Components/Toast` | `Toast` (`COMPONENT_SET`, `209:2087`) | High | 4 variants: Success, Error, Warning, Info |
| `Components/UnitField` | `Form fields` / `Field=unit` variant (`314:4218`) | High | Unit variant of the Form fields component set |
| `Components/AvatarRow` | `AvatarRow` (`COMPONENT`, `570:2947`) | High | Created 2026-04-23 — overlapping 28px avatars + dashed invite button, token-bound |
| `Components/BmrCalculatorCard` | `BmrCalculatorCard` (`FRAME`, `319:4936`) | High | Already in Figma on Account page — token-bound per CSS comment |
| `Components/ChoiceTile` | `ChoiceTile` (`COMPONENT_SET`, `570:2966`) | High | Created 2026-04-23 — Default + Selected, all values token-bound |
| `Components/ListSwitcher` | `ListSwitcher` (`COMPONENT_SET`, `570:3048`) | High | Created 2026-04-23 — Collapsed + Expanded variants, token-bound |
| `Components/OtpCodeInput` | `OtpCodeInput` (`COMPONENT_SET`, `570:3029`) | High | Created 2026-04-23 — Empty/Partial/Filled variants, all values token-bound |
| `Components/SettingsSection` | `SettingsSection` (`FRAME`, `314:4194`) | High | Already in Figma on Account page — token-bound per CSS comment |
| `Components/ShareSheet` | `ShareSheet` (`COMPONENT`, `570:3050`) | High | Created 2026-04-23 — share bottom sheet, token-bound |
| `Patterns/AccountView` | `Account` (`COMPONENT_SET`, `317:4248`) | High | 3 variants of full-screen account page — on Account page |
| `Patterns/Auth Modules` | `Auth Components` (`SECTION`, `273:1638`) | High | Sign In, Sign Up, Verify, Reset Password modules |
| `Patterns/MealPlanningView` | `Meal Section` / related meal frames in `PATTERNS` | Medium | Semantic match, naming differs |
| `Patterns/RecipeDetailView` | `Recipes - Detailed` (`FRAME`) | Medium | Semantic match, naming differs |
| `Patterns/RecipeImportView` | `Recipe Import` (`COMPONENT`, `336:3286`) | Medium | Direct component — may be a pattern-level view |
| `Patterns/RecipesView` | `Recipes` (`FRAME`, `157:2549`) | Medium | View-level frame, not component set |
| `Patterns/ShoppingListView` | `Shopping List - Ordered by list` + `Shopping List` (`FRAME`) | Medium | View-level frame match |

## Missing from Figma — Need to Create

These Storybook components have no Figma counterpart and must be built:

| Storybook | Priority | Notes |
|-----------|----------|-------|
| `Components/ActionSheet` | High | ✅ Created 2026-04-23 — node `570:2945` on ActionSheet page |
| `Components/AvatarRow` | Medium | ✅ Created 2026-04-23 — node `570:2947` on AvatarRow page |
| `Components/BatchImportSection` | Low | Batch recipe import UI — deferred |
| `Components/BmrCalculatorCard` | Medium | ✅ Already in Figma — node `319:4936` on Account page |
| `Components/Chip` | High | ✅ Created 2026-04-23 — node `570:2878` on Chip page |
| `Components/ChoiceTile` | Medium | ✅ Created 2026-04-23 — node `570:2966` on ChoiceTile page |
| `Components/ImportMethodSheet` | Low | ✅ Merged into ActionSheet as `State=With Chevron` variant — node `570:3070` |
| `Components/ListSwitcher` | Medium | ✅ Created 2026-04-23 — node `570:3048` on ListSwitcher page |
| `Components/OtpCodeInput` | Medium | ✅ Created 2026-04-23 — node `570:3029` on OtpCodeInput page |
| `Components/Overview` | Medium | ✅ Docs-only MDX page — no Figma component needed |
| `Components/SettingsSection` | Medium | ✅ Already in Figma — node `314:4194` on Account page |
| `Components/ShareSheet` | Medium | ✅ Created 2026-04-23 — node `570:3050` on ShareSheet page |

## Not Yet Mapped — Patterns

| Storybook | Status |
|-----------|--------|
| `Patterns/Onboarding` | No Figma counterpart found |
| `Patterns/Overview` | No Figma counterpart found |

## Storybook Inventory (Current — as of 2026-04-23)

### Components

- `Components/AccountCard`
- `Components/ActionSheet` ✅ `570:2945`
- `Components/AvatarRow` ✅ `570:2947`
- `Components/Badge`
- `Components/BatchImportSection` ❌ no Figma
- `Components/BmrCalculatorCard` ✅ `319:4936` (Account page)
- `Components/Button`
- `Components/CalendarButton`
- `Components/CalendarModule`
- `Components/CalendarWeek`
- `Components/Chip` ✅ `570:2878`
- `Components/ChoiceTile` ✅ `570:2966`
- `Components/ConfirmDialog`
- `Components/ContextMenu`
- `Components/Divider`
- `Components/ImportMethodSheet` ✅ `570:3070` (ActionSheet / State=With Chevron)
- `Components/IngredientList`
- `Components/IngredientListItem`
- `Components/ListSwitcher` ✅ `570:3048`
- `Components/NavItem`
- `Components/NavigationBar`
- `Components/OtpCodeInput` ✅ `570:3029`
- `Components/Overview` ✅ docs-only MDX
- `Components/RadioButton`
- `Components/RecipeList`
- `Components/RecipeListItem`
- `Components/SearchBar`
- `Components/SearchFab`
- `Components/SelectField`
- `Components/SettingsSection` ✅ `314:4194` (Account page)
- `Components/ShareSheet` ✅ `570:3050`
- `Components/Stepper`
- `Components/TextField`
- `Components/Toast`
- `Components/UnitField`

### Patterns

- `Patterns/AccountView`
- `Patterns/Auth Modules`
- `Patterns/MealPlanningView`
- `Patterns/Onboarding` ❌ no Figma
- `Patterns/Overview` ❌ no Figma
- `Patterns/RecipeDetailView`
- `Patterns/RecipeImportView`
- `Patterns/RecipesView`
- `Patterns/ShoppingListView`

## Canonical Figma References (User Confirmed)

- SearchFab: node `568:2067` (page: SearchFab, created 2026-04-23)
- Badge: node `149:1085`
- Dialog: node `232:2337`
- Form fields: node `295:637`

## Repeatable Workflow

1. Pull Storybook inventory from `/index.json`.
2. Pull Figma inventory from both:
   - `figma_get_library_components` (REST API — no Desktop Bridge needed)
   - `figma_execute` node scan (component/frame/section names)
3. Auto-pair by normalized names.
4. Manually review medium/low-confidence matches.
5. Keep this file updated as the source of truth for design parity references.
