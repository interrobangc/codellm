import type { Chat, ChatInsert, MessageInsert, User } from '@remix/.server/db';
import type {
  AgentHistoryErrorItem,
  AgentHistoryItem,
  AgentHistoryToolItem,
  AgentHistoryUserItem,
} from '@codellm/core';

import { eq } from 'drizzle-orm';
import { db, chatSchema, messageSchema } from '@remix/.server/db';
import { isError, newError, promiseMayFail } from '@remix/.server/errors';

export const ERRORS = {
  'chatModel:addMessage': {
    message: 'Failed to add message',
  },
  'chatModel:getMessages': {
    message: 'Failed to get messages',
  },
  'chatModel:addChatFromUser': {
    message: 'Failed to add chat from user',
  },
  'chatModel:destroy': {
    message: 'Failed to remove chat',
  },
  'chatModel:update': {
    message: 'Failed to update chat',
  },
  'chatModel:notFound': {
    message: 'Chat not found',
  },
} as const;

export const fromAgentHistoryMessage = (
  message: AgentHistoryItem,
): Omit<MessageInsert, 'chatId' | 'userId' | 'updatedAt'> => ({
  type: message.role,
  error: JSON.stringify((message as AgentHistoryErrorItem).error),
  params: JSON.stringify((message as AgentHistoryToolItem).params),
  name: (message as AgentHistoryToolItem).name,
  content: (message as AgentHistoryUserItem).content,
});

export const addMessage = (chat: Chat) => (newMessage: AgentHistoryItem) =>
  promiseMayFail(
    db
      .insert(messageSchema)
      .values({
        ...fromAgentHistoryMessage(newMessage),
        chatId: chat.id,
        userId: chat.userId,
      })
      .returning(),
    'chatModel:addMessage',
  );

export const getMessages = (chat: Chat) => () =>
  promiseMayFail(
    db.query.messageSchema.findMany({
      where: (model, { eq }) => eq(model.chatId, chat.id),
      orderBy: (model, { desc }) => desc(model.createdAt),
    }),
    'chatModel:getMessages',
  );

export const addChatFromUser = async (
  user: User,
  newChat: Omit<ChatInsert, 'userId'>,
) => {
  const insertedChats = await promiseMayFail(
    db
      .insert(chatSchema)
      .values({ ...newChat, userId: user.id })
      .returning(),
    'chatModel:addChatFromUser',
  );

  if (isError(insertedChats)) return insertedChats;
  const insertedChat = await getById(insertedChats[0].id);
  if (isError(insertedChat)) return insertedChat;

  return dbToModel(insertedChat);
};

export const destroy = (chat: Chat) => () =>
  promiseMayFail(
    db.delete(chatSchema).where(eq(chatSchema.id, chat.id)),
    'chatModel:destroy',
  );

export const update = (chat: Chat) => async (newData: Partial<ChatInsert>) => {
  const updatedChats = await promiseMayFail(
    db
      .update(chatSchema)
      .set(newData)
      .where(eq(chatSchema.id, chat.id))
      .returning(),
    'chatModel:update',
  );

  if (isError(updatedChats)) return updatedChats;

  const updatedChat = await getById(updatedChats[0].id);
  if (isError(updatedChat)) return updatedChat;

  return dbToModel(updatedChat);
};

export const dbToModel = (chat: Chat) =>
  Object.freeze({
    ...chat,
    addMessage: addMessage(chat),
    getMessages: getMessages(chat),
    destroy: destroy(chat),
    update: update(chat),
  } as const);

export const getById = async (id: Chat['id']) => {
  const chat = await promiseMayFail(
    db.query.chatSchema.findFirst({
      where: (model, { eq }) => eq(model.id, id),
      with: {
        messages: {
          orderBy: (model, { desc }) => desc(model.createdAt),
        },
      },
    }),
    'chatModel:notFound',
  );
  if (isError(chat)) return chat;
  if (!chat) return newError({ code: 'chatModel:notFound' });

  return dbToModel(chat);
};
