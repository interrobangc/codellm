import type { ToolConfig, ToolDescription } from '@codellm/core';

export const DEFAULT_CONFIG: ToolConfig = {
  maxFileCount: 10,
} as const;

export const description: ToolDescription = {
  description: `This tool accepts an array of full or relative file paths within the project and returns the contents of the files. If you do not have the full file path, use another tool to get it.`,
  name: 'fileReader',
  params: [
    {
      description: `The relative or full paths of the files to read. The paths must be within the projects base path. This does NOT support glob patterns or wildcards.`,
      name: 'filePaths',
      required: true,
      type: 'array',
    },
  ],
} as const;
