import type { Config, VectorDbClient } from '@/.';
import { VECTOR_DB_MODULES } from './types.js';

export const newClient = async (config: Config): Promise<VectorDbClient> => {
  const db = VECTOR_DB_MODULES[config.vectorDb];
  if (!db) {
    throw new Error(`VectorDb not found: ${config.vectorDb}`);
  }
  return db.newClient();
};

export * from './types.js';