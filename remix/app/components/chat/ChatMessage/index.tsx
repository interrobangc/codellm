import type {
  AgentHistoryAssistantItem,
  AgentHistoryErrorItem,
  AgentHistoryItem,
  AgentHistoryToolItem,
  AgentHistoryUserItem,
} from '@codellm/core';
import type { ChatMessageComponents, ChatMessageProps } from './types';

import ChatMessageAlert from './ChatMessageAlert';
import ChatMessageBubble from './ChatMessageBubble';

const chatMessageComponents: ChatMessageComponents = {
  assistant: (m: AgentHistoryItem) => {
    const message = m as AgentHistoryAssistantItem;
    return (
      <ChatMessageBubble outerClass="chat-end" innerClass="chat-bubble-primary">
        {message.content}
      </ChatMessageBubble>
    );
  },
  error: (m: AgentHistoryItem) => {
    const message = m as AgentHistoryErrorItem;
    return (
      <ChatMessageAlert innerClass="chat-bubble-error">
        There was an error: {message.error.message}
      </ChatMessageAlert>
    );
  },
  tool: (m: AgentHistoryItem) => {
    const message = m as AgentHistoryToolItem;
    return (
      <ChatMessageAlert innerClass="chat-bubble-accent">
        Running the{' '}
        <div
          className="font-bold text-primary text-left tooltip tooltip-left tooltip-primary before:whitespace-pre-wrap"
          data-tip={JSON.stringify(message.params, null, 4)}
        >
          {message.name}
        </div>{' '}
        tool
      </ChatMessageAlert>
    );
  },
  user: (m: AgentHistoryItem) => {
    const message = m as AgentHistoryUserItem;
    return (
      <ChatMessageBubble outerClass="chat-start">
        {message.content}
      </ChatMessageBubble>
    );
  },
};

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const role = message.role;

  return chatMessageComponents[role](message);
};

export default ChatMessage;
