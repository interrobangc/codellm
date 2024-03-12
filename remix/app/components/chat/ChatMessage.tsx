import type { AgentHistoryItem } from '@codellm/core';

const chatBubbleClassNames = {
  assistant: 'chat-bubble chat-bubble-primary',
  error: 'chat-bubble chat-bubble-error',
  tool: 'chat-bubble chat-bubble-accent',
  user: 'chat-bubble',
};

export const ChatMessage = ({ message }: { message: AgentHistoryItem }) => {
  const role = message.role;

  const wrapperClassNames =
    role === 'user' ? 'chat chat-start' : 'chat chat-end';

  const Content = () => {
    if (role === 'error') {
      return `There was an error: ${message.error.message}`;
    } else if (role === 'tool') {
      return (
        <span>
          I&apos;m running the{' '}
          <span className="font-bold text-primary">{message.name}</span> tool
          with these parameters: {JSON.stringify(message.params)}
        </span>
      );
    } else {
      return message.content;
    }
  };

  return (
    <div className={wrapperClassNames}>
      <div className={chatBubbleClassNames[role]}>
        <Content />
      </div>
    </div>
  );
};

export default ChatMessage;
