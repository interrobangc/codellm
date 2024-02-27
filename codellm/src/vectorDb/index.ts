import type { Config, VectorDb, VectorDbClient } from '@/.';
import { VECTOR_DB_MODULES } from './constants.js';

/**
 * Import a VectorDb module from the vectorDb library
 *
 * @param dbName - The name of the VectorDb to import.
 *
 * @returns The VectorDb module.
 *
 * @throws If the VectorDb is not found.
 * @throws If there is an error importing the VectorDb.
 */
export const importVectorDb = async (dbName: VectorDb) => {
  const dbModule = VECTOR_DB_MODULES[dbName];
  if (!dbModule) throw new Error(`VectorDb not found: ${dbName}`);

  return import(dbModule);
};

/**
 * Create a new VectorDbClient instance from the vectorDb library
 *
 * @param config - The configuration object.
 *
 * @returns The new VectorDbClient instance.
 */
export const newClient = async (config: Config): Promise<VectorDbClient> => {
  const db = await importVectorDb(config.vectorDb);
  return db.newClient();
};

export * from './types.js';
export * from './constants.js';
