import type { ToolConfig, ToolDescription } from '@codellm/core';

export const vectorDbCollectionName = 'docSummary' as const;

export const numResults = 8;

export const DEFAULT_CONFIG: ToolConfig = {
  include: ['**/*.md', '**/*.txt'],
  exclude: ['**/node_modules/**', '**/dist/**'],
  vectorDbCollectionName,
  vectorDbName: 'chromadb',
} as const;

export const taskPrompt = `Your task is to provide a summary of the documentation in the context provided to help answer the user's question.
`;

export const summarizeTaskPrompt = `
  Your task is to generate an extremely concise summary with minimal prose of the following text file. Keep your summary to 5 sentences or less. You should only include relevant comments if the file provided is a code file.
`;

export const description: ToolDescription = {
  name: 'docSummaryQuery',
  description: `This tool processes a query generated by an LLM to gather relevant documentation, code comments, full file paths, and documentation summaries from a vector db collection to provide context to assist the asking LLM in answering a question. It can summarize documentation and provide relevant documentation to the asker so that it can answer a question.`,
  taskPrompt,
  params: [
    {
      name: 'query',
      description: `The query to use to find relevant documentation and documentation summaries to help you answer the user's question.`,
      type: 'string',
      required: true,
    },
  ],
} as const;
