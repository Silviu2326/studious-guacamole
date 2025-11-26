import { MessageTemplate, InteractionChannel, Lead } from '../types';
import { TemplateService } from '../services/templateService';

export interface MessageTemplateExtended {
  id: string;
  name: string;
  category: 'bienvenida' | 'seguimiento' | 'cierre' | 'reactivacion' | 'personalizada';
  channel: InteractionChannel;
  businessType: 'entrenador' | 'gimnasio';
  subject?: string;
  body: string;
  variables: string[];
  usageCount: number;
  lastUsed?: Date;
  effectiveness?: {
    sent: number;
    opened?: number;
    clicked?: number;
    replied?: number;
    converted?: number;
  };
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
}

export const getTemplates = async (
  businessType: 'entrenador' | 'gimnasio',
  channel?: InteractionChannel
): Promise<MessageTemplateExtended[]> => {
  return TemplateService.getTemplates(businessType, channel);
};

export const getTemplate = async (id: string): Promise<MessageTemplateExtended | null> => {
  return TemplateService.getTemplate(id);
};

export const createTemplate = async (
  template: Omit<MessageTemplateExtended, 'id' | 'createdAt' | 'updatedAt' | 'usageCount' | 'effectiveness'>
): Promise<MessageTemplateExtended> => {
  return TemplateService.createTemplate(template);
};

export const updateTemplate = async (
  id: string,
  updates: Partial<MessageTemplateExtended>
): Promise<MessageTemplateExtended> => {
  return TemplateService.updateTemplate(id, updates);
};

export const deleteTemplate = async (id: string): Promise<void> => {
  return TemplateService.deleteTemplate(id);
};

export const personalizeTemplate = (template: MessageTemplateExtended, lead: Lead): string => {
  return TemplateService.personalizeTemplate(template, lead);
};

export const incrementUsage = async (templateId: string): Promise<void> => {
  return TemplateService.incrementUsage(templateId);
};

export const getTemplateEffectiveness = async (
  templateId: string
): Promise<MessageTemplateExtended['effectiveness']> => {
  return TemplateService.getTemplateEffectiveness(templateId);
};

export const searchTemplates = async (
  businessType: 'entrenador' | 'gimnasio',
  query: string,
  filters?: {
    category?: string;
    channel?: InteractionChannel;
  }
): Promise<MessageTemplateExtended[]> => {
  return TemplateService.searchTemplates(businessType, query, filters);
};

