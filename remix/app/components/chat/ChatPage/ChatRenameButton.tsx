import { useRef } from 'react';
import { useChatForm } from '@remix/components/chat/ChatPage/hooks/useChatForm';
import ActionForm from '@remix/components/common/ActionForm';

export const ChatRenameButton = ({
  buttonClassName,
}: { buttonClassName?: string; formClassName?: string } = {}) => {
  const { currentChat, isSubmitting } = useChatForm();
  const $modal = useRef<HTMLDialogElement>(null);

  const buttonClasses = `btn ${buttonClassName} ${isSubmitting ? 'btn-disabled' : ''}`;
  const chatName = currentChat.name || 'new name';

  const closeModal = () => {
    $modal.current?.close();
  };

  const openModal = () => {
    $modal.current?.showModal();
  };

  return (
    <>
      <button className={buttonClasses} onClick={openModal}>
        rename
      </button>
      <dialog ref={$modal} className="modal">
        <div className="modal-box">
          <ActionForm
            intent="renameChat"
            isSubmitting={isSubmitting}
            method="post"
            onSubmit={closeModal}
            submitButtonChildren="submit"
            submitButtonClassName={buttonClasses}
            shouldHideSubmitButton={true}
          >
            <div className="label pt-0">
              <span className="label-text">new name</span>
            </div>
            <input
              type="text"
              placeholder={chatName}
              name="name"
              className="input input-bordered w-full"
            />
          </ActionForm>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};

export default ChatRenameButton;
