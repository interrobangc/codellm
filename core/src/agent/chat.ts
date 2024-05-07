import type { MessageList } from '@/.';

import { load as loadYaml } from 'js-yaml';
import { isError, mayFail, newError, promiseMayFail } from '@/error/index.js';
import { getLlm } from '@/llm/index.js';
import { log } from '@/log/index.js';
import { newPrompt } from '@/prompt/index.js';
import * as agentTypes from './types.js';
import { AGENT_RECURSION_DEPTH_MAX } from './constants.js';
import { addToHistory } from './history.js';
import { handleToolResponse } from './handleToolResponse.js';

const prompt = newPrompt();

/**
 * Decode the response from the agent into an AgentSelectToolResponse type
 *
 * @param {String} content - The content of the response
 *
 * @returns - The decoded response or an error
 */
export const decodeResponse = (content: string) =>
  mayFail(
    () => agentTypes.agentLlmResponseSchema.parse(loadYaml(content.trim())),
    'agent:decodeResponse',
    { content },
  );

/**
 * Get the tool responses as a string
 *
 * @param {AgentToolResponses} toolResponses - The tool responses
 *
 * @returns - The tool responses as a string
 */
export const getToolResponses = (
  toolResponses: agentTypes.AgentToolResponses,
) =>
  toolResponses
    .map(
      (toolRes) => `####${toolRes.name}:
    ${toolRes.response}
  `,
    )
    .join('\n');

export const sendUserMessage = async ({
  agentLlm,
  error,
  question,
  toolResponses = [],
}: agentTypes.AgentHandleQuestionParams) => {
  const messages: MessageList = [];

  const content = await prompt.get('agentQuestion', {
    error,
    question,
    toolResponses: getToolResponses(toolResponses),
  });
  if (isError(content)) return content;

  messages.push({
    content,
    role: 'user',
  });

  const response = await promiseMayFail(
    agentLlm.chat(messages),
    'agent:chat:sendUserMessage',
    { agentLlm, messages },
  );
  if (isError(response)) return response;

  return decodeResponse((response as string).trim());
};

export const handleQuestionRecursive = async ({
  agentLlm,
  depth = 0,
  error = null,
  id,
  question,
  toolResponses = [],
}: agentTypes.AgentHandleQuestionParams): Promise<agentTypes.AgentResponse> => {
  const response = await sendUserMessage({
    agentLlm,
    error,
    id,
    question,
    toolResponses,
  });

  if (depth >= AGENT_RECURSION_DEPTH_MAX) {
    const e = newError({
      code: 'agent:maxDepthExceeded',
    });
    addToHistory(id, {
      error: e,
      role: 'error',
    });
    return e;
  }

  if (isError(response)) {
    log('Error decoding response', 'error', { response });
    addToHistory(id, {
      error: response,
      role: 'error',
    });
    // If we had a decode error, we add the error to the response and try again
    return handleQuestionRecursive({
      agentLlm,
      depth: depth + 1,
      error: `${response.message} - ${response.cause}`,
      id,
      question,
      toolResponses,
    });
  }

  if (agentTypes.isAgentResponseResponse(response)) {
    addToHistory(id, response);
    return response;
  }

  const toolResponse = await handleToolResponse({
    id,
    response,
    toolResponses,
  });
  if (isError(toolResponse)) {
    addToHistory(id, {
      error: toolResponse,
      role: 'error',
    });
    return toolResponse;
  }

  // eslint-disable-next-line  @typescript-eslint/no-use-before-define
  return handleQuestionRecursive({
    agentLlm,
    depth: depth + 1,
    id,
    question,
    toolResponses: toolResponse,
  });
};

/**
 * Handles the interaction with the llm and tools to provide enough context to the LLM
 * to answer the user's question

 * @param {String} question - The question to answer
 *
 * @returns - The response from the LLM
 */
export const chat = (id: string) => async (question: string) => {
  log('chat', 'debug', { question });
  const agentLlm = getLlm(id);
  if (isError(agentLlm)) return agentLlm;

  addToHistory(id, {
    content: question,
    role: 'user',
  });

  return handleQuestionRecursive({
    agentLlm,
    id,
    question,
  });
};

export default chat;
