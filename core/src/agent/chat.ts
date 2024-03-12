import type { MessageList } from '@/.';

import { load as loadYaml } from 'js-yaml';
import { CodeLlmError, isError, mayFail } from '@/error/index.js';
import { getLlm } from '@/llm/index.js';
import { log } from '@/log/index.js';
import { newPrompt } from '@/prompt/index.js';
import { AGENT_RECURSION_DEPTH_MAX } from './constants.js';
import { addToHistory } from './history.js';
import * as agentTypes from './types.js';
import { handleToolResponse } from './handleToolResponse.js';

const prompt = newPrompt();

/**
 * Decode the response from the agent into an AgentSelectToolResponse type
 *
 * @param {String} content - The content of the response
 *
 * @returns - The decoded response or an error
 */
export const decodeResponse = (content: string) => {
  return mayFail<agentTypes.AgentLlmResponse>(
    () => agentTypes.agentLlmResponseSchema.parse(loadYaml(content.trim())),
    'agent:decodeResponse',
  );
};

/**
 * Get the tool responses as a string
 *
 * @param {AgentToolResponses} toolResponses - The tool responses
 *
 * @returns - The tool responses as a string
 */
export const getToolResponses = (
  toolResponses: agentTypes.AgentToolResponses,
) => {
  return toolResponses
    .map(
      (toolRes) => `####${toolRes.name}:
    ${toolRes.response}
  `,
    )
    .join('\n');
};

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

  return decodeResponse(await agentLlm.chat(messages));
};

export const handleQuestionRecursive = async ({
  agentLlm,
  depth = 0,
  error = null,
  question,
  toolResponses = [],
}: agentTypes.AgentHandleQuestionParams): Promise<agentTypes.AgentResponse> => {
  const response = await sendUserMessage({
    agentLlm,
    error,
    question,
    toolResponses,
  });
  if (isError(response)) {
    log('Error decoding response', 'error', { response });
    // If we had a decode error, we add the error to the response and try again
    return handleQuestionRecursive({
      agentLlm,
      depth: depth + 1,
      error: `${response.message} - ${response.cause}`,
      question,
      toolResponses,
    });
  }

  if (agentTypes.isAgentResponseResponse(response)) {
    addToHistory(response);
    return response;
  }

  if (depth >= AGENT_RECURSION_DEPTH_MAX) {
    const e = new CodeLlmError({
      code: 'agent:maxDepthExceeded',
    });
    addToHistory({
      content: `error: ${e.message} - ${e.cause}`,
      type: 'response',
    });
    return e;
  }

  const toolResponse = await handleToolResponse({
    response,
    toolResponses,
  });
  if (isError(toolResponse)) return toolResponse;

  // eslint-disable-next-line  @typescript-eslint/no-use-before-define
  return handleQuestionRecursive({
    agentLlm,
    depth: depth + 1,
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
export const chat = async (question: string) => {
  log('chat', 'debug', { question });
  const agentLlm = getLlm('agent');
  if (isError(agentLlm)) return agentLlm;

  addToHistory({
    content: question,
    role: 'user',
  });

  return handleQuestionRecursive({
    agentLlm,
    question,
  });
};

export default chat;
