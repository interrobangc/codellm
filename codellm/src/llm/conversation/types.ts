import { Service } from '../../config/types.js';
import { MessageList } from '../types.js';

export type ConversationHistory = Record<Service, MessageList>;
