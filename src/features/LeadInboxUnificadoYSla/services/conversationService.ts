import { ConversationMessage, LeadWithConversation } from '../types';
import { NotificationService } from './notificationService';

// Mock data storage
let mockConversations: Map<string, ConversationMessage[]> = new Map();

// Initialize mock data
const initializeMockData = () => {
  if (mockConversations.size > 0) return;

  const now = new Date();
  
  // Conversation for lead 'ld_001' - Ana García (Instagram, at risk)
  mockConversations.set('ld_001', [
    {
      id: 'msg_001_1',
      leadId: 'ld_001',
      channel: 'instagram',
      direction: 'inbound',
      content: '¡Hola! Me gustaría saber precios para el plan de entrenamiento personal. Vi tus resultados en Instagram y me encantaron 😍',
      timestamp: new Date(now.getTime() - 50 * 60 * 1000), // 50 minutes ago
      read: true
    },
    {
      id: 'msg_001_2',
      leadId: 'ld_001',
      channel: 'instagram',
      direction: 'inbound',
      content: '¿Tienes disponibilidad para entrenar en las mañanas?',
      timestamp: new Date(now.getTime() - 45 * 60 * 1000), // 45 minutes ago
      read: true
    }
  ]);

  // Conversation for lead 'ld_002' - Roberto Martínez (Facebook, on time)
  mockConversations.set('ld_002', [
    {
      id: 'msg_002_1',
      leadId: 'ld_002',
      channel: 'whatsapp',
      direction: 'inbound',
      content: 'Hola, estoy interesado en conocer más sobre los planes de membresía. ¿Me puedes dar más información?',
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      read: true
    },
    {
      id: 'msg_002_2',
      leadId: 'ld_002',
      channel: 'whatsapp',
      direction: 'outbound',
      content: '¡Hola Roberto! 👋 Claro que sí. Tengo varios planes según tus objetivos. ¿Buscas perder peso, ganar músculo o mantener tu forma física?',
      timestamp: new Date(now.getTime() - 90 * 60 * 1000),
      read: true,
      readAt: new Date(now.getTime() - 85 * 60 * 1000), // US-05: Read 5 minutes after sent
      userId: 'trainer_xyz',
      userName: 'Laura Sánchez'
    },
    {
      id: 'msg_002_3',
      leadId: 'ld_002',
      channel: 'whatsapp',
      direction: 'inbound',
      content: 'Principalmente perder peso y tonificar. Tengo unos 10 kilos de más que quiero bajar.',
      timestamp: new Date(now.getTime() - 80 * 60 * 1000),
      read: true
    }
  ]);

  // Conversation for lead 'ld_003' - María López (WhatsApp, on time)
  mockConversations.set('ld_003', [
    {
      id: 'msg_003_1',
      leadId: 'ld_003',
      channel: 'whatsapp',
      direction: 'inbound',
      content: '¿Tienen disponibilidad para entrenamientos en la mañana? Trabajo de 9 a 6 y solo puedo antes de las 8am',
      timestamp: new Date(now.getTime() - 10 * 60 * 1000),
      read: true
    }
  ]);

  // Conversation for lead 'ld_005' - Carmen Torres (Email, OVERDUE - 65 min)
  mockConversations.set('ld_005', [
    {
      id: 'msg_005_1',
      leadId: 'ld_005',
      channel: 'whatsapp',
      direction: 'inbound',
      content: '¿Qué horarios tienen disponibles para clases grupales? Me interesan las de spinning y funcional',
      timestamp: new Date(now.getTime() - 65 * 60 * 1000), // 65 minutes - OVERDUE
      read: true
    }
  ]);

  // Conversation for lead 'ld_007' - Patricia Ramírez (Facebook, at risk)
  mockConversations.set('ld_007', [
    {
      id: 'msg_007_1',
      leadId: 'ld_007',
      channel: 'instagram',
      direction: 'inbound',
      content: '¿Ofrecen planes familiares? Me gustaría información. Somos mi esposo y yo, ambos queremos empezar a entrenar',
      timestamp: new Date(now.getTime() - 50 * 60 * 1000),
      read: true
    }
  ]);

  // Conversation for lead 'ld_010' - Miguel Díaz (Email, at risk) - 25+ HOURS without response
  mockConversations.set('ld_010', [
    {
      id: 'msg_010_1',
      leadId: 'ld_010',
      channel: 'whatsapp',
      direction: 'inbound',
      content: 'Me gustaría una consulta sobre nutrición. ¿Ofrecen planes de alimentación personalizados?',
      timestamp: new Date(now.getTime() - 26 * 60 * 60 * 1000), // 26 hours ago - CRITICAL
      read: true
    },
    {
      id: 'msg_010_2',
      leadId: 'ld_010',
      channel: 'whatsapp',
      direction: 'inbound',
      content: '¿Hola? ¿Siguen disponibles?',
      timestamp: new Date(now.getTime() - 25 * 60 * 60 * 1000), // 25 hours ago
      read: true
    }
  ]);
};

export class ConversationService {
  static async getConversation(leadId: string): Promise<ConversationMessage[]> {
    initializeMockData();
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const messages = mockConversations.get(leadId) || [];
    
    // US-09: Simulate receiving new messages and notify
    const unreadInbound = messages.filter(m => m.direction === 'inbound' && !m.read);
    if (unreadInbound.length > 0 && Math.random() > 0.7) {
      const leadName = 'Lead'; // In production, get from lead data
      NotificationService.notify(
        'Nuevo mensaje recibido',
        `${leadName}: ${unreadInbound[0].content.substring(0, 50)}...`
      );
    }
    
    return messages;
  }

  static async sendMessage(
    leadId: string,
    content: string,
    channel: 'instagram' | 'whatsapp',
    userId: string,
    userName: string,
    attachments?: ConversationMessage['metadata']
  ): Promise<ConversationMessage> {
    initializeMockData();
    await new Promise(resolve => setTimeout(resolve, 500));

    const newMessage: ConversationMessage = {
      id: `msg_${leadId}_${Date.now()}`,
      leadId,
      channel,
      direction: 'outbound',
      content,
      timestamp: new Date(),
      read: true,
      // US-05: Simulate read receipt after random delay (30-90 seconds)
      readAt: Math.random() > 0.3 ? new Date(Date.now() + (30 + Math.random() * 60) * 1000) : undefined,
      userId,
      userName,
      metadata: attachments
    };

    const conversation = mockConversations.get(leadId) || [];
    conversation.push(newMessage);
    mockConversations.set(leadId, conversation);

    return newMessage;
  }

  static async markAsRead(leadId: string): Promise<void> {
    initializeMockData();
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const conversation = mockConversations.get(leadId);
    if (conversation) {
      conversation.forEach(msg => {
        if (msg.direction === 'inbound') {
          msg.read = true;
        }
      });
    }
  }

  static getHoursWithoutResponse(messages: ConversationMessage[]): number {
    if (messages.length === 0) return 0;

    // Find the last inbound message
    const inboundMessages = messages.filter(m => m.direction === 'inbound');
    if (inboundMessages.length === 0) return 0;

    const lastInbound = inboundMessages[inboundMessages.length - 1];
    
    // Check if there's an outbound message after the last inbound
    const outboundAfter = messages.find(
      m => m.direction === 'outbound' && m.timestamp > lastInbound.timestamp
    );

    if (outboundAfter) {
      return 0; // Already responded
    }

    // Calculate hours without response
    const now = new Date();
    const hoursDiff = (now.getTime() - lastInbound.timestamp.getTime()) / (1000 * 60 * 60);
    return Math.floor(hoursDiff);
  }
}

