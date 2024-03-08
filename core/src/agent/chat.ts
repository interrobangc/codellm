import type { LlmClient, MessageList, Tools } from '@/.';

import { load as loadYaml } from 'js-yaml';
import { CodeLlmError, isError } from '@/error/index.js';
import { conversation, getLlm } from '@/llm/index.js';
import log from '@/log/index.js';
import { newPrompt } from '@/prompt/index.js';
import * as agentTypes from './types.js';

const prompt = newPrompt();

/**
 * Send a chat message to the LLM
 *
 * @param {LlmClient} llm - Llm Client to use
 * @param {MessageList} messages - Messages to send
 *
 * @returns - The response from the LLM
 */
export const sendChat = async (llm: LlmClient, messages: MessageList) => {
  return llm.chat(messages);
};

/**
 * Decode the response from the agent into an AgentSelectToolResponse type
 *
 * @param {String} content - The content of the response
 *
 * @returns - The decoded response or an error
 */
export const decodeResponse = (
  content: string,
): agentTypes.AgentSelectToolResponse | CodeLlmError => {
  try {
    return agentTypes.agentLlmResponseSchema.parse(loadYaml(content.trim()));
  } catch (e) {
    return new CodeLlmError({
      code: 'agent:decodeResponse',
      cause: e,
    });
  }
};

export const getToolResponses = (
  toolResponses: agentTypes.AgentToolResponses,
) => {
  return Object.entries(toolResponses)
    .map(
      ([tool, response]) => `####${tool}:
    ${response}
  `,
    )
    .join('\n');
};

export const handleToolResponse = async ({
  response,
  toolResponses,
  tools,
}: agentTypes.AgentHandleToolResponseParams): Promise<
  agentTypes.AgentToolResponses | CodeLlmError
> => {
  if (!agentTypes.isAgentToolResponse(response)) return toolResponses || {};
  const toolName = response.name;

  const tool = tools?.[toolName];

  if (!tool) {
    log('Tool not found', 'error', { toolName, tools });
    return {
      ...toolResponses,
      [toolName]: 'Tool not found',
    };
  }

  log(`Running the ${response.name} tool`);

  const toolLlm = getLlm('tool');
  if (isError(toolLlm)) {
    return toolLlm;
  }

  // TODO: move tool run response to a response or an CodeLlmError
  let toolResponse;
  try {
    toolResponse = await tool.run({
      llm: toolLlm,
      params: response.params,
    });
  } catch (e) {
    log('Error running tool', 'error', { toolName, e });
    return {
      ...toolResponses,
      [toolName]: 'Error running tool: ' + e,
    };
  }

  return {
    ...toolResponses,
    [toolName]: toolResponse.content,
  };
};

export const handleQuestion = async ({
  depth = 0,
  error = null,
  question,
  toolResponses = {},
  tools,
}: agentTypes.AgentHandleQuestionParams): Promise<agentTypes.AgentResponse> => {
  const messages: MessageList = [];

  messages.push({
    role: 'user',
    content: await prompt.get('agentQuestion', {
      error,
      question,
      toolResponses: getToolResponses(toolResponses),
    }),
  });

  const agentLlm = getLlm('agent');
  if (isError(agentLlm)) {
    // Any error here is a critical error
    return agentLlm;
  }

  const response = decodeResponse(await sendChat(agentLlm, messages));

  log(`conversation.getHistory('agent')`, 'debug', {
    history: conversation.getHistory('agent'),
  });

  if (isError(response)) {
    // If we had a decode error, we add the error to the response and try again
    return handleQuestion({
      depth: depth + 1,
      error: response.message,
      question,
      toolResponses,
      tools,
    });
  }

  if (agentTypes.isAgentResponseResponse(response)) {
    return response;
  }

  if (depth >= 5) {
    return new CodeLlmError({
      code: 'agent:maxDepthExceeded',
    });
  }

  const toolResponse = await handleToolResponse({
    response,
    toolResponses,
    tools,
  });

  if (isError(toolResponse)) {
    return toolResponse;
  }

  // eslint-disable-next-line  @typescript-eslint/no-use-before-define
  return handleQuestion({
    depth: depth + 1,
    question,
    toolResponses,
    tools,
  });
};

/**
 * Handles the interaction with the llm and tools to provide enough context to the LLM
 * to answer the user's question
 *
 * @param {Llms} llms - The LLMs to use
 * @param {Tools} tools - The tools to use
 * @param {String} question - The question to answer
 *
 * @returns - The response from the LLM
 */
export const chat =
  (tools: Tools | undefined) =>
  async (question: string): Promise<agentTypes.AgentResponse> => {
    log('chat', 'debug', { question });
    return handleQuestion({
      question,
      tools,
    });
  };

export default chat;
