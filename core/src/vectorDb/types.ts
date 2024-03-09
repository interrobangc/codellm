import type { Document, Embedding, Metadata } from 'chromadb';

export type VectorDb = string;

export type VectorDbClientConfig = Record<string, unknown>;

export type VectorDbConfigItem = {
  config: VectorDbClientConfig;
  module: string;
};

export type VectorDbConfigs = Record<VectorDb, VectorDbConfigItem>;

export type EmbeddingDocument = {
  document: Document;
  embedding?: Embedding;
  id: string;
  metadata: Metadata;
};

export type EmbeddingDocumentList = EmbeddingDocument[];

export type VectorDbAddDocumentsParams = {
  collectionName: string;
  documents: EmbeddingDocumentList;
};

export type VectorDbQueryOpts = {
  numResults: number;
  query: string;
};

export type VectorDbQueryParams = {
  collectionName: string;
  opts: VectorDbQueryOpts;
};

export type VectorDbQueryResultItem = EmbeddingDocument & {
  distance: number | null;
};

export type VectorDbQueryResult = VectorDbQueryResultItem[];

export type VectorDbGetParams = {
  collectionName: string;
  ids: string[];
  limit?: number;
  offset?: number;
};

export type VectorDbDeleteParams = {
  collectionName: string;
  ids: string[];
};

export type VectorDbGetResultItem = EmbeddingDocument;
export type VectorDbGetResult = VectorDbGetResultItem[];

export type VectorDbModule = {
  newClient: (config: VectorDbClientConfig) => Promise<VectorDbClient>;
};

export const isVectorDbModule = (module: unknown): module is VectorDbModule => {
  return (
    typeof module === 'object' &&
    module !== null &&
    typeof (module as VectorDbModule).newClient === 'function'
  );
};

export type VectorDbClient = {
  addDocuments: (params: VectorDbAddDocumentsParams) => Promise<void>;
  deleteDocuments: (params: VectorDbDeleteParams) => Promise<void>;
  get: (params: VectorDbGetParams) => Promise<unknown>;
  init: (collectionNames: string[]) => Promise<void>;
  query: (params: VectorDbQueryParams) => Promise<VectorDbQueryResult>;
  reset: () => Promise<void>;
};

export type VectorDbs = Map<VectorDb, VectorDbClient>;
