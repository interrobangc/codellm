import type { LlmClient, MessageList } from '@/.';

import { load as loadYaml } from 'js-yaml';
import { CodeLlmError, isError, maybe } from '@/error/index.js';
import { conversation, getLlm } from '@/llm/index.js';
import log from '@/log/index.js';
import { newPrompt } from '@/prompt/index.js';
import { getTool } from '@/tool/index.js';
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
export const decodeResponse = (content: string) => {
  return maybe<agentTypes.AgentLlmResponse>(
    () => agentTypes.agentLlmResponseSchema.parse(loadYaml(content.trim())),
    'agent:decodeResponse',
  );
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
}: agentTypes.AgentHandleToolResponseParams): Promise<
  agentTypes.AgentToolResponses | CodeLlmError
> => {
  if (!agentTypes.isAgentToolResponse(response)) return toolResponses || {};
  const toolName = response.name;

  const tool = getTool(toolName);

  if (isError(tool)) {
    log('Tool not found', 'error', { toolName });
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
    log('Tool response', 'debug', { toolResponse });
  } catch (e) {
    log('Error running tool', 'error', { e, toolName });
    return {
      ...toolResponses,
      [toolName]: 'Error running tool: ' + e,
    };
  }

  log('Tool responses', 'debug', { toolResponses });

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
}: agentTypes.AgentHandleQuestionParams): Promise<agentTypes.AgentResponse> => {
  const messages: MessageList = [];

  const content = await prompt.get('agentQuestion', {
    error,
    question,
    toolResponses: getToolResponses(toolResponses),
  });
  if (isError(content)) {
    return content;
  }

  messages.push({
    content,
    role: 'user',
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
      error: `${response.message} - ${response.cause}`,
      question,
      toolResponses,
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
  });

  if (isError(toolResponse)) {
    return toolResponse;
  }

  // eslint-disable-next-line  @typescript-eslint/no-use-before-define
  return handleQuestion({
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
  return handleQuestion({
    question,
  });
};

export default chat;
