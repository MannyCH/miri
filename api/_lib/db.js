import { neon } from '@neondatabase/serverless';

/**
 * Shared Neon SQL tagged-template function.
 * Uses DATABASE_URL which bypasses RLS (server-side only).
 */
export const sql = neon(process.env.DATABASE_URL);
