import { Quote, QuoteItem, Lead } from '../types';
import { QuoteService } from '../services/quoteService';

export const getQuotes = async (filters?: {
  leadId?: string;
  status?: Quote['status'];
  startDate?: Date;
  endDate?: Date;
}): Promise<Quote[]> => {
  return QuoteService.getQuotes(filters);
};

export const getQuote = async (id: string): Promise<Quote | null> => {
  return QuoteService.getQuote(id);
};

export const getLeadQuotes = async (leadId: string): Promise<Quote[]> => {
  return QuoteService.getLeadQuotes(leadId);
};

export const createQuote = async (
  quote: Omit<Quote, 'id' | 'quoteNumber' | 'createdAt' | 'updatedAt' | 'status' | 'sentAt' | 'openedAt' | 'viewedAt' | 'approvedAt' | 'rejectedAt'>
): Promise<Quote> => {
  return QuoteService.createQuote(quote);
};

export const updateQuote = async (
  id: string,
  updates: Partial<Quote>
): Promise<Quote> => {
  return QuoteService.updateQuote(id, updates);
};

export const deleteQuote = async (id: string): Promise<void> => {
  return QuoteService.deleteQuote(id);
};

export const sendQuote = async (id: string): Promise<void> => {
  return QuoteService.sendQuote(id);
};

export const approveQuote = async (id: string, userId: string): Promise<Quote> => {
  return QuoteService.approveQuote(id, userId);
};

export const rejectQuote = async (id: string, reason: string, userId: string): Promise<Quote> => {
  return QuoteService.rejectQuote(id, reason, userId);
};

export const convertToClient = async (id: string): Promise<Lead> => {
  return QuoteService.convertToClient(id);
};

