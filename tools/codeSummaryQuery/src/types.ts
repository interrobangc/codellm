import type {
  Config,
  ToolRunParamsCommon,
  VectorDbClient,
  VectorizeFilesToolConfig,
} from '@interrobangc/codellm';

export type ToolConfig = VectorizeFilesToolConfig;

export type RunParams = ToolRunParamsCommon & {
  toolConfig: ToolConfig;
  dbClient: VectorDbClient;
};

export type RunImportParams = {
  config: Config;
  toolConfig: ToolConfig;
  dbClient: VectorDbClient;
};
