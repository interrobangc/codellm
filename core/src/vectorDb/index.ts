import type { Config, VectorDb, VectorDbClient, VectorDbs } from '@/.';
import { getConfig } from '@/config/index.js';
import { CodeLlmError, isError } from '@/error/index.js';
import log from '@/log/index.js';

const vectorDbs: VectorDbs = new Map();

export const getVectorDb = (name: VectorDb) => {
  const db = vectorDbs.get(name);
  if (!db) {
    return new CodeLlmError({ code: 'vectorDb:notFound' });
  }
  return db;
};

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

  if (!dbConfig) {
    return new CodeLlmError({ code: 'vectorDb:configNotFound' });
  }
  const dbModuleName = dbConfig.module;
  try {
    return await import(dbModuleName);
  } catch (e) {
    return new CodeLlmError({
      code: 'vectorDb:importError',
      cause: e,
    });
  }
};

/**
 * Create a new VectorDbClient instance from the vectorDb library
 *
 * @param {VectorDb} name - The name of the VectorDb to get.
 * @param {Config} config - The configuration object.
 *
 * @returns The new VectorDbClient instance.
 */
export const newClient = async (name: VectorDb) => {
  log(`vectordb newClient: ${name}`, 'silly');
  if (!vectorDbs.get(name)) {
    const config = getConfig();
    const module = await importVectorDbModule(name, config);
    if (isError(module)) {
      return module;
    }
    vectorDbs.set(name, await module.newClient(config));
  }

  return vectorDbs.get(name) as VectorDbClient;
};

export * from './types.js';
