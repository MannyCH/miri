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
- Colors: `var(--color-text-strong)`, `var(--color-bg-surface)`, etc.
- Spacing: `var(--spacing-16)`, `var(--spacing-8)`, etc.
- Typography: CSS classes like `.text-h1-bold`, `.text-body-regular`
- Border radius: `var(--corner-radius-8)`

### Components use Base UI

Components are built on `@base-ui-components/react` primitives for accessibility. Follow existing patterns — render props, composable sub-components, no hardcoded ARIA attributes where Base UI handles them.

### Storybook HTTP API

If Storybook is running on port 6006, query it directly rather than reading story files:
```bash
curl -s http://localhost:6006/index.json   # List all stories
```
Story URL format: `http://localhost:6006/?path=/story/components-button--primary`

## Rules (from .cursor/rules/)

### Minimal Changes
Make ONLY the changes explicitly requested. Never add unrequested features, styles, animations, refactors, or error handling. If unclear, ask.

### Design Tokens — No Hardcoding
Never hardcode colors, spacing, font sizes, or border radii. Only use:
- Colors: `var(--color-text-strong)`, `var(--color-background-base)`, `var(--color-stroke-weak)`, etc.
- Spacing: `var(--spacing-4)`, `var(--spacing-8)`, `var(--spacing-16)`, etc.
- Typography: CSS classes `.text-h1-bold`, `.text-body-regular` — never set font properties inline
- Border radius: `var(--corner-radius-8)`, etc.

### Storybook as Single Source of Truth
**Phase 1:** Figma → Storybook (create components using Figma Console MCP + Base UI + tokens)
**Phase 2:** Storybook → Web App (compose pages from documented Storybook components)

Never recreate a component that already exists in Storybook. Never modify a component without updating its Storybook story.

When Storybook is running, use its HTTP API instead of reading files:
```bash
# Check if running
curl -s http://localhost:6006/index.json >/dev/null 2>&1 && echo "Running"
# Get all story IDs and URLs
curl -s http://localhost:6006/index.json
# Story URL format: http://localhost:6006/?path=/story/components-button--primary
```

### Flexbox First
Use flexbox over `position: absolute/fixed`. Structure: container `flex-direction: column; height: 100vh`, header/footer `flex-shrink: 0`, scrollable content `flex: 1; overflow-y: auto`. Valid uses of `position`: sticky inside scroll container, modal overlays, floating action buttons.

### Neon MCP for Database Tasks
Use Neon MCP tools, not scripts or SQL files:
- Schema changes: `prepare_database_migration` → test → `complete_database_migration` (never directly to main)
- One-off queries: `run_sql`
- Inspect: `get_database_tables`, `describe_table_schema`

MCP is for dev/admin only. App runtime uses `src/lib/dataClient.js`.

### Base UI Components
Components use `@base-ui-components/react`. Always forward refs and spread props. Style with data attributes (`.Switch[data-checked]`). Use `Field` for labeled inputs. Use Base UI events (`onOpenChange`, `onValueChange`). Always style `:focus-visible`.

### Commits

Use conventional commits: `type(scope): description`
Common types: `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `chore`
