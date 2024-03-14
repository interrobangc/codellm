import { Outlet } from '@remix-run/react';
import ChatNav from '@remix/components/chat/ChatNav';

export const ChatLayout = () => {
  return (
    <div className="flex">
      <div className="min-w-[15vw] max-w-[15vw]">
        <ChatNav />
      </div>
      <div className="flex-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default ChatLayout;
