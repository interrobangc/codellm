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
