import type { Config, ToolRunParamsCommon } from '@codellm/core';

export type ToolConfig = {
  maxFileCount: number;
};

export type RunParams = ToolRunParamsCommon & {
  toolConfig: ToolConfig;
};

export type RunImportParams = {
  config: Config;
  toolConfig: ToolConfig;
};
