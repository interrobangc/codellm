import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
  dbCredentials: {
    database: process.env.DB_NAME!,
    host: process.env.DB_HOST!,
    password: process.env.DB_PASSWORD!,
    port: Number(process.env.DB_PORT!),
    user: process.env.DB_USERNAME!,
  },
  dialect: 'postgresql',
  out: './app/.server/db/migrations',
  schema: './app/.server/db/schema.ts',

  // Always ask for confirmation
  strict: true,

  // Print all statements
  verbose: true,
} satisfies Config;
