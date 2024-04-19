import type { ChatMessageProps } from './types';

import { useRef } from 'react';
import ChatMessageAlert from './ChatMessageAlert';

export const ToolResponseMessage = ({ message }: ChatMessageProps) => {
  const $modal = useRef<HTMLDialogElement>(null);

  return (
    <ChatMessageAlert innerClass="chat-bubble-primary">
      Results of the{' '}
      <button
        className="font-bold text-accent"
        onClick={() => $modal.current?.showModal()}
      >
        {message.name}
      </button>
      <dialog ref={$modal} className="modal">
        <div className="modal-box bg-accent">
          {message.name} response:
          <pre>{message.content}</pre>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </ChatMessageAlert>
  );
};

export default ToolResponseMessage;
