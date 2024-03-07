import type { ToolDescription } from '@codellm/core';
import type { ToolConfig } from './types';

export const DEFAULT_CONFIG: ToolConfig = {
  exclude: [
    '**/node_modules/**',
    '**/cdk.out/**',
    '**/coverage/**',
    '**/dist/**',
  ],
} as const;

export const description: ToolDescription = {
  name: 'projectGlob',
  description: `This tool accepts an array of glob patterns and returns all of the file paths that match the patterns from within the project's base path.`,
  params: [
    {
      name: 'globPatterns',
      description: `The glob patterns to match files against. For example, ['**/*.ts', '**/*.js'].`,
      type: 'array',
      required: true,
    },
  ],
} as const;
