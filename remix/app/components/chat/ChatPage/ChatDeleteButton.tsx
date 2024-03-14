import ActionButton from '@remix/components/common/ActionButton';
import { useChatForm } from './hooks/useChatForm';

export const ChatDeleteButton = ({
  buttonClassName,
  formClassName,
}: { buttonClassName?: string; formClassName?: string } = {}) => {
  const { isSubmitting } = useChatForm();

  return (
    <ActionButton
      buttonClassName={buttonClassName}
      formClassName={formClassName}
      intent="deleteChat"
      isSubmitting={isSubmitting}
      method="post"
    >
      delete
    </ActionButton>
  );
};

export default ChatDeleteButton;
