import type { ToolRunParamsCommon } from '@interrobangc/codellm';

export type ToolConfig = {
  filePath: string;
};

export type RunParams = ToolRunParamsCommon & {
  toolConfig: ToolConfig;
};
