import type { ChatLayoutLoaderData } from '@remix/.server/chat';
import type { ChatModel } from '@remix/.server/models';

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

  // @ts-expect-error - we know this is a ChatLoaderData but probably need to check for error
  const chats = loaderData?.chats || [];

  return (
    <div className="flex flex-col pr-4 pl-4">
      <div className="flex justify-end">
        <Link to="/chat/create" className="btn btn-accent btn-sm">
          <FaPlus />
        </Link>
      </div>
      <div className="flex flex-col space-y-1 flex- pt-4">
        {chats.map((chat: ChatModel) => (
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
