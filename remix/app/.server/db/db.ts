import { remember } from '@epic-web/remember';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema';

export const client = remember(
  'pgClient',
  () =>
    new pg.Client({
      connectionString: process.env.DATABASE_URL!,
    }),
);

// { schema } is used for relational queries
export const db = remember('drizzle', () =>
  drizzle(client, { schema, logger: true }),
);

export const initClient = () => {
  // @ts-expect-error - this is a private property
  if (client._connected) return Promise.resolve();
  return client.connect();
};
