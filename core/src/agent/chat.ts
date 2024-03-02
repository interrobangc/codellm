import type { LlmClient, Llms, MessageList, Tools } from '@/.';

import { load as loadYaml } from 'js-yaml';
import { conversation } from '@/llm/index.js';
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
 * @returns - The decoded response
 */
export const decodeResponse = (
  content: string,
): agentTypes.AgentSelectToolResponse => {
  try {
    return agentTypes.agentLlmResponseSchema.parse(loadYaml(content.trim()));
  } catch (e) {
    log('Error decoding response', 'debug', { content, e });
    return {
      type: 'error',
      content,
    };
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
  llms,
  response,
  toolResponses,
  tools,
}: agentTypes.AgentHandleToolResponseParams): Promise<agentTypes.AgentToolResponses> => {
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

  let toolResponse;
  try {
    toolResponse = await tool.run({
      llm: llms.tool,
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
  llms,
  question,
  toolResponses = {},
  tools,
  depth = 0,
}: agentTypes.AgentHandleQuestionParams): Promise<agentTypes.AgentResponse> => {
  const messages: MessageList = [];

  messages.push({
    role: 'user',
    content: await prompt.get('agentQuestion', {
      question,
      toolResponses: getToolResponses(toolResponses),
    }),
  });

  const response = decodeResponse(await sendChat(llms.agent, messages));

  log(`conversation.getHistory('agent')`, 'debug', {
    history: conversation.getHistory('agent'),
  });

  if (agentTypes.isAgentErrorResponse(response)) {
    // conversation.addMessages('agent', [
    //   {
    //     role: 'user',
    //     content: `
    //       Be sure to use the correct yaml format in all further responses.
    //       ${prompt.get('selectToolFormats')}
    //     `,
    //   },
    // ]);
    return handleQuestion({
      llms,
      question,
      toolResponses,
      tools,
      depth: depth + 1,
    });
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
  return handleQuestion({
    llms,
    question,
    toolResponses: await handleToolResponse({
      llms,
      response,
      toolResponses,
      tools,
    }),
    tools,
    depth: depth + 1,
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
  (llms: Llms, tools: Tools | undefined) =>
  async (question: string): Promise<agentTypes.AgentResponse> => {
    log('chat', 'debug', { question });
    return handleQuestion({
      llms,
      question,
      tools,
    });
  };

export default chat;
