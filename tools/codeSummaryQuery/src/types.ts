import type {
  ToolRunParamsCommon,
  VectorDbClient,
} from '@interrobangc/codellm';

export type CodeSummaryQueryRunParams = ToolRunParamsCommon & {
  vectorDb: VectorDbClient;
};
