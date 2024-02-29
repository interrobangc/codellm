import type {
  LlmClient,
  ProcessFileHandleParams,
  VectorDbAddDocumentsParams,
} from '@interrobangc/codellm';
import type { HandleFileParams, RunImportParams } from './types.js';

import { llm as codeLlmLlm, log, toolUtils } from '@interrobangc/codellm';
import {
  vectorDbCollectionName as collectionName,
  summarizeTaskPrompt,
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
export const summarize = async (llm: LlmClient, code: string) => {
  return llm.prompt({
    system: '',
    prompt: `
    ${summarizeTaskPrompt}
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
export const handleFile = async ({
  dbClient,
  llm,
  fileContent,
  fileContentHash,
  filePath,
  filePathHash,
}: HandleFileParams) => {
  // TODO: dynamic for different passes in a single run
  const id = `codeSummary:${filePath}`;

  // TODO: track files that have been processed and check fo deletions

  const existingDocument = await dbClient.get({
    collectionName,
    ids: [id],
  });

  if (
    // @ts-expect-error - types aren't in place yet
    existingDocument.documents.length > 0 &&
    // @ts-expect-error - types aren't in place yet
    existingDocument.metadatas[0].fileContentHash === fileContentHash
  ) {
    log(`Document ${id} is already up to date, skipping`);
    return;
  }

  const response = await summarize(llm, `file: ${filePath}\n\n${fileContent}`);

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
  dbClient,
}: RunImportParams) => {
  const llms = await codeLlmLlm.initLlms(config, ['summarize']);
  log('codeSummaryQuery runImport LLMs', 'silly', { llms });
  const llm = llms.summarize;

  if (!llm) {
    throw new Error('No summarize LLM found');
  }

  const path = config.path;
  const { include, exclude } = toolConfig;

  await toolUtils.processFiles({
    toolName: 'codeSummaryQuery',
    path,
    include,
    exclude,
    handle: (params: ProcessFileHandleParams) =>
      handleFile({
        dbClient,
        llm,
        ...params,
      }),
  });

  return { success: true, content: 'success' };
};

export default runImport;
