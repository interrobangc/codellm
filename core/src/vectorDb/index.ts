import type { Config, VectorDb, VectorDbClient, VectorDbs } from '@/.';
import log from '@/log/index.js';

const vectorDbs: VectorDbs = {};

/**
 * Import a VectorDb module from the vectorDb library
 *
 * @param {VectorDb} name - The name of the VectorDb to import.
 * @param {VectorDbConfigItem} config - The configuration for the VectorDb.
 *
 * @returns The VectorDb module.
 **/
export const importVectorDbModule = async (name: VectorDb, config: Config) => {
  const dbConfig = config.vectorDbs[name];

  if (!dbConfig) throw new Error(`VectorDb config not found: ${name}`);
  const dbModule = dbConfig.module;

  return import(dbModule);
};

/**
 * Create a new VectorDbClient instance from the vectorDb library
 *
 * @param {VectorDb} name - The name of the VectorDb to get.
 * @param {Config} config - The configuration object.
 *
 * @returns The new VectorDbClient instance.
 */
export const newClient = async (
  name: VectorDb,
  config: Config,
): Promise<VectorDbClient> => {
  log(`vectordb newClient: ${name}`, 'silly');

  if (!vectorDbs[name]) {
    const module = await importVectorDbModule(name, config);
    vectorDbs[name] = module.newClient();
  }

  if (!vectorDbs[name]) {
    throw new Error(`VectorDb not found: ${name}`);
  }

  return vectorDbs[name]!;
};

export * from './types.js';
