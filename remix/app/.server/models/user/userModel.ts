import type { ChatInsert, User, UserInsert } from '@remix/.server/db';
import { desc, eq } from 'drizzle-orm';
import { isError, newError, promiseMayFail } from '@remix/.server/errors';
import { db, chatSchema, userSchema, messageSchema } from '@remix/.server/db';
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

export const addChat = (user: User) => (newChat: Omit<ChatInsert, 'userId'>) =>
  chatModel.addChatFromUser(user, newChat);

export const getChats =
  (user: User) =>
  ({
    withMessages = false,
  }: {
    withMessages?: boolean;
  } = {}) =>
    promiseMayFail(
      db.query.chatSchema.findMany({
        where: eq(chatSchema.userId, user.id),
        orderBy: desc(chatSchema.createdAt),
        with: withMessages
          ? { messages: { orderBy: desc(messageSchema.createdAt) } }
          : {},
      }),
      'userModel:getChats',
    );

export const dbToModel = (user: User) => ({
  ...user,
  addChat: addChat(user),
  getChats: getChats(user),
});

export const getByEmail = async (email: string) => {
  const user = await promiseMayFail(
    db.query.userSchema.findFirst({
      where: eq(userSchema.email, email),
      with: {
        chats: {
          orderBy: desc(chatSchema.createdAt),
        },
      },
    }),
    'userModel:getByEmail',
  );
  if (isError(user)) return user;

  if (!user) return newError({ code: 'userModel:notFound' });
  return dbToModel(user);
};

export const create = async (data: UserInsert) => {
  const insertedUsers = await promiseMayFail(
    db.insert(userSchema).values(data).returning(),
    'userModel:create',
  );

  if (isError(insertedUsers)) return insertedUsers;

  const insertedUser = await getByAuth0Id(insertedUsers[0].auth0Id);
  if (isError(insertedUser)) return insertedUser;

  return dbToModel(insertedUser);
};

export const getByAuth0Id = async (auth0Id: string) => {
  const user = await promiseMayFail(
    db.query.userSchema.findFirst({
      where: eq(userSchema.auth0Id, auth0Id),
      with: {
        chats: {
          orderBy: desc(chatSchema.createdAt),
        },
      },
    }),
    'userModel:getByAuth0Id',
  );
  if (isError(user)) return user;

  if (!user) return newError({ code: 'userModel:notFound' });
  return dbToModel(user);
};
