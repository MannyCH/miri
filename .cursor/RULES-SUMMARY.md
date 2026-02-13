# Cursor Rules Summary

This document maps your goals to the Cursor rules that enforce them.

## Your Development Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                    PHASE 1: Component Library                    │
│                                                                   │
│  Figma Design                                                    │
│      ↓                                                           │
│  [Use Figma Console MCP]                                        │
│      ↓                                                           │
│  Extract: Typography, Colors, Spacing, Structure                │
│      ↓                                                           │
│  Implement with Base UI + Design Tokens                         │
│      ↓                                                           │
│  Document in Storybook (Stories + Props)                        │
│      ↓                                                           │
│  Verify: Storybook matches Figma                                │
│                                                                   │
│  Rules: figma-design-consistency, base-ui-best-practices,       │
│         visual-verification, storybook-workflow                  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    Storybook = Single Source of Truth
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    PHASE 2: Web Application                      │
│                                                                   │
│  Storybook Docs                                                  │
│      ↓                                                           │
│  [Use Storybook MCP]                                            │
│      ↓                                                           │
│  Find: Existing components to reuse                             │
│      ↓                                                           │
│  Import & Compose: Build patterns from components               │
│      ↓                                                           │
│  Build: Web app pages/features                                  │
│      ↓                                                           │
│  Verify: App uses components correctly                          │
│                                                                   │
│  Rules: storybook-workflow, minimal-changes,                    │
│         visual-verification, code-quality-standards             │
└─────────────────────────────────────────────────────────────────┘
```

## Your Goals & Coverage

### ✅ Goal 1: Constant Visual Design Consistency

**Rules Enforcing This:**
- `figma-design-consistency.mdc` (NEW) - Mandates exact Figma matching
- `storybook-workflow.mdc` - Requires Storybook as single source of truth
- `base-ui-best-practices.mdc` - Ensures consistent component patterns

**How They Work Together:**
1. Always check Figma before implementing (`figma-design-consistency.mdc`)
2. Use Storybook components as building blocks (`storybook-workflow.mdc`)
3. Follow Base UI patterns for consistency (`base-ui-best-practices.mdc`)

---

### ✅ Goal 2: High Code Quality

**Rules Enforcing This:**
- `code-quality-standards.mdc` - Code review standards
- `clean-code-principles.mdc` - DRY, single responsibility, meaningful names
- `git-conventional-commits.mdc` - Clean commit history
- `base-ui-best-practices.mdc` - React/accessibility best practices

**How They Work Together:**
1. Write clean, maintainable code (`clean-code-principles.mdc`)
2. Follow strict quality standards (`code-quality-standards.mdc`)
3. Use semantic commits (`git-conventional-commits.mdc`)
4. Implement accessible components (`base-ui-best-practices.mdc`)

---

### ✅ Goal 3: No Random Changes Between Iterations

**Rules Enforcing This:**
- `minimal-changes.mdc` (NEW) - Zero tolerance for scope creep
- `code-quality-standards.mdc` - "Preserve existing code unless explicitly requested"
- `figma-design-consistency.mdc` - "Never add styles not present in Figma"

**How They Work Together:**
1. Only make requested changes (`minimal-changes.mdc`)
2. Don't remove unrelated code (`code-quality-standards.mdc`)
3. Don't add unrequested features (`minimal-changes.mdc`)
4. Stick to Figma designs (`figma-design-consistency.mdc`)

---

### ✅ Goal 4: Visual Accuracy (Browser = Figma)

**Rules Enforcing This:**
- `visual-verification.mdc` (NEW) - Mandatory visual testing
- `figma-design-consistency.mdc` - Exact Figma matching
- `storybook-workflow.mdc` - Component verification in Storybook

**How They Work Together:**
1. Capture Figma screenshot before implementing (`visual-verification.mdc`)
2. Use exact design tokens (`figma-design-consistency.mdc`)
3. Test in browser and compare (`visual-verification.mdc`)
4. Verify in Storybook (`storybook-workflow.mdc`)

---

### ✅ Goal 5: Correct Token Usage (No Hardcoded Values)

**Rules Enforcing This:**
- `figma-design-consistency.mdc` - "NEVER hardcode visual properties"
- `clean-code-principles.mdc` - "Avoid hard-coded numbers"
- `visual-verification.mdc` - Token usage verification checklist

**How They Work Together:**
1. Always use design tokens for:
   - Colors: `var(--color-text-strong)`
   - Spacing: `var(--spacing-16)`
   - Typography: `.text-h1-bold`
   - Border radius: `var(--corner-radius-8)`
2. Zero tolerance for hardcoded values (`figma-design-consistency.mdc`)
3. Verification checklist before commit (`visual-verification.mdc`)

---

### ✅ Goal 6: No Random Additions

**Rules Enforcing This:**
- `minimal-changes.mdc` (NEW) - "If user didn't ask, don't add it"
- `code-quality-standards.mdc` - "Don't invent changes beyond request"
- `figma-design-consistency.mdc` - "Zero tolerance: never add styles not in Figma"

**How They Work Together:**
1. Surgical changes only (`minimal-changes.mdc`)
2. No unrequested features, styles, or "improvements" (`minimal-changes.mdc`)
3. Only implement what's in Figma (`figma-design-consistency.mdc`)
4. Focus on requested changes only (`code-quality-standards.mdc`)

---

## All Rules & Skills

### Rules (Automatic Enforcement)

| Rule | Purpose | Always Applied |
|------|---------|----------------|
| `figma-design-consistency.mdc` | Enforce exact Figma matching with design tokens | ✅ Yes |
| `visual-verification.mdc` | Mandatory browser testing and visual comparison | ✅ Yes |
| `chromatic-testing.mdc` | Automated visual regression and accessibility testing | ✅ Yes |
| `minimal-changes.mdc` | Prevent scope creep and random additions | ✅ Yes |
| `storybook-workflow.mdc` | Use Storybook as single source of truth | ✅ Yes |
| `base-ui-best-practices.mdc` | Ensure accessible, composable components | No (only .tsx/.jsx) |
| `code-quality-standards.mdc` | High code quality and clear communication | ✅ Yes |
| `clean-code-principles.mdc` | DRY, single responsibility, meaningful names | ✅ Yes |
| `git-conventional-commits.mdc` | Semantic commit messages | ✅ Yes |
| `context7-mcp-usage.mdc` | Auto-use Context7 for library docs | ✅ Yes |

### Skills (Specialized Knowledge)

| Skill | Purpose | When Applied |
|-------|---------|--------------|
| `web-accessibility` | WCAG 2.1 Level AA compliance, catch a11y violations | Creating UI, reviewing accessibility, when a11y addon shows violations |

---

## Two-Phase Development Workflow

### Phase 1: Figma → Storybook (Component Library)

**Purpose:** Create and document reusable components

```
1. CHECK FIGMA
   ├─ Use: figma_execute, figma_capture_screenshot
   ├─ Use: figma_get_variables, figma_get_styles
   └─ Verify: tokens, typography, spacing, colors, structure

