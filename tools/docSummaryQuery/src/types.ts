import type {
  Config,
  LlmClient,
  ProcessFileHandleParams,
  ToolRunParamsCommon,
  VectorDbClient,
  VectorizeFilesToolConfig,
} from '@codellm/core';

export type ToolConfig = VectorizeFilesToolConfig;

export type RunParams = ToolRunParamsCommon & {
  dbClient: VectorDbClient;
  toolConfig: ToolConfig;
};

export type RunImportParams = {
  config: Config;
  dbClient: VectorDbClient;
  toolConfig: ToolConfig;
};

export type HandleFileParams = ProcessFileHandleParams & {
  dbClient: VectorDbClient;
  llm: LlmClient;
};
