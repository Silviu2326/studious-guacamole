// Types for Lead Inbox Unified & SLA

export interface ConversationMessage {
  id: string;
  leadId: string;
  channel: 'instagram' | 'whatsapp';
  direction: 'inbound' | 'outbound';
  content: string;
  timestamp: Date;
  read: boolean;
  readAt?: Date; // US-05: Cuando el lead leyó el mensaje
  userId?: string;
  userName?: string;
  metadata?: {
    attachments?: MessageAttachment[];
    replyTo?: string;
  };
}

export interface MessageAttachment {
  type: 'image' | 'audio' | 'document';
  url: string;
  name?: string;
  size?: number;
}

export interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  category: 'precios' | 'horarios' | 'servicios' | 'seguimiento' | 'otros';
  variables: string[]; // e.g., ['nombre', 'servicio', 'precio']
  usageCount: number;
  lastUsed?: Date;
}

export interface LeadWithConversation {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  sourceChannel: 'instagram' | 'whatsapp';
  status: 'new' | 'contacted' | 'converted' | 'discarded';
  lastMessageAt: Date;
  lastResponseAt?: Date;
  hoursWithoutResponse: number;
  slaStatus: 'on_time' | 'at_risk' | 'overdue';
  messages: ConversationMessage[];
}

