import type { Config, Tool, ToolRunParamsCommon } from '@interrobangc/codellm';
import type { ToolConfig } from './types';

import { vectorDb } from '@interrobangc/codellm';
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
  const toolConfig = {
    ...DEFAULT_CONFIG,
    ...(config.tools?.[toolName]?.config as Partial<ToolConfig>),
  } as ToolConfig;

  const { vectorDbName } = toolConfig;

  const dbClient = await vectorDb.newClient(vectorDbName, config);
  await dbClient.init([vectorDbCollectionName]);

  return {
    run: async (params: ToolRunParamsCommon) =>
      run({
        ...params,
        toolConfig,
        dbClient,
      }),
    import: async () => runImport({ config, toolConfig, dbClient }),
    description,
  };
};
