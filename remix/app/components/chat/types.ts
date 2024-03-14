import type { AgentHistory } from '@codellm/core';

export type Chat = {
  id: string;
  name: string;
};

export type Chats = Chat[];

export type ChatLayoutLoaderData = {
  chats: Chats;
  currentChat?: Chat;
};

export type ChatLoaderData = {
  currentChat: Chat;
  history: AgentHistory;
};
