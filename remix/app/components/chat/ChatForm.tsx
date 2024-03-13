import { Form } from '@remix-run/react';
import { useChatForm } from './hooks/useChatForm';

export const ChatForm = () => {
  const { $form, isSubmitting } = useChatForm();

  const buttonClassNames = `flex-align-self-end btn btn-sm btn-accent btn-sm ${isSubmitting ? 'btn-disabled' : ''} `;
  return (
    <Form method="post" ref={$form}>
      <div className="p-1">
        <div className="flex border border-secondary rounded-lg p-2 space-x-2">
          <textarea
            name="userMessage"
            className="flex-auto textarea input-accent textarea-lg"
            disabled={isSubmitting}
            placeholder="Ask a question..."
          />
          <div className="flex flex-none flex-col justify-end">
            <button className={buttonClassNames}>Send</button>
          </div>
        </div>
      </div>
    </Form>
  );
};

export default ChatForm;
