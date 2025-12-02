import { ChatMessage, Lead, LeadInteraction, InteractionType } from '../types';
import { getLead, updateLead } from '../api/leads';

// Mock data storage
let mockMessages: ChatMessage[] = [];
let messageSubscriptions: Map<string, Set<(message: ChatMessage) => void>> = new Map();

// Inicializar datos de ejemplo
const initializeMockData = () => {
  if (mockMessages.length > 0) return;

  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

  mockMessages = [
    {
      id: 'msg1',
      leadId: '1',
      channel: 'whatsapp',
      direction: 'inbound',
      content: 'Hola, vi tu publicación en Instagram y me interesa saber más sobre tus planes',
      timestamp: twoDaysAgo,
      read: true,
      important: false
    },
    {
      id: 'msg2',
      leadId: '1',
      channel: 'whatsapp',
      direction: 'outbound',
      content: '¡Hola! Me alegra que te interese. ¿Te gustaría agendar una consulta gratuita?',
      timestamp: new Date(twoDaysAgo.getTime() + 2 * 60 * 60 * 1000),
      userId: '1',
      userName: 'Entrenador Principal',
      read: true,
      important: false
    },
    {
      id: 'msg3',
      leadId: '1',
      channel: 'whatsapp',
      direction: 'inbound',
      content: 'Sí, me gustaría. ¿Qué días tienes disponible?',
      timestamp: new Date(twoDaysAgo.getTime() + 3 * 60 * 60 * 1000),
      read: true,
      important: true
    },
    {
      id: 'msg4',
      leadId: '1',
      channel: 'whatsapp',
      direction: 'outbound',
      content: 'Tengo disponibilidad esta semana. ¿Te viene bien el jueves a las 18:00?',
      timestamp: yesterday,
      userId: '1',
      userName: 'Entrenador Principal',
      read: true,
      important: false
    },
    {
      id: 'msg5',
      leadId: '1',
      channel: 'whatsapp',
      direction: 'inbound',
      content: 'Perfecto, el jueves a las 18:00 me viene bien. Te confirmo mañana',
      timestamp: new Date(yesterday.getTime() + 1 * 60 * 60 * 1000),
      read: true,
      important: false
    },
    {
      id: 'msg6',
      leadId: '2',
      channel: 'whatsapp',
      direction: 'inbound',
      content: 'Hola, pregunté por precios hace unos días pero no me respondiste',
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      read: false,
      important: true
    }
  ];
};

// Simular recepción de mensajes en tiempo real
const simulateIncomingMessage = (leadId: string) => {
  // En producción, esto vendría de un webhook de WhatsApp Business API
  setTimeout(() => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      leadId,
      channel: 'whatsapp',
      direction: 'inbound',
      content: 'Mensaje de prueba recibido',
      timestamp: new Date(),
      read: false,
      important: false
    };

    mockMessages.push(newMessage);

    // Notificar suscriptores
    const subscribers = messageSubscriptions.get(leadId);
    if (subscribers) {
      subscribers.forEach(callback => callback(newMessage));
    }
  }, 5000);
};

