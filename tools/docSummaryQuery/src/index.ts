import type { Config, Tool, ToolRunParamsCommon } from '@interrobangc/codellm';

import { vectorDb as codeLlmVectorDb } from '@interrobangc/codellm';
import {
  DEFAULT_CONFIG,
  description,
  vectorDbCollectionName,
} from './constants.js';
import run from './run.js';
import runImport from './runImport.js';

/**
 * Create a new codeSummaryQuery tool
 *
 * @param toolName - The name of the tool
 * @param config - The configuration to use
 *
 * @returns - The new tool instance
 */
export const newTool = async (
  toolName: string,
  config: Config,
): Promise<Tool> => {
  const vectorDb = await codeLlmVectorDb.newClient(config);
  await vectorDb.init([vectorDbCollectionName]);

  const toolConfig = {
    ...DEFAULT_CONFIG,
    // @ts-expect-error - types aren't in place yet
    ...config.tools?.[toolName]?.config,
  };

  return {
    run: async (params: ToolRunParamsCommon) =>
      run({
        ...params,
        toolConfig,
        vectorDb,
      }),
    import: async () => runImport({ config, toolConfig, vectorDb }),
    description,
  };
};
