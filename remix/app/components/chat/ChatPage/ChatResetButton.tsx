import ActionButton from '@remix/components/common/ActionButton';
import { useChatForm } from './hooks/useChatForm';

export const ChatResetButton = ({
  buttonClassName,
  formClassName,
}: { buttonClassName?: string; formClassName?: string } = {}) => {
  const { isSubmitting } = useChatForm();

  return (
    <ActionButton
      buttonClassName={buttonClassName}
      formClassName={formClassName}
      intent="resetAgent"
      isSubmitting={isSubmitting}
      method="post"
    >
      reset
    </ActionButton>
  );
};

export default ChatResetButton;
