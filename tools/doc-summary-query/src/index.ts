import type {
  Config,
  Tool,
  ToolRunParamsCommon,
  VectorDbQueryResultItem,
} from '@codellm/core';
import type { ToolConfig } from './types';

import { isError, toolUtils } from '@codellm/core';
import { dump as dumpYaml } from 'js-yaml';
import {
  DEFAULT_CONFIG,
  description,
  numResults,
  summarizeTaskPrompt,
} from './constants.js';

/**
 * Create a new codeSummaryQuery tool
 *
 * @param toolName - The name of the tool
 * @param config - The configuration to use
 *
 * @returns - The new tool instance
 */
export const newTool = async (toolName: string, config: Config) => {
  const toolConfig = {
    ...DEFAULT_CONFIG,
    ...(config.tools?.[toolName]?.config as Partial<ToolConfig>),
  } as ToolConfig;

  const vectorizeFilesClient =
    await toolUtils.vectorizeFiles.newVectorizeFilesClient({
      config,
      toolConfig,
      toolName,
    });
  if (isError(vectorizeFilesClient)) return vectorizeFilesClient;

  return {
    description,
    import: async () => {
      await vectorizeFilesClient.vectorizeFiles({
        summarize: summarizeTaskPrompt,
      });
      return `${toolName} import complete`;
    },
    run: async ({ params }: ToolRunParamsCommon) => {
      const dbResponse = await vectorizeFilesClient.query({
        numResults,
        query: params['query'] as unknown as string,
      });

      return dumpYaml(
        dbResponse.map((d: VectorDbQueryResultItem) => ({
          distance: d.distance,
          fileContent: d.metadata['fileContent'],
          filePath: d.metadata['filePath'],
          summary: d.document,
        })),
      );
    },
  } as Tool;
};
