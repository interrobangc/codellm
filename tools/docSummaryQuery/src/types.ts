import type {
  Config,
  LlmClient,
  ProcessFileHandleParams,
  ProcessFilesToolConfig,
  ToolRunParamsCommon,
  VectorDbClient,
} from '@interrobangc/codellm';

export type ToolConfig = ProcessFilesToolConfig;

export type RunParams = ToolRunParamsCommon & {
  toolConfig: ToolConfig;
  vectorDb: VectorDbClient;
};

export type RunImportParams = {
  config: Config;
  toolConfig: ToolConfig;
  vectorDb: VectorDbClient;
};

export type HandleFileParams = ProcessFileHandleParams & {
  dbClient: VectorDbClient;
  llm: LlmClient;
};
