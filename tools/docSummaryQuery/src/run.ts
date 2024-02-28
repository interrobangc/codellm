import type { ToolRunReturn } from '@interrobangc/codellm';
import type { RunParams } from './types';

import { log } from '@interrobangc/codellm';
import { vectorDbCollectionName as collectionName } from './constants.js';

/**
 * The codeSummaryQuery tool queries a codebase and provides context from a vectordb collection
 * that contains summaries of code files and their contents to an LLM to help answer a user's question.
 *
 * @param Object - The parameters for the run
 * @param Object.llm - The LLM to use for summarization
 * @param Object.params - The parameters for the run
 * @param Object.vectorDb - The vector database client to use
 *
 * @returns - The result of the run
 *
 * @throws - If there is an error running the tool
 */
export const run = async ({
  llm,
  params,
  vectorDb,
}: RunParams): Promise<ToolRunReturn> => {
  log('codeSummaryTool running', 'debug', {
    collectionName,
    params,
    llm,
  });

  //TODO: Validate params

  const dbResponse = await vectorDb.query({
    collectionName,
    opts: {
      query: params['query'] as unknown as string,
      numResults: 5,
    },
  });

  log('codeSummaryTool dbResponse', 'debug', { dbResponse });

  const content = JSON.stringify(
    // @ts-expect-error - types aren't in place yet
    dbResponse.map((d) => ({
      path: d.metadata.path,
      summary: d.document,
      content: d.metadata.content,
      distance: d.distance,
    })),
  );

  return { success: true, content };
};

export default run;
