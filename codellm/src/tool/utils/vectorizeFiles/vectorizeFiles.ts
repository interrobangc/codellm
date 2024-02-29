import type {
  LlmClient,
  ProcessFileHandleParams,
  VectorDbAddDocumentsParams,
  VectorizeFileParams,
  VectorizeFilesParams,
} from '@/.';

import { llm as codeLlmLlm, log, toolUtils } from '@/index.js';

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

/**
 * Handle a single file by summarizing it and adding it to the database
 *
 * @param dbClient - The vector database client to use
 * @param llm - The LLM to use for summarization
 * @param path - The path to the file to handle
 */
export const vectorizeFile = async ({
  dbClient,
  llm,
  fileContent,
  fileContentHash,
  filePath,
  filePathHash,
  collectionName,
  prompt,
}: VectorizeFileParams) => {
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

  const path = config.path;
  const { include, exclude } = toolConfig;

  await toolUtils.processFiles({
    toolName,
    path,
    include,
    exclude,
    handle: (params: ProcessFileHandleParams) =>
      vectorizeFile({
        dbClient,
        llm,
        collectionName: toolConfig.vectorDbCollectionName,
        prompt: prompts.summarize,
        ...params,
      }),
  });
};
