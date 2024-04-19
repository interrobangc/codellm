import type { Message } from '@prisma/client';

export type ChatMessageProps = {
  message: Message;
};

export type ChatMessageDisplayProps = {
  children: React.ReactNode;
  innerClass?: string;
  outerClass?: string;
};

export type ChatMessageComponentFn = (message: Message) => React.ReactNode;

export type ChatMessageComponents = Record<string, ChatMessageComponentFn>;
