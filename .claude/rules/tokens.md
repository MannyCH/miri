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

### Colors

Use semantic tokens — never primitives, never hardcoded hex.

```css
color: var(--color-text-strong)         /* primary text */
color: var(--color-text-weak)           /* secondary/muted text */
color: var(--color-text-error)          /* error state — also used for "danger" */
background: var(--color-fill-brand-weak)
border-color: var(--color-stroke-error-strong)
```

**Note:** "danger" and "destructive" map to the `error` token family — `--color-text-error`, `--color-fill-error-strong`, `--color-stroke-error-strong`, etc. There is no separate "danger" token.

### Spacing

Prefer **intent aliases** over raw scale values. Only use raw scale (`--spacing-N`) when no alias fits.

| Intent | Token | Use when |
|--------|-------|----------|
| Inset XS | `--spacing-inset-xs` | Badges, chips, tags |
| Inset SM | `--spacing-inset-sm` | Icon buttons, small cells |
| Inset MD | `--spacing-inset-md` | Cards, inputs, list items |
| Inset LG | `--spacing-inset-lg` | Page sections, modals |
| Inset XL | `--spacing-inset-xl` | Hero areas, empty states |
| Gap XS | `--spacing-gap-xs` | Icon + label, inline pairs |
| Gap SM | `--spacing-gap-sm` | Button clusters, form rows |
| Gap MD | `--spacing-gap-md` | Card grids, list gaps |
| Gap LG | `--spacing-gap-lg` | Loose section content |
| Stack SM | `--spacing-stack-sm` | Label + input, title + subtitle |
| Stack MD | `--spacing-stack-md` | Form fields, content blocks |
| Stack LG | `--spacing-stack-lg` | Section-level stacking |

### Border Radius

Prefer **intent aliases** over raw scale values.

| Intent | Token | Use when |
|--------|-------|----------|
| Badge | `--corner-radius-badge` | Badges, tags, chips |
| Input | `--corner-radius-input` | Text inputs, selects |
| Button | `--corner-radius-button` | Buttons, interactive controls |
| Card | `--corner-radius-card` | Cards, sheets, list containers |
| Modal | `--corner-radius-modal` | Modals, dialogs, bottom sheets |
| Pill | `--corner-radius-pill` | Full-round / pill shapes |

### Typography

CSS classes only — never set font properties directly.

```css
class="text-h1-bold"          /* page titles */
class="text-h3-bold"          /* section headers */
class="text-body-regular"     /* body copy */
class="text-body-small-bold"  /* labels, captions */
class="text-annotation-regular" /* helper text, metadata */
class="text-tiny-regular"     /* timestamps, micro labels */
```

### Elevation

```css
box-shadow: var(--elevation-raised)   /* cards, buttons */
box-shadow: var(--elevation-overlay)  /* modals, dropdowns */
box-shadow: var(--elevation-sunken)   /* pressed/inset states */
```

## Mandatory Checks

```
color: var(--color-text-strong)         ✅  not  color: #260B00          ❌
padding: var(--spacing-inset-md)        ✅  not  padding: 16px           ❌
gap: var(--spacing-gap-sm)              ✅  not  gap: 8px                ❌
border-radius: var(--corner-radius-card) ✅  not  border-radius: 12px   ❌
class="text-h1-bold"                    ✅  not  font-size: 24px         ❌
```

## CSS Value Traceability

Every spacing, margin, padding, and border-radius value must be traced to either:
- A design token (`var(--spacing-*)`, `var(--corner-radius-*)`)
- An explicit Figma spec via `figma_execute` or `figma_capture_screenshot`
- A Storybook story via MCP or HTTP API

**Never** write a raw pixel value for spacing or radius. If the token doesn't exist, stop and ask.
