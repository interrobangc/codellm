import type { LlmClient, Llms, MessageList, Tools } from '@/.';

import log from '@/log/index.js';
import { getPrompt } from '@/prompt/index.js';
import * as agentTypes from './types.js';

export const sendChat = async (llm: LlmClient, messages: MessageList) => {
  return llm.chat(messages);
};

export const decodeResponse = (
  response: string,
): agentTypes.AgentSelectToolResponse => {
  try {
    return JSON.parse(response);
  } catch (e) {
    log('Error parsing response', 'error', { response, e });
    return {
      type: 'error',
      content: 'Error parsing response',
    };
  }
};

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

export const chat =
  (llms: Llms, tools: Tools) =>
  async (message: string): Promise<agentTypes.AgentResponse> => {
    const toolSelectResponse = await selectTool(llms.agent, message);

    if (!agentTypes.isAgentToolResponse(toolSelectResponse)) {
      return toolSelectResponse;
    }

    log('Tools', 'debug', { tools });
    log('Tool select response', 'debug', { toolSelectResponse });

    const tool = tools[toolSelectResponse.name];

    log('Selected tool', 'debug', { tool });

    const toolResponse = await tool.run({
      userPrompt: toolSelectResponse.query,
      basePrompt: getPrompt('agent'),
      llm: llms.tool,
      includeCode: true,
      collectionName: 'fileSummary',
    });

    return {
      type: 'response',
      content: toolResponse.content,
    };
  };

export default chat;
