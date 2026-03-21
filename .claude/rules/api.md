---
paths:
  - "api/**"
---

# API Development Rules

## Structure

Vercel serverless functions live in `api/`. Each file exports a default handler.

**Shared utilities:** `api/_lib/` (e.g., `api/_lib/pusher.js`)

## Authentication Pattern

All protected endpoints use Neon Auth JWT verification:

```js
import { createRemoteJWKSet, jwtVerify } from 'jose';

const JWKS = createRemoteJWKSet(
  new URL(`${process.env.NEON_AUTH_BASE_URL}/.well-known/jwks.json`)
);

async function getUserId(req) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) throw new Error('Missing Bearer token');
  const token = auth.slice(7);
  const { payload } = await jwtVerify(token, JWKS);
  if (!payload.sub) throw new Error('No sub in JWT payload');
  return payload.sub;
}
```

## Database Access

API routes use `@neondatabase/serverless` directly:

```js
import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);
```

This is different from the client-side `src/lib/dataClient.js` which uses the Neon Data API + RLS.

## Conventions

- Always validate HTTP method: `if (!['GET', 'POST'].includes(req.method)) return res.status(405).end()`
- Return JSON errors: `res.status(400).json({ error: 'message' })`
- Use `try/catch` around DB operations
- Never expose internal error details to the client
