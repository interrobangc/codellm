import type { Chat, Message, Prisma, User } from '@prisma/client';
import type {
  AgentHistoryErrorItem,
  AgentHistoryItem,
  AgentHistoryToolItem,
  AgentHistoryUserItem,
} from '@codellm/core';
import { prisma } from '@remix/.server/models/prisma';

export const fromAgentHistoryMessage = (
  message: AgentHistoryItem,
): Omit<Prisma.MessageCreateWithoutChatInput, 'userId'> => ({
  type: message.role,
  error: JSON.stringify((message as AgentHistoryErrorItem).error),
  params: JSON.stringify((message as AgentHistoryToolItem).params),
  name: (message as AgentHistoryToolItem).name,
  content: (message as AgentHistoryUserItem).content,
});

export const addMessage = (chat: Chat) => (newMessage: AgentHistoryItem) => {
  const message = prisma.message.create({
    data: {
      ...fromAgentHistoryMessage(newMessage),
      userId: chat.userId,
      chat: {
        connect: {
          id: chat.id,
        },
      },
    },
  });
  if (!message) throw new Error('Message not created');

  return message;
};

export const getMessages = (chat: Chat) => () =>
  prisma.message.findMany({
    where: { chatId: chat.id },
    orderBy: {
      createdAt: 'asc',
    },
  });

export const addChatFromUser = async (
  user: User,
  newChat: Prisma.ChatCreateWithoutUserInput,
) => {
  const chat = await prisma.chat.create({
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
  });
  if (!chat) throw new Error('Chat not created');

  return prismaToModel(chat);
};

export const remove = (chat: Chat) => () =>
  prisma.chat.delete({ where: { id: chat.id } });

export const update =
  (chat: Chat) => async (newData: Prisma.ChatUpdateInput) => {
    const updatedChat = await prisma.chat.update({
      where: { id: chat.id },
      data: newData,
    });
    if (!updatedChat) throw new Error('Chat not updated');

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
  const chat = await prisma.chat.findUnique({
    where: { id },
    include: {
      messages: {
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  });

  if (!chat) throw new Error('Chat not found');
  return prismaToModel(chat);
};
