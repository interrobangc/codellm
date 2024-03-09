import type { Config, Tool, ToolRunParamsCommon } from '@codellm/core';
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
export const newTool = async (
  toolName: string,
  config: Config,
): Promise<Tool> => {
  const toolConfig = {
    ...DEFAULT_CONFIG,
    ...(config.tools?.[toolName]?.config as Partial<ToolConfig>),
  } as ToolConfig;

  return {
    description,
    import: async () => ({
      content: 'unimplemented',
      success: true,
    }),
    run: async (params: ToolRunParamsCommon) =>
      run({
        ...params,
        toolConfig,
      }),
  };
};
