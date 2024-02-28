import type { LlmClient } from '@/.';

export * from './utils/types.js';

export type ToolRunParamsParam = Record<
  string,
  boolean | string | number | object | unknown[]
>;

export type ToolRunParamsParams = Record<string, ToolRunParamsParam>;

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
  name: string;
  module: string;
  config: Record<string, unknown>;
};

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
