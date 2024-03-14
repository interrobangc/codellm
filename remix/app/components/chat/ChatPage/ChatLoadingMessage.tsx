import { useChatForm } from './hooks/useChatForm';

export const ChatLoadingMessage = () => {
  const { isSubmitting } = useChatForm();
  if (!isSubmitting) return null;

  return (
    <div className="chat chat-end">
      <div className="chat-bubble">
        <span className="loading loading-spinner" />
      </div>
    </div>
  );
};

export default ChatLoadingMessage;
