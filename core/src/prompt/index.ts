import type {
  Config,
  PromptConfig,
  PromptConfigItem,
  Prompts,
  Tools,
} from '@/.';

import {
  PipelinePromptTemplate,
  PromptTemplate,
} from '@langchain/core/prompts';
import { dump as dumpYaml } from 'js-yaml';
import isArray from 'lodash/isArray.js';
import isString from 'lodash/isString.js';

import log from '@/log/index.js';
import { DEFAULT_PROMPTS, DEFAULTS } from './constants.js';
import { isPromptPipeline } from './types.js';

const prompts: Prompts = {};
const baseParams: Record<string, string> = {};

export const getToolDescriptions = (tools: Tools = {}) => {
  const descriptions = Object.values(tools).map((tool) => tool.description);

  log('getToolDescriptions', 'debug', { descriptions });
  return dumpYaml(descriptions);
};

export const newPrompt = () => {
  return {
    get: (
      promptName: string,
      params: Record<string, unknown> = {},
    ): Promise<string> => {
      const prompt = prompts[promptName];
      if (!prompt) {
        throw new Error(`Prompt ${promptName} not found`);
      }

      const promptString = prompt.format({
        ...baseParams,
        ...params,
      });

      log('newPrompt data', 'debug', {
        promptName,
        params,
        promptString,
      });

      return promptString;
    },
  };
};

export const initPrompts = ({
  config,
  tools,
}: {
  config: Config;
  tools: Tools;
}) => {
  const configPrompts: PromptConfig = DEFAULT_PROMPTS;
  baseParams['availableTools'] = getToolDescriptions(tools);

  Object.entries(DEFAULTS).forEach(([key, value]) => {
    baseParams[key] = value;
  });

  Object.entries(configPrompts).forEach(([name, prompt]) => {
    if (isString(prompt)) {
      prompts[name] = PromptTemplate.fromTemplate(prompt);
    } else if (prompt instanceof PromptTemplate) {
      prompts[name] = prompt;
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
        prompt: prompts[step],
      }));

      prompts[name] = new PipelinePromptTemplate<PromptTemplate>({
        // @ts-expect-error - fix types later
        finalPrompt: prompts[prompt.final],
        // @ts-expect-error - fix types later
        pipelinePrompts,
      });
    },
  );

  return newPrompt();
};

export * from './types.js';
