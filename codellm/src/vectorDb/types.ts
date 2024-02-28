import type { Document, Embedding, Metadata } from 'chromadb';

import type { VECTOR_DBS } from './constants';

export type VectorDb = (typeof VECTOR_DBS)[keyof typeof VECTOR_DBS];

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
