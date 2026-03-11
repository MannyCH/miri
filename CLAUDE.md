# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (http://localhost:5173)
npm run storybook    # Start Storybook (http://localhost:6006)
npm run build        # Production build → dist/
npm run chromatic    # Run visual regression + accessibility tests
npm run preview      # Preview production build
```

There is no traditional unit test suite. Component testing happens via Storybook stories + Chromatic for visual regression and accessibility.

## Architecture

**Miri** is a React 19 + Vite SPA for meal planning. Hosted on Vercel with serverless API functions in `/api/`. Backend is Neon Postgres with Neon Auth.

### Two-Phase Development Workflow

**Phase 1 — Figma → Storybook:** All new components originate from Figma designs. Implement using Base UI primitives + CSS design tokens, then document in Storybook. Storybook is the single source of truth.

**Phase 2 — Storybook → Web App:** Build pages/features by composing documented Storybook components. Never recreate a component that already exists in Storybook.

### Layer Structure

| Layer | Location | Purpose |
|-------|----------|---------|
| Components | `src/components/` | Reusable UI primitives, each with `.stories.jsx` |
| Patterns | `src/patterns/` | Full-screen layouts composed from components |
| Pages | `src/pages/` | Wire patterns to React Router routes |
| Context | `src/context/` | Global state (Auth, App, Preferences) |
| API | `api/` | Vercel serverless functions |

### State Management

Three React Contexts, nested in this order:
1. `AuthContext` — Neon Auth session, user identity
2. `AppContext` — Meal plans, shopping list, toast notifications
3. `PreferencesContext` — User preferences persisted to Neon Postgres

### Routing (all routes except `/auth` are protected)

```
/            → redirect to /planning or /auth
/auth        → Login/Signup
/planning    → Meal planning view
/recipes     → Recipe browser
/recipes/:id → Recipe detail
/shopping-list
/account
```

### Design Tokens

All visual values come from CSS variables in `src/design-tokens.css`, `src/typography-tokens.css`, and `src/elevation-tokens.css`. Never hardcode colors, spacing, font sizes, or border radii. Use:
- Colors: `var(--color-text-strong)`, `var(--color-background-base)`, `var(--color-stroke-weak)`, `var(--color-icon-brand)`, etc.
- Spacing: `var(--spacing-4)`, `var(--spacing-8)`, `var(--spacing-16)`, etc.
- Typography: CSS classes `.text-h1-bold`, `.text-body-regular`, `.text-annotation-bold` — never set font properties directly in CSS
- Border radius: `var(--corner-radius-4)`, `var(--corner-radius-8)`, `var(--corner-radius-12)`, etc.

---

## MCP Servers

Three MCP servers are used in this project.

### Storybook MCP (project scope — already configured in `.mcp.json`)

Powered by `@storybook/addon-mcp` which is already installed and registered in `.storybook/main.js`. Exposes the MCP server automatically when Storybook is running. **Requires Storybook to be running first.**

```bash
# Already configured — no setup needed for Claude Code
# For Claude desktop app, add to claude_desktop_config.json:
{ "storybook-mcp": { "type": "http", "url": "http://localhost:6006/mcp" } }
```

### Figma Console MCP (user scope)

```bash
claude mcp add figma-console -s user \
  -e FIGMA_ACCESS_TOKEN=<your_token> \
  -e ENABLE_MCP_APPS=true \
  -- npx -y figma-console-mcp@latest
