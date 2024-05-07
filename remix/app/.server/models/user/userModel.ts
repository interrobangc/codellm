import type { Prisma, User } from '@prisma/client';
import { isError, newError, promiseMayFail } from '@remix/.server/errors';
import { prisma } from '@remix/.server/models/prisma';
import * as chatModel from '@remix/.server/models/chat/chatModel';

export const ERRORS = {
  'userModel:addChat': {
    message: 'Failed to add chat',
  },
  'userModel:getByEmail': {
    message: 'Failed to get user by email',
  },
  'userModel:getByAuth0Id': {
    message: 'Failed to get user by Auth0 id',
  },
  'userModel:create': {
    message: 'Failed to create user',
  },
  'userModel:getChats': {
    message: 'Failed to get chats',
  },
  'userModel:notFound': {
    message: 'User not found',
  },
} as const;

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
    promiseMayFail(
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
      }),
      'userModel:getChats',
    );

export const prismaToModel = (user: User) => ({
  ...user,
  addChat: addChat(user),
  getChats: getChats(user),
});

export const getByEmail = async (email: string) => {
  const user = await promiseMayFail(
    prisma.user.findUnique({
      where: { email },
      include: {
        chats: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    }),
    'userModel:getByEmail',
  );
  if (isError(user)) return user;

  if (!user) return newError({ code: 'userModel:notFound' });
  return prismaToModel(user);
};

export const create = async (data: Prisma.UserCreateInput) => {
  const user = await promiseMayFail(
    prisma.user.create({
      data,
    }),
    'userModel:create',
  );

  if (isError(user)) return user;
  return prismaToModel(user);
};

export const getByAuth0Id = async (auth0Id: string) => {
  const user = await promiseMayFail(
    prisma.user.findUnique({
      where: { auth0Id },
      include: {
        chats: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    }),
    'userModel:getByAuth0Id',
  );

  if (isError(user)) return user;

  if (!user) return newError({ code: 'userModel:notFound' });
  return prismaToModel(user);
};
