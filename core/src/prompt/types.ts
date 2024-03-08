import type {
  PipelinePromptTemplate,
  PromptTemplate,
} from '@langchain/core/prompts';
import type { Config } from '@/.';

export type Prompt = PromptTemplate | PipelinePromptTemplate<PromptTemplate>;
export type Prompts = Map<string, Prompt>;

export type PromptPipelineConfigPipeline =
  | string[]
  | ((config: Config) => string[]);

export type PromptPipelineConfig = {
  final: string;
  pipeline: PromptPipelineConfigPipeline;
};

export type PromptConfigItem = string | PromptPipelineConfig | PromptTemplate;

export type PromptConfig = Record<string, PromptConfigItem>;

export const isPromptPipeline = (
  item: PromptConfigItem,
): item is PromptPipelineConfig => {
  return (item as PromptPipelineConfig).final !== undefined;
};
