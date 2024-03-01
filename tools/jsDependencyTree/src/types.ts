import type { ToolRunParamsCommon } from '@codellm/core';

export type ToolConfig = {
  filePath: string;
};

export type RunParams = ToolRunParamsCommon & {
  toolConfig: ToolConfig;
};
