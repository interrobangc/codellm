import type { Config, VectorDb } from '@/.';
import { CodeLlmError, isError, promiseMayFail } from '@/error/index.js';
import { log } from '@/log/index.js';
import { isVectorDbModule } from './types.js';

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
