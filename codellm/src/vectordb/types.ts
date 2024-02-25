import type { Embedding } from 'chromadb';

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
  query: (params: VectorDbQueryParams) => Promise<EmbeddingDocumentList>;
};
