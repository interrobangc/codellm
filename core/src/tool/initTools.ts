import type { ToolConfigItem } from '@/.';

import isEmpty from 'lodash/isEmpty.js';
import { getConfig } from '@/config/index.js';
import { isError, mayFail, promiseMapMayFail } from '@/error/index.js';
import { log } from '@/log/index.js';
import { toolSchema } from './types.js';
import { getTools, setTool } from './tools.js';
import { importTool } from './importTool.js';

export const initTool = async ([name, toolConfig]: [
  string,
  ToolConfigItem,
]) => {
  const toolModule = await importTool(toolConfig.module);
  if (isError(toolModule)) return toolModule;

  const config = getConfig();
  const tool = await toolModule.newTool(name, config);
  if (isError(tool)) return tool;

  const validatedTool = mayFail(
    () => toolSchema.parse(tool),
    'tool:invalidTool',
    { name, tool },
  );
  if (isError(validatedTool)) return validatedTool;

  setTool(name, validatedTool);
  return validatedTool;
};

/**
 * Create a new tool instance from the tool library
 *
 * @returns The tool library or an error
 */
export const initTools = async () => {
  const config = getConfig();
  if (isEmpty(config.tools)) return getTools();

  const toolInitMap = Object.entries(config.tools).map(initTool);
  const toolInitsRes = await promiseMapMayFail(toolInitMap, 'tool:init');
  if (isError(toolInitsRes)) return toolInitsRes;

  log('initTools result', 'silly', {
    toolInitsRes,
  });

  return getTools();
};

export default initTools;
