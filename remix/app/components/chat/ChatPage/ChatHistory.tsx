import useChatHistory from './hooks/useChatHistory';
import ChatMessage from './ChatMessage';
import ChatMessageLoading from './ChatMessageLoading';

export const ChatHistory = () => {
  const history = useChatHistory();
  if (!history) return null;

  return (
    <div className="p-2">
      {/* @ts-expect-error - not fighting with Prisma types for now  */}
      {history.map((message, index) => {
        return <ChatMessage key={index} message={message} />;
      })}
      <ChatMessageLoading />
    </div>
  );
};

export default ChatHistory;
