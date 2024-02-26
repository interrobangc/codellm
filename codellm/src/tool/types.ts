import type { LlmClient, VectorDbCollection } from '@/.';
import type { TOOLS_TYPE } from './constants.js';

export * from './general/codeQuery/types.js';

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
};

export type ToolName = (typeof TOOLS_TYPE)[keyof typeof TOOLS_TYPE];

export type Tools = Record<ToolName, Tool>;
