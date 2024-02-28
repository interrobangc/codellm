import type { ToolRunReturn } from '@interrobangc/codellm';
import type { RunParams } from './types';

import { log } from '@interrobangc/codellm';

/**
 * The codeSummaryQuery tool queries a codebase and provides context from a vectordb collection
 * that contains summaries of code files and their contents to an LLM to help answer a user's question.
 *
 * @param llm - The LLM to use for the query
 *
 * @returns
 */
export const run = async ({
  llm,
  params,
}: RunParams): Promise<ToolRunReturn> => {
  log('codeSummaryTool running', 'debug', {
    llm,
    params,
  });

  return { success: true, content: 'success' };
};

export default run;
