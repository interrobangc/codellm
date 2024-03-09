import type { Tools } from '@/.';

import isEmpty from 'lodash/isEmpty.js';
import { getConfig } from '@/config/index.js';
import { CodeLlmError, isError, promiseMapMaybe } from '@/error/index.js';
import { log } from '@/log/index.js';

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
 * @returns - The new tool instance or an error
 */
export const initTools = async () => {
  const config = getConfig();
  if (isEmpty(config.tools)) return tools;

  const toolInits = Object.entries(config.tools).map(
    async ([name, toolConfig]) => {
      const toolModule = await import(toolConfig.module);
      const tool = await toolModule.newTool(name, config);
      tools.set(name, tool);
      return tool;
    },
  );

  const toolInitsRes = await promiseMapMaybe(toolInits, 'tool:initError');
  if (isError(toolInitsRes)) {
    return toolInitsRes;
  }

  log('initTools result', 'silly', {
    toolInitsRes,
  });

  return tools;
};
