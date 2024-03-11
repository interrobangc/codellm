import type { LlmClient, LlmProviderClient } from '@/.';

export const getValidLlmProviderClient = ({
  chatResponse = {
    content: 'fake chat content',
    type: 'response' as const,
  },
  initModelResponse = {},
  promptResponse = {
    content: 'fake prompt content',
    type: 'response' as const,
  },
}: {
  chatResponse?: unknown;
  initModelResponse?: unknown;
  promptResponse?: unknown;
} = {}) =>
  ({
    chat: async () => chatResponse,
    initModel: async () => initModelResponse,
    prompt: async () => promptResponse,
  }) as LlmProviderClient;

export const getValidLlmClient = ({
  chatResponse = {
    content: 'fake chat content',
    type: 'response' as const,
  },
  initModelResponse = {},
  promptResponse = {
    content: 'fake prompt content',
    type: 'response' as const,
  },
  service,
}: {
  chatResponse?: unknown;
  initModelResponse?: unknown;
  promptResponse?: unknown;
  service: string;
}) =>
  ({
    ...getValidLlmProviderClient({
      chatResponse,
      initModelResponse,
      promptResponse,
    }),
    service,
  }) as LlmClient;
