import { getPrompt } from '../prompt/index.js';
import { CodeLlmClient, CodeLlmLlms, CodeLlmMessageList } from '../index.js';

export const sendChat = async (
  llm: CodeLlmClient,
  messages: CodeLlmMessageList,
) => {
  return llm.chat(messages);
};

export const selectTool = async (
  llm: CodeLlmClient,
  message: string,
): Promise<string> => {
  const messages: CodeLlmMessageList = [];

  messages.push({
    role: 'system',
    content: `
      ${getPrompt('agent')}
      ${getPrompt('selectTool')}
      ${getPrompt('toolList')}
    `,
  });

  messages.push({
    role: 'user',
    content: `
      ${getPrompt('userQuestionStart')}
      ${message}
    `,
  });

  return sendChat(llm, messages);
};

export const chat =
  (llms: CodeLlmLlms) =>
  async (message: string): Promise<string> => {
    const toolSelectResponse = await selectTool(llms.agent, message);

    return toolSelectResponse;
  };

export default chat;
