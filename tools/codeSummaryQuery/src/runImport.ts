import { globby } from 'globby';
import { resolve } from 'path';
import { readFile } from 'fs/promises';
import { createHash } from 'crypto';

import type {
  LlmClient,
  VectorDbAddDocumentsParams,
  VectorDbClient,
} from '@interrobangc/codellm';
import type { RunImportParams } from './types.js';

import { llm as codeLlmLlm, log } from '@interrobangc/codellm';
import {
  vectorDbCollectionName as collectionName,
  summarizeCodeTaskPrompt,
} from './constants.js';

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
export const summarizeCode = async (llm: LlmClient, code: string) => {
  return llm.prompt({
    system: '',
    prompt: `
    ${summarizeCodeTaskPrompt}
    ${code}
  `,
  });
};

/**
 * Handle a single file by summarizing it and adding it to the database
 *
 * @param dbClient - The vector database client to use
 * @param llm - The LLM to use for summarization
 * @param path - The path to the file to handle
 */
export const handleFile = async (
  dbClient: VectorDbClient,
  llm: LlmClient,
  path: string,
) => {
  log(`Processing ${path}`);

  // TODO: dynamic for different passes in a single run
  const id = `summary:${path}`;

  // TODO: track files that have been processed and check fo deletions

  const content = await readFile(path, 'utf-8');
  const hash = createHash('sha256').update(content).digest('hex');

  const existingDocument = await dbClient.get({
    collectionName,
    ids: [id],
  });

  if (
    // @ts-expect-error - types aren't in place yet
    existingDocument.documents.length > 0 &&
    // @ts-expect-error - types aren't in place yet
    existingDocument.metadatas[0].hash === hash
  ) {
    log(`Document ${id} is already up to date, skipping`);
    return;
  }

  const response = await summarizeCode(llm, `file: ${path}\n\n${content}`);

  const document: VectorDbAddDocumentsParams = {
    collectionName,
    documents: [
      {
        id,
        metadata: {
          content,
          hash,
          path,
        },
        document: response,
      },
    ],
  };

  await dbClient.addDocuments(document);
};

/**
 * Traverse all directories in the path and import all files that match the include pattern and do not match the exclude pattern.
 *
 * @param dbClient - The vector database client to use
 * @param llm - The LLM to use for summarization
 * @param path - The path to traverse
 * @param include - The patterns to include
 * @param exclude - The patterns to exclude
 *
 * @returns - The summary of the code
 *
 * @throws - If there is an error summarizing the code
 */
export const importPath = async (
  dbClient: VectorDbClient,
  llm: LlmClient,
  path: string,
  include: string[],
  exclude: string[],
) => {
  const files = [
    ...include.map((i) => `${resolve(path)}/${i}`),
    ...exclude.map((e) => `!${resolve(path)}/${e}`),
  ];

  const paths = await globby(files, {
    //TODO: gitignore seems to be broken upstream
    // gitignore: true,
    // ignoreFiles: [`${resolve(path)}.gitignore`],
  });

  log('importPaths', 'debug', { paths });

  for (const p of paths) {
    await handleFile(dbClient, llm, p);
  }
};

/**
 * Run the import for the codeSummaryQuery tool
 *
 * @param params Object - The parameters for the import
 * @param params.config - The codellm configuration
 * @param params.toolConfig - The tool configuration
 * @param params.vectorDb - The vector database client to use
 *
 * @returns - The result of the import
 *
 * @throws - If there is an error running the import
 */
export const runImport = async ({
  config,
  toolConfig,
  vectorDb,
}: RunImportParams) => {
  const llms = await codeLlmLlm.initLlms(config, ['summarize']);
  log('codeSummaryQuery runImport LLMs', 'silly', { llms });
  const llm = llms.summarize;

  if (!llm) {
    throw new Error('No summarize LLM found');
  }

  const path = config.path;
  const { include, exclude } = toolConfig;

  await importPath(vectorDb, llm, path, include, exclude);

  return { success: true, content: 'success' };
};

export default runImport;
