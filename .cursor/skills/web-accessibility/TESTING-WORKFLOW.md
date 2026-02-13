# Accessibility Testing Workflow

Step-by-step process for testing accessibility in Storybook components.

## Phase 1: Development (Before Committing)

### Step 1: Check Storybook a11y Addon

```bash
# 1. Open Storybook
npm run storybook

# 2. Navigate to your component story
# Example: http://localhost:6006/?path=/story/components-ingredientlistitem--list

# 3. Open Accessibility tab (bottom panel)
# Look for:
# - Violations (red): MUST FIX
# - Passes (green): Good!
# - Incomplete (yellow): Manual review needed
```

### Step 2: Review Each Violation

**Click on each violation to see:**
- Description of the issue
- Which element is affected
- How to fix it
- WCAG criterion violated

**Common violations in this project:**
1. nested-interactive
2. color-contrast
3. button-name
4. label

### Step 3: Fix Violations

Use the [COMMON-VIOLATIONS.md](COMMON-VIOLATIONS.md) reference for quick fixes.

**For nested-interactive:**
```javascript
// Remove nested Checkbox, Button, or Link
// Use single interactive element with ARIA
```

**For color-contrast:**
```css
/* Use design tokens instead of hardcoded colors */
color: var(--color-text-strong);
```

**For button-name:**
```javascript
// Add aria-label to icon buttons
<button aria-label="Delete">
  <TrashIcon />
</button>
```

### Step 4: Re-test

After fixing:
1. Refresh Storybook story
2. Check Accessibility tab again
3. Violations should be 0
4. Repeat until all violations resolved

---

## Phase 2: Automated Testing (Chromatic)

### Step 1: Run Chromatic

```bash
npm run chromatic
```

Chromatic runs accessibility audits automatically:
- Tests all stories
- Captures accessibility violations
- Shows before/after comparisons
- Reports to dashboard

### Step 2: Review Chromatic Dashboard

```
https://www.chromatic.com
```

**Check for:**
- Accessibility score (aim for 100%)
- New violations introduced
- Regression in accessibility

### Step 3: Approve or Fix

**If violations found:**
1. Review violation details in Chromatic
2. Fix issues in code
3. Re-run Chromatic
4. Approve when clean

**If no violations:**
1. Approve the build
2. Proceed with commit

---

## Phase 3: Keyboard Testing

### Manual Keyboard Test

```
1. Open component in Storybook
2. Use only keyboard (no mouse)
3. Test all interactions:
   - Tab: Navigate to all interactive elements
   - Shift+Tab: Navigate backwards
   - Space: Activate buttons/checkboxes
   - Enter: Activate buttons/links
   - Escape: Close modals/menus
   - Arrow keys: Navigate lists/menus
   - Home/End: First/last item
```

### Expected Behavior

**All Interactive Elements:**
- [ ] Can be reached with Tab
- [ ] Have visible focus indicator
- [ ] Can be activated with Space or Enter
- [ ] Tab order is logical (top to bottom, left to right)

**Modals/Overlays:**
- [ ] Focus trapped inside modal
- [ ] Escape key closes modal
- [ ] Focus returns to trigger element after close

**Lists/Menus:**
- [ ] Arrow keys navigate items
- [ ] Home/End go to first/last
- [ ] Type-ahead search works (if applicable)

---

## Phase 4: Screen Reader Testing (Optional)

### Mac: VoiceOver

```bash
# Enable: Cmd+F5
# Navigate: Tab or Control+Option+Arrow keys
# Read: Control+Option+A (read all)
# Stop: Control key
```

**Test Checklist:**
- [ ] All elements are announced
- [ ] Button/link purpose is clear
- [ ] Form labels are read with inputs
- [ ] Checked/unchecked state is announced
- [ ] Error messages are announced

### Windows: NVDA

```bash
# Download: https://www.nvaccess.org/download/
# Enable: Control+Alt+N
# Navigate: Tab or Arrow keys
# Read: Insert+Down arrow
# Stop: Insert key
```

---

## Component-Specific Tests

### IngredientListItem

**Interactive Element:**
```
role="button"
aria-pressed={checked}
aria-label="Check/Uncheck [ingredient]"
```

**Test:**
1. Tab to item
2. Space to toggle
3. Delete key to remove
4. Swipe left to delete (touch)

**Expected Announcement:**
- "Check 2l Milch, button, not pressed"
- After toggle: "Uncheck 2l Milch, button, pressed"

### Button Component

**Test:**
1. Tab to button
2. Space or Enter to activate
3. Focus indicator visible

**Expected Announcement:**
- "[Button text], button"

### SearchBar Component

**Test:**
1. Tab to input
2. Type text
3. Tab to icon button (if present)
4. Verify label association

**Expected Announcement:**
- "Search, edit text" (or similar based on label)

### NavigationBar

**Test:**
1. Tab through all nav items
2. Space/Enter to activate
3. Verify active state is announced

**Expected Announcement:**
- "Planning, button" (or "Planning, button, selected")

---

## Regression Prevention

### Before Every Commit

```bash
# 1. Storybook a11y check
npm run storybook
# → Check Accessibility tab
# → Violations must be 0

# 2. Keyboard test
# → Tab through component
# → Verify all interactions work

# 3. Commit only if clean
git commit -m "fix(a11y): description"
```

### After Every Push

```bash
# Chromatic runs automatically on GitHub
# Check: https://github.com/MannyCH/miri/actions
# Review accessibility report in Chromatic dashboard
```

---

## Tools & Resources

### Installed Tools
- ✅ `@storybook/addon-a11y` - Automatic testing in Storybook
- ✅ `@chromatic-com/storybook` - Visual + a11y regression testing
- ✅ `chromatic` CLI - Manual testing

### Browser Extensions (Recommended)
- **axe DevTools**: https://www.deque.com/axe/devtools/
- **WAVE**: https://wave.webaim.org/extension/
- **Lighthouse**: Built into Chrome DevTools

### Screen Readers
- **VoiceOver**: Free, built into macOS
- **NVDA**: Free, Windows download
- **JAWS**: Paid, Windows

### Contrast Checkers
- **WebAIM Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **Coolors Contrast Checker**: https://coolors.co/contrast-checker
- **Chrome DevTools**: Built-in contrast ratio display

---

## Emergency Checklist

If Storybook a11y addon shows violations:

```
1. nested-interactive
   → Remove nested button/link/input/checkbox
   → Use aria-pressed on parent

2. color-contrast
   → Use design tokens: var(--color-text-strong)
   → Never hardcode colors

3. button-name
   → Add aria-label to icon buttons
   → Use descriptive text

4. label
   → Wrap with Field.Root
   → Or use <label htmlFor={id}>

5. link-name
   → Add descriptive text or aria-label

6. image-alt
   → Add meaningful alt text
   → Use alt="" for decorative images

7. focus-visible
   → Add :focus-visible { outline: 2px solid ... }
```

---

## Success Criteria

Component is accessible when:
- ✅ Storybook a11y addon: 0 violations
- ✅ Keyboard test: All interactions work
- ✅ Chromatic: Accessibility score 100%
- ✅ Screen reader: All elements announced correctly
- ✅ Visual: Focus indicators visible
- ✅ Code: No hardcoded colors, proper ARIA attributes

**Only commit when all criteria are met.**
