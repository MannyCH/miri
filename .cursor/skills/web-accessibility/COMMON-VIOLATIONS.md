# Common Accessibility Violations & Fixes

Quick reference for the most common accessibility issues found in React/Base UI components.

## Nested Interactive Controls

### Violation Pattern
```javascript
// Container with role="button" containing Checkbox
<div role="button" tabIndex={0}>
  <Checkbox.Root checked={checked} onCheckedChange={onChange} />
  <span>Item text</span>
</div>
```

### Why It's Wrong
- Screen reader doesn't announce the element
- Creates empty tab stop
- User Impact: Serious
- WCAG: 4.1.2 (A)

### Fix
```javascript
// Remove nested checkbox, use aria-pressed on parent
<div 
  role="button" 
  tabIndex={0}
  aria-pressed={checked}
  aria-label={`${checked ? 'Uncheck' : 'Check'} ${text}`}
  onClick={() => onChange(!checked)}
  onKeyDown={(e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange(!checked);
    }
  }}
>
  <span>{text}</span>
</div>
```

---

## Icon Button Without Label

### Violation Pattern
```javascript
// Icon button with no accessible name
<button onClick={handleDelete}>
  <TrashIcon />
</button>
```

### Why It's Wrong
- Screen reader announces "button" with no context
- User doesn't know what the button does
- User Impact: Serious

### Fix
```javascript
// Add aria-label
<button onClick={handleDelete} aria-label="Delete ingredient">
  <TrashIcon aria-hidden="true" />
</button>

// Or use visible text with icon
<button onClick={handleDelete}>
  <TrashIcon aria-hidden="true" />
  <span>Delete</span>
</button>
```

---

## Low Color Contrast

### Violation Pattern
```css
/* Gray text on white: 2.8:1 ratio */
.text {
  color: #999999;
  background: #ffffff;
}

/* Light brown on beige: 2.1:1 ratio */
.label {
  color: #D4A574;
  background: #F5E6D3;
}
```

### Why It's Wrong
- Hard to read for users with low vision
- Fails WCAG 2.1 Level AA
- User Impact: Serious

### Fix
```css
/* Use design tokens with tested contrast */
.text {
  color: var(--color-text-strong);  /* #260B00: 13:1 */
  background: var(--color-background-base);
}

/* Or use contrast-safe combinations */
.label {
  color: #000000;  /* Black: 21:1 */
  background: #FFFFFF;
}
```

---

## Form Input Without Label

### Violation Pattern
```javascript
// Placeholder is NOT a label
<input type="email" placeholder="Your email" />

// Title attribute is NOT a label
<input type="email" title="Email address" />
```

### Why It's Wrong
- Screen readers can't associate input with its purpose
- Placeholder disappears when typing
- User Impact: Critical

### Fix
```javascript
// Use Base UI Field (recommended)
<Field.Root>
  <Field.Label>Email address</Field.Label>
  <Field.Control type="email" required />
  <Field.Description>We'll never share your email</Field.Description>
</Field.Root>

// Or use label element with htmlFor
<label htmlFor="email">Email address</label>
<input id="email" type="email" required />
```

---

## Missing Focus Indicator

### Violation Pattern
```css
/* Removes focus indicator */
button:focus {
  outline: none;
}

.interactive-element:focus {
  outline: 0;
}
```

### Why It's Wrong
- Keyboard users can't see where focus is
- Critical for keyboard navigation
- User Impact: Critical

### Fix
```css
/* Use :focus-visible for keyboard-only focus */
button:focus-visible {
  outline: 2px solid var(--color-stroke-focus);
  outline-offset: 2px;
  border-radius: var(--corner-radius-4);
}

/* Or use custom focus style */
.interactive-element:focus-visible {
  box-shadow: 0 0 0 3px var(--color-stroke-focus);
}
```

---

## Image Without Alt Text

### Violation Pattern
```javascript
// No alt attribute
<img src="recipe.jpg" />

// Alt with "image of" prefix (redundant)
<img src="recipe.jpg" alt="Image of salmon" />
```

### Fix
```javascript
// Descriptive alt text
<img src="recipe.jpg" alt="Salmon with tomato and asparagus" />

// Empty alt for decorative images
<img src="pattern.svg" alt="" role="presentation" />

// Icon with aria-hidden
<TrashIcon aria-hidden="true" />
```

---

## Non-semantic Interactive Elements

### Violation Pattern
```javascript
// div used as button without proper ARIA
<div className="button" onClick={handleClick}>
  Submit
</div>

// span used as link
<span className="link" onClick={handleNavigate}>
  Go to page
</span>
```

