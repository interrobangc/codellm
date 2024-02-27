import type { MessageList, ToolRunReturn } from '@interrobangc/codellm';
import type { CodeSummaryQueryRunParams } from './types';

import { log } from '@interrobangc/codellm';

/**
 * The codeSummaryQuery tool queries a codebase and provides context from a vectordb collection
 * that contains summaries of code files and their contents to an LLM to help answer a user's question.
 *
 * @param basePrompt - The base prompt to use for the Tool
 * @param collectionName - The collection in the vector db to use for the query
 * @param includeCode - Whether to include code in the response
 * @param llm - The LLM to use for the query
 * @param userPrompt - The user's question or prompt
 * @param vectorDb - The vector db to use for the query
 *
 * @returns
 */
export const run = async ({
  basePrompt,
  collectionName,
  includeCode,
  llm,
  userPrompt,
  vectorDb,
}: CodeSummaryQueryRunParams): Promise<ToolRunReturn> => {
  log('qaTool running', 'debug', {
    basePrompt,
    collectionName,
    includeCode,
    llm,
    userPrompt,
  });

  const dbResponse = await vectorDb.query({
    collectionName,
    opts: {
      query: userPrompt,
      numResults: 7,
    },
  });

  log('qaTool dbResponse', 'debug', { dbResponse });

  // @ts-expect-error - types aren't in place yet
  const contexts = dbResponse.map(
    // @ts-expect-error - types aren't in place yet
    (doc) => `filename: ${doc.metadata.path}\n\ncode:\n${doc.metadata.content}`,
  );

  const messages: MessageList = [
    {
      role: 'system',
      content: `
        ${basePrompt}
        Use the following contexts to help answer the question:
        ${contexts.join('\n\n')}
      `,
    },
    {
      role: 'user',
      content: userPrompt,
    },
  ];

  const content = await llm.chat(messages);

  log('qaTool Lresponse', 'debug', { content });

  return { success: true, content };
};

export default run;
