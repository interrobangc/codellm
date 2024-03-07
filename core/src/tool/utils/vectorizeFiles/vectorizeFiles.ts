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
import { mkdir, readFile, stat, writeFile } from '@/fs/index.js';
import { dirname, resolve } from 'path';

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

export const getCacheFilePath = (cacheDir: string, idPrefix: string) =>
  resolve(`${cacheDir}/vectorizeFiles-${idPrefix}.json`);

export const updateTrackingCache = async ({
  cacheDir,
  idPrefix,
  filePath,
  action,
}: UpdateTrackingCacheParams) => {
  const trackingCache = new Set();
  const cacheFilePath = getCacheFilePath(cacheDir, idPrefix);

  try {
    const trackingCacheFile = await readFile(cacheFilePath);
    JSON.parse(trackingCacheFile)?.map((i: string) => trackingCache.add(i));
  } catch (e) {
    log(
      `Error parsing trackingCache from ${cacheFilePath}. If this is not the first run, files that have been deleted will not be cleaned`,
      'error',
    );
  }

  trackingCache[action](filePath);

  log('trackingCache', 'silly', { trackingCache });

  const dir = dirname(cacheFilePath);
  await mkdir(dir);
  log(`writing trackingCache to ${cacheFilePath}`, 'debug');
  await writeFile(cacheFilePath, JSON.stringify([...trackingCache]));
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
  dbClient,
  idPrefix,
  llm,
  fileContent,
  fileContentHash,
  filePath,
  filePathHash,
  collectionName,
  prompt,
}: VectorizeFileParams) => {
  // TODO: dynamic for different passes in a single run
  const id = getId(idPrefix, filePath);

  await updateTrackingCache({
    cacheDir,
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

  // We want to use the full path for ids to prevent overlap if different projects have the same structure,
  // but only deal with relative paths for the rest of the metadata and document
  const relativeFilePath = filePath.replace(resolve(basePath), '.');

  const response = await summarize(
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
        id,
        metadata,
        document: response,
      },
    ],
  };

  log('vectorizeFile document', 'debug', { document });

  await dbClient.addDocuments(document);
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

  try {
    const trackingCacheFile = await readFile(cacheFilePath);
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
      log(`Checking file ${filePath} for deletion`, 'debug');
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
          idPrefix,
          filePath,
          action: 'delete',
        });
      }
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
}: VectorizeFilesParams): Promise<void> => {
  const llms = await codeLlmLlm.initLlms(config, ['summarize']);
  log(`${toolName} runImport LLMs`, 'silly', { llms });
  const llm = llms.summarize;

  if (!llm) {
    throw new Error('No summarize LLM found');
  }

  const {
    project: { name: projectName },
    paths: { cache: rootCacheDir, project: path },
  } = config;
  const {
    include,
    exclude,
    vectorDbCollectionName: collectionName,
  } = toolConfig;

  const idPrefix = 'summary';
  const cacheDir = `${rootCacheDir}/${projectName}/${toolName}`;

  await toolUtils.processFiles({
    toolName,
    path,
    include,
    exclude,
    handle: async (params: ProcessFileHandleParams) => {
      await vectorizeFile({
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
    },
  });

  await removeMissingFiles({
    cacheDir,
    collectionName,
    dbClient,
    idPrefix,
  });
};