```

**Tools:** `figma_execute`, `figma_capture_screenshot`, `figma_get_variables`, `figma_get_styles`, `figma_search_components`, `figma_get_status`

### Neon MCP (user scope)

```bash
# Authenticate via browser (sets up HTTP MCP automatically):
npx neonctl@latest init
```

**Tools:** `run_sql`, `prepare_database_migration`, `complete_database_migration`, `get_database_tables`, `describe_table_schema`, `list_slow_queries`, `explain_sql_statement`, `provision_neon_data_api`

---

## Rules

### 1. Minimal Changes (minimal-changes)

Make ONLY the changes explicitly requested. Never add unrequested features, styles, animations, refactors, or error handling. If unclear, ask instead of guessing.

**Red flags — never do these unless asked:**
- "I also added..." / "I improved..." / "I refactored..." / "While I was at it..."
- Adding hover states, loading spinners, transitions not in Figma
- Reorganizing file structure or renaming variables
- Adding validation or error handling not requested

### 2. Figma Design Consistency (figma-design-consistency)

All UI must EXACTLY match Figma. Zero tolerance for hardcoded visual values.

**Before implementing (Phase 1 — Storybook):** Use Figma Console MCP tools:
- `figma_execute` — get component structure
- `figma_capture_screenshot` — visual reference
- `figma_get_variables` — check token bindings
- `figma_get_styles` — get typography styles

**Before implementing (Phase 2 — Web App):** Check Storybook MCP first, reuse existing components.

**NEVER:**
- Hardcode color values (`#9C4722`, `rgb(...)`)
- Hardcode spacing (`16px`, `8px`)
- Set font properties directly in CSS
- Add styles not present in Figma

### 3. Storybook as Single Source of Truth (storybook-workflow, storybook-source-of-truth)

**Workflow contract:** Figma → Storybook → App Code (strict order)

Never recreate or replace a Storybook component in app code. If a Storybook component exists, use it directly (props/variants only). Never modify a component without updating its Storybook story.

**When Storybook is running (port 6006), ALWAYS use its HTTP API — never read story files instead:**
```bash
# Check if running
curl -s http://localhost:6006/index.json >/dev/null 2>&1 && echo "Running"

# Get all story IDs, URLs, metadata
curl -s http://localhost:6006/index.json

# Story URL format
http://localhost:6006/?path=/story/components-button--primary

# Never guess story IDs — always get exact ID from index.json
```

**Pre-code required output:**
- List Storybook story IDs/URLs used for implementation
- List app components that will reuse those Storybook components

**Completion audit:**
- Component reuse: confirmed
- Typography classes: confirmed
- Token usage (color/spacing/radius): confirmed
- Hardcoded visual overrides: none

### 4. UI Preflight Protocol (ui-preflight-protocol)

Before ANY UI change, in this order:
1. Check Storybook availability (`http://localhost:6006/index.json`)
2. Find existing components to reuse — do not add inline SVGs if a documented icon exists
3. Use only design tokens and typography classes
4. Self-check: "Which documented source (Storybook/Figma) am I using?" If unclear, stop and ask.

**A UI task is only complete when:** documented components/icons/tokens were used, behavior matches requested scope.

### 5. Visual Verification (visual-verification)

After any UI change, before considering work complete:
1. Capture Figma screenshot reference (`figma_capture_screenshot`)
2. Test in browser (`npm run dev` → `http://localhost:5173`)
3. Compare side-by-side with Figma
4. Verify all of: typography classes, color tokens, spacing tokens, border-radius tokens

**Mandatory checks before committing:**
- `color: var(--color-text-strong)` ✅ not `color: #260B00` ❌
- `padding: var(--spacing-16)` ✅ not `padding: 16px` ❌
- `border-radius: var(--corner-radius-12)` ✅ not `border-radius: 12px` ❌
- Text uses `.text-h1-bold` class ✅ not inline font styles ❌

Re-verify after: new components, token updates, typography changes, spacing adjustments, bug fixes that affect appearance.

### 6. Chromatic Testing (chromatic-testing)

Run `npm run chromatic` after Storybook component changes (not for web app page changes).

**When to run:**
- Creating/modifying Storybook components
- Updating design tokens
- Changing component styles or layout

**Do NOT run for:** web app changes (`src/pages`, `src/App.jsx`), documentation-only updates.

**Review process:** Approve if changes are intentional and match Figma. Deny if unintended regression or accessibility violation introduced. Chromatic runs automatically on every GitHub push.

### 7. Flexbox First (flexbox-first-layout)

Prefer flexbox over `position: absolute/fixed/sticky` for layout.

**Correct pattern for full-height views:**
```css
.view    { display: flex; flex-direction: column; height: 100vh; overflow: hidden; }
.header  { flex-shrink: 0; }        /* Fixed at top */
.content { flex: 1; overflow-y: auto; }  /* Scrollable */
.footer  { flex-shrink: 0; }        /* Fixed at bottom */
```

