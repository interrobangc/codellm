import type { ChatLayoutLoaderData } from '@remix/components/chat/types';

import { Link, useLoaderData, useParams } from '@remix-run/react';
import { FaPlus } from 'react-icons/fa6';

const ChatNav = () => {
  const loaderData = useLoaderData<ChatLayoutLoaderData>();
  const params = useParams();
  const chatId = params.chatId;

  const handleClick = (event: React.MouseEvent) => {
    const elem = event.target as HTMLElement;
    if (elem) {
      elem?.blur();
    }
  };

  return (
    <div className="flex flex-col pr-4 pl-4">
      <div className="flex justify-end">
        <Link to="/chat/create" className="btn btn-accent btn-sm">
          <FaPlus />
        </Link>
      </div>
      <div className="flex flex-col space-y-1 flex- pt-4">
        {loaderData.chats.toReversed().map((chat) => (
          <Link
            key={chat.id}
            to={`/chat/${chat.id}`}
            type="button"
            onClick={handleClick}
            className={`btn btn-sm w-full text-ellipsis ${chat.id === chatId ? 'btn-primary' : 'btn-ghost'}`}
          >
            {chat.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ChatNav;
