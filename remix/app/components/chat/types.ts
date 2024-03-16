import type { ChatModel } from '@remix/.server/models';
export type Chat = ChatModel;

export type Chats = Chat[];

export type { ChatLoaderData } from '@remix/.server/chat.$chatId';
export type { ChatLayoutLoaderData } from '@remix/.server/chat';
