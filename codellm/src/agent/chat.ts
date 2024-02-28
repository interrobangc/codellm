import type { LlmClient, Llms, MessageList, Tools } from '@/.';

import log from '@/log/index.js';
import { getPrompt } from '@/prompt/index.js';
import * as agentTypes from './types.js';

/**
 * Send a chat message to the LLM
 *
 * @param llm - Llm Client to use
 * @param messages - Messages to send
 *
 * @returns - The response from the LLM
 */
export const sendChat = async (llm: LlmClient, messages: MessageList) => {
  return llm.chat(messages);
};

/**
 * Decode the response from the agent into an AgentSelectToolResponse type
 *
 * @param content - The content of the response
 *
 * @returns - The decoded response
 */
export const decodeResponse = (
  content: string,
): agentTypes.AgentSelectToolResponse => {
  try {
    return JSON.parse(content.trim());
  } catch (e) {
    log(
      'The agent model did not return valid json. The response is probably questionable.',
      'error',
    );
    return {
      type: 'response',
      content,
    };
  }
};

/**
 * Sent a message to the agent model to select a tool to use for additional context
 *
 * @param llm - The LLM client to use
 * @param message - The message to send
 *
 * @returns - The response from the agent model
 */
export const selectTool = async (
  llm: LlmClient,
  message: string,
): Promise<agentTypes.AgentSelectToolResponse> => {
  const messages: MessageList = [];

  messages.push({
    role: 'user',
    content: `
      ${getPrompt('userQuestionStart')}
      ${message}
    `,
  });

  return decodeResponse(await sendChat(llm, messages));
};

/**
 * Handles the interaction with the llm and tools to provide enough context to the LLM
 * to answer the user's question
 *
 * @param llms - The LLMs to use
 * @param tools - The tools to use
 * @param message - The message to send
 *
 * @returns - The response from the agent model
 */
export const chat =
  (llms: Llms, tools: Tools | undefined) =>
  async (message: string): Promise<agentTypes.AgentResponse> => {
    const toolSelectResponse = await selectTool(llms.agent, message);

    if (!agentTypes.isAgentToolResponse(toolSelectResponse)) {
      return toolSelectResponse;
    }

    log('Tools', 'debug', { tools });
    log('Tool select response', 'debug', { toolSelectResponse });

    if (!tools) {
      log('Tool select response', 'error', { toolSelectResponse });
      throw new Error('No tools available');
    }

    const tool = tools[toolSelectResponse.name];

    if (!tool) {
      log('Tool not found', 'error', { toolSelectResponse });
      throw new Error('Tool not found');
    }

    log('Selected tool', 'debug', { tool });

    const toolResponse = await tool.run({
      userPrompt: toolSelectResponse.query,
      llm: llms.tool,
      params: toolSelectResponse.params,
    });

    const toolContextResponse = await sendChat(llms.agent, [
      {
        role: 'user',
        content: toolResponse.content,
      },
    ]);

    return {
      type: 'response',
      content: toolContextResponse,
    };
  };

export default chat;
