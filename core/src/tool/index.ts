import type { Config, Tools } from '@/.';

import { CodeLlmError, isError, mapMaybe } from '@/error/index.js';
import isEmpty from 'lodash/isEmpty.js';

export const tools: Tools = new Map();

export const getTool = (name: string) => {
  const tool = tools.get(name);
  if (!tool) {
    return new CodeLlmError({ code: 'tool:notFound' });
  }
  return tool;
};

/**
 * Create a new tool instance from the tool library
 *
 * @param config - The configuration object.
 * @param toolName - The name of the tool to create.
 *
 * @returns The new tool instance.
 *
 * @throws If the tool is not found.
 * @throws If there is an error creating the tool.
 */
export const initTools = async (config: Config) => {
  if (isEmpty(config.tools)) return tools;

  const toolInits = Object.entries(config.tools).map(
    async ([name, toolConfig]) => {
      const toolModule = await import(toolConfig.module);
      const tool = await toolModule.newTool(name, config);
      tools.set(name, tool);
      return tool;
    },
  );

  const toolInitsRes = await mapMaybe(toolInits, 'tool:initError');
  if (isError(toolInitsRes)) {
    return toolInitsRes;
  }

  return tools;
};
