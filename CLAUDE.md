# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

For detailed rules, see `AGENTS.md` which routes to modular rule files in `.claude/rules/`.

## Commands

```bash
npm run dev          # Start dev server (http://localhost:5173)
npm run storybook    # Start Storybook (http://localhost:6006)
npm run build        # Production build → dist/
npm run chromatic    # Run visual regression + accessibility tests
npm run preview      # Preview production build
```

No traditional unit test suite. Component testing happens via Storybook stories + Chromatic.

## Architecture

**Miri** is a React 19 + Vite SPA for meal planning. Hosted on Vercel with serverless API functions in `/api/`. Backend is Neon Postgres with Neon Auth.

### Development Workflow

Components can originate from multiple sources — Figma, Storybook, or direct code. The user will specify which. Key principles:

- **From Figma:** When the user says to move a Figma design to code, check Figma MCP for specs.
- **From Storybook:** When building app pages, check if a Storybook component already exists before creating a new one.
- **Direct code:** Only when no existing component covers the use case.
- **Always reuse:** If a component exists (Button, Divider, etc.), use it. Always use design tokens and typography classes — no exceptions.

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

All visual values come from CSS variables in `src/design-tokens.css`, `src/typography-tokens.css`, and `src/elevation-tokens.css`. Never hardcode colors, spacing, font sizes, or border radii. See `.claude/rules/tokens.md` for full reference.

## MCP Servers

| Server | Scope | Availability |
|--------|-------|-------------|
| **Storybook** | project (`.mcp.json`) | `http://localhost:6006/mcp` — requires Storybook running |
| **Figma Console** | user | Always connected |
| **Neon** | user | Always connected |
| **Context7** | user | Always connected — use proactively for library docs |

## Key Rules (detailed in `.claude/rules/`)

1. **Minimal changes** — only what's requested, never add unrequested features
2. **Design tokens** — never hardcode visual values
3. **Reuse existing components** — check Storybook before creating new ones in app code
4. **Neon MCP for DB** — always use branching for migrations
5. **Conventional commits** — `type(scope): description`
6. **Accessibility** — WCAG 2.1 AA, semantic HTML, keyboard navigation
7. **Steve Jobs Design Buddy** — challenge complexity, favor simplicity
