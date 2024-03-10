import type { ToolConfig, ToolDescription } from '@codellm/core';

export const vectorDbCollectionName = 'codeSummary' as const;

export const DEFAULT_CONFIG: ToolConfig = {
  exclude: ['**/node_modules/**', '**/dist/**'],
  include: ['**/*.ts'],
  vectorDbCollection: 'codeSummary',
} as const;

//TODO: use name assigned by client for tool
export const description: ToolDescription = {
  description: `
    This tool can be used to generate a dependency tree for a javascript or typescript file. The filePath must be the full path to the file within the context of the project. If you are unsure of the path, you must use another tool to find the full path before using this tool. Do not use this tool unless you know the exact full path to the file you want to generate a dependency tree for in the context of this code project. This tool is never a good starting point for answering a user's question.
  `,
  name: 'jsDependencyTree',
  params: [
    {
      description: `A full path to a file to generate a dependency tree for. `,
      name: 'filePath',
      required: true,
      type: 'string',
    },
  ],
} as const;
