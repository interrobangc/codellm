import type { Config, PromptConfig } from '@/.';

export const PROMPT_ERRORS = {
  'prompt:baseParamNotFound': {
    message: 'Base param not found',
  },
  'prompt:notFound': {
    message: 'Prompt not found',
  },
} as const;

export const DEFAULTS = {
  responseFormat: 'yaml',
};

export const DEFAULT_PROMPTS: PromptConfig = {
  agentQuestion: {
    final: 'agentQuestionFinal',
    pipeline: (config: Config) => [
      ...[
        'agentQuestionTask',
        'errorBlock',
        'userQuestionBlock',
        'toolResponseBlock',
      ],
      ...(config.formatInUserMessage ? ['responseFormatBlock'] : []),
    ],
  },

  agentQuestionFinal: `
{agentQuestionTask}
{toolResponseBlock}
{responseFormatBlock}
{userQuestionBlock}
{errorBlock}
`,

  agentQuestionTask: `
### Task
Your task is to address a question or command from a user in the Question section related to a codebase in the format described in the Response Format section as precisely as possible. You must use the tools available to you as provided in the Available Tools section. You will do this in a step by step manner by choosing tools as necessary. When you have the necessary data to complete your task, respond directly to the user in the response type yaml format. Do not ask the user for a full file path. You may also use the context from earlier conversations to help you answer the user's question. Avoid conversation and only provide the necessary information in {responseFormat}.
  `,

  agentSystem: {
    final: 'agentSystemFinal',
    pipeline: ['agentSystemRole', 'availableToolsBlock', 'responseFormatBlock'],
  },

  agentSystemFinal: `
{agentSystemRole}
{availableToolsBlock}
{responseFormatBlock}
`,

  agentSystemRole: `
You are an assistant that answers question about a codebase that you have not been trained on as specifically and accurately as possible in an exact {responseFormat} format. All of the user's questions should be about this particular codebase. You will be given tools that you can use to help you answer questions about the codebase.
  `,

  availableToolsBlock: `
### Available Tools
{availableTools}
`,

  errorBlock: `
### Error
{error}
`,

  responseFormatBlock: `
### Response Format
Your answer must be in one of the following two formats with no extra text. Do not include any codeblock wrapper or \`\`\` around the {responseFormat} or describe your reasoning outside of the {responseFormat} object. You MUST escape any special characters in your response.

(1) If you are choosing the correct Tool and parameters, return valid and properly escaped {responseFormat} using the following example. Do not use references to parameter values, you must put the value being passed in the Parameter value section If passing in code, do not include backticks. The type should be the exact string "tool".

type: "tool" # Do not change this
reason: "<Describe your reasoning for why this tool was chosen in 3 sentences or less.
name: "<Tool Name>"
params:
  <parameter_0_name>: <Parameter_0 value of type defined in tool description>
  ...
  <parameter_N_name>: <Parameter_N value of type defined in tool description>

(2) If you are responding directly to the user's questions, return valid {responseFormat} using this format. The type should be the exact string "response".

type: "response" # Do not change this
content: |
  <Write the text of your response here. You must use properly escaped and indented {responseFormat} with no wrapping quotes.>
`,

  toolResponseBlock: `
### Tool Response
If the tool response does not contain the information you need, you must select another tool to help you refine your answer by returning a response in the tool type {responseFormat} format without any additional text.
{toolResponses}
`,

  userQuestionBlock: `
### Question
{question}
  `,
};
