import type { ChatMessageComponents, ChatMessageProps } from './types';

import AssistantMessage from './AssistantMessage';
import ErrorMessage from './ErrorMessage';
import ToolMessage from './ToolMessage';
import ToolResponseMessage from './ToolResponseMessage';
import UserMessage from './UserMessage';
import { Message } from '@remix/.server/db';

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const chatMessageComponents: ChatMessageComponents = {
    assistant: (m: Message) => <AssistantMessage message={m} />,
    error: (m: Message) => <ErrorMessage message={m} />,
    tool: (m: Message) => <ToolMessage message={m} />,
    toolResponse: (m: Message) => <ToolResponseMessage message={m} />,
    user: (m: Message) => <UserMessage message={m} />,
  };

  const role = message.type;

  return chatMessageComponents[role](message);
};

export default ChatMessage;
