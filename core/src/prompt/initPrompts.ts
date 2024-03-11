import type { PromptConfig, PromptConfigItem } from '@/.';

import {
  PipelinePromptTemplate,
  PromptTemplate,
} from '@langchain/core/prompts';
import isArray from 'lodash/isArray.js';
import isString from 'lodash/isString.js';
import { dump as dumpYaml } from 'js-yaml';

import { getConfig } from '@/config/index.js';
import { isError } from '@/error/index.js';
import { getTools } from '@/tool/index.js';
import { log } from '@/log/index.js';
import { DEFAULTS, DEFAULT_PROMPTS } from './constants.js';
import { isPromptPipeline } from './types.js';
import { getPrompt, setBaseParam, setPrompt } from './prompts.js';
import { newPrompt } from './newPrompt.js';

export const getToolDescriptions = () => {
  const descriptions = [];
  for (const [, tool] of getTools().entries()) {
    descriptions.push(tool.description);
  }

  log('getToolDescriptions', 'debug', { descriptions });
  return dumpYaml(descriptions);
};

export const initPrompts = () => {
  const config = getConfig();
  if (isError(config)) return config;

  const configPrompts: PromptConfig = DEFAULT_PROMPTS;
  setBaseParam('availableTools', getToolDescriptions());

  Object.entries(DEFAULTS).forEach(([key, value]) => {
    setBaseParam(key, value);
  });

  Object.entries(configPrompts).forEach(([name, prompt]) => {
    if (isString(prompt)) {
      setPrompt(name, PromptTemplate.fromTemplate(prompt));
    } else if (prompt instanceof PromptTemplate) {
      setPrompt(name, prompt);
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
        prompt: getPrompt(step) as PromptTemplate,
      }));

      const promptTemplate = new PipelinePromptTemplate<PromptTemplate>({
        finalPrompt: getPrompt(prompt.final) as PromptTemplate,
        pipelinePrompts,
      });
      setPrompt(name, promptTemplate);
    },
  );

  return newPrompt();
};
