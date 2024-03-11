import type {
  VectorDbQueryOpts,
  VectorizeFilesAdditionalMetadataFn,
  VectorizeFilesNewClientParams,
  VectorizeFilesPrompts,
} from '@/.';

import { isError } from '@/error/index.js';
import { log } from '@/log/index.js';
import * as vectorDb from '@/vectorDb/index.js';
import { vectorizeFiles } from './vectorizeFiles.js';

export const newVectorizeFilesClient = async ({
  config,
  toolConfig,
  toolName,
}: VectorizeFilesNewClientParams) => {
  const { vectorDbCollectionName, vectorDbName } = toolConfig;
  const dbClient = await vectorDb.newVectorDbClient(vectorDbName, config);

  if (isError(dbClient)) return dbClient;

  await dbClient.init([vectorDbCollectionName]);

  return {
    query: (opts: VectorDbQueryOpts) => {
      log(`${toolName} running vectorizeFiles query`, 'debug', {
        opts,
        vectorDbCollectionName,
      });

      //TODO: Validate params
      return dbClient.query({
        collectionName: vectorDbCollectionName,
        opts,
      });
    },
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
  };
};