2. IMPLEMENT WITH BASE UI + TOKENS
   ├─ Use: Base UI components (@base-ui/react)
   ├─ Use: var(--color-*), var(--spacing-*), .text-*
   └─ Never: hardcoded colors, spacing, fonts

3. DOCUMENT IN STORYBOOK
   ├─ Create: Component stories (CSF3 format)
   ├─ Document: Props, variants, usage examples
   └─ Verify: All states and variants shown

4. VERIFY IN STORYBOOK
   ├─ Run: npm run storybook
   ├─ Compare: Storybook vs Figma screenshot
   └─ Check: Typography, colors, spacing, layout

5. CHECK ACCESSIBILITY (Required)
   ├─ Check: Storybook a11y addon tab
   ├─ Fix: All violations (nested controls, contrast, labels)
   ├─ Test: Keyboard navigation
   └─ Verify: 0 violations before proceeding

6. RUN CHROMATIC (Automated Testing)
   ├─ Run: npm run chromatic
   ├─ Review: Visual changes, accessibility issues
   └─ Approve: If changes are intentional

7. COMMIT
   ├─ Use: Conventional commit format
   └─ Scope: Only requested changes
```

### Phase 2: Storybook → Web App (Application)

**Purpose:** Build web application using documented components

```
1. CHECK STORYBOOK FIRST
   ├─ Use: Storybook MCP (list-all-documentation, get-documentation)
   └─ Find: Existing components to reuse

2. COMPOSE FROM STORYBOOK COMPONENTS
   ├─ Import: Documented components from Storybook
   ├─ Use: Props and APIs as documented
   └─ Never: Recreate components or modify without updating Storybook

3. BUILD PATTERNS
   ├─ Compose: Multiple Storybook components
   ├─ Document: Patterns in Storybook too
   └─ Example: MealPlanningView = CalendarWeek + RecipeListItem + NavigationBar

4. VERIFY IN WEB APP
   ├─ Run: npm run dev
   ├─ Compare: App vs Storybook reference
   └─ Check: Components used correctly, props match docs

5. COMMIT
   ├─ Use: Conventional commit format
   └─ Scope: Only requested changes
```

### Key Principle

```
Figma (Design Source) 
  ↓ Phase 1: Component Creation
  ↓ Uses: Figma MCP + Base UI
  ↓
Storybook (Component Library & Single Source of Truth)
  ↓ Phase 2: App Development  
  ↓ Uses: Storybook MCP
  ↓
