import type { Config, Tool, ToolRunParamsCommon } from '@interrobangc/codellm';

import { vectorDb as codeLlmVectorDb } from '@interrobangc/codellm';
import run from './run.js';
import runImport from './runImport.js';

/**
 * Create a new codeSummaryQuery tool
 *
 * @param config - The configuration to use
 *
 * @returns - The new tool instance
 */
export const newTool = async (
  toolName: string,
  config: Config,
): Promise<Tool> => {
  const vectorDb = await codeLlmVectorDb.newClient(config);
  await vectorDb.init();

  return {
    run: async (params: ToolRunParamsCommon) => run({ ...params, vectorDb }),
    import: async () => runImport(toolName, config, vectorDb),
  };
};
