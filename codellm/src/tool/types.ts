import type { LlmClient, VectorDbCollection } from '@/.';

export type ToolRunParamsCommon = {
  basePrompt: string;
  collectionName: VectorDbCollection;
  includeCode: boolean;
  llm: LlmClient;
  userPrompt: string;
};

export type ToolRunReturn = {
  success: boolean;
  content: string;
};

export type Tool = {
  run: (params: ToolRunParamsCommon) => Promise<ToolRunReturn>;
  import?: () => Promise<ToolRunReturn>;
};

export type ToolConfigItem = {
  name: string;
  module: string;
  config: Record<string, unknown>;
};

export type Tools = Record<string, Tool>;
