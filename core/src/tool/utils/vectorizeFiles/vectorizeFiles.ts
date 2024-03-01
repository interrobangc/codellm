import type {
  LlmClient,
  ProcessFileHandleParams,
  RemoveMissingFilesParams,
  UpdateTrackingCacheParams,
  VectorDbAddDocumentsParams,
  VectorizeFileParams,
  VectorizeFilesParams,
} from '@/.';

import { llm as codeLlmLlm, log, toolUtils } from '@/index.js';
import { readFile, stat, writeFile } from 'fs/promises';
import { resolve } from 'path';

/**
 * Summarize the code using the summarize LLM
 *
 * @param llm - The LLM to use for summarization
 * @param code - The code to summarize
 *
 * @returns - The summary of the code
 *
 * @throws - If there is an error summarizing the code
 */
export const summarize = async (
  llm: LlmClient,
  prompt: string,
  code: string,
) => {
  return llm.prompt({
    system: '',
    prompt: `
    ${prompt}
    ${code}
  `,
  });
};

//TODO: dynamic prefix for different passes on a single file in one collection
export const getId = (idPrefix: string, filePath: string) =>
  `${idPrefix}':${filePath}`;

export const getCacheFilePath = (
  cacheDir: string,
  toolName: string,
  idPrefix: string,
) => resolve(`${cacheDir}/vectorizeFiles-${toolName}-${idPrefix}.json`);

export const updateTrackingCache = async ({
  cacheDir,
  toolName,
  idPrefix,
  filePath,
  action,
}: UpdateTrackingCacheParams) => {
  const trackingCache = new Set();
  const cacheFilePath = getCacheFilePath(cacheDir, toolName, idPrefix);

  try {
    const trackingCacheFile = await readFile(cacheFilePath, 'utf-8');
    JSON.parse(trackingCacheFile)?.map((i: string) => trackingCache.add(i));
  } catch (e) {
    log(
      `Error parsing trackingCache from ${cacheFilePath}. If this is not the first run, files that have been deleted will not be cleaned`,
      'error',
    );
  }

  trackingCache[action](filePath);

  log('trackingCache', 'silly', { trackingCache });

  log(`writing trackingCache to ${cacheFilePath}`, 'debug');
  await writeFile(cacheFilePath, JSON.stringify([...trackingCache]), {
    encoding: 'utf8',
  });
};

/**
 * Handle a single file by summarizing it and adding it to the database
 *
 * @param dbClient - The vector database client to use
 * @param llm - The LLM to use for summarization
 * @param path - The path to the file to handle
 */
export const vectorizeFile = async ({
  cacheDir,
  dbClient,
  idPrefix,
  llm,
  fileContent,
  fileContentHash,
  filePath,
  filePathHash,
  collectionName,
  prompt,
  toolName,
}: VectorizeFileParams) => {
  // TODO: dynamic for different passes in a single run
  const id = getId(idPrefix, filePath);

  await updateTrackingCache({
    cacheDir,
    toolName,
    idPrefix,
    filePath,
    action: 'add',
  });

  // TODO: track files that have been processed and check fo deletions

  const existingDocument = await dbClient.get({
    collectionName,
    ids: [id],
  });

  log('vectorizeFile existingDocument', 'silly', { existingDocument });

  if (
    // @ts-expect-error - types aren't in place yet
    existingDocument.documents.length > 0 &&
    // @ts-expect-error - types aren't in place yet
    existingDocument.metadatas[0].fileContentHash === fileContentHash
  ) {
    log(`Document ${id} is already up to date, skipping`);
    return;
  }

  const response = await summarize(
    llm,
    prompt,
    `file: ${filePath}\n\n${fileContent}`,
  );

  const document: VectorDbAddDocumentsParams = {
    collectionName,
    documents: [
      {
        id,
        metadata: {
          fileContent,
          fileContentHash,
          filePath,
          filePathHash,
        },
        document: response,
      },
    ],
  };

  await dbClient.addDocuments(document);
};

export const removeMissingFiles = async ({
  cacheDir,
  collectionName,
  dbClient,
  idPrefix,
  toolName,
}: RemoveMissingFilesParams) => {
  log('Removing missing files from database');
  const cacheFilePath = getCacheFilePath(cacheDir, toolName, idPrefix);
  const trackingCache = new Set();

  try {
    const trackingCacheFile = await readFile(cacheFilePath, 'utf-8');
    JSON.parse(trackingCacheFile)?.map((i: string) => trackingCache.add(i));
  } catch (e) {
    log(
      `Error parsing trackingCache from ${cacheFilePath}. Files that have been deleted will not be cleaned`,
      'error',
    );
  }

  Promise.all(
    [...trackingCache].map(async (p) => {
      const filePath = p as string;
      try {
        await stat(filePath);
      } catch (e) {
        log(`File ${filePath} has been deleted, removing from database`);
        await dbClient.deleteDocuments({
          collectionName,
          ids: [getId(idPrefix, filePath)],
        });
        await updateTrackingCache({
          cacheDir,
          toolName,
          idPrefix,
          filePath,
          action: 'delete',
        });
      }
    }),
  );
};

export const vectorizeFiles = async ({
  config,
  dbClient,
  prompts,
  toolConfig,
  toolName,
}: VectorizeFilesParams): Promise<void> => {
  const llms = await codeLlmLlm.initLlms(config, ['summarize']);
  log(`${toolName} runImport LLMs`, 'silly', { llms });
  const llm = llms.summarize;

  if (!llm) {
    throw new Error('No summarize LLM found');
  }

  const { cacheDir, path } = config;
  const {
    include,
    exclude,
    vectorDbCollectionName: collectionName,
  } = toolConfig;

  const idPrefix = 'summary';

  await toolUtils.processFiles({
    toolName,
    path,
    include,
    exclude,
    handle: async (params: ProcessFileHandleParams) => {
      await vectorizeFile({
        cacheDir,
        collectionName,
        dbClient,
        idPrefix,
        llm,
        prompt: prompts.summarize,
        toolName,
        ...params,
      });
    },
  });

  await removeMissingFiles({
    cacheDir,
    collectionName,
    dbClient,
    idPrefix,
    toolName,
  });
};
