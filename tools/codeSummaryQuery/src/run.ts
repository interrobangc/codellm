import type { ToolRunReturn } from '@interrobangc/codellm';
import type { RunParams } from './types';

import { log } from '@interrobangc/codellm';
import { vectorDbCollectionName as collectionName } from './constants.js';

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
  llm,
  params,
  userPrompt,
  vectorDb,
}: RunParams): Promise<ToolRunReturn> => {
  log('codeSummaryTool running', 'debug', {
    collectionName,
    params,
    llm,
    userPrompt,
  });

  const dbResponse = await vectorDb.query({
    collectionName,
    opts: {
      query: userPrompt,
      numResults: 5,
    },
  });

  log('codeSummaryTool dbResponse', 'debug', { dbResponse });

  const content = JSON.stringify(
    // @ts-expect-error - types aren't in place yet
    dbResponse.map((d) => ({
      path: d.metadata.path,
      summary: d.document,
      code: params['includeCode'] ? d.metadata.content : undefined,
      distance: d.distance,
    })),
  );

  return { success: true, content };
};

export default run;
