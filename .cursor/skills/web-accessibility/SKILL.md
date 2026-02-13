---
name: web-accessibility
description: Enforce WCAG 2.1 Level AA accessibility standards. Catch nested interactive controls, color contrast violations, missing ARIA labels, keyboard navigation issues. Use when creating UI components, reviewing accessibility, or when Storybook a11y addon reports violations.
---

# Web Accessibility Standards

Ensure all UI components meet WCAG 2.1 Level AA standards and are accessible to users with disabilities.

## Critical Rules to Check

### 1. No Nested Interactive Controls (Serious)

**Rule:** Interactive elements must NOT contain other focusable elements.

**Impact:** Screen readers don't announce elements, creates empty tab stops

**Common Violations:**
```javascript
// ❌ BAD: Nested interactive controls
<button>
  <a href="#">Link</a>  // Nested focusable element
</button>

<div role="button" tabIndex={0}>
  <Checkbox.Root />  // Nested interactive element
</div>

<button onClick={handleClick}>
  <input type="text" />  // Nested input
</button>
```

**Solutions:**
```javascript
// ✅ GOOD: Single interactive control
<button>Submit</button>

<div role="button" tabIndex={0} aria-pressed={checked}>
  <span>Text content only</span>
</div>

// ✅ GOOD: Separate controls
<div>
  <button>Submit</button>
  <a href="#">Link</a>
</div>
```

**How to Fix:**
1. Remove nested interactive elements (buttons, links, inputs, checkboxes)
2. Use ARIA attributes on parent for state (`aria-pressed`, `aria-expanded`)
3. Handle interactions on parent element only
4. Use non-interactive children (span, div, img)

**Reference:** https://dequeuniversity.com/rules/axe/4.11/nested-interactive

---

### 2. Color Contrast (Serious)

**Rule:** Text must have sufficient contrast ratio against background

**Requirements:**
- Normal text (< 18px): 4.5:1 minimum
- Large text (≥ 18px or ≥ 14px bold): 3:1 minimum
- UI components and graphics: 3:1 minimum

**Common Violations:**
```css
/* ❌ BAD: Low contrast */
.text { 
  color: #999999;  /* 2.8:1 against white */
  background: #ffffff; 
}

/* ❌ BAD: Light text on light background */
.button {
  color: #cccccc;
  background: #f0f0f0;
}
```

**Solutions:**
```css
/* ✅ GOOD: Use design tokens with tested contrast */
.text { 
  color: var(--color-text-strong);  /* 13:1 ratio */
  background: var(--color-background-base); 
}

/* ✅ GOOD: High contrast combinations */
.button {
  color: var(--color-text-inverted);  /* White */
  background: var(--color-fill-brand-strong);  /* Dark brown */
}
```

**How to Check:**
- Use Storybook a11y addon (automatic)
- Browser DevTools > Accessibility Inspector
- Contrast checker tools

---

### 3. ARIA Labels (Moderate)

**Rule:** Interactive elements without text content need accessible names

**Common Violations:**
```javascript
// ❌ BAD: Icon button without label
<button onClick={handleDelete}>
  <TrashIcon />
</button>

// ❌ BAD: Form input without label
<input type="text" placeholder="Email" />
```

**Solutions:**
```javascript
// ✅ GOOD: Icon button with aria-label
<button onClick={handleDelete} aria-label="Delete ingredient">
  <TrashIcon />
</button>

// ✅ GOOD: Input with label association
<label htmlFor="email">Email</label>
<input id="email" type="text" />

// ✅ GOOD: Base UI Field (automatic association)
<Field.Root>
  <Field.Label>Email</Field.Label>
  <Field.Control type="text" />
</Field.Root>
```

---

### 4. Keyboard Navigation (Critical)

**Rule:** All interactive elements must be keyboard accessible

**Requirements:**
- Tab order is logical
- Focus indicators are visible
- Space/Enter activate buttons
- Escape closes modals/menus
- Arrow keys navigate lists/menus

**Common Violations:**
```javascript
// ❌ BAD: div with onClick, no keyboard support
<div onClick={handleClick}>Click me</div>

// ❌ BAD: No focus indicator
.button:focus { outline: none; }
```

**Solutions:**
```javascript
// ✅ GOOD: Full keyboard support
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
  Click me
</div>

// ✅ GOOD: Visible focus indicator
.button:focus-visible {
  outline: 2px solid var(--color-stroke-focus);
  outline-offset: 2px;
}
```

---

### 5. Form Accessibility (Critical)

**Rule:** Forms must be fully accessible with proper labels and error messages

**Common Violations:**
```javascript
// ❌ BAD: No label association
<input type="text" placeholder="Username" />

// ❌ BAD: Error not associated
<input type="email" />
<span className="error">Invalid email</span>
```

**Solutions:**
```javascript
// ✅ GOOD: Base UI Field with proper association
<Field.Root>
  <Field.Label>Username</Field.Label>
  <Field.Control type="text" />
  <Field.Description>Must be 3+ characters</Field.Description>
  <Field.Error match="valueMissing">Required</Field.Error>
</Field.Root>

// ✅ GOOD: Manual association with IDs
<label htmlFor="username">Username</label>
<input 
  id="username" 
  type="text"
  aria-describedby="username-hint username-error"
  aria-invalid={hasError}
/>
<div id="username-hint">Must be 3+ characters</div>
<div id="username-error" role="alert">Invalid username</div>
```

---

## Component Checklist

Before committing any UI component, verify:

