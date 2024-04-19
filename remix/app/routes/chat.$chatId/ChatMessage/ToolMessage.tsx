import type { ChatMessageProps } from './types';

import { useRef } from 'react';
import ChatMessageAlert from './ChatMessageAlert';

export const ToolMessage = ({ message }: ChatMessageProps) => {
  const $modal = useRef<HTMLDialogElement>(null);

  return (
    <ChatMessageAlert innerClass="chat-bubble-accent">
      Running:
      <button
        className="font-bold text-primary"
        onClick={() => $modal.current?.showModal()}
      >
        {message.name}
      </button>
      <dialog ref={$modal} className="modal">
        <div className="modal-box bg-primary">
          {message.name} params:
          <pre>{JSON.stringify(message.params, null, 4)}</pre>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </ChatMessageAlert>
  );
};

export default ToolMessage;
