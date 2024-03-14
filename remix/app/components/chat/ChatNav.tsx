import { Link, useLoaderData, useParams } from '@remix-run/react';
import type { ChatLayoutLoaderData } from '@remix/components/chat/types';

const ChatNav = () => {
  const loaderData = useLoaderData<ChatLayoutLoaderData>();
  const params = useParams();
  const chatId = params.chatId;

  const currentChatName = loaderData.currentChat?.name;

  const handleClick = (event: React.MouseEvent) => {
    const elem = event.target as HTMLElement;
    if (elem) {
      elem?.blur();
    }
  };

  return (
    <div key={chatId} className="navbar bg-base-100 pl-6 pr-10">
      <div className="navbar-start">
        <Link to="./" className="btn btn-ghost text-xl">
          Chat
        </Link>
        <div className="dropdown dropdown-bottom">
          <div
            key={chatId}
            tabIndex={0}
            role="button"
            className="m-1 btn btn-sm btn-accent"
          >
            {currentChatName}
            <ul
              key={chatId}
              className="menu menu-sm dropdown-content z-[1] p-2 bg-accent shadow rounded-box min-w-[10rem]"
            >
              {loaderData.chats.map((chat) => (
                <li key={chat.id}>
                  <Link
                    to={`/chat/${chat.id}`}
                    onClick={handleClick}
                    className="text-align-center"
                  >
                    {chat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="navbar-end">
        <Link to="/chat/create" className="btn btn-primary btn-sm">
          New
        </Link>
      </div>
    </div>
  );
};

export default ChatNav;
