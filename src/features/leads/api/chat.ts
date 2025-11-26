import { ChatMessage, Lead } from '../types';
import { ChatService } from '../services/chatService';

export const getChatHistory = async (leadId: string): Promise<ChatMessage[]> => {
  return ChatService.getMessages(leadId);
};

export const sendMessage = async (
  leadId: string,
  message: {
    channel: 'whatsapp' | 'email' | 'sms';
    content: string;
    userId: string;
    userName: string;
  }
): Promise<ChatMessage> => {
  return ChatService.sendMessage(leadId, message);
};

export const markAsRead = async (messageId: string): Promise<void> => {
  return ChatService.markAsRead(messageId);
};

export const markAsImportant = async (messageId: string, important: boolean): Promise<void> => {
  return ChatService.markAsImportant(messageId, important);
};

export const getUnreadCount = async (leadId?: string): Promise<number> => {
  return ChatService.getUnreadCount(leadId);
};

export const subscribeToMessages = (
  leadId: string,
  callback: (message: ChatMessage) => void
): (() => void) => {
  return ChatService.subscribeToMessages(leadId, callback);
};

