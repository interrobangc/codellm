import type { Config, Tool, ToolRunParamsCommon } from '@interrobangc/codellm';

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
    // @ts-expect-error - types aren't in place yet
    ...config.tools?.[toolName]?.config,
  };

  return {
    run: async (params: ToolRunParamsCommon) =>
      run({
        ...params,
        toolConfig,
      }),
    import: async () => ({
      success: true,
      content: 'unimplemented',
    }),
    description,
  };
};
