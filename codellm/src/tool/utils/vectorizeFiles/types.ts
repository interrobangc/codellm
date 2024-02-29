import type {
  Config,
  LlmClient,
  ProcessFileHandleParams,
  ProcessFilesToolConfig,
  VectorDbClient,
} from '@/.';

export type VectorizeFilesToolConfig = ProcessFilesToolConfig & {
  vectorDbName: string;
  vectorDbCollectionName: string;
};

export type VectorizeFilesPrompts = {
  summarize: string;
};

export type VectorizeFilesParams = {
  config: Config;
  dbClient: VectorDbClient;
  prompts: VectorizeFilesPrompts;
  toolConfig: VectorizeFilesToolConfig;
  toolName: string;
};

export type VectorizeFileParams = ProcessFileHandleParams & {
  collectionName: string;
  dbClient: VectorDbClient;
  llm: LlmClient;
  prompt: string;
};
