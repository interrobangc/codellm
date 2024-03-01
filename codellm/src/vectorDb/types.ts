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

export type VectorDbClient = {
  addDocuments: (params: VectorDbAddDocumentsParams) => Promise<void>;
  deleteDocuments: (params: VectorDbDeleteParams) => Promise<void>;
  get: (params: VectorDbGetParams) => Promise<unknown>;
  init: (collectionNames: string[]) => Promise<void>;
  query: (params: VectorDbQueryParams) => Promise<VectorDbQueryResult>;
};

export type VectorDbs = Record<VectorDb, VectorDbClient>;
