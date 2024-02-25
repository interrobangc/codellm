import { newClient } from '../../../vectorDb/index.js';
import log from '../../../log/index.js';

import type { Config } from '../../../config';
import type { Tool, ToolRunParamsCommon, ToolRunReturn } from '../../types';
import type { CodeQueryRunParams } from './types';

/**
 * The general.codeQuery tool queries a codebase and generates responses using
 * an LLM. It is a general tool that can be used to query any codebase
 *
 * @param param0
 * @param basePrompt - The base prompt to use for the Tool
 * @param collectionName - The collection in the vector db to use for the query
 * @param includeCode - Whether to include code in the response
 * @param userPrompt - The user's question or prompt
 * @param llm - The LLM to use for the query
 * @param vectorDb - The vector db to use for the query
 * @returns
 */
export const run = async ({
  basePrompt,
  collectionName,
  includeCode,
  llm,
  userPrompt,
  vectorDb,
}: CodeQueryRunParams): Promise<ToolRunReturn> => {
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

  return { success: true, content: 'qaTool ran' };
};

export const newTool = async (config: Config): Promise<Tool> => {
  const vectorDb = await newClient(config);
  await vectorDb.init();

  return {
    run: async (params: ToolRunParamsCommon) => run({ ...params, vectorDb }),
  };
};
