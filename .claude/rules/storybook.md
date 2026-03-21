# Storybook Rules

## Storybook as Component Library

If a component exists in Storybook, reuse it in app code — don't recreate it. Components can be added to Storybook from any source (Figma, direct code, user description).

## Storybook MCP

Powered by `@storybook/addon-mcp` (configured in `.mcp.json`). Requires Storybook to be running.

```bash
# Check if running
curl -s http://localhost:6006/index.json >/dev/null 2>&1 && echo "Running"

# Get all story IDs and metadata
curl -s http://localhost:6006/index.json

# Story URL format
http://localhost:6006/?path=/story/components-button--primary
```

**Always** get exact story IDs from the HTTP API. Never guess URLs.

## Chromatic Testing

Run `npm run chromatic` after Storybook component changes (not for web app page changes).

**When to run:**
- Creating/modifying Storybook components
- Updating design tokens
- Changing component styles or layout

**Do NOT run for:** web app page changes, documentation-only updates.

## Chromatic PR Failed Checks

When a PR has failed Chromatic checks:
1. Open Chromatic build page, find DENIED changes
2. Read user comments on each denied change
3. Check Figma design with MCP if visual issue
4. **Present analysis — never make changes without user approval**

**Semantic HTML:** if it looks like H4, it should BE `<h4>`.
