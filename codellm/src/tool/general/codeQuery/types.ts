import type { ToolRunParamsCommon, VectorDbClient } from '@/.';

export type CodeQueryRunParams = ToolRunParamsCommon & {
  vectorDb: VectorDbClient;
};
