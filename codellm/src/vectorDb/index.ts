import type { Config, VectorDbClient } from '@/.';
import { VECTOR_DB_MODULES } from './types.js';

/**
 * Create a new VectorDbClient instance from the vectorDb library
 *
 * @param config - The configuration object.
 *
 * @returns The new VectorDbClient instance.
 */
export const newClient = async (config: Config): Promise<VectorDbClient> => {
  const db = VECTOR_DB_MODULES[config.vectorDb];
  if (!db) {
    throw new Error(`VectorDb not found: ${config.vectorDb}`);
  }
  return db.newClient();
};

export * from './types.js';
