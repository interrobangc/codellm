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
  cacheDir: string;
  collectionName: string;
  dbClient: VectorDbClient;
  llm: LlmClient;
  prompt: string;
  toolName: string;
  idPrefix: string;
};

export type RemoveMissingFilesParams = {
  cacheDir: string;
  collectionName: string;
  dbClient: VectorDbClient;
  idPrefix: string;
  toolName: string;
};

export type UpdateTrackingCacheParams = {
  action: 'add' | 'delete';
  cacheDir: string;
  toolName: string;
  idPrefix: string;
  filePath: string;
};
