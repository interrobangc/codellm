import type { LlmClient } from '@/.';

import { z } from 'zod';

export * from './utils/types.js';

export const toolRunParamsParamSchema = z.record(
  z.union([
    z.boolean(),
    z.string(),
    z.number(),
    z.object({}),
    z.array(z.unknown()),
  ]),
);

export type ToolRunParamsParams = z.infer<typeof toolRunParamsParamSchema>;

export type ToolRunParamsCommon = {
  llm: LlmClient;
  params: ToolRunParamsParams;
};

export type ToolRunReturn = {
  additionalPrompt?: string;
  content: string;
  success: boolean;
};

export type ToolConfig = Record<string, unknown>;

export type ToolConfigItem = {
  config: ToolConfig;
  module: string;
};

export type ToolConfigs = Record<string, ToolConfigItem>;

export type ToolDescriptionParamsType = 'array' | 'bool' | 'string' | 'number';

export type ToolDescriptionParams = {
  description: string;
  name: string;
  required: boolean;
  type: ToolDescriptionParamsType;
};

export type ToolDescription = {
  description: string;
  name: string;
  params: ToolDescriptionParams[];
};

export type Tool = {
  description: ToolDescription;
  import?: () => Promise<ToolRunReturn>;
  run: (params: ToolRunParamsCommon) => Promise<ToolRunReturn>;
};

export const isTool = (tool: unknown): tool is Tool => {
  if (typeof tool !== 'object' || tool === null) return false;
  if (!('description' in tool)) return false;
  if (!('import' in tool)) return false;
  if (!('run' in tool)) return false;

  return true;
};

export type Tools = Map<string, Tool>;
