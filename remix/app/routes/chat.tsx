import { ShouldRevalidateFunction } from '@remix-run/react';

export { loader } from '@remix/.server/chat';

export const shouldRevalidate: ShouldRevalidateFunction = ({
  currentParams,
  defaultShouldRevalidate,
  nextParams,
}) => {
  if (currentParams.chatId !== nextParams.chatId) return true;

  return defaultShouldRevalidate;
};

import ChatLayout from '@remix/components/chat/ChatLayout';
export default ChatLayout;
