import type {
  Config,
  ProcessFileHandleParams,
  Tool,
  ToolRunParamsCommon,
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
export const newTool = async (toolName: string, config: Config) => {
  log(`Creating ${toolName} tool`, 'silly', { config });
  const toolConfig = {
    ...DEFAULT_CONFIG,
    ...(config.tools?.[toolName]?.config as Partial<ToolConfig>),
  } as ToolConfig;
  const projectPath = config.paths.project;

  return {
    description,
    import: async () => {
      return {
        content: 'unimplemented',
        success: true,
      };
    },
    run: async ({ params }: ToolRunParamsCommon) => {
      const { globPatterns } = params;

      if (!Array.isArray(globPatterns)) {
        return {
          content: 'globPatterns must be an array',
          success: false,
        };
      }

      globPatterns.forEach((pattern, i) => {
        globPatterns[i] = pattern.replace(/^\.\//g, '').trim();
      });

      log('Running projectGlob tool', 'debug', { globPatterns });

      const filePaths: string[] = [];

      // TODO: use mayFail and CodeLlmErrors instead of try/catch
      try {
        await toolUtils.processFiles({
          exclude: toolConfig.exclude,
          handle: async ({ filePath }: ProcessFileHandleParams) => {
            filePaths.push(filePath);
          },
          include: globPatterns as string[],
          path: projectPath,
          toolName: 'projectGlob',
        });
      } catch (error) {
        return {
          content: String(error),
          success: false,
        };
      }

      log('projectGlob tool finished', 'debug', { filePaths });

      const content = `
#### Count of files that match ${globPatterns.join(', ')} in this project: ${filePaths.length}
#### All file paths that match ${globPatterns.join(', ')} in this project:
${filePaths.join('\n')};
`;

      return { content, success: true };
    },
  } as Tool;
};
