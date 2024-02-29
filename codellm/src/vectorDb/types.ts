import type { Document, Embedding, Metadata } from 'chromadb';

export type VectorDb = string;

export type VectorDbClientConfig = Record<string, unknown>;

export type VectorDbConfigItem = {
  module: string;
  config: VectorDbClientConfig;
};

export type VectorDbConfigs = Record<VectorDb, VectorDbConfigItem>;

export type EmbeddingDocument = {
  id: string;
  embedding?: Embedding;
  metadata: Metadata;
  document: Document;
};

export type EmbeddingDocumentList = EmbeddingDocument[];

export type VectorDbAddDocumentsParams = {
  collectionName: string;
  documents: EmbeddingDocumentList;
};

export type VectorDbQueryOpts = {
  query: string;
  numResults: number;
};

export type VectorDbQueryParams = {
  collectionName: string;
  opts: VectorDbQueryOpts;
};

export type VectorDbQueryResultItem = EmbeddingDocument & {
  distances: number[][] | null;
};
export type VectorDbQueryResult = VectorDbQueryResultItem[];

export type VectorDbGetParams = {
  collectionName: string;
  ids: string[];
  limit?: number;
  offset?: number;
};

export type VectorDbGetResultItem = EmbeddingDocument;
export type VectorDbGetResult = VectorDbGetResultItem[];

export type VectorDbClient = {
  init: (collectionNames: string[]) => Promise<void>;
  addDocuments: (params: VectorDbAddDocumentsParams) => Promise<void>;
  // query: (params: VectorDbQueryParams) => Promise<VectorDbQueryResult>;
  // get: (params: VectorDbGetParams) => Promise<VectorDbGetResult>;
  query: (params: VectorDbQueryParams) => Promise<unknown>;
  get: (params: VectorDbGetParams) => Promise<unknown>;
};

export type VectorDbs = Record<VectorDb, VectorDbClient>;