**Never:** use `position: fixed` for layout, add `padding-bottom: 120px` as clearance for fixed footers, use z-index for normal stacking.

**Valid uses of `position`:** sticky inside a scroll container, modal overlays (`position: fixed; inset: 0`), floating action buttons.

### 8. Base UI Best Practices (base-ui-best-practices)

Components use `@base-ui-components/react`. Import with tree-shaking: `import { Dialog } from '@base-ui-components/react/dialog'`.

- Always forward refs and spread props on custom wrapper components
- Style states with data attributes: `.Switch[data-checked]`, `.Popup[data-starting-style]`
- Use `Field` for all labeled inputs (accessibility requirement)
- Use Base UI events (`onOpenChange`, `onValueChange`, `onPressedChange`) — not just native `onClick`
- Always style `:focus-visible` — never `outline: none`
- Use `fieldset` for radio/checkbox groups

### 9. Figma Parity Sync (figma-parity-sync)

When asked to "match", "sync", "reuse", or "apply same styles/tokens" from one module to others:
- Treat the named source module as single source of truth — do not reinterpret semantically
- Mirror: text styles, fills/strokes, spacing/radius variable bindings, component usage
- Before finishing, provide a parity audit listing: Matched, Mismatches, Reason
- If mismatches remain with no valid reason, keep iterating until parity is achieved

### 10. Figma → Storybook Parity Gate (figma-storybook-parity-gate)

For every component/pattern mapping or visual implementation:
1. Build mapping first — Storybook from `http://localhost:6006/index.json`, Figma from `user-figma-console` only
2. Extract exact Figma specs before coding (layout, spacing, size, radius, fill/stroke vars, text style, color token)
3. Reuse Storybook components — do not recreate visuals with local CSS if a documented component exists
4. No hardcoded visual values when token/style exists; justify any exception explicitly
5. Produce parity audit before completion: structure, typography, color/fill, spacing/radius, embedded component parity

**Stop conditions (do not proceed):**
- Figma-to-Storybook mapping is ambiguous
- Storybook component exists but implementation uses custom substitute
- Typography implemented with ad-hoc sizes despite existing text styles

### 11. Figma Component Binding (figma-component-binding)

When creating/editing Figma components:
- Use variable bindings, not resolved/hardcoded values
- Use existing text styles — no manual typography values
- Reject output if any fill/stroke/spacing/radius is unbound
- Return binding audit after every Figma component task:
  ```
  Element: SignIn/Card → Fill: Background/Raised, Stroke: Stroke/Weak, Radius: Corner radius/16
  Element: SignIn/Title → Text Style: <style>, Color: Text/Strong
  ```

### 12. Figma Mapping Console Only (figma-mapping-console-only)

For Storybook-Figma component mapping/inventory tasks:
- Use `user-figma-console` only — not `user-Figma Desktop`
- Workflow: get Storybook inventory → verify Figma Console connection → extract Figma inventory → build pairings
- Update `FIGMA_STORYBOOK_MAPPING.md` and `design-mapping.json` with pairings and rationale

### 13. Neon MCP for Database Tasks (neon-mcp-usage)

Use Neon MCP tools for all DB tasks — not scripts or SQL files.

| Task | Use |
|------|-----|
| Schema change | `prepare_database_migration` → test → `complete_database_migration` |
| Inspect tables | `get_database_tables`, `describe_table_schema` |
| One-off query | `run_sql` |
| Debug slow queries | `list_slow_queries`, `explain_sql_statement` |

**Never** apply schema changes directly to main branch with `run_sql`. Always use branching.

- Project ID: `rapid-wildflower-52568597`, Database: `neondb`
- MCP = dev/admin only. App runtime queries use `src/lib/dataClient.js` (Data API + RLS)

### 14. Code Quality Standards (code-quality-standards)

- Make changes file-by-file to allow review; provide all edits for a file in one chunk
- Preserve existing code and features unless explicitly requested to change
- Don't remove unrelated code or features
- Only reference real files, never placeholders
- Don't summarize changes made unless explicitly requested
- Don't suggest whitespace/indentation changes unless requested
- Don't invent changes beyond what's explicitly requested

