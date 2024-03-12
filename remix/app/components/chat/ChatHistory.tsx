import useChatHistory from './hooks/useChatHistory';
import ChatMessage from './ChatMessage';
import ChatLoadingMessage from './ChatLoadingMessage';

export const ChatHistory = () => {
  const history = useChatHistory();
  if (!history) return null;

  return (
    <div className="p-2">
      {history.map((message, index) => {
        return <ChatMessage key={index} message={message} />;
      })}
      <ChatLoadingMessage />
    </div>
  );
};

export default ChatHistory;
