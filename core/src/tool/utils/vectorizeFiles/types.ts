import type {
  Config,
  LlmClient,
  ProcessFileHandleParams,
  ProcessFilesToolConfig,
  VectorDbClient,
} from '@/.';

export type VectorizeFilesToolConfig = ProcessFilesToolConfig & {
  vectorDbCollectionName: string;
  vectorDbName: string;
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
  basePath: string;
  cacheDir: string;
  collectionName: string;
  dbClient: VectorDbClient;
  idPrefix: string;
  llm: LlmClient;
  prompt: string;
};

export type RemoveMissingFilesParams = {
  cacheDir: string;
  collectionName: string;
  dbClient: VectorDbClient;
  idPrefix: string;
};

export type UpdateTrackingCacheParams = {
  action: 'add' | 'delete';
  cacheDir: string;
  filePath: string;
  idPrefix: string;
};
