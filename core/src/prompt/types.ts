import type {
  PipelinePromptTemplate,
  PromptTemplate,
} from '@langchain/core/prompts';

export type Prompt = PromptTemplate | PipelinePromptTemplate<PromptTemplate>;
export type Prompts = Record<string, Prompt>;

export type PromptPipelineConfig = {
  final: string;
  pipeline: string[];
};

export type PromptConfigItem = string | PromptPipelineConfig | PromptTemplate;

export type PromptConfig = Record<string, PromptConfigItem>;

export const isPromptPipeline = (
  item: PromptConfigItem,
): item is PromptPipelineConfig => {
  return (item as PromptPipelineConfig).final !== undefined;
};
