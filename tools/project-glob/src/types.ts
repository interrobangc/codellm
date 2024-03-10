import type { Config, ToolRunParamsCommon } from '@codellm/core';

export type ToolConfig = {
  exclude: string[];
};

export type RunParams = ToolRunParamsCommon & {
  toolConfig: ToolConfig;
};

export type RunImportParams = {
  config: Config;
  toolConfig: ToolConfig;
};
