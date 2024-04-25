import type { ChatLayoutLoaderData } from '@remix/routes/chat/loader.server';

import { Link, useLoaderData, useParams } from '@remix-run/react';
import { FaPlus } from 'react-icons/fa6';
import useParamRevalidate from '@remix/components/common/hooks/useParamRevalidate';

const ChatNav = () => {
  const loaderData = useLoaderData<ChatLayoutLoaderData>();
  const { chatId } = useParams();
  useParamRevalidate('chatId');

  const handleClick = (event: React.MouseEvent) => {
    const elem = event.target as HTMLElement;
    if (elem) {
      elem?.blur();
    }
  };

  const chats = loaderData?.chats || [];

  return (
    <div className="flex flex-col pr-4 pl-4">
      <div className="flex justify-end">
        <Link to="/chat/create" className="btn btn-accent btn-sm">
          <FaPlus />
        </Link>
      </div>
      <div className="flex flex-col space-y-1 flex- pt-4">
        {chats.map((chat) => (
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
