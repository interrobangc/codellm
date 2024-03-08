import type {
  VectorDbQueryOpts,
  VectorizeFilesAdditionalMetadataFn,
  VectorizeFilesNewClientParams,
  VectorizeFilesPrompts,
} from '@/.';

import { log } from '@/log/index.js';
import * as vectorDb from '@/vectorDb/index.js';
import { vectorizeFiles } from './vectorizeFiles.js';

export const newClient = async ({
  config,
  toolConfig,
  toolName,
}: VectorizeFilesNewClientParams) => {
  const { vectorDbName, vectorDbCollectionName } = toolConfig;
  const dbClient = await vectorDb.newClient(vectorDbName, config);
  await dbClient.init([vectorDbCollectionName]);

  return {
    vectorizeFiles: (
      prompts: VectorizeFilesPrompts,
      additionalMetadataFn:
        | VectorizeFilesAdditionalMetadataFn
        | undefined = undefined,
    ) => {
      return vectorizeFiles({
        additionalMetadataFn,
        config,
        dbClient,
        prompts,
        toolConfig,
        toolName,
      });
    },
    query: (opts: VectorDbQueryOpts) => {
      log(`${toolName} running vectorizeFiles query`, 'debug', {
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
