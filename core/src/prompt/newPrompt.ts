import { isError } from '@/error/index.js';
import { log } from '@/log/index.js';
import { getBaseParams, getPrompt } from './prompts.js';

export const newPrompt = () => {
  return {
    get: (promptName: string, params: Record<string, unknown> = {}) => {
      const prompt = getPrompt(promptName);
      if (isError(prompt)) return prompt;

      const promptString = prompt.format({
        ...getBaseParams(),
        ...params,
      });

      log('newPrompt data', 'debug', {
        params,
        promptName,
        promptString,
      });

      return promptString;
    },
  };
};
