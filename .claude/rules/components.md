---
paths:
  - "src/components/**"
  - "src/patterns/**"
---

# Component Development Rules

## Component Workflow

Work can start from any source. The user will tell you which one:

| User says | What to do |
|-----------|-----------|
| "Move this from Figma to Storybook" | Check Figma MCP for specs, then build the Storybook component |
| "Build this component in Storybook" | Build from user's description/specs. No need to check Figma first. |
| "Build this in the app" | Check if a Storybook component already exists. If yes, reuse it. Only create new components if nothing existing covers the use case. |
| "Add a story for this component" | Component already exists in code — create the `.stories.jsx` for it. |

**The rule is simple:** only check Figma when the user explicitly references Figma as the source. Only check Storybook when building app-level code where reuse is possible.

## Non-Negotiable Defaults

Regardless of source or workflow, these always apply:
- **Always use design tokens** — colors, spacing, radius, elevation. Never hardcode.
- **Always use typography classes** — `.text-h1-bold`, `.text-body-regular`, etc. Never set font properties directly.
- **Always reuse existing components** — if a Button, Divider, SearchBar, etc. exists, use it. Only create new components when nothing existing covers the use case.

## Preflight — Check for Existing Components

Before writing ANY component usage (new or existing):
1. If Storybook is running, check `curl -s http://localhost:6006/index.json` for existing components
2. If an existing component covers the use case — even partially — reuse it. Don't recreate.
3. Any `<button>` written by hand → stop and check if `Button` component exists first
4. Any inline color, spacing, or radius value → stop and look up the token
5. **For any component with string-typed props (variant, size, type, etc.) — check its Storybook stories to confirm valid values and their intended use before writing JSX.** Never guess or invent prop values.

## Storybook HTTP API

When Storybook is running, use its HTTP API — never read story files directly:
```bash
curl -s http://localhost:6006/index.json  # Get all story IDs and metadata
```

**Completion audit (when working on components):**
- Component reuse: confirmed (if applicable)
- Typography classes: confirmed
- Token usage (color/spacing/radius): confirmed
- Hardcoded visual overrides: none

## Base UI Best Practices

Components use `@base-ui-components/react`. Import with tree-shaking:
```js
import { Dialog } from '@base-ui-components/react/dialog';
```

- Always forward refs and spread props on wrapper components
- Style states with data attributes: `.Switch[data-checked]`
- Use `Field` for all labeled inputs (accessibility)
- Use Base UI events (`onOpenChange`, `onValueChange`) — not just `onClick`
- Always style `:focus-visible` — never `outline: none`
- Use `fieldset` for radio/checkbox groups

## Design System Standards

**All components must have:** proper states (hover, focus, active, disabled, error, loading), keyboard navigation, ARIA roles/labels, color contrast meeting WCAG AA.

**Key requirements:**
- Button: focus ring (`:focus-visible`), icon-only needs `aria-label`, don't change size during loading
- TextField/TextArea: always use `Field` wrapper, placeholder is not a label replacement
- Modal: focus trapping, Escape to close, return focus to trigger on close
- Toast: keyboard-focusable actions, don't auto-dismiss while focused, respect reduced motion
- Dropdown: dynamic positioning, focus trapping, Escape to close

## Layout

Prefer flexbox over `position: absolute/fixed/sticky`.

```css
.view    { display: flex; flex-direction: column; height: 100vh; overflow: hidden; }
.header  { flex-shrink: 0; }
.content { flex: 1; overflow-y: auto; }
.footer  { flex-shrink: 0; }
```

**Never:** `position: fixed` for layout, `padding-bottom` hacks for fixed footers, z-index for normal stacking.

## Dynamic Content

- Test components with real data at initial render, not just empty state
- Auto-resize patterns must work without user interaction — use `useLayoutEffect`
- Verify: no clipping, no overflow-hidden text, correct spacing on populated rows

## Shared CSS Class Audit

When a CSS class is applied to multiple elements:
- Verify the full ruleset is correct for **every** element using it
- If any element needs an exception, use a modifier class — never a late override
