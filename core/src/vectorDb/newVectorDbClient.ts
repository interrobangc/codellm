import type { Config, VectorDb } from '@/.';
import { isError } from '@/error/index.js';
import { log } from '@/log/index.js';
import { importVectorDbModule } from './importVectorDbModule.js';
import { getVectorDb, setVectorDb } from './vectorDbs.js';

/**
 * Create a new VectorDbClient instance from the vectorDb library
 *
 * @param {VectorDb} name - The name of the VectorDb to get.
 * @param {Config} config - The configuration object.
 *
 * @returns The new VectorDbClient instance.
 */
export const newVectorDbClient = async (name: VectorDb, config: Config) => {
  log(`vectordb newVectorDbClient: ${name}`, 'silly');
  if (isError(getVectorDb(name))) {
    const module = await importVectorDbModule(name, config);
    if (isError(module)) return module;

    setVectorDb(name, await module.newClient(config));
  }

  return getVectorDb(name);
};
