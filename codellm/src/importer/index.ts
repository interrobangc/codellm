import { globby } from 'globby';
import { resolve } from 'path';
import { readFile } from 'fs/promises';

import type { Config } from '../config/types';
import { setConfig, getConfig } from '../config/index.js';
import { initLlms, Client } from '../llm/index.js';
import { getPrompt } from '../prompt/index.js';

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

  console.log({
    path,
    files,
  });

  const paths = await globby(files, {
    //TODO: gitignore seems to be broken upstream
    // gitignore: true,
    // ignoreFiles: [`${resolve(path)}.gitignore`],
  });

  console.log(paths);

  for (const p of paths) {
    const content = await readFile(p, 'utf-8');
    const response = await summarizeCode(llm, content);

    console.log(response);
  }
};

export const getImporter = async (configParam: Config): Promise<Importer> => {
  setConfig(configParam);
  const config = getConfig();

  const llms = await initLlms(config, ['summarize']);

  // conversation.addMessages('agent', [
  //   {
  //     role: 'system',
  //     content: `
  //       ${getPrompt('summarizeCode')}
  //     `,
  //   },
  // ]);

  return {
    import: async () =>
      importPath(llms.summarize, config.path, config.include, config.exclude),
  };
};
