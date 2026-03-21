# Figma Rules

These rules apply **only when working with Figma as the source** — i.e., when the user asks to move a Figma design to Storybook or code, or to verify implementation against Figma.

Do NOT check Figma when the user asks to build from Storybook, from a spec, or from scratch.

## When Figma IS the Source

Use Figma Console MCP tools to extract specs:
- `figma_execute` — get component structure
- `figma_capture_screenshot` — visual reference
- `figma_get_variables` — check token bindings
- `figma_get_styles` — get typography styles

All UI derived from Figma must EXACTLY match the design. Zero tolerance for hardcoded visual values.

## Visual Verification

After any UI change:
1. Capture Figma screenshot (`figma_capture_screenshot`)
2. Run `figma_lint_design` — catches WCAG contrast, touch target size, hardcoded values
3. Test in browser (`npm run dev` → `http://localhost:5173`)
4. Compare side-by-side with Figma

## Figma Parity Sync

When asked to "match", "sync", or "apply same styles" from one module to others:
- Treat the named source module as single source of truth
- Mirror: text styles, fills/strokes, spacing/radius variable bindings, component usage
- Provide parity audit: Matched, Mismatches, Reason

## Figma → Storybook Parity Gate

For every component mapping:
1. Build mapping first — Storybook from `http://localhost:6006/index.json`, Figma from MCP
2. Extract exact Figma specs before coding
3. Reuse Storybook components — do not recreate with local CSS
4. Produce parity audit before completion

**Stop conditions:** ambiguous mapping, Storybook component exists but custom substitute used, ad-hoc typography.

## Figma Creation Preflight

Before ANY `figma_execute` code that creates/styles nodes, resolve every token:

| Need | Resolve with |
|------|-------------|
| Text style | `getLocalTextStylesAsync()` → `setTextStyleIdAsync` |
| Color/fill | `variables.getLocalVariablesAsync()` → `setBoundVariableForPaint` |
| Spacing/radius | Same variable lookup — never raw `px` |
| Icons | `figma_search_components` → `importComponentByKeyAsync` |
| Layout components | `figma_search_components` first — reuse, never recreate |

All must be resolved before proceeding. If not found, stop and ask.

## Figma Component Binding

- Use variable bindings, not hardcoded values
- Use existing text styles — no manual typography
- Return binding audit after every Figma component task

## Mapping

- Use `user-figma-console` MCP only (not Figma Desktop)
- Update `FIGMA_STORYBOOK_MAPPING.md` and `design-mapping.json` with pairings
