import { getPrompt } from '../prompt/index.js';
import { Client, Llms, MessageList } from '../index.js';

export const sendChat = async (llm: Client, messages: MessageList) => {
  return llm.chat(messages);
};

export const selectTool = async (
  llm: Client,
  message: string,
): Promise<string> => {
  const messages: MessageList = [];

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
  (llms: Llms) =>
  async (message: string): Promise<string> => {
    const toolSelectResponse = await selectTool(llms.agent, message);

    return toolSelectResponse;
  };

export default chat;
