import type {
  Config,
  Tool,
  ToolRunParamsCommon,
  ToolRunReturn,
} from '@interrobangc/codellm';
import type { ToolConfig } from './types';

import { toolUtils } from '@interrobangc/codellm';
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
export const newTool = async (
  toolName: string,
  config: Config,
): Promise<Tool> => {
  const toolConfig = {
    ...DEFAULT_CONFIG,
    ...(config.tools?.[toolName]?.config as Partial<ToolConfig>),
  } as ToolConfig;

  const vectorizeFilesClient = await toolUtils.vectorizeFiles.newClient(
    toolName,
    config,
    toolConfig,
  );

  return {
    run: async ({ params }: ToolRunParamsCommon): Promise<ToolRunReturn> => {
      const dbResponse = await vectorizeFilesClient.query({
        query: params['query'] as unknown as string,
        numResults,
      });

      const content = JSON.stringify(
        dbResponse.map((d) => ({
          path: d.metadata['path'],
          summary: d.document,
          code: params['includeCode'] ? d.metadata['content'] : undefined,
          distances: d.distances,
        })),
      );

      return { success: true, content };
    },
    import: async () => {
      await vectorizeFilesClient.vectorizeFiles({
        summarize: summarizeTaskPrompt,
      });
      return { success: true, content: 'Import complete' };
    },
    description,
  };
};
