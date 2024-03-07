import type {
  Config,
  Tool,
  ToolRunParamsCommon,
  ToolRunReturn,
} from '@codellm/core';
import type { ToolConfig } from './types';

import { log, toolUtils } from '@codellm/core';
import { DEFAULT_CONFIG, description } from './constants.js';

/**
 * Create a new fileReader tool
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
  log(`Creating ${toolName} tool`, 'silly', { config });
  const toolConfig = {
    ...DEFAULT_CONFIG,
    ...(config.tools?.[toolName]?.config as Partial<ToolConfig>),
  } as ToolConfig;
  const projectPath = config.paths.project;

  return {
    run: async ({ params }: ToolRunParamsCommon): Promise<ToolRunReturn> => {
      const { globPatterns } = params;

      if (!Array.isArray(globPatterns)) {
        return {
          success: false,
          content: 'globPatterns must be an array',
        };
      }

      log('Running projectGlob tool', 'debug', { globPatterns });

      const filePaths: string[] = [];

      try {
        await toolUtils.processFiles({
          toolName: 'projectGlob',
          path: projectPath,
          include: globPatterns as string[],
          exclude: toolConfig.exclude,
          handle: async ({ filePath }) => {
            filePaths.push(filePath);
          },
        });
      } catch (error) {
        return {
          success: false,
          content: String(error),
        };
      }

      log('projectGlob tool finished', 'debug', { filePaths });

      const content = filePaths.join('\n');

      return { success: true, content };
    },
    import: async () => {
      return {
        success: true,
        content: 'unimplemented',
      };
    },
    description,
  };
};
