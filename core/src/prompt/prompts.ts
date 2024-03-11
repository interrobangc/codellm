import { CodeLlmError } from '@/error/index.js';
import { Prompt, Prompts } from './types';

const prompts: Prompts = new Map();
const baseParams: Record<string, string> = {};

export const getPrompt = (promptName: string) => {
  const prompt = prompts.get(promptName);
  if (!prompt) {
    return new CodeLlmError({ code: 'prompt:notFound', meta: { promptName } });
  }
  return prompt;
};

export const setPrompt = (promptName: string, prompt: Prompt) => {
  prompts.set(promptName, prompt);
};

export const getBaseParam = (key: string) => {
  const value = baseParams[key];
  if (!value) {
    return new CodeLlmError({
      code: 'prompt:baseParamNotFound',
      meta: { promptName: key },
    });
  }
  return value;
};

export const getBaseParams = () => {
  return baseParams;
};

export const setBaseParam = (key: string, value: string) => {
  baseParams[key] = value;
};
