import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sql = neon(process.env.DATABASE_URL);

const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');

// Execute each statement separately
const statements = schema
  .split(';')
  .map((s) => s.trim())
  .filter(Boolean);

for (const statement of statements) {
  await sql.unsafe(statement);
}

console.log('Migration complete.');
