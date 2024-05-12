import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';

import {
  pgTable,
  serial,
  varchar,
  timestamp,
  text,
  integer,
  foreignKey,
  jsonb,
  boolean,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

import { relations } from 'drizzle-orm/relations';
import { sql } from 'drizzle-orm';

export const messageSchema = pgTable('message', {
  id: serial('id').primaryKey().notNull(),
  chatId: integer('chatId')
    .notNull()
    .references(() => chatSchema.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  userId: integer('userId')
    .notNull()
    .references(() => userSchema.id),
  content: text('content'),
  createdAt: timestamp('createdAt', { precision: 3, mode: 'string' })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updatedAt', { precision: 3, mode: 'string' })
    .defaultNow()
    .notNull(),
  error: jsonb('error'),
  name: text('name'),
  params: jsonb('params'),
  type: text('type').notNull(),
});

export type MessageSelect = InferSelectModel<typeof messageSchema>;
export type MessageInsert = InferInsertModel<typeof messageSchema>;
export type MessageUpdate = Partial<
  Omit<MessageInsert, 'chatId' | 'userId' | 'updatedAt'>
>;
export type Message = MessageSelect;

export const messageRelations = relations(messageSchema, ({ one }) => ({
  chat: one(chatSchema, {
    fields: [messageSchema.chatId],
    references: [chatSchema.id],
  }),
}));

export const chatSchema = pgTable('chat', {
  id: serial('id').primaryKey().notNull(),
  userId: integer('userId')
    .notNull()
    .references(() => userSchema.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  createdAt: timestamp('createdAt', { precision: 3, mode: 'string' })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updatedAt', { precision: 3, mode: 'string' })
    .defaultNow()
    .notNull(),
  isLoading: boolean('isLoading').default(false).notNull(),
  name: text('name').notNull(),
});

export type ChatSelect = InferSelectModel<typeof chatSchema>;
export type ChatInsert = InferInsertModel<typeof chatSchema>;
export type ChatUpdate = Partial<Omit<ChatInsert, 'userId' | 'updatedAt'>>;
export type Chat = ChatSelect & { messages: MessageSelect[] };

export const chatRelations = relations(chatSchema, ({ many, one }) => ({
  messages: many(messageSchema),
  user: one(userSchema, {
    fields: [chatSchema.userId],
    references: [userSchema.id],
  }),
}));

export const userSchema = pgTable(
  'user',
  {
    id: serial('id').primaryKey().notNull(),
    email: text('email').notNull(),
    createdAt: timestamp('createdAt', { precision: 3, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updatedAt', {
      precision: 3,
      mode: 'string',
    })
      .defaultNow()
      .notNull(),
    firstName: text('firstName'),
    lastName: text('lastName'),
    auth0Id: text('auth0Id').notNull(),
    isVerified: boolean('isVerified').default(false).notNull(),
  },
  (table) => {
    return {
      email_key: uniqueIndex('User_email_key').on(table.email),
      auth0Id_key: uniqueIndex('User_auth0Id_key').on(table.auth0Id),
    };
  },
);

export type UserSelect = InferSelectModel<typeof userSchema>;
export type UserInsert = InferInsertModel<typeof userSchema>;
export type UserUpdate = Partial<UserInsert>;
export type User = UserSelect & { chats: ChatSelect[] };

export const userRelations = relations(userSchema, ({ many }) => ({
  chats: many(chatSchema),
}));
