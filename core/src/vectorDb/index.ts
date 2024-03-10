import type { Config, VectorDb, VectorDbs } from '@/.';
import { CodeLlmError, isError, promiseMayFail } from '@/error/index.js';
import { log } from '@/log/index.js';
import { isVectorDbModule } from './types.js';

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
  const dbConfig = config?.vectorDbs?.[name];

  if (!dbConfig) {
    return new CodeLlmError({ code: 'vectorDb:configNotFound' });
  }
  const dbModuleName = dbConfig.module;
  const dbModule = await promiseMayFail(
    import(dbModuleName),
    'vectorDb:importError',
    {
      dbModuleName,
    },
  );

  log('importVectorDbModule imported module', 'silly', {
    dbModule,
    dbModuleName,
  });

  if (isError(dbModule)) return dbModule;

  if (!isVectorDbModule(dbModule)) {
    return new CodeLlmError({
      code: 'vectorDb:invalidModule',
      meta: { dbModuleName },
    });
  }

  return dbModule;
};

/**
 * Create a new VectorDbClient instance from the vectorDb library
 *
 * @param {VectorDb} name - The name of the VectorDb to get.
 * @param {Config} config - The configuration object.
 *
 * @returns The new VectorDbClient instance.
 */
export const newClient = async (name: VectorDb, config: Config) => {
  log(`vectordb newClient: ${name}`, 'silly');
  if (!vectorDbs.get(name)) {
    const module = await importVectorDbModule(name, config);
    if (isError(module)) return module;

    vectorDbs.set(name, await module.newClient(config));
  }

  if (!vectorDbs.get(name)) {
    return new CodeLlmError({ code: 'vectorDb:notFound', meta: { name } });
  }
  return vectorDbs.get(name)!;
};

export * from './types.js';
