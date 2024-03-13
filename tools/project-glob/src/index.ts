import type {
  Config,
  ProcessFileHandleParams,
  Tool,
  ToolRunParamsCommon,
} from '@codellm/core';
import type { ToolConfig } from './types';

import {
  CodeLlmError,
  initConfig,
  isError,
  log,
  toolUtils,
} from '@codellm/core';
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
  initConfig(config);
  log(`Creating ${toolName} tool`, 'silly', { config });
  const toolConfig = {
    ...DEFAULT_CONFIG,
    ...(config.tools?.[toolName]?.config as Partial<ToolConfig>),
  } as ToolConfig;
  const projectPath = config.paths.project;

  return {
    description,
    run: async ({ params }: ToolRunParamsCommon) => {
      const { globPatterns } = params;

      if (!Array.isArray(globPatterns)) {
        return new CodeLlmError({
          code: 'error:unknown',
          message: 'globPatterns must be an array',
          meta: { globPatterns },
        });
      }

      globPatterns.forEach((pattern, i) => {
        globPatterns[i] = pattern.replace(/^\.\//g, '').trim();
      });

      log('Running projectGlob tool', 'debug', { globPatterns });

      const filePaths: string[] = [];

      const processFilesRes = await toolUtils.processFiles({
        exclude: toolConfig.exclude,
        handle: async ({ filePath }: ProcessFileHandleParams) => {
          filePaths.push(filePath);
        },
        include: globPatterns as string[],
        path: projectPath,
        toolName: 'projectGlob',
      });

      log('projectGlob tool finished', 'debug', { filePaths, processFilesRes });

      if (isError(processFilesRes)) return processFilesRes;

      log('projectGlob tool finished', 'debug', { filePaths });

      return `
#### Count of files that match ${globPatterns.join(', ')} in this project: ${filePaths.length}
#### All file paths that match ${globPatterns.join(', ')} in this project:
${filePaths.join('\n')};
`;
    },
  } as Tool;
};
