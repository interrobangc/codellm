import type { ToolConfig, ToolDescription } from '@interrobangc/codellm';

export const vectorDbCollectionName = 'codeSummary' as const;

export const DEFAULT_CONFIG: ToolConfig = {
  include: ['**/*.ts'],
  exclude: ['**/node_modules/**', '**/dist/**'],
  vectorDbCollection: 'codeSummary',
} as const;

export const taskPrompt = `Your task is to accept a filename and provide a dependency tree for the file.`;

//TODO: use name assigned by client for tool
export const description: ToolDescription = {
  name: 'jsDependencyTree',
  description: `
    This tool can be used to generate a dependency tree for a javascript or typescript file. The filePath must be the full path to the file within the context of the project. If you are unsure of the path, you must use another tool to find the full path before using this tool. Do not use this tool unless you know the exact full path to the file you want to generate a dependency tree for in the context of this code project. This tool is never a good starting point for answering a user's question.
  `,
  taskPrompt,
  params: [
    {
      name: 'filePath',
      description: `A full path to a file to generate a dependency tree for. `,
      type: 'string',
      required: true,
    },
  ],
} as const;
