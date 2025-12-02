import { ChatMessage, ChatAttachment, ChatConversation } from '../types';

// Mock data - En producción esto se reemplazaría con llamadas reales a la API
const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_1',
    clienteId: 'client_1',
    senderId: 'trainer_1',
    senderType: 'trainer',
    senderName: 'Entrenador',
    content: 'Hola Juan, ¿cómo te sientes después de la sesión de ayer?',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // Hace 2 horas
    read: true,
  },
  {
    id: 'msg_2',
    clienteId: 'client_1',
    senderId: 'client_1',
    senderType: 'client',
    senderName: 'Juan Pérez',
    content: 'Muy bien, gracias! Me siento más fuerte. ¿Podemos aumentar el peso en press banca?',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // Hace 1 hora
    read: true,
  },
  {
    id: 'msg_3',
    clienteId: 'client_1',
    senderId: 'trainer_1',
    senderType: 'trainer',
    senderName: 'Entrenador',
    content: 'Perfecto! Te envío el plan actualizado para la próxima sesión.',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // Hace 30 minutos
    read: true,
    attachments: [
      {
        id: 'att_1',
        messageId: 'msg_3',
        fileName: 'plan_entrenamiento_octubre.pdf',
        fileType: 'application/pdf',
        fileSize: 245760, // 240 KB
        url: '/files/plan_entrenamiento_octubre.pdf',
        uploadDate: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: 'msg_4',
    clienteId: 'client_1',
    senderId: 'client_1',
    senderType: 'client',
    senderName: 'Juan Pérez',
    content: 'Genial, muchas gracias!',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // Hace 15 minutos
    read: true,
  },
];

const MOCK_ATTACHMENTS: ChatAttachment[] = [];

export const getChatMessages = async (clienteId: string): Promise<ChatMessage[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return MOCK_MESSAGES.filter(msg => msg.clienteId === clienteId).sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
};

export const sendMessage = async (
  clienteId: string,
  senderId: string,
  senderType: 'trainer' | 'client',
  senderName: string,
  content: string,
  attachments?: File[]
): Promise<ChatMessage> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const newMessage: ChatMessage = {
    id: `msg_${Date.now()}`,
    clienteId,
    senderId,
    senderType,
    senderName,
    content,
    timestamp: new Date().toISOString(),
    read: false,
    attachments: attachments?.map((file, index) => ({
      id: `att_${Date.now()}_${index}`,
      messageId: `msg_${Date.now()}`,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      url: URL.createObjectURL(file), // En producción sería una URL del servidor
      uploadDate: new Date().toISOString(),
    })),
  };

  MOCK_MESSAGES.push(newMessage);
  return newMessage;
};

export const markMessagesAsRead = async (clienteId: string, messageIds: string[]): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  MOCK_MESSAGES.forEach(msg => {
    if (msg.clienteId === clienteId && messageIds.includes(msg.id)) {
      msg.read = true;
    }
  });
};

export const getChatConversations = async (trainerId: string): Promise<ChatConversation[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  // Agrupar mensajes por cliente
  const conversationsMap = new Map<string, ChatMessage[]>();
  MOCK_MESSAGES.forEach(msg => {
    if (!conversationsMap.has(msg.clienteId)) {
      conversationsMap.set(msg.clienteId, []);
    }
    conversationsMap.get(msg.clienteId)!.push(msg);
  });

  const conversations: ChatConversation[] = [];
  conversationsMap.forEach((messages, clienteId) => {
    const sortedMessages = messages.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    const lastMessage = sortedMessages[0];
    const unreadCount = messages.filter(
      msg => !msg.read && msg.senderType === 'client'
    ).length;

    conversations.push({
      clienteId,
      clienteName: lastMessage.senderType === 'client' ? lastMessage.senderName : 'Cliente',
      lastMessage,
      unreadCount,
      lastActivity: lastMessage.timestamp,
    });
  });

  return conversations.sort(
    (a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
  );
};

export const deleteMessage = async (messageId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const index = MOCK_MESSAGES.findIndex(msg => msg.id === messageId);
  if (index !== -1) {
    MOCK_MESSAGES.splice(index, 1);
  }
};

export const uploadAttachment = async (file: File, messageId: string): Promise<ChatAttachment> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const attachment: ChatAttachment = {
    id: `att_${Date.now()}`,
    messageId,
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
    url: URL.createObjectURL(file), // En producción sería una URL del servidor
    uploadDate: new Date().toISOString(),
  };

  MOCK_ATTACHMENTS.push(attachment);
  return attachment;
};

