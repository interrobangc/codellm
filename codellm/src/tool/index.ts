import type { Config, Tool, ToolName } from '@/.';
import { TOOL_MODULES } from './constants.js';

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
export const newTool = async (
  config: Config,
  toolName: ToolName,
): Promise<Tool> => {
  const toolModule = TOOL_MODULES[toolName];
  return toolModule.newTool(config);
};

export * from './types.js';
export * from './constants.js';
