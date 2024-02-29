import type {
  Config,
  LlmClient,
  ProcessFileHandleParams,
  ProcessFilesToolConfig,
  ToolRunParamsCommon,
  VectorDbClient,
  VectorDbToolConfig,
} from '@interrobangc/codellm';

export type ToolConfig = ProcessFilesToolConfig & VectorDbToolConfig;

export type RunParams = ToolRunParamsCommon & {
  toolConfig: ToolConfig;
  dbClient: VectorDbClient;
};

export type RunImportParams = {
  config: Config;
  toolConfig: ToolConfig;
  dbClient: VectorDbClient;
};

export type HandleFileParams = ProcessFileHandleParams & {
  dbClient: VectorDbClient;
  llm: LlmClient;
};
