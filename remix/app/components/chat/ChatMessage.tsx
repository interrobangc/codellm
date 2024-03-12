import type { AgentHistoryItem } from '@codellm/core';

export const ChatMessage = ({ message }: { message: AgentHistoryItem }) => {
  const wrapperClassNames = `chat ${message.role === 'user' ? 'chat-start' : 'chat-end'}`;
  return (
    <div className={wrapperClassNames}>
      <div className="chat-bubble">{message.content}</div>
    </div>
  );
};
