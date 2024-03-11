import { z } from 'zod';

export * from './utils/types.js';
import { llmClientSchema } from '@/llm/types.js';
import { CodeLlmError } from '@/error/errors.js';

export * from './utils/types.js';

export const toolRunParamsParamSchema = z.record(
  z.union([
    z.boolean(),
    z.string(),
    z.number(),
    z.object({}),
    z.array(z.unknown()),
  ]),
);
export type ToolRunParamsParams = z.infer<typeof toolRunParamsParamSchema>;

export const toolRunParamsCommonSchema = z.object({
  additionalPrompt: z.string().optional(),
  llm: llmClientSchema,
  params: toolRunParamsParamSchema,
});
export type ToolRunParamsCommon = z.infer<typeof toolRunParamsCommonSchema>;

export const toolRunReturnSchema = z.string();
export type ToolRunReturn = z.infer<typeof toolRunReturnSchema> | CodeLlmError;

export type ToolImportReturn =
  | z.infer<typeof toolRunReturnSchema>
  | CodeLlmError;

export const toolConfigSchema = z.record(z.unknown());
export type ToolConfig = z.infer<typeof toolConfigSchema>;

export const toolConfigItemSchema = z.object({
  config: toolConfigSchema.optional(),
  module: z.string(),
});
export type ToolConfigItem = z.infer<typeof toolConfigItemSchema>;

export const toolConfigsSchema = z.record(toolConfigItemSchema);
export type ToolConfigs = z.infer<typeof toolConfigsSchema>;

export const toolDescriptionParamsTypeSchema = z.enum([
  'array',
  'bool',
  'string',
  'number',
]);
export type ToolDescriptionParamsType = z.infer<
  typeof toolDescriptionParamsTypeSchema
>;

export const toolDescriptionParamsSchema = z.object({
  description: z.string(),
  name: z.string(),
  required: z.boolean(),
  type: toolDescriptionParamsTypeSchema,
});
export type ToolDescriptionParams = z.infer<typeof toolDescriptionParamsSchema>;

export const toolDescriptionSchema = z.object({
  description: z.string(),
  name: z.string(),
  params: z.array(toolDescriptionParamsSchema),
});

export type ToolDescription = z.infer<typeof toolDescriptionSchema>;

export const toolSchema = z.object({
  description: toolDescriptionSchema,
  import: z.function().returns(z.promise(toolRunReturnSchema)).optional(),
  run: z
    .function(z.tuple([toolRunParamsCommonSchema]))
    .returns(z.promise(toolRunReturnSchema)),
});

export type Tool = z.infer<typeof toolSchema>;

export type Tools = Map<string, Tool>;
