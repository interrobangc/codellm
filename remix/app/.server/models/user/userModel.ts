import type { Prisma, User } from '@prisma/client';
import { prisma } from '@remix/.server/models/prisma';
import * as chatModel from '@remix/.server/models/chat/chatModel';

export const addChat =
  (user: User) => (newChat: Prisma.ChatCreateWithoutUserInput) =>
    chatModel.addChatFromUser(user, newChat);

export const getChats =
  (user: User) =>
  ({
    withMessages = false,
  }: {
    withMessages?: boolean;
  } = {}) =>
    prisma.chat.findMany({
      where: { userId: user.id },
      orderBy: {
        createdAt: 'desc',
      },
      include: withMessages
        ? {
            messages: {
              orderBy: {
                createdAt: 'desc',
              },
            },
          }
        : undefined,
    });

export const prismaToModel = (user: User) => ({
  ...user,
  addChat: addChat(user),
  getChats: getChats(user),
});

export const getByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      chats: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });
  if (!user) throw new Error('User not found');
  return prismaToModel(user);
};

export const getByAuth0Id = async (auth0Id: string) => {
  const user = await prisma.user.findUnique({
    where: { auth0Id },
    include: {
      chats: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });
  if (!user) throw new Error('User not found');
  return prismaToModel(user);
};
