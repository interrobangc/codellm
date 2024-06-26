import useChatHistory from './hooks/useChatHistory';
import ChatMessage from './ChatMessage';
import ChatMessageLoading from './ChatMessageLoading';

export const ChatHistory = () => {
  const history = useChatHistory();
  if (!history) return null;

  return (
    <div className="p-2">
      {history.map((message, index) => (
        /* @ts-expect-error - not working */
        <ChatMessage key={index} message={message} />
      ))}
      <ChatMessageLoading />
    </div>
  );
};

export default ChatHistory;
