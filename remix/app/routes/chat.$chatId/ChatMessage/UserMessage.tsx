import type { ChatMessageProps } from './types';

import ChatMessageBubble from './ChatMessageBubble';

export const UserMessage = ({ message }: ChatMessageProps) => {
  return (
    <ChatMessageBubble outerClass="chat-start" innerClass="whitespace-pre-wrap">
      {message.content}
    </ChatMessageBubble>
  );
};

export default UserMessage;
