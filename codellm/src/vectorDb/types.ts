import type { Document, Embedding, Metadata } from 'chromadb';
import * as chromadb from './db/chromadb/index.js';

export const VECTOR_DB_COLLECTIONS = {
  fileSummary: 'fileSummary',
} as const;

export type VectorDbCollection =
  (typeof VECTOR_DB_COLLECTIONS)[keyof typeof VECTOR_DB_COLLECTIONS];

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
  metadata: Metadata;
  document: Document;
};

export type EmbeddingDocumentList = EmbeddingDocument[];

export type AddDocumentsParams = {
  collectionName: VectorDbCollection;
  documents: EmbeddingDocumentList;
};

export type VectorDbQueryOpts = {
  query: string;
  numResults: number;
};

export type VectorDbQueryParams = {
  collectionName: VectorDbCollection;
  opts: VectorDbQueryOpts;
};

export type VectorDbQueryResultItem = EmbeddingDocument & {
  distances: number[][] | null;
};
export type VectorDbQueryResult = VectorDbQueryResultItem[];

export type VectorDbGetParams = {
  collectionName: VectorDbCollection;
  ids: string[];
  limit?: number;
  offset?: number;
};

export type VectorDbGetResultItem = EmbeddingDocument;
export type VectorDbGetResult = VectorDbGetResultItem[];

export type VectorDbClient = {
  init: () => Promise<void>;
  addDocuments: (params: AddDocumentsParams) => Promise<void>;
  // query: (params: VectorDbQueryParams) => Promise<VectorDbQueryResult>;
  // get: (params: VectorDbGetParams) => Promise<VectorDbGetResult>;
  query: (params: VectorDbQueryParams) => Promise<unknown>;
  get: (params: VectorDbGetParams) => Promise<unknown>;
};
