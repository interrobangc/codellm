import { useNavigation } from '@remix-run/react';

export const ChatLoadingMessage = () => {
  const transition = useNavigation();
  const isSubmitting = Boolean(transition.state === 'submitting');
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
