import type { Chat, Message, Prisma, User } from '@prisma/client';
import type {
  AgentHistoryErrorItem,
  AgentHistoryItem,
  AgentHistoryToolItem,
  AgentHistoryUserItem,
} from '@codellm/core';
import { prisma } from '@remix/.server/models/prisma';
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
  'chatModel:remove': {
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
): Omit<Prisma.MessageCreateWithoutChatInput, 'userId'> => ({
  type: message.role,
  error: JSON.stringify((message as AgentHistoryErrorItem).error),
  params: JSON.stringify((message as AgentHistoryToolItem).params),
  name: (message as AgentHistoryToolItem).name,
  content: (message as AgentHistoryUserItem).content,
});

export const parseMessages = (messages: Message[]) =>
  messages.map((message) => ({
    ...message,
    error: message.error ? JSON.parse(message.error as string) : undefined,
    params: message.params ? JSON.parse(message.params as string) : undefined,
  }));

export const addMessage = (chat: Chat) => (newMessage: AgentHistoryItem) =>
  promiseMayFail(
    prisma.message.create({
      data: {
        ...fromAgentHistoryMessage(newMessage),
        userId: chat.userId,
        chat: {
          connect: {
            id: chat.id,
          },
        },
      },
    }),
    'chatModel:addMessage',
  );

export const getMessages = (chat: Chat) => () =>
  promiseMayFail(
    prisma.message
      .findMany({
        where: { chatId: chat.id },
        orderBy: {
          createdAt: 'asc',
        },
      })
      .then((messages) => parseMessages(messages)),
    'chatModel:getMessages',
  );

export const addChatFromUser = async (
  user: User,
  newChat: Prisma.ChatCreateWithoutUserInput,
) => {
  const chat = await promiseMayFail(
    prisma.chat.create({
      data: {
        ...newChat,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    }),
    'chatModel:addChatFromUser',
  );

  if (isError(chat)) return chat;

  return prismaToModel(chat);
};

export const remove = (chat: Chat) => () =>
  promiseMayFail(
    prisma.chat.delete({ where: { id: chat.id } }),
    'chatModel:remove',
  );

export const update =
  (chat: Chat) => async (newData: Prisma.ChatUpdateInput) => {
    const updatedChat = await promiseMayFail(
      prisma.chat.update({
        where: { id: chat.id },
        data: newData,
      }),
      'chatModel:update',
    );

    if (isError(updatedChat)) return updatedChat;

    return prismaToModel(updatedChat);
  };

export const prismaToModel = (chat: Chat) => ({
  ...chat,
  addMessage: addMessage(chat),
  getMessages: getMessages(chat),
  remove: remove(chat),
  update: update(chat),
});

export const getById = async (id: string) => {
  const chat = await promiseMayFail(
    prisma.chat
      .findUnique({
        where: { id },
        include: {
          messages: {
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
      })
      .then((c) => {
        if (!c) return newError({ code: 'chatModel:notFound' });
        return {
          ...c,
          messages: c.messages ? parseMessages(c.messages) : [],
        };
      }),
    'chatModel:notFound',
  );

  if (isError(chat)) return chat;
  if (!chat) return newError({ code: 'chatModel:notFound' });

  return prismaToModel(chat);
};
