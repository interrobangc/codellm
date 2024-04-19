import type { ChatMessageProps } from './types';

import { useRef } from 'react';
import ChatMessageAlert from './ChatMessageAlert';

export const ErrorMessage = ({ message }: ChatMessageProps) => {
  const $modal = useRef<HTMLDialogElement>(null);
  const error = message.error || {};

  return (
    <ChatMessageAlert innerClass="chat-bubble-error">
      There was an error:{' '}
      <button
        className="text-primary font-bold"
        onClick={() => $modal.current?.showModal()}
      >
        {/* @ts-expect-error - ignore prisma error for now */}
        {error.message}
      </button>
      <dialog ref={$modal} className="modal">
        <div className="modal-box bg-primary">
          <pre>{JSON.stringify(error, null, 4)}</pre>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </ChatMessageAlert>
  );
};

export default ErrorMessage;
