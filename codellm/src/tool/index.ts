import type { Config, Tool, ToolName } from '@/.';
import { TOOL_MODULES } from './constants.js';

export const newTool = async (
  config: Config,
  toolName: ToolName,
): Promise<Tool> => {
  const toolModule = TOOL_MODULES[toolName];
  return toolModule.newTool(config);
};

export * from './types.js';
export * from './constants.js';
