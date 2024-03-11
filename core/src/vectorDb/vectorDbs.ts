import type { VectorDb, VectorDbClient, VectorDbs } from '@/.';
import { CodeLlmError } from '@/error/index.js';

const vectorDbs: VectorDbs = new Map();

export const getVectorDb = (name: VectorDb) => {
  const db = vectorDbs.get(name);
  if (!db) {
    return new CodeLlmError({ code: 'vectorDb:notFound', meta: { name } });
  }
  return db;
};

export const setVectorDb = (name: VectorDb, db: VectorDbClient) => {
  vectorDbs.set(name, db);
};

export const getVectorDbs = () => {
  return vectorDbs;
};
