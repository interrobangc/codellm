import type { Embedding, QueryResponse } from 'chromadb';
import * as chromadb from './db/chromadb/index.js';

export const VECTOR_DBS = {
  chromadb: 'chromadb',
} as const;

export type VectorDb = (typeof VECTOR_DBS)[keyof typeof VECTOR_DBS];

export const VECTOR_DB_MODULES = {
  chromadb,
} as const;

export type EmbeddingDocument = {
  id: string;
  embedding?: Embedding;
  metadata: Record<string, string>;
  document: string;
};

export type EmbeddingDocumentList = EmbeddingDocument[];

export type AddDocumentsParams = {
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

export type VectorDbClient = {
  init: () => Promise<void>;
  addDocuments: (params: AddDocumentsParams) => Promise<void>;
  query: (params: VectorDbQueryParams) => Promise<QueryResponse>;
};
