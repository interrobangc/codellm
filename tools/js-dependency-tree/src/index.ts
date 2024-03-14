import type { Config, Tool, ToolRunParamsCommon } from '@codellm/core';
import { initConfig } from '@codellm/core';
import type { ToolConfig } from './types';

import { DEFAULT_CONFIG, description } from './constants.js';
import run from './run.js';

/**
 * Create a new codeSummaryQuery tool
 *
 * @param config - The configuration to use
 *
 * @returns - The new tool instance
 */
export const newTool = async (toolName: string, config: Config) => {
  initConfig(config);
  const toolConfig = {
    ...DEFAULT_CONFIG,
    ...(config.tools?.[toolName]?.config as Partial<ToolConfig>),
  } as ToolConfig;

  return {
    description,
    run: async (params: ToolRunParamsCommon) =>
      run({
        ...params,
        toolConfig,
      }),
  } as Tool;
};