### Interactive Elements
- [ ] No nested interactive controls (buttons, links, inputs inside each other)
- [ ] All interactive elements are keyboard accessible
- [ ] Tab order is logical
- [ ] Focus indicators are visible (`:focus-visible`)

### ARIA Attributes
- [ ] Icon-only buttons have `aria-label`
- [ ] Toggle buttons have `aria-pressed`
- [ ] Expandable sections have `aria-expanded`
- [ ] Form inputs have associated labels
- [ ] Error messages use `role="alert"` or `aria-live`

### Visual
- [ ] Text contrast meets 4.5:1 minimum (normal text)
- [ ] UI components contrast meets 3:1 minimum
- [ ] Focus indicators are visible and distinct
- [ ] No color-only information (use icons/text too)

### Semantic HTML
- [ ] Use semantic elements (`<button>`, `<nav>`, `<main>`, `<article>`)
- [ ] Don't use `div` with `onClick` without proper ARIA
- [ ] Form controls are inside `<form>` elements
- [ ] Images have `alt` text (empty `alt=""` for decorative)

### Keyboard Support
- [ ] Space/Enter activate buttons
- [ ] Escape closes modals/popups
- [ ] Arrow keys navigate lists/menus
- [ ] Tab navigates in logical order
- [ ] Focus trap in modals

---

## Testing Tools

### 1. Storybook a11y Addon (Automatic)

Already installed in your project:
```javascript
// .storybook/main.js
addons: [
  "@storybook/addon-a11y",  // Automatic accessibility testing
]
```

**How to Use:**
1. Open any story in Storybook
2. Click "Accessibility" tab (bottom panel)
3. Review violations, warnings, passes
4. Fix all violations before committing

### 2. Browser DevTools

**Chrome DevTools:**
- Elements > Accessibility pane
- Lighthouse > Accessibility audit

**Firefox DevTools:**
- Inspector > Accessibility tree
- Color contrast checker

### 3. Screen Reader Testing

**Mac:** VoiceOver (Cmd+F5)
**Windows:** NVDA (free) or JAWS
**Test:** Tab through component, verify announcements

---

## Common Patterns

### Toggle Button (Checkbox Replacement)

```javascript
// ✅ Accessible toggle without nested controls
<div
  role="button"
  tabIndex={0}
  aria-pressed={checked}
  aria-label={`${checked ? 'Uncheck' : 'Check'} ${item.name}`}
  onClick={() => setChecked(!checked)}
  onKeyDown={(e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      setChecked(!checked);
    }
  }}
>
  <span className={checked ? 'checked' : ''}>{item.name}</span>
</div>

// CSS for visual feedback
.checked {
  text-decoration: line-through;
}
```

### Icon Button

```javascript
// ✅ Accessible icon button
<button
  onClick={handleDelete}
  aria-label="Delete ingredient"
>
  <TrashIcon aria-hidden="true" />
</button>
```

### Form Field (Base UI)

```javascript
// ✅ Fully accessible form field
<Field.Root>
  <Field.Label>Email address</Field.Label>
  <Field.Control 
    type="email" 
    required
    aria-describedby="email-hint"
  />
  <Field.Description id="email-hint">
    We'll never share your email
  </Field.Description>
  <Field.Error match="valueMissing">
    Email is required
  </Field.Error>
</Field.Root>
```

### Skip Link

```javascript
// ✅ Allow keyboard users to skip navigation
<a href="#main-content" className="skip-link">
  Skip to main content
</a>

<main id="main-content">
  {/* Main content */}
</main>

// CSS
.skip-link {
  position: absolute;
  left: -9999px;
}
.skip-link:focus {
  position: static;
}
```

---

## Quick Reference: Accessibility Checks

Run before committing UI components:

```bash
# 1. Visual check in Storybook
npm run storybook
# → Open Accessibility tab
# → Fix all violations

# 2. Run Chromatic (includes a11y tests)
npm run chromatic
# → Review accessibility report
# → Fix issues before approving

# 3. Keyboard test
# → Tab through component
# → Try Space, Enter, Escape, Arrow keys
# → Verify focus indicators

# 4. Screen reader test (optional but recommended)
# → Enable VoiceOver/NVDA
# → Navigate component
# → Verify proper announcements
```

---

## Resources

### Standards
- **WCAG 2.1**: https://www.w3.org/WAI/WCAG21/quickref/
- **ARIA Practices**: https://www.w3.org/WAI/ARIA/apg/

### Testing Tools
- **axe DevTools**: https://www.deque.com/axe/devtools/
- **Storybook a11y**: Already installed
- **Chromatic**: Automated accessibility testing

### Rules Database
- **Deque University**: https://dequeuniversity.com/rules/axe/4.11/
- **Your Issue**: https://dequeuniversity.com/rules/axe/4.11/nested-interactive

---

## Priority Levels

### Critical (Must Fix Before Commit)
1. ❌ Nested interactive controls
2. ❌ Missing form labels
3. ❌ No keyboard access
4. ❌ Color contrast < 3:1

### Serious (Fix Same Day)
1. ⚠️ Color contrast < 4.5:1
2. ⚠️ Missing alt text on images
3. ⚠️ No focus indicators
4. ⚠️ Missing ARIA labels on icon buttons

### Moderate (Fix Before Release)
1. ⚡ Inconsistent tab order
2. ⚡ Missing skip links
3. ⚡ No ARIA landmarks
4. ⚡ Poor error messages

---

## Key Principle

**Accessibility is not optional. It's a requirement.**

- Run a11y addon on every component story
- Fix all violations before committing
- Test with keyboard navigation
- Use semantic HTML and ARIA attributes
- Never compromise accessibility for visual design
