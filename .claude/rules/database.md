# Database Rules

## Neon Postgres

- **Project ID:** `rapid-wildflower-52568597`
- **Database:** `neondb`
- **Schema:** `database/schema.sql`

## Use Neon MCP for All DB Tasks

| Task | MCP Tool |
|------|----------|
| Schema change | `prepare_database_migration` → test → `complete_database_migration` |
| Inspect tables | `get_database_tables`, `describe_table_schema` |
| One-off query | `run_sql` |
| Debug slow queries | `list_slow_queries`, `explain_sql_statement` |

**Never** apply schema changes directly to main branch with `run_sql`. Always use branching via `prepare_database_migration`.

## Runtime Data Access

- **API routes** (`api/`): Use `@neondatabase/serverless` with `DATABASE_URL` (direct SQL, no RLS)
- **Client app** (`src/`): Use `src/lib/dataClient.js` (Neon Data API + RLS)

MCP tools are for dev/admin only — never for runtime app queries.
