import type {
  AddParams,
  CreateCollectionParams as ChromaCreateCollectionParams,
  Collection,
} from 'chromadb';
import {
  ChromaClient,
  // Embedding,
  IncludeEnum,
} from 'chromadb';

import log from '../../../log/index.js';
import type {
  EmbeddingDocumentList,
  VectorDbAddDocumentsParams,
  VectorDbClient,
  VectorDbGetParams,
  VectorDbQueryParams,
} from '../../types';
import { VECTOR_DB_COLLECTIONS } from '../../types.js';

export type CreateCollectionParams = {
  client: ChromaClient;
  params: ChromaCreateCollectionParams;
};

export const createCollection = async ({
  client,
  params,
}: CreateCollectionParams) => {
  // TODO: there is currently a bug in the ChromaClient for create collection:
  // See: https://github.com/chroma-core/chroma/issues/1746
  // try {
  //   const collection = await client.getCollection(params);
  //   if (collection) return collection;
  // } catch (e) {
  //   // do nothing
  // }

  return client.getOrCreateCollection(params);
};

const collections: Record<string, Collection> = {};

export const getCollection = (collectionName: string) => {
  const collection = collections[collectionName];

  if (!collection) {
    throw new Error(`Collection ${collectionName} not found`);
  }

  return collection;
};

export const convertDocuments = (
  documentList: EmbeddingDocumentList,
): AddParams => {
  const ids = documentList.map((doc) => doc.id);
  // const embeddings: Embedding[] = documentList.map(
  //   (doc) => doc.embedding ?? [],
  // );
  const metadatas = documentList.map((doc) => doc.metadata);
  const documents = documentList.map((doc) => doc.document);

  const ret: AddParams = {
    ids,
    metadatas,
    documents,
  };

  // TODO: this will need a flag when we start allowing other ebedding functions
  // if (embeddings.length > 0) {
  //   ret.embeddings = embeddings;
  // }

  return ret;
};

export const addDocuments = async ({
  collectionName,
  documents,
}: VectorDbAddDocumentsParams) => {
  log(`vectorDB.addDocuments: Adding documents to ${collectionName}`, 'debug', {
    documents,
  });
  const collection = getCollection(collectionName);
  await collection.add(convertDocuments(documents));
};

export const newClient = async (): Promise<VectorDbClient> => {
  const client = new ChromaClient();

  return {
    init: async () => {
      await Promise.all(
        Object.entries(VECTOR_DB_COLLECTIONS).map(
          async ([, collectionName]) => {
            collections[collectionName] = await createCollection({
              client,
              params: {
                name: collectionName,
              },
            });

            log(`vectorDB.init: Initialized ${collectionName}`, 'debug');
            log(`vectorDB.init: Collection ${collectionName} Peek`, 'silly', {
              peek: await collections[collectionName]?.peek(),
            });
          },
        ),
      );
    },
    addDocuments,

    query: async ({
      collectionName,
      opts: { query, numResults },
    }: VectorDbQueryParams) => {
      log(`vectorDB.query: Querying ${collectionName}`, 'silly', {
        query,
        numResults,
      });
      const collection = getCollection(collectionName);
      const resp = await collection.query({
        queryTexts: query,
        nResults: numResults,
      });

      log(`vectorDB.query: Query response`, 'silly', { resp });

      return resp.ids?.[0]?.map((id, i) => ({
        id,
        metadata: resp.metadatas?.[0]?.[i],
        document: resp.documents?.[0]?.[i],
        distance: resp.distances?.[0]?.[i] ?? 0,
      }));
    },

    get: async ({ collectionName, ids }: VectorDbGetParams) => {
      log(`vectorDB.get: Getting documents from ${collectionName}`, 'silly', {
        ids,
      });
      const collection = getCollection(collectionName);

      return collection.get({
        ids,
        limit: 5,
        offset: 0,
        include: [IncludeEnum.Documents, IncludeEnum.Metadatas],
      });
    },
  };
};
