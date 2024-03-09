import type {
  AddParams,
  CreateCollectionParams as ChromaCreateCollectionParams,
  Collection,
} from 'chromadb';
import { ChromaClient, IncludeEnum } from 'chromadb';

import type {
  EmbeddingDocumentList,
  VectorDbAddDocumentsParams,
  VectorDbClient,
  VectorDbGetParams,
  VectorDbQueryParams,
  VectorDbQueryResult,
} from '@codellm/core';

import { getConfig, log } from '@codellm/core';

export type CreateCollectionParams = {
  client: ChromaClient;
  params: ChromaCreateCollectionParams;
};

/**
 * Get a collection if it exists or create new collection if it doesn't in the VectorDb
 *
 * @param client - The ChromaClient instance.
 * @param params - The parameters for creating the collection.
 *
 * @returns The new collection instance.
 *
 * @throws If there is an error creating the collection.
 */
export const getOrCreateCollection = async ({
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

/**
 * Get a collection from the VectorDb
 *
 * @param collectionName - The name of the collection to get.
 *
 * @returns The collection instance.
 *
 * @throws If the collection does not exist.
 */
export const getCollection = (collectionName: string) => {
  const collection = collections[collectionName];

  if (!collection) {
    throw new Error(`Collection ${collectionName} not found`);
  }

  return collection;
};

/**
 * Convert a list of EmbeddingDocumentList to AddParams
 *
 * @param documentList - The list of EmbeddingDocumentList to convert.
 *
 * @returns The AddParams.
 */
export const convertDocuments = (documentList: EmbeddingDocumentList) => {
  const ids = documentList.map((doc) => doc.id);
  // const embeddings: Embedding[] = documentList.map(
  //   (doc) => doc.embedding ?? [],
  // );
  const metadatas = documentList.map((doc) => doc.metadata);
  const documents = documentList.map((doc) => doc.document);

  const ret: AddParams = {
    documents,
    ids,
    metadatas,
  };

  // TODO: this will need a flag when we start allowing other ebedding functions
  // if (embeddings.length > 0) {
  //   ret.embeddings = embeddings;
  // }

  return ret;
};

/**
 * Add documents to the VectorDb
 *
 * @param collectionName - The name of the collection to add the documents to.
 * @param documents - The documents to add.
 *
 * @returns The response from the VectorDb.
 *
 * @throws If there is an error adding the documents.
 */
export const addDocuments = async ({
  collectionName,
  documents,
}: VectorDbAddDocumentsParams) => {
  log(`vectorDB.addDocuments: Adding documents to ${collectionName}`, 'debug', {
    documents,
  });
  const collection = getCollection(collectionName);
  await collection.upsert(convertDocuments(documents));
};

// TODO: abstract collection name setting away to core
export const getFullCollectionName = (
  projectName: string,
  collectionName: string,
) => `${projectName}.${collectionName}`;

/**
 * Create a new VectorDb client
 *
 * @returns The new VectorDb client.
 */
export const newClient = async () => {
  const client = new ChromaClient();
  const config = getConfig();

  return {
    addDocuments: async ({
      collectionName,
      ...params
    }: VectorDbAddDocumentsParams) => {
      const fullCollectionName = getFullCollectionName(
        config.project.name,
        collectionName,
      );
      await addDocuments({ collectionName: fullCollectionName, ...params });
    },

    deleteDocuments: async ({ collectionName, ids }) => {
      const fullCollectionName = getFullCollectionName(
        config.project.name,
        collectionName,
      );
      log(
        `vectorDB.deleteDocuments: Deleting documents from ${fullCollectionName}`,
        'debug',
        {
          ids,
        },
      );
      const collection = getCollection(fullCollectionName);
      await collection.delete({ ids });
    },

    get: async ({ collectionName, ids }: VectorDbGetParams) => {
      const fullCollectionName = getFullCollectionName(
        config.project.name,
        collectionName,
      );
      log(
        `vectorDB.get: Getting documents from ${fullCollectionName}`,
        'silly',
        {
          ids,
        },
      );
      const collection = getCollection(fullCollectionName);

      return collection.get({
        ids,
        include: [IncludeEnum.Documents, IncludeEnum.Metadatas],
        limit: 5,
        offset: 0,
      });
    },

    init: async (collectionNames: string[]) => {
      await Promise.all(
        collectionNames.map(async (collectionName) => {
          const fullCollectionName = getFullCollectionName(
            config.project.name,
            collectionName,
          );
          collections[fullCollectionName] = await getOrCreateCollection({
            client,
            params: {
              name: fullCollectionName,
            },
          });

          log(`vectorDB.init: Initialized ${fullCollectionName}`, 'debug');
          log(`vectorDB.init: Collection ${fullCollectionName} Peek`, 'silly', {
            peek: await collections[fullCollectionName]?.peek({ limit: 10 }),
          });

          log(
            `vectorDB.init: Collection ${fullCollectionName} embeddingFunction`,
            'silly',
            {
              embeddingFunction:
                collections[fullCollectionName]?.embeddingFunction,
            },
          );
        }),
      );
    },

    query: async ({
      collectionName,
      opts: { numResults, query },
    }: VectorDbQueryParams) => {
      const fullCollectionName = getFullCollectionName(
        config.project.name,
        collectionName,
      );
      log(`vectorDB.query: Querying ${fullCollectionName}`, 'silly', {
        numResults,
        query,
      });
      const collection = getCollection(fullCollectionName);
      const resp = await collection.query({
        nResults: numResults,
        queryTexts: query,
      });

      log(`vectorDB.query: Query response`, 'silly', { resp });

      return (resp.ids?.[0]?.map((id, i) => ({
        distance: resp.distances?.[0]?.[i] ?? null,
        document: resp.documents?.[0]?.[i] ?? '',
        id,
        metadata: resp.metadatas?.[0]?.[i] ?? {},
      })) ?? []) as VectorDbQueryResult;
    },

    reset: async () => {
      log('vectorDB.close: Closing VectorDb client', 'debug');
      await client.reset();
    },
  } as VectorDbClient;
};
