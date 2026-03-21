# Deployment Rules

## Platform

- **Hosting:** Vercel
- **Project name:** `miri-meal` (on Vercel dashboard)
- **Repo:** `MannyCH/miri` (GitHub)
- **Framework:** Vite (auto-detected by Vercel)
- **Build output:** `dist/`

## Preview Deployments

Every push to a branch with an open PR triggers a Vercel preview deployment.

Preview URL pattern: `https://miri-meal-git-{branch}-{team}.vercel.app`

## Environment Variables

Managed in Vercel dashboard (Settings → Environment Variables).

**Server-side only** (API routes):
- `DATABASE_URL` — Neon Postgres connection string
- `NEON_AUTH_BASE_URL` — JWT verification endpoint
- `PUSHER_APP_ID`, `PUSHER_SECRET` — Pusher server credentials

**Client-exposed** (Vite `VITE_` prefix):
- `VITE_NEON_AUTH_URL` — Neon Auth for client
- `VITE_NEON_DATA_API_URL` — Neon Data API for client
- `VITE_PUSHER_KEY`, `VITE_PUSHER_CLUSTER` — Pusher client credentials

**Local development:** All vars in `.env.local` (gitignored).

## Serverless Functions

- Located in `api/` directory
- Auto-deployed as Vercel serverless functions
- Use `@neondatabase/serverless` for DB access
- Auth via `jose` JWT verification against Neon Auth JWKS

## CI/CD

- Chromatic runs on every GitHub push (visual regression)
- Vercel builds on every push (preview) and merge to main (production)
