import type { AgentHistoryItem } from '@codellm/core';

const chatBubbleCommonClassNames = 'whitespace-pre-wrap p-6 chat-bubble';

const chatBubbleClassNames = {
  assistant: `${chatBubbleCommonClassNames} chat-bubble-primary`,
  error: `${chatBubbleCommonClassNames} chat-bubble-error`,
  tool: `${chatBubbleCommonClassNames} chat-bubble-accent`,
  user: `${chatBubbleCommonClassNames}`,
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
        <div>
          I&apos;m running the{' '}
          <div
            className="font-bold text-primary text-left tooltip tooltip-left tooltip-primary before:whitespace-pre-wrap"
            data-tip={JSON.stringify(message.params, null, 4)}
          >
            {message.name}
          </div>{' '}
          tool
        </div>
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
