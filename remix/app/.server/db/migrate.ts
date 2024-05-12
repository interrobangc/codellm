import 'dotenv/config';
import { resolve } from 'node:path';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

import { initClient } from './db.js';
import { client, db } from './db.js';

const run = async () => {
  await initClient();
  await migrate(db, {
    migrationsFolder: resolve('./app/.server/db/migrations'),
  });
  await client.end();
};

run();
