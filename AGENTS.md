# AGENTS.md

Agent instructions index for the Miri project. Read the relevant rule file before working in that area.

## Quick Reference

| Working on | Read this |
|------------|-----------|
| Components or patterns | `.claude/rules/components.md` |
| Design tokens, CSS, styling | `.claude/rules/tokens.md` |
| Figma design work | `.claude/rules/figma.md` |
| Storybook stories, Chromatic | `.claude/rules/storybook.md` |
| API routes (`api/`) | `.claude/rules/api.md` |
| Database, schema, migrations | `.claude/rules/database.md` |
| Feature specs, docs | `.claude/rules/docs.md` |
| Dev workflow, code quality, commits | `.claude/rules/development.md` |
| Deployment, env vars, Vercel | `.claude/rules/deployment.md` |
| Project overview, architecture | `CLAUDE.md` |

## Features Map

**Read `FEATURES-MAP.md` first** to locate key files for any feature area. This avoids scanning the codebase from scratch.

## Feature Specs (read before implementing)

| Feature | Spec |
|---------|------|
| Shopping list sharing & multi-list | `docs/shopping-list-flow.json` |
| Real-time sync (Pusher) | `docs/pusher-integration.json` |

## Design Mappings

| File | Purpose |
|------|---------|
| `FIGMA_STORYBOOK_MAPPING.md` | Figma ↔ Storybook component pairings |
| `design-mapping.json` | Structured mapping data |
| `database/schema.sql` | Full DB schema |
