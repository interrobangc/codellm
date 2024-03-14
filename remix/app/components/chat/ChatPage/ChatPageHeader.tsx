import ChatRenameButton from './ChatRenameButton';
import ChatResetButton from './ChatResetButton';

export const ChatPageHeader = () => {
  return (
    <div className="flex justify-between">
      <div>
        <ChatRenameButton buttonClassName="btn-sm btn-secondary" />
      </div>
      <div>
        <ChatResetButton buttonClassName="btn-sm btn-secondary" />
      </div>
    </div>
  );
};

export default ChatPageHeader;
