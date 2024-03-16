import type { Message } from '@prisma/client';
import type { ChatMessageComponents, ChatMessageProps } from './types';

import ChatMessageAlert from './ChatMessageAlert';
import ChatMessageBubble from './ChatMessageBubble';

const chatMessageComponents: ChatMessageComponents = {
  assistant: (m: Message) => {
    return (
      <ChatMessageBubble outerClass="chat-end" innerClass="chat-bubble-primary">
        {m.content}
      </ChatMessageBubble>
    );
  },
  error: (m: Message) => {
    return (
      <ChatMessageAlert innerClass="chat-bubble-error">
        There was an error:{' '}
        <div
          className="font-bold text-left tooltip tooltip-left tooltip-primary before:whitespace-pre-wrap"
          data-tip={JSON.stringify(m.error, null, 4)}
        >
          {/* @ts-expect-error - not fighting with Prisma types for now */}
          {m.error?.message}
        </div>
      </ChatMessageAlert>
    );
  },
  tool: (m: Message) => {
    return (
      <ChatMessageAlert innerClass="chat-bubble-accent">
        Running the{' '}
        <div
          className="font-bold text-primary text-left tooltip tooltip-left tooltip-primary before:whitespace-pre-wrap"
          data-tip={JSON.stringify(m.params, null, 4)}
        >
          {m.name}
        </div>{' '}
        tool
      </ChatMessageAlert>
    );
  },
  user: (m: Message) => {
    return (
      <ChatMessageBubble outerClass="chat-start">{m.content}</ChatMessageBubble>
    );
  },
};

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const role = message.type;

  return chatMessageComponents[role](message);
};

export default ChatMessage;
