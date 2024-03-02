import type { LlmClient, Llms, MessageList, Tools } from '@/.';

import { conversation } from '@/llm/index.js';
import log from '@/log/index.js';
import { getPrompt } from '@/prompt/index.js';
import * as agentTypes from './types.js';

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
 * @returns - The decoded response
 */
export const decodeResponse = (
  content: string,
): agentTypes.AgentSelectToolResponse => {
  try {
    return agentTypes.agentLlmResponseSchema.parse(JSON.parse(content.trim()));
  } catch (e) {
    log('Error decoding response', 'debug', { content, e });
    return {
      type: 'error',
      content,
    };
  }
};

export const handleMessage = async (
  llms: Llms,
  message: string,
  tools: Tools | undefined,
  depth: number = 0,
): Promise<agentTypes.AgentResponse> => {
  const messages: MessageList = [];

  messages.push({
    role: 'user',
    content: message,
  });

  const response = decodeResponse(await sendChat(llms.agent, messages));

  log(`conversation.getHistory('agent')`, 'debug', {
    history: conversation.getHistory('agent'),
  });

  if (agentTypes.isAgentErrorResponse(response)) {
    conversation.addMessages('agent', [
      {
        role: 'user',
        content: `
          Be sure to use the correct json format in all further responses.
        `,
      },
    ]);
    return handleMessage(llms, message, tools, depth + 1);
  }

  if (agentTypes.isAgentResponseResponse(response)) {
    return response;
  }

  if (depth >= 5) {
    return {
      type: 'error',
      content: 'The agent model has reached the maximum depth of recursion.',
    };
  }

  // eslint-disable-next-line  @typescript-eslint/no-use-before-define
  return handleToolResponse(llms, message, response, tools, depth);
};

export const handleToolResponse = async (
  llms: Llms,
  message: string,
  response: agentTypes.AgentSelectToolResponse,
  tools: Tools | undefined,
  depth: number = 0,
) => {
  if (!agentTypes.isAgentToolResponse(response)) return response;

  const tool = tools?.[response.name];

  if (!tool) {
    log('Tool not found', 'debug', { response, tools });
    const toolNotFoundMessage = `
      ${message}

      The ${response.name} tool was not found. Please select a different tool.
    `;

    return handleMessage(llms, toolNotFoundMessage, tools, depth + 1);
  }

  log(`Running the ${response.name} tool`);

  const toolResponse = await tool.run({
    llm: llms.tool,
    params: response.params,
  });

  const toolResponseMessage = `
    ${message}
    ${getPrompt('toolResponseStart')}

    Tool: ${response.name}

    Response:
    ${toolResponse.content}
  `;

  return handleMessage(llms, toolResponseMessage, tools, depth + 1);
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
  (llms: Llms, tools: Tools | undefined) =>
  async (question: string): Promise<agentTypes.AgentResponse> => {
    const message = `
      ${getPrompt('userQuestionStart')}
      ${question}
    `;

    return handleMessage(llms, message, tools);
  };

export default chat;
