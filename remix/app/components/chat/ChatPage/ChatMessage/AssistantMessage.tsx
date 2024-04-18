import type { ChatMessageProps } from './types';

import ChatMessageBubble from './ChatMessageBubble';

export const AssistantMessage = ({ message }: ChatMessageProps) => {
  return (
    <ChatMessageBubble
      outerClass="chat-end"
      innerClass="chat-bubble-primary whitespace-pre-wrap"
    >
      {message.content}
    </ChatMessageBubble>
  );
};

export default AssistantMessage;