Web App (Final Application)
```

---

## Rule Conflicts & Resolutions

### No Conflicts Detected

All rules complement each other:
- `minimal-changes.mdc` + `figma-design-consistency.mdc` = Only implement what's in Figma
- `visual-verification.mdc` + `figma-design-consistency.mdc` = Verify token usage and visual match
- `code-quality-standards.mdc` + `clean-code-principles.mdc` = High quality, maintainable code
- `storybook-workflow.mdc` + `base-ui-best-practices.mdc` = Consistent, accessible components

---

## Potential Issues & Mitigations

### Issue 1: Rule Fatigue
**Problem:** Too many rules might be overwhelming
**Mitigation:** All rules have `alwaysApply: true` except `base-ui-best-practices.mdc`
**Status:** ✅ Manageable (9 rules total)

### Issue 2: Over-Enforcement
**Problem:** Rules might slow down development
**Mitigation:** Rules enforce quality, not quantity. Focus on correctness over speed.
**Status:** ✅ Acceptable trade-off

### Issue 3: Figma Dependency
**Problem:** Every change requires Figma verification
**Mitigation:** This is intentional to ensure design consistency
**Status:** ✅ Working as intended

---

## Recommended Actions

### 1. Test the Rules ✅ DONE
- Created 3 new rules
- All goals covered
- No conflicts detected

### 2. Monitor Effectiveness
Watch for:
- Are visual discrepancies caught before commit?
- Are hardcoded values prevented?
- Are random additions stopped?

### 3. Adjust as Needed
If rules are:
- Too strict: Adjust tolerance levels
- Too loose: Add more specific checks
- Conflicting: Merge or clarify priorities

---

## Quick Reference Card

### Phase 1: Creating Storybook Components

```
BEFORE:
✅ Check Figma using Figma MCP (figma-design-consistency.mdc)
✅ Get exact specs: typography, colors, spacing (figma-design-consistency.mdc)
✅ Use Base UI + design tokens (base-ui-best-practices.mdc)

DURING:
✅ Use design tokens only (figma-design-consistency.mdc)
✅ Make only requested changes (minimal-changes.mdc)
✅ Document in Storybook with stories (storybook-workflow.mdc)

AFTER:
✅ Test in Storybook manually (visual-verification.mdc)
✅ Compare with Figma screenshot (visual-verification.mdc)
✅ Check Accessibility tab - 0 violations (web-accessibility skill)
✅ Run Chromatic for automated testing (chromatic-testing.mdc)
✅ Review visual changes and accessibility (chromatic-testing.mdc)
✅ Verify token usage (figma-design-consistency.mdc)
```

### Phase 2: Building Web App

```
BEFORE:
✅ Check Storybook using Storybook MCP (storybook-workflow.mdc)
✅ Find existing components to reuse (storybook-workflow.mdc)
✅ Understand component APIs (storybook-workflow.mdc)

DURING:
✅ Import from Storybook components (storybook-workflow.mdc)
✅ Make only requested changes (minimal-changes.mdc)
✅ Compose patterns from documented components (storybook-workflow.mdc)

AFTER:
✅ Test in web app (visual-verification.mdc)
✅ Verify component usage (visual-verification.mdc)
✅ Check props match Storybook docs (visual-verification.mdc)
```

### Always (Both Phases)

```
✅ Clean code (clean-code-principles.mdc)
✅ Quality standards (code-quality-standards.mdc)
✅ Conventional commits (git-conventional-commits.mdc)
✅ Use Context7 for library docs (context7-mcp-usage.mdc)
✅ Use Storybook HTTP API when running (storybook-workflow.mdc)
```

### Storybook MCP Usage (When Running)

**CRITICAL: If Storybook is running on port 6006, ALWAYS:**

```bash
# 1. Check if running
curl -s http://localhost:6006/index.json >/dev/null 2>&1

# 2. If running, get exact data
curl -s http://localhost:6006/index.json | grep "component-name"

# 3. Return exact story IDs and URLs
# Example: components-searchbar--default
# URL: http://localhost:6006/?path=/story/components-searchbar--default
```

**Never:**
- ❌ Guess story IDs or URLs
- ❌ Read files when Storybook is running
- ❌ Manually construct URLs

---

## Conclusion

**All 6 goals are now covered by Cursor rules.**

The new rules (`figma-design-consistency.mdc`, `minimal-changes.mdc`, `visual-verification.mdc`) fill the gaps and work together with existing rules to ensure:

1. ✅ Constant visual design consistency
2. ✅ High code quality
3. ✅ No random changes between iterations
4. ✅ Visual accuracy (Figma = Browser)
5. ✅ Correct token usage (no hardcoding)
6. ✅ No random additions

**Status: Rules framework is complete and ready for production use.**