export class ChatService {
  // Obtener mensajes de un lead
  static async getMessages(leadId: string): Promise<ChatMessage[]> {
    initializeMockData();
    return mockMessages
      .filter(msg => msg.leadId === leadId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  // Obtener mensajes no leídos
  static async getUnreadMessages(userId?: string): Promise<ChatMessage[]> {
    initializeMockData();
    let messages = mockMessages.filter(msg => !msg.read && msg.direction === 'inbound');

    if (userId) {
      // Filtrar por leads asignados al usuario
      const leads = await import('../api/leads').then(m => m.getLeads({ assignedTo: [userId] }));
      const leadIds = leads.map(l => l.id);
      messages = messages.filter(msg => leadIds.includes(msg.leadId));
    }

    return messages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Enviar mensaje
  static async sendMessage(
    leadId: string,
    content: string,
    userId: string,
    userName: string,
    channel: ChatMessage['channel'] = 'whatsapp',
    metadata?: ChatMessage['metadata']
  ): Promise<ChatMessage> {
    initializeMockData();

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      leadId,
      channel,
      direction: 'outbound',
      content,
      timestamp: new Date(),
      userId,
      userName,
      read: true,
      important: false,
      metadata
    };

    mockMessages.push(newMessage);

    // Registrar como interacción en el lead
    const lead = await getLead(leadId);
    if (lead) {
      let interactionType: InteractionType;
      switch (channel) {
        case 'whatsapp':
          interactionType = 'whatsapp_sent';
          break;
        case 'email':
          interactionType = 'email_sent';
          break;
        case 'sms':
          interactionType = 'whatsapp_sent'; // Similar a WhatsApp
          break;
        default:
          interactionType = 'whatsapp_sent';
      }

      const interaction: LeadInteraction = {
        id: `chat-${newMessage.id}`,
        type: interactionType,
        channel,
        date: new Date(),
        description: content.substring(0, 100),
        outcome: 'neutral',
        userId,
        metadata: {
          messageId: newMessage.id,
          chatMessage: true
        }
      };

      await updateLead(leadId, {
        interactions: [...(lead.interactions || []), interaction],
        lastContactDate: new Date()
      });
    }

    // Notificar suscriptores
    const subscribers = messageSubscriptions.get(leadId);
    if (subscribers) {
      subscribers.forEach(callback => callback(newMessage));
    }

    return newMessage;
  }

  // Enviar mensaje usando plantilla
  static async sendTemplateMessage(
    leadId: string,
    templateId: string,
    userId: string,
    userName: string,
    customValues?: Record<string, any>
  ): Promise<ChatMessage> {
    // Obtener plantilla
    const templateService = await import('./templateService').then(m => m.TemplateService);
    const lead = await getLead(leadId);
    if (!lead) {
      throw new Error('Lead not found');
    }

    const template = await templateService.getTemplate(templateId);
    if (!template) {
      throw new Error('Template not found');
    }

    // Personalizar mensaje
    const personalized = await templateService.useTemplate(
      templateId,
      lead,
      { id: userId, name: userName },
      customValues
    );

    return this.sendMessage(leadId, personalized.body, userId, userName, template.channel);
  }

  // Marcar mensajes como leídos
  static async markAsRead(messageIds: string[]): Promise<void> {
    initializeMockData();
    messageIds.forEach(id => {
      const message = mockMessages.find(m => m.id === id);
      if (message) {
        message.read = true;
      }
    });
  }

  // Marcar mensaje como importante
  static async toggleImportant(messageId: string): Promise<ChatMessage> {
    initializeMockData();
    const message = mockMessages.find(m => m.id === messageId);
    if (!message) {
      throw new Error('Message not found');
    }

    message.important = !message.important;
    return message;
  }

  // Suscribirse a nuevos mensajes de un lead
  static subscribeToMessages(
    leadId: string,
    callback: (message: ChatMessage) => void
  ): () => void {
    if (!messageSubscriptions.has(leadId)) {
      messageSubscriptions.set(leadId, new Set());
    }

    const subscribers = messageSubscriptions.get(leadId)!;
    subscribers.add(callback);

    // Simular recepción de mensajes (en producción sería un webhook real)
    // simulateIncomingMessage(leadId);

    // Retornar función de desuscripción
    return () => {
      subscribers.delete(callback);
      if (subscribers.size === 0) {
        messageSubscriptions.delete(leadId);
      }
    };
  }

  // Obtener estadísticas de chat
  static async getChatStats(leadId: string): Promise<{
    totalMessages: number;
    inbound: number;
    outbound: number;
    unread: number;
    averageResponseTime: number; // en minutos
    lastMessageAt?: Date;
  }> {
    const messages = await this.getMessages(leadId);

    const inbound = messages.filter(m => m.direction === 'inbound');
    const outbound = messages.filter(m => m.direction === 'outbound');
    const unread = messages.filter(m => !m.read && m.direction === 'inbound');

    // Calcular tiempo promedio de respuesta
    let totalResponseTime = 0;
    let responseCount = 0;

    for (let i = 0; i < messages.length - 1; i++) {
      const current = messages[i];
      const next = messages[i + 1];

      if (current.direction === 'inbound' && next.direction === 'outbound') {
        const responseTime = (next.timestamp.getTime() - current.timestamp.getTime()) / (1000 * 60);
        totalResponseTime += responseTime;
        responseCount++;
      }
    }

    const averageResponseTime = responseCount > 0 ? totalResponseTime / responseCount : 0;

    return {
      totalMessages: messages.length,
      inbound: inbound.length,
      outbound: outbound.length,
      unread: unread.length,
      averageResponseTime,
      lastMessageAt: messages.length > 0 ? messages[messages.length - 1].timestamp : undefined
    };
  }

  // Obtener conteo de mensajes no leídos
  static async getUnreadCount(leadId?: string): Promise<number> {
    initializeMockData();
    if (leadId) {
      const messages = await ChatService.getMessages(leadId);
      return messages.filter(m => !m.read && m.direction === 'inbound').length;
    }
    // Si no se especifica leadId, contar todos los no leídos
    return mockMessages.filter(m => !m.read && m.direction === 'inbound').length;
  }
}

