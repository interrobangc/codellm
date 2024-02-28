import type {
  Config,
  ToolRunParamsCommon,
  VectorDbClient,
} from '@interrobangc/codellm';

export type ToolConfig = {
  include: string[];
  exclude: string[];
};

export type RunParams = ToolRunParamsCommon & {
  toolConfig: ToolConfig;
  vectorDb: VectorDbClient;
};

export type RunImportParams = {
  config: Config;
  toolConfig: ToolConfig;
  vectorDb: VectorDbClient;
};
