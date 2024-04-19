import type { HTMLFormMethod } from '@remix-run/router';
import { Form, useSubmit } from '@remix-run/react';
import TextareaAutosize from 'react-textarea-autosize';
import useChatForm from './hooks/useChatForm';

const intent = 'sendChat';

export const ChatForm = () => {
  const submit = useSubmit();
  const { $form, isSubmitting } = useChatForm();

  const buttonClass = `flex-align-self-end btn btn-sm btn-accent ${isSubmitting ? 'btn-disabled' : ''}`;

  const handleTextBoxKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();

      const currentForm = $form.current;
      if (!currentForm) return;

      const formData = new FormData(currentForm);
      formData.set('intent', intent);

      submit(formData, {
        action: currentForm.getAttribute('action') ?? currentForm.action,
        method: currentForm.getAttribute('method') as HTMLFormMethod,
      });
    }
  };

  return (
    <Form method="post" ref={$form}>
      <div className="p-1">
        <div className="flex border border-accent rounded-lg space-x-2">
          <TextareaAutosize
            autoFocus
            name="userMessage"
            className="flex-auto textarea textarea-ghost resize-none focus:outline-none focus:border-none "
            disabled={isSubmitting}
            placeholder="Ask a question..."
            onKeyDown={handleTextBoxKeyDown}
          />
          <div className="flex flex-none flex-col justify-end pb-2 pr-2">
            <button className={buttonClass} name="intent" value={intent}>
              Send
            </button>
          </div>
        </div>
      </div>
    </Form>
  );
};

export default ChatForm;
