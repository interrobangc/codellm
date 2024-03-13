import type { AgentHistoryItem } from '@codellm/core';

export type ChatMessageProps = {
  message: AgentHistoryItem;
};

export type ChatMessageDisplayProps = {
  children: React.ReactNode;
  innerClass?: string;
  outerClass?: string;
};

export type ChatMessageComponentFn = (
  message: AgentHistoryItem,
) => React.ReactNode;

export type ChatMessageComponents = Record<string, ChatMessageComponentFn>;