### 15. Clean Code Principles (clean-code-principles)

- No magic numbers — use named constants or design tokens
- Meaningful names that reveal intent
- Single responsibility per function/component
- DRY — reuse through functions, not repetition
- Comment the "why", not the "what"
- Encapsulate nested conditionals into well-named functions

### 16. Conventional Commits (git-conventional-commits)

Format: `type(scope): description`

Types: `fix`, `feat`, `refactor`, `docs`, `style`, `test`, `chore`, `build`, `ci`, `perf`

Breaking changes: use `feat!:` or footer `BREAKING CHANGE: description`

Examples:
```
feat(recipes): add search by ingredient
fix(auth): handle token expiry on session restore
feat!: change API response shape for meal plans
```

### 17. Chromatic PR Failed Checks (pr-failed-checks)

When a PR has failed Chromatic checks:
1. Open the Chromatic build page and find all DENIED changes
2. Read user comments on each denied change (visual, code quality, accessibility, functionality)
3. Check Figma design with MCP Console if visual issue
4. **Present analysis with recommendations — never make changes without user approval**
5. Only implement after confirmation; commit referencing the Chromatic build number

**Never:** assume you know why something was denied, skip reading user comments, make changes before asking.

**Semantic HTML:** if it looks like H4, it should BE `<h4>`. Never use a heading level that doesn't match the visual style class.

### 18. Context7 MCP Usage (context7-mcp-usage)

Use Context7 MCP **proactively** (without being asked) for library/API documentation:
1. Call `resolve-library-id` first
2. Call `query-docs` with specific questions
3. Apply the documented approach

Trigger for: library usage questions, code generation with specific library APIs, setup/configuration, troubleshooting library errors.

### 19. Steve Jobs Design Buddy (steve-jobs-design-buddy)

Before implementing any new feature or design change, challenge decisions through the lens of simplicity and exceptional UX. Activate when user proposes: new features, UI/UX pattern changes, added complexity, architectural decisions affecting UX.

**Core principles:**
- Simplicity is the ultimate sophistication — "Does this feature truly need to exist?"
- Start with user experience, then work backwards — "Are we designing for technology or the human?"
- Question everything — "Why does it work this way currently?"
- Perfection in details — obsess over every pixel, transition, consistency
- Say no to 1,000 things — remove what doesn't serve the core experience
- Don't ship until it feels magical, not just functional

**Response format:**
```
🍎 Steve's Take:
[2-3 sharp questions challenging the proposal]
[Challenge assumptions or complexity]
[Suggest a simpler/better approach if one exists]
[Verdict: "This could be insanely great" OR "We can do better"]
```

### 20. Design System Standards (design-system-standards)

Before creating any new component, check the design systems checklist for that component type. Key areas:

**Foundations:** Color (accessibility/contrast, semantic colors, dark mode), Layout (grid, spacing units, breakpoints), Typography (responsiveness, readability, grid relation), Iconography (naming by function not appearance, accessibility labels), Elevation (shadow scale, z-index system), Motion (reduced motion support, easing, duration).

**All components must have:** proper states (hover, focus, active, disabled, error, loading), keyboard navigation, ARIA roles/labels, color contrast meeting WCAG AA.

**Key component requirements:**
- Button: focus ring (`:focus-visible`), icon-only needs `aria-label`, don't change size during loading state
- TextField/TextArea: always use `Field` wrapper for labeling, placeholder is not a label replacement
- Modal: focus trapping, Escape to close, return focus to trigger on close
- Toast: keyboard-focusable actions, don't auto-dismiss while focused, respect reduced motion
- Dropdown: dynamic positioning (never clipped), focus trapping, Escape to close

### 21. Accessibility (web-accessibility skill)

Target WCAG 2.1 Level AA compliance. Check Storybook a11y addon tab — resolve all violations before committing.

- Semantic HTML: use correct element for the visual role (H4 styled text → `<h4>`, not `<h3>`)
- All interactive elements keyboard accessible
- Color contrast: text 4.5:1 minimum, large text 3:1
- Focus indicators always visible (`:focus-visible`)
- Form inputs always have associated labels
- Icon-only buttons always have `aria-label`
- Respect `prefers-reduced-motion` for animations
