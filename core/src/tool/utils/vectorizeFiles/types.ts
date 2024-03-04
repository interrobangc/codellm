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

export type VectorizeFilesMetadata = {
  fileContent: string;
  fileContentHash: string;
  filePath: string;
  filePathHash: string;
};

export type VectorizeFilesAdditionalMetadataFn = (
  params: VectorizeFilesMetadata,
) => Promise<Record<string, unknown>>;

export type VectorizeFilesNewClientParams = {
  config: Config;
  toolConfig: VectorizeFilesToolConfig;
  toolName: string;
};

export type VectorizeFilesParams = VectorizeFilesNewClientParams & {
  additionalMetadataFn: VectorizeFilesAdditionalMetadataFn | undefined;
  dbClient: VectorDbClient;
  prompts: VectorizeFilesPrompts;
};

export type VectorizeFileParams = ProcessFileHandleParams & {
  additionalMetadataFn: VectorizeFilesAdditionalMetadataFn | undefined;
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
