import type { LlmClient, VectorDbCollection } from '@/.';
import * as generalCodeQuery from './general/codeQuery/index.js';

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

export const TOOLS = {
  'general.codeQuery': 'general.codeQuery',
} as const;

export const TOOL_MODULES = {
  'general.codeQuery': generalCodeQuery,
};

export type ToolName = (typeof TOOLS)[keyof typeof TOOLS];

export type Tools = Record<ToolName, Tool>;
