import type { Config, Tools } from '@/.';

import isEmpty from 'lodash/isEmpty.js';

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
export const initTools = async (config: Config): Promise<Tools> => {
  if (isEmpty(config.tools)) return {};

  const tools: Tools = {};

  const toolInits = Object.entries(config.tools).map(async ([name, tool]) => {
    const toolModule = await import(tool.module);
    tools[name] = await toolModule.newTool(name, config);
  });

  await Promise.all(toolInits);

  return tools;
};
