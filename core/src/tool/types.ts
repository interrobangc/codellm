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
  success: boolean;
  content: string;
};

export type ToolConfig = Record<string, unknown>;

export type ToolConfigItem = {
  module: string;
  config: ToolConfig;
};

export type ToolConfigs = Record<string, ToolConfigItem>;

export type ToolDescriptionParamsType = 'bool' | 'string' | 'number';

export type ToolDescriptionParams = {
  name: string;
  description: string;
  type: ToolDescriptionParamsType;
  required: boolean;
};

export type ToolDescription = {
  name: string;
  description: string;
  taskPrompt: string;
  params: ToolDescriptionParams[];
};

export type Tool = {
  run: (params: ToolRunParamsCommon) => Promise<ToolRunReturn>;
  import?: () => Promise<ToolRunReturn>;
  description: ToolDescription;
};
export type Tools = Record<string, Tool>;
