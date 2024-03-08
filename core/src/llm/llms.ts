import type { LlmClient, Llms, Service } from '@/.';

import { CodeLlmError } from '@/error/index.js';

const llms: Llms = new Map();

export const getLlm = (service: Service) => {
  const llm = llms.get(service);
  if (!llm) {
    return new CodeLlmError({
      code: 'llm:noServiceLlm',
      meta: { service },
    });
  }
  return llm;
};

export const setLlm = (service: Service, client: LlmClient): void => {
  llms.set(service, client);
};
