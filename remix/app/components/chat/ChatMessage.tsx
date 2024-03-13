import type { AgentHistoryItem } from '@codellm/core';

const chatBubbleCommonClassNames = 'whitespace-pre-wrap p-6';

const chatBubbleClassNames = {
  assistant: `${chatBubbleCommonClassNames} chat-bubble chat-bubble-primary`,
  error: `${chatBubbleCommonClassNames} chat-bubble chat-bubble-error`,
  tool: `${chatBubbleCommonClassNames} card-body rounded-md chat-bubble-accent`,
  user: `${chatBubbleCommonClassNames} chat-bubble`,
};

export const ChatMessage = ({ message }: { message: AgentHistoryItem }) => {
  const role = message.role;

  const getWrapperClasses = () => {
    if (role === 'user') return 'chat chat-start';
    if (role === 'tool') return 'card items-center m-1';
    return 'chat chat-end';
  };

  const Content = () => {
    if (role === 'error') {
      return `There was an error: ${message.error.message}`;
    } else if (role === 'tool') {
      return (
        <div>
          Running the{' '}
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
    <div className={getWrapperClasses()}>
      <div className={chatBubbleClassNames[role]}>
        <Content />
      </div>
    </div>
  );
};

export default ChatMessage;
