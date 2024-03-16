import useChatForm from './hooks/useChatForm';
import ChatMessageBubble from './ChatMessage/ChatMessageBubble';

export const ChatMessageLoading = () => {
  const { isSubmitting } = useChatForm();
  if (!isSubmitting) return null;

  return (
    <ChatMessageBubble outerClass="chat-end" innerClass="chat-bubble-primary">
      <span className="loading loading-spinner" />
    </ChatMessageBubble>
  );
};

export default ChatMessageLoading;
