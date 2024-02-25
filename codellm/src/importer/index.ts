import { globby } from 'globby';
import { resolve } from 'path';
import { readFile } from 'fs/promises';
import { createHash } from 'crypto';

import type { Config } from '../config/types';
import { initConfig, getConfig } from '../config/index.js';
import { initLlms, Client } from '../llm/index.js';
import log from '../log/index.js';
import { getPrompt } from '../prompt/index.js';
import { newClient } from '../vectordb/db/chromadb/index.js';

export type Importer = {
  import: () => Promise<void>;
};

export const summarizeCode = async (llm: Client, code: string) => {
  const response = await llm.prompt({
    system: '',
    prompt: `
    ${getPrompt('summarizeCode')}
    ${code}
  `,
  });

  return response;
};

export const handleFile = async (dbClient: any, llm: Client, path: string) => {
  log(`Processing ${path}`);
  const content = await readFile(path, 'utf-8');
  const response = await summarizeCode(llm, content);

  // get md5 hash of content
  const hash = createHash('sha256').update(content).digest('hex');
  const document = {
    collectionName: 'codellm',
    documents: [
      {
        id: `${path}_summary`,
        metadata: {
          path,
          hash,
        },
        document: response,
      },
    ],
  };

  await dbClient.addDocuments(document);
};

/**
 * Traverse all directories in the path and import all files that match the include pattern and do not match the exclude pattern.
 * @param path
 * @param include
 * @param exclude
 */
export const importPath = async (
  llm: Client,
  path: string,
  include: string[],
  exclude: string[],
) => {
  const files = [
    ...include.map((i) => `${resolve(path)}/${i}`),
    ...exclude.map((e) => `!${resolve(path)}/${e}`),
  ];

  const paths = await globby(files, {
    //TODO: gitignore seems to be broken upstream
    // gitignore: true,
    // ignoreFiles: [`${resolve(path)}.gitignore`],
  });

  log('importPaths', 'debug', { paths });

  const dbClient = await newClient();
  await dbClient.init();

  for (const p of paths) {
    await handleFile(dbClient, llm, p);
  }
};

export const getImporter = async (configParam: Config): Promise<Importer> => {
  initConfig(configParam);
  const config = getConfig();

  const llms = await initLlms(config, ['summarize']);

  return {
    import: async () =>
      importPath(llms.summarize, config.path, config.include, config.exclude),
  };
};