### Fix
```javascript
// Use semantic HTML
<button onClick={handleClick}>
  Submit
</button>

<a href="/page" onClick={handleNavigate}>
  Go to page
</a>

// If you MUST use div, add full ARIA
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleClick();
    }
  }}
>
  Submit
</div>
```

---

## Testing Checklist

Use this checklist for every component:

```markdown
## Accessibility Testing Checklist

### Storybook a11y Addon
- [ ] Open component story in Storybook
- [ ] Check Accessibility tab for violations
- [ ] All violations: 0
- [ ] All passes: Green

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Space/Enter activate buttons
- [ ] Escape closes overlays
- [ ] Arrow keys work in lists/menus
- [ ] Focus indicators are visible

### Screen Reader (Optional)
- [ ] All elements are announced
- [ ] Button/link purpose is clear
- [ ] Form labels are read correctly
- [ ] Error messages are announced

### Visual
- [ ] Color contrast is sufficient
- [ ] Focus indicators are visible
- [ ] No color-only information
```

---

## Quick Fixes by Violation Type

| Violation | Quick Fix |
|-----------|-----------|
| nested-interactive | Remove nested element, use aria-pressed |
| button-name | Add aria-label to button |
| color-contrast | Use design tokens with tested contrast |
| label | Wrap with Field.Root or add htmlFor |
| link-name | Add descriptive text or aria-label |
| image-alt | Add meaningful alt text |
| focus-visible | Add :focus-visible style with outline |

---

## False Positives & Safe Exceptions

### 1. Color Contrast on Sticky/Fixed Elements

**Error Message:**
```
"Element's background color could not be determined because it partially overlaps other elements"
```

**Why This Happens:**
- Element has `position: sticky` or `position: fixed`
- Element has explicit `background` color
- Element has `z-index` that layers it above content
- Automated checker can't determine what's underneath

**How to Verify It's a False Positive:**
```css
/* Check the element has explicit background */
.element {
  position: sticky;
  background: var(--color-background-base); /* Explicit white background */
  color: var(--color-text-strong);          /* Dark text */
  z-index: 10;
}
```

**If both colors are design tokens with known good contrast, it's safe to ignore.**

**How to Disable in Storybook:**
```javascript
export default {
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            selector: '.recipe-detail-title',
            enabled: false,
          },
        ],
      },
    },
  },
};
```

**Always document WHY you're disabling:**
```javascript
// Disable contrast check for sticky title (false positive)
// Reason: Checker can't determine background due to position:sticky + z-index
// Verified: Text #260B00F2 (dark brown) on #FFFFFF (white) = 13:1 contrast
```

---

### 2. Heading Order (Skipping Levels)

**Error Message:**
```
"Heading levels should only increase by one"
```

**Why This Happens:**
- HTML uses h1 → h3 without an h2 in between
- Checker expects strict sequential order (h1, h2, h3, h4...)
- This is sometimes a valid design pattern when using headings for semantic grouping

**When It's Safe to Ignore:**
✅ **Visual hierarchy is maintained through design tokens (not heading levels)**
```jsx
<h1 className="text-h1-bold">Shopping list</h1>
{/* ... */}
<h3 className="text-body-base-bold">{group.recipeName}</h3>
```
In this example:
- h1 is the page title (visually prominent)
- h3 is used for semantic grouping (recipe names within sections)
- Visual hierarchy comes from typography classes, not heading levels
- Screen readers still understand the structure

✅ **The component doesn't have a logical h2 level**
- Some patterns don't need intermediate heading levels
- h3 is used to group content within a section, not to indicate a sub-level

**When You MUST Fix It:**
❌ Don't ignore if:
- You're creating a long-form document (blog post, article, docs)
- The visual hierarchy suggests there should be an h2
- Screen readers would benefit from the intermediate level

**How to Disable in Storybook:**
```javascript
export default {
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'heading-order',
            enabled: false,
          },
        ],
      },
    },
  },
};
```

**Always document WHY you're disabling:**
```javascript
// Disable heading-order check (safe to ignore for this pattern)
// Reason: h3 is used for semantic grouping (recipe names) within sections
// Visual hierarchy is maintained through typography tokens, not heading levels
```

---

## Resources

- **Deque University Rules**: https://dequeuniversity.com/rules/axe/4.11/
- **WCAG Quick Reference**: https://www.w3.org/WAI/WCAG21/quickref/
- **ARIA Authoring Practices**: https://www.w3.org/WAI/ARIA/apg/
- **Base UI Accessibility**: https://base-ui.com/accessibility
- **WebAIM Contrast Checker**: https://webaim.org/resources/contrastchecker/ (verify false positives)
