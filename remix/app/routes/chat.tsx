import { Outlet, ShouldRevalidateFunction } from '@remix-run/react';
import ChatNav from '@remix/components/chat/ChatNav';

export default function ChatLayout() {
  return (
    <div>
      <ChatNav />
      <Outlet />
    </div>
  );
}

export { loader } from '@remix/.server/chat/layout';

export const shouldRevalidate: ShouldRevalidateFunction = ({
  currentParams,
  defaultShouldRevalidate,
  nextParams,
}) => {
  if (currentParams.chatId !== nextParams.chatId) return true;

  return defaultShouldRevalidate;
};
