import type { ChatMessageDisplayProps } from './types';

export const ChatMessageAlert = ({
  children,
  innerClass,
  outerClass,
}: ChatMessageDisplayProps) => {
  return (
    <div className={`card items-center m-1 ${outerClass}`}>
      <div className={`card-body rounded-md ${innerClass}`}>{children}</div>
    </div>
  );
};

export default ChatMessageAlert;
