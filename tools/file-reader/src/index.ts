import type { Config, Tool, ToolRunParamsCommon } from '@codellm/core';
import type { ToolConfig } from './types';

import { fs, initConfig, log, newError } from '@codellm/core';
import { resolve } from 'path';
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
  const toolConfig = {
    ...DEFAULT_CONFIG,
    ...(config.tools?.[toolName]?.config as Partial<ToolConfig>),
  } as ToolConfig;

  const projectPath = config.paths.project;

  return {
    description,
    run: async ({ params }: ToolRunParamsCommon) => {
      const { filePaths } = params;

      if (!Array.isArray(filePaths)) {
        return newError({
          code: 'error:unknown',
          message: 'filePaths must be an array',
          meta: { filePaths },
        });
      }

      if (filePaths.length > toolConfig.maxFileCount) {
        return newError({
          code: 'error:unknown',
          message: `The maximum number of files that can be read is ${toolConfig.maxFileCount}`,
          meta: { filePaths },
        });
      }

      const contents = await Promise.all(
        filePaths.map(async (filePath) => {
          let filePathResolved: string = resolve(filePath);
          if (!filePath.startsWith(filePathResolved)) {
            filePathResolved = resolve(projectPath, filePath);
          }
          log('handling file', 'debug', { filePath, filePathResolved });
          const fileContent = await fs.readFile(filePathResolved);
          return `
#### ${filePath} content:
${fileContent}
#### end ${filePath} content
          `;
        }),
      );

      log('contents', 'debug', { contents });

      const content = contents.join('\n');

      log('content', 'debug', { content });

      return content;
    },
  } as Tool;
};
