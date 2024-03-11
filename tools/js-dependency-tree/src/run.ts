import type { RunParams } from './types';

import { log } from '@codellm/core';

/**
 * The codeSummaryQuery tool queries a codebase and provides context from a vectordb collection
 * that contains summaries of code files and their contents to an LLM to help answer a user's question.
 *
 * @param llm - The LLM to use for the query
 *
 * @returns
 */
export const run = async ({ llm, params }: RunParams) => {
  log('codeSummaryTool running', 'debug', {
    llm,
    params,
  });

  return 'success';
};

export default run;
