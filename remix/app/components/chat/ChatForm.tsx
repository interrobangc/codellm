import { Form } from '@remix-run/react';
import TextareaAutosize from 'react-textarea-autosize';
import { useChatForm } from './hooks/useChatForm';

export const ChatForm = () => {
  const { $form, isSubmitting } = useChatForm();

  const buttonClassNames = `flex-align-self-end btn btn-sm btn-accent btn-sm ${isSubmitting ? 'btn-disabled' : ''} `;

  const handleTextBoxKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      $form.current?.dispatchEvent(new Event('submit', { bubbles: true }));
    }
  };
  return (
    <Form method="post" ref={$form}>
      <div className="p-1">
        <div className="flex border border-accent rounded-lg space-x-2">
          <TextareaAutosize
            name="userMessage"
            className="flex-auto textarea textarea-ghost resize-none focus:outline-none focus:border-none "
            disabled={isSubmitting}
            placeholder="Ask a question..."
            onKeyDown={handleTextBoxKeyDown}
          />
          <div className="flex flex-none flex-col justify-end pb-2 pr-2">
            <button className={buttonClassNames}>Send</button>
          </div>
        </div>
      </div>
    </Form>
  );
};

export default ChatForm;
