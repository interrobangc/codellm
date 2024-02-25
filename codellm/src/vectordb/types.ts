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
