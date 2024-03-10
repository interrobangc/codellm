import type { PromptConfig, PromptConfigItem, Prompts } from '@/.';

import {
  PipelinePromptTemplate,
  PromptTemplate,
} from '@langchain/core/prompts';
import { dump as dumpYaml } from 'js-yaml';
import isArray from 'lodash/isArray.js';
import isString from 'lodash/isString.js';

import { getConfig } from '@/config/index.js';
import { CodeLlmError } from '@/error/index.js';
import { log } from '@/log/index.js';
import { getTools } from '@/tool/index.js';
import { DEFAULTS, DEFAULT_PROMPTS } from './constants.js';
import { isPromptPipeline } from './types.js';

const prompts: Prompts = new Map();
const baseParams: Record<string, string> = {};

export const getToolDescriptions = () => {
  const descriptions = [];
  for (const [, tool] of getTools().entries()) {
    descriptions.push(tool.description);
  }

  log('getToolDescriptions', 'debug', { descriptions });
  return dumpYaml(descriptions);
};

export const newPrompt = () => {
  return {
    get: (promptName: string, params: Record<string, unknown> = {}) => {
      const prompt = prompts.get(promptName);
      if (!prompt) {
        return new CodeLlmError({
          code: 'prompt:notFound',
          meta: { promptName },
        });
      }

      const promptString = prompt.format({
        ...baseParams,
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

export const initPrompts = () => {
  const config = getConfig();
  const configPrompts: PromptConfig = DEFAULT_PROMPTS;
  baseParams['availableTools'] = getToolDescriptions();

  Object.entries(DEFAULTS).forEach(([key, value]) => {
    baseParams[key] = value;
  });

  Object.entries(configPrompts).forEach(([name, prompt]) => {
    if (isString(prompt)) {
      prompts.set(name, PromptTemplate.fromTemplate(prompt));
    } else if (prompt instanceof PromptTemplate) {
      prompts.set(name, prompt);
    }
  });

  Object.entries(configPrompts).forEach(
    ([name, prompt]: [string, PromptConfigItem]) => {
      if (!isPromptPipeline(prompt)) return;
      const pipelinePromptItems = isArray(prompt.pipeline)
        ? prompt.pipeline
        : prompt.pipeline(config);

      const pipelinePrompts = pipelinePromptItems.map((step) => ({
        name: step,
        prompt: prompts.get(step) as PromptTemplate,
      }));

      const promptTemplate = new PipelinePromptTemplate<PromptTemplate>({
        finalPrompt: prompts.get(prompt.final) as PromptTemplate,
        pipelinePrompts,
      });
      prompts.set(name, promptTemplate);
    },
  );

  return newPrompt();
};

export * from './types.js';
