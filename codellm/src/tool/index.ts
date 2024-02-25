import type { Config } from '../config';
import type { Tool, ToolName } from './types';
import { TOOL_MODULES } from './types.js';

export const newTool = async (
  config: Config,
  toolName: ToolName,
): Promise<Tool> => {
  const toolModule = TOOL_MODULES[toolName];
  const tool = await toolModule.newTool(config);

  return tool;
};

export * from './types.js';
