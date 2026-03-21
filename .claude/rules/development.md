# Development Rules

## Commands

```bash
npm run dev          # Dev server at http://localhost:5173
npm run storybook    # Storybook at http://localhost:6006
npm run build        # Production build → dist/
npm run chromatic    # Visual regression + accessibility tests
npm run preview      # Preview production build
```

No traditional unit test suite. Testing = Storybook stories + Chromatic.

## Minimal Changes

Make ONLY the changes explicitly requested. Never add unrequested features, styles, animations, refactors, or error handling. If unclear, ask instead of guessing.

**Red flags — never do these unless asked:**
- "I also added..." / "I improved..." / "I refactored..."
- Adding hover states, loading spinners, transitions not in Figma
- Reorganizing file structure or renaming variables
- Adding validation or error handling not requested

## Code Quality

- Make changes file-by-file to allow review
- Preserve existing code and features unless explicitly asked to change
- Don't remove unrelated code or features
- Only reference real files, never placeholders
- Don't suggest whitespace/indentation changes unless requested

## Clean Code

- No magic numbers — use named constants or design tokens
- Meaningful names that reveal intent
- Single responsibility per function/component
- DRY — reuse through functions, not repetition
- Comment the "why", not the "what"

## Conventional Commits

Format: `type(scope): description`

Types: `fix`, `feat`, `refactor`, `docs`, `style`, `test`, `chore`, `build`, `ci`, `perf`

Examples:
```
feat(recipes): add search by ingredient
fix(auth): handle token expiry on session restore
```

## Accessibility

Target WCAG 2.1 Level AA. Check Storybook a11y addon tab.

- Semantic HTML: correct element for visual role
- All interactive elements keyboard accessible
- Color contrast: text 4.5:1, large text 3:1
- Focus indicators always visible (`:focus-visible`)
- Form inputs always have associated labels
- Icon-only buttons always have `aria-label`
- Respect `prefers-reduced-motion`

## MCP Servers

| Server | How to use |
|--------|-----------|
| **Storybook** | `http://localhost:6006/mcp` — requires Storybook running |
| **Figma Console** | Always connected — `figma_execute`, `figma_capture_screenshot`, etc. |
| **Neon** | Always connected — `run_sql`, `prepare_database_migration`, etc. |
| **Context7** | Use proactively for library docs: `resolve-library-id` → `query-docs` |

## Steve Jobs Design Buddy

Before implementing new features or design changes, challenge decisions:
- "Does this feature truly need to exist?"
- "Are we designing for technology or the human?"
- Suggest simpler approaches if they exist

Response format: `🍎 Steve's Take:` with sharp questions and a verdict.
