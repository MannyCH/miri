# Documentation & Specs

## Feature Specs

Structured JSON specs for features live in `docs/`. Read these before implementing related features.

| File | Contents |
|------|----------|
| `docs/shopping-list-flow.json` | Shopping list sharing & multi-list UX — all user flows, edge cases, state transitions |
| `docs/pusher-integration.json` | Pusher Channels real-time sync — architecture, implementation steps, data flow, security |

## Design Mappings

| File | Contents |
|------|----------|
| `FIGMA_STORYBOOK_MAPPING.md` | Figma ↔ Storybook component pairings |
| `design-mapping.json` | Structured mapping data |

## Database Schema

| File | Contents |
|------|----------|
| `database/schema.sql` | Full DB schema (tables, RLS policies, indexes) |

## When to Consult

- Before implementing shopping list sharing features → read `docs/shopping-list-flow.json`
- Before implementing real-time sync → read `docs/pusher-integration.json`
- Before creating/modifying components → check `FIGMA_STORYBOOK_MAPPING.md`
- Before DB schema changes → read `database/schema.sql` and use Neon MCP
