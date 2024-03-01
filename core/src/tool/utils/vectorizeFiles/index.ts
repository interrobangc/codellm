import type {
  Config,
  VectorDbQueryOpts,
  VectorizeFilesPrompts,
  VectorizeFilesToolConfig,
} from '@/.';

import { log, vectorDb } from '@/index.js';
import { vectorizeFiles } from './vectorizeFiles.js';

export const newClient = async (
  toolName: string,
  config: Config,
  toolConfig: VectorizeFilesToolConfig,
) => {
  const { vectorDbName, vectorDbCollectionName } = toolConfig;
  const dbClient = await vectorDb.newClient(vectorDbName, config);
  await dbClient.init([vectorDbCollectionName]);

  return {
    vectorizeFiles: (prompts: VectorizeFilesPrompts) => {
      return vectorizeFiles({
        config,
        dbClient,
        prompts,
        toolConfig,
        toolName,
      });
    },
    query: (opts: VectorDbQueryOpts) => {
      log(`${toolName} running`, 'debug', {
        vectorDbCollectionName,
        opts,
      });

      //TODO: Validate params

      return dbClient.query({
        collectionName: vectorDbCollectionName,
        opts,
      });
    },
  };
};
