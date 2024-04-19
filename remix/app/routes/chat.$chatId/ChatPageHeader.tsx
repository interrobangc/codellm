import ChatRenameButton from './ChatRenameButton';
import ChatDeleteButton from './ChatDeleteButton';

export const ChatPageHeader = () => {
  return (
    <div className="flex justify-between">
      <div>
        <ChatRenameButton buttonClassName="btn-sm btn-secondary" />
      </div>
      <div>
        <ChatDeleteButton buttonClassName="btn-sm btn-secondary" />
      </div>
    </div>
  );
};

export default ChatPageHeader;
