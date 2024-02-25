import type { VectorDbClient } from '../../../vectorDb/types';
import type { ToolRunParamsCommon } from '../../types';

export type CodeQueryRunParams = ToolRunParamsCommon & {
  vectorDb: VectorDbClient;
};
