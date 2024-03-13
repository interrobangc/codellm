import type { ChatMessageDisplayProps } from './types';

export const ChatMessageBubble = ({
  children,
  innerClass,
  outerClass,
}: ChatMessageDisplayProps) => {
  return (
    <div className={`chat ${outerClass}`}>
      <div className={`chat-bubble ${innerClass}`}>{children}</div>
    </div>
  );
};

export default ChatMessageBubble;
