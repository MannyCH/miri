---
paths:
  - "src/**/*.css"
  - "src/**/*.jsx"
---

# Design Tokens

All visual values come from CSS variables. **Never hardcode colors, spacing, font sizes, or border radii.**

## Token Files

| File | Contents |
|------|----------|
| `src/design-tokens.css` | Colors, spacing, border radius |
| `src/typography-tokens.css` | Font styles as CSS classes |
| `src/elevation-tokens.css` | Shadows, z-index |

## Usage

**Colors:** `var(--color-text-strong)`, `var(--color-background-base)`, `var(--color-stroke-weak)`, `var(--color-icon-brand)`, etc.

**Spacing:** `var(--spacing-4)`, `var(--spacing-8)`, `var(--spacing-16)`, etc.

**Typography:** CSS classes `.text-h1-bold`, `.text-body-regular`, `.text-annotation-bold` — never set font properties directly in CSS.

**Border radius:** `var(--corner-radius-4)`, `var(--corner-radius-8)`, `var(--corner-radius-12)`, etc.

## Mandatory Checks

```
color: var(--color-text-strong)       ✅  not  color: #260B00          ❌
padding: var(--spacing-16)            ✅  not  padding: 16px           ❌
border-radius: var(--corner-radius-12) ✅  not  border-radius: 12px    ❌
class="text-h1-bold"                  ✅  not  font-size: 24px         ❌
```

## CSS Value Traceability

Every spacing, margin, padding, and border-radius value must be traced to either:
- A design token (`var(--spacing-*)`, `var(--corner-radius-*)`)
- An explicit Figma spec via `figma_execute` or `figma_capture_screenshot`
- A Storybook story via MCP or HTTP API

**Never** write a raw pixel value for spacing or radius. If the token doesn't exist, stop and ask.
