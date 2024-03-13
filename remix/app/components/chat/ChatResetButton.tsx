import { Form } from '@remix-run/react';
import { useChatForm } from './hooks/useChatForm';

export const ChatResetButton = ({
  buttonClassName,
  formClassName,
}: { buttonClassName?: string; formClassName?: string } = {}) => {
  const { isSubmitting } = useChatForm();

  const buttonClass = `btn ${buttonClassName} ${isSubmitting ? 'btn-disabled' : ''}`;

  return (
    <Form method="post" className={formClassName}>
      <button className={buttonClass} name="intent" value="clearAgent">
        Reset
      </button>
    </Form>
  );
};

export default ChatResetButton;
