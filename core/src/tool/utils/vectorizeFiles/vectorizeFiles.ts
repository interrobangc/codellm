import type {
  LlmClient,
  ProcessFileHandleParams,
  RemoveMissingFilesParams,
  UpdateTrackingCacheParams,
  VectorDbAddDocumentsParams,
  VectorizeFileParams,
  VectorizeFilesParams,
} from '@/.';

import { dirname, resolve } from 'path';
import { promiseMayFail } from '@/error/index.js';
import * as codeLlmLlm from '@/llm/index.js';
import log from '@/log/index.js';
import * as toolUtils from '@/tool/utils/index.js';
import { isError } from '@/error/index.js';
import { mkdir, readFile, stat, writeFile } from '@/fs/index.js';

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
    prompt: `
      ${prompt}
      ${code}
    `,
    system: '',
  });
};

//TODO: dynamic prefix for different passes on a single file in one collection
export const getId = (idPrefix: string, filePath: string) =>
  `${idPrefix}':${filePath}`;

export const getCacheFilePath = (cacheDir: string, idPrefix: string) =>
  resolve(`${cacheDir}/vectorizeFiles-${idPrefix}.json`);

export const updateTrackingCache = async ({
  action,
  cacheDir,
  filePath,
  idPrefix,
}: UpdateTrackingCacheParams) => {
  const trackingCache = new Set();
  const cacheFilePath = getCacheFilePath(cacheDir, idPrefix);

  const trackingCacheFile = await readFile(cacheFilePath);
  if (isError(trackingCacheFile)) {
    log(
      `Error reading trackingCache from ${cacheFilePath}. If this is not the first run, files that have been deleted will not be cleaned`,
      'error',
    );
  } else {
    JSON.parse(trackingCacheFile)?.map((i: string) => trackingCache.add(i));
  }

  trackingCache[action](filePath);

  log('trackingCache', 'silly', { trackingCache });

  const dir = dirname(cacheFilePath);
  const mkDirRes = promiseMayFail(
    mkdir(dir),
    'vectorizeFiles:trackingCacheMkDir',
    {
      dir,
    },
  );
  if (isError(mkDirRes)) return mkDirRes;

  log(`writing trackingCache to ${cacheFilePath}`, 'debug');

  return promiseMayFail(
    writeFile(cacheFilePath, JSON.stringify([...trackingCache])),
    'vectorizeFiles:updateTrackingCache',
    {
      cacheFilePath,
      trackingCache,
    },
  );
};

/**
 * Handle a single file by summarizing it and adding it to the database
 *
 * @param dbClient - The vector database client to use
 * @param llm - The LLM to use for summarization
 * @param path - The path to the file to handle
 */
export const vectorizeFile = async ({
  additionalMetadataFn,
  basePath,
  cacheDir,
  collectionName,
  dbClient,
  fileContent,
  fileContentHash,
  filePath,
  filePathHash,
  idPrefix,
  llm,
  prompt,
}: VectorizeFileParams) => {
  // TODO: dynamic for different passes in a single run
  const id = getId(idPrefix, filePath);

  const trackingRes = await updateTrackingCache({
    action: 'add',
    cacheDir,
    filePath,
    idPrefix,
  });

  if (isError(trackingRes)) return trackingRes;

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

  // We want to use the full path for ids to prevent overlap if different projects have the same structure,
  // but only deal with relative paths for the rest of the metadata and document
  const relativeFilePath = filePath.replace(resolve(basePath), '.');

  const summarizeRes = await summarize(
    llm,
    prompt,
    `file: ${relativeFilePath}\n\n${fileContent}`,
  );

  const baseMetadata = {
    fileContent,
    fileContentHash,
    filePath: relativeFilePath,
    filePathHash,
  };

  const additionalMetadata = additionalMetadataFn
    ? await additionalMetadataFn(baseMetadata)
    : {};

  const metadata = {
    ...baseMetadata,
    ...additionalMetadata,
  };

  const document: VectorDbAddDocumentsParams = {
    collectionName,
    documents: [
      {
        document: summarizeRes,
        id,
        metadata,
      },
    ],
  };

  log('vectorizeFile document', 'debug', { document });

  return promiseMayFail(
    dbClient.addDocuments(document),
    'vectorizeFiles:addDocuments',
    {
      collectionName,
      document,
    },
  );
};

export const removeMissingFiles = async ({
  cacheDir,
  collectionName,
  dbClient,
  idPrefix,
}: RemoveMissingFilesParams) => {
  log('Removing missing files from database');
  const cacheFilePath = getCacheFilePath(cacheDir, idPrefix);
  const trackingCache = new Set();

  const trackingCacheFile = await readFile(cacheFilePath);
  if (isError(trackingCacheFile)) {
    log(
      `Error reading trackingCache from ${cacheFilePath}. Files that have been deleted will not be cleaned`,
      'error',
    );
    return trackingCacheFile;
  } else {
    JSON.parse(trackingCacheFile)?.map((i: string) => trackingCache.add(i));
  }

  return Promise.allSettled(
    [...trackingCache].map(async (p) => {
      const filePath = p as string;
      log(`Checking file ${filePath} for deletion`, 'debug');
      const statRes = await stat(filePath);

      // If the file still exists, we don't need to do anything
      if (!isError(statRes, 'fs:statError')) return;

      log(`File ${filePath} has been deleted, removing from database`);
      await dbClient.deleteDocuments({
        collectionName,
        ids: [getId(idPrefix, filePath)],
      });
      await updateTrackingCache({
        action: 'delete',
        cacheDir,
        filePath,
        idPrefix,
      });
    }),
  );
};

export const vectorizeFiles = async ({
  additionalMetadataFn,
  config,
  dbClient,
  prompts,
  toolConfig,
  toolName,
}: VectorizeFilesParams) => {
  const llms = await codeLlmLlm.initLlms(['summarize']);
  log(`${toolName} runImport LLMs`, 'silly', { llms });
  const llm = codeLlmLlm.getLlm('summarize');

  if (isError(llm)) return llm;

  const {
    paths: { cache: rootCacheDir, project: path },
    project: { name: projectName },
  } = config;
  const {
    exclude,
    include,
    vectorDbCollectionName: collectionName,
  } = toolConfig;

  const idPrefix = 'summary';
  const cacheDir = `${rootCacheDir}/${projectName}/${toolName}`;

  const processFilesRes = await toolUtils.processFiles({
    exclude,
    handle: async (params: ProcessFileHandleParams) => {
      const vectorizeRes = await vectorizeFile({
        additionalMetadataFn,
        basePath: path,
        cacheDir,
        collectionName,
        dbClient,
        idPrefix,
        llm,
        prompt: prompts.summarize,
        ...params,
      });

      if (isError(vectorizeRes, 'vectorizeFiles:updateTrackingCache')) {
        // This is a critical error that could cause data loss, so we throw it
        throw vectorizeRes;
      }
    },
    include,
    path,
    toolName,
  });

  if (isError(processFilesRes)) return processFilesRes;

  return removeMissingFiles({
    cacheDir,
    collectionName,
    dbClient,
    idPrefix,
  });
};
