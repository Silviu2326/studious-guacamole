import {
  AutomatedComplianceMessage,
  ComplianceMessageConfig,
  ComplianceMessageTemplate,
  MessageType,
  MessageTrigger,
  MessageChannel,
  MessageStatus,
  MilestoneData,
  RelapseData,
} from '../types';

// Mock data para configuración de mensajes automatizados
const MOCK_CONFIG: ComplianceMessageConfig = {
  id: 'compliance_config_001',
  trainerId: 'trainer_001',
  enabled: true,
  milestoneMessages: {
    enabled: true,
    triggers: ['objective-achieved', 'session-milestone', 'weight-goal', 'strength-goal', 'attendance-streak'],
    channels: ['whatsapp', 'email'],
    delayHours: 2,
    templates: [
      {
        id: 'template_milestone_001',
        name: 'Felicitación por Objetivo Alcanzado',
        type: 'milestone',
        trigger: 'objective-achieved',
        message: '¡Felicitaciones {nombre}! 🎉 Has alcanzado tu objetivo: {hito}. Tu dedicación y esfuerzo son inspiradores. ¡Sigamos adelante hacia nuevos retos! 💪',
        variables: ['nombre', 'hito', 'valor'],
        tone: 'celebratorio',
        channel: 'whatsapp',
        delayHours: 2,
        isActive: true,
        createdAt: '2025-09-01T00:00:00Z',
      },
      {
        id: 'template_milestone_002',
        name: 'Celebración de Hito de Sesiones',
        type: 'milestone',
        trigger: 'session-milestone',
        message: '¡Increíble {nombre}! 🏆 Has completado {valor} sesiones. Cada sesión es un paso más hacia tu transformación. ¡Estamos orgullosos de tu compromiso! ✨',
        variables: ['nombre', 'valor'],
        tone: 'motivacional',
        channel: 'whatsapp',
        delayHours: 1,
        isActive: true,
        createdAt: '2025-09-01T00:00:00Z',
      },
    ],
  },
  relapseMessages: {
    enabled: true,
    triggers: ['relapse-detected', 'low-engagement'],
    channels: ['whatsapp', 'email'],
    delayHours: 24,
    templates: [
      {
        id: 'template_relapse_001',
        name: 'Motivación por Recaída',
        type: 'relapse',
        trigger: 'relapse-detected',
        message: 'Hola {nombre}, notamos que has estado un poco ausente últimamente. Sabemos que los altibajos son parte del proceso. Estamos aquí para apoyarte. ¿Te gustaría programar una sesión esta semana? 💪',
        variables: ['nombre', 'dias_ausente'],
        tone: 'empatico',
        channel: 'whatsapp',
        delayHours: 24,
        isActive: true,
        createdAt: '2025-09-01T00:00:00Z',
      },
      {
        id: 'template_relapse_002',
        name: 'Check-in Motivacional',
        type: 'encouragement',
        trigger: 'low-engagement',
        message: 'Hola {nombre}, queremos saber cómo estás. Tu progreso hasta ahora ha sido increíble. Si necesitas apoyo o motivación, estamos aquí. ¡Juntos podemos superar cualquier obstáculo! 🌟',
        variables: ['nombre'],
        tone: 'cercano',
        channel: 'whatsapp',
        delayHours: 48,
        isActive: true,
        createdAt: '2025-09-01T00:00:00Z',
      },
    ],
    sensitivity: 'medium',
  },
  general: {
    maxMessagesPerWeek: 3,
    quietHours: {
      start: '22:00',
      end: '08:00',
    },
    respectOptOut: true,
    useTrainerVoice: true,
  },
  stats: {
    totalMessagesSent: 156,
    milestoneMessagesSent: 98,
    relapseMessagesSent: 58,
    averageResponseRate: 68,
    averageEngagementScore: 75,
    clientsReached: 45,
  },
  lastAnalysis: '2025-10-15T10:00:00Z',
  createdAt: '2025-09-01T00:00:00Z',
  updatedAt: '2025-10-15T10:00:00Z',
};

const MOCK_MESSAGES: AutomatedComplianceMessage[] = [
  {
    id: 'message_001',
    clientId: 'client_001',
    clientName: 'Laura Méndez',
    type: 'milestone',
    trigger: 'objective-achieved',
    templateId: 'template_milestone_001',
    message: '¡Felicitaciones Laura! 🎉 Has alcanzado tu objetivo: Perder 5kg. Tu dedicación y esfuerzo son inspiradores. ¡Sigamos adelante hacia nuevos retos! 💪',
    channel: 'whatsapp',
    status: 'sent',
    milestoneData: {
      type: 'weight',
      title: 'Meta de Peso Alcanzada',
      description: 'Has perdido 5kg',
      achievedAt: '2025-10-15T14:00:00Z',
      value: '5kg',
      previousValue: '0kg',
      clientId: 'client_001',
      clientName: 'Laura Méndez',
    },
    personalization: {
      tone: 'celebratorio',
      emojis: ['🎉', '💪'],
      keywords: ['felicitaciones', 'objetivo', 'dedicación'],
    },
    sentAt: '2025-10-15T16:00:00Z',
    deliveredAt: '2025-10-15T16:00:05Z',
    readAt: '2025-10-15T16:15:00Z',
    clientResponse: {
      responded: true,
      responseText: '¡Gracias! Estoy muy feliz con mi progreso. ¡Sigamos!',
      respondedAt: '2025-10-15T16:20:00Z',
      sentiment: 'positive',
    },
    effectiveness: {
      opened: true,
      clicked: false,
      responded: true,
      engagementScore: 85,
    },
    createdAt: '2025-10-15T14:00:00Z',
    updatedAt: '2025-10-15T16:20:00Z',
  },
  {
    id: 'message_002',
    clientId: 'client_002',
    clientName: 'Carlos Ortega',
    type: 'milestone',
    trigger: 'session-milestone',
    templateId: 'template_milestone_002',
    message: '¡Increíble Carlos! 🏆 Has completado 10 sesiones. Cada sesión es un paso más hacia tu transformación. ¡Estamos orgullosos de tu compromiso! ✨',
    channel: 'whatsapp',
    status: 'delivered',
    milestoneData: {
      type: 'session',
      title: '10 Sesiones Completadas',
      description: 'Has alcanzado el hito de 10 sesiones',
      achievedAt: '2025-10-14T18:00:00Z',
      value: '10',
      previousValue: '9',
      clientId: 'client_002',
      clientName: 'Carlos Ortega',
    },
    personalization: {
      tone: 'motivacional',
      emojis: ['🏆', '✨'],
      keywords: ['increíble', 'compromiso', 'transformación'],
    },
    sentAt: '2025-10-14T19:00:00Z',
    deliveredAt: '2025-10-14T19:00:03Z',
    effectiveness: {
      opened: true,
      clicked: false,
      responded: false,
      engagementScore: 60,
    },
    createdAt: '2025-10-14T18:00:00Z',
    updatedAt: '2025-10-14T19:00:03Z',
  },
  {
    id: 'message_003',
    clientId: 'client_003',
    clientName: 'María González',
    type: 'relapse',
    trigger: 'relapse-detected',
    templateId: 'template_relapse_001',
    message: 'Hola María, notamos que has estado un poco ausente últimamente. Sabemos que los altibajos son parte del proceso. Estamos aquí para apoyarte. ¿Te gustaría programar una sesión esta semana? 💪',
    channel: 'whatsapp',
    status: 'scheduled',
    relapseData: {
      type: 'attendance',
      description: 'Ausente por 7 días consecutivos',
      detectedAt: '2025-10-15T10:00:00Z',
      severity: 'medium',
      indicators: ['No asistencia a sesiones', 'Sin check-ins', 'Baja actividad'],
      clientId: 'client_003',
      clientName: 'María González',
      lastPositiveInteraction: '2025-10-08T18:00:00Z',
      daysSinceLastSession: 7,
      previousStreak: 12,
    },
    personalization: {
      tone: 'empatico',
      emojis: ['💪'],
      keywords: ['apoyo', 'proceso', 'juntos'],
    },
    scheduledFor: '2025-10-16T10:00:00Z',
    createdAt: '2025-10-15T10:00:00Z',
  },
];

export const AutomatedComplianceMessagesAPI = {
  async getConfig(trainerId?: string): Promise<ComplianceMessageConfig | null> {
    await delay(200);
    return cloneData(MOCK_CONFIG);
  },

  async updateConfig(config: Partial<ComplianceMessageConfig>): Promise<ComplianceMessageConfig> {
    await delay(300);
    const updated = {
      ...MOCK_CONFIG,
      ...config,
      updatedAt: new Date().toISOString(),
    };
    return cloneData(updated);
  },

  async getMessages(filters?: {
    clientId?: string;
    type?: MessageType;
    status?: MessageStatus;
    trigger?: MessageTrigger;
  }): Promise<AutomatedComplianceMessage[]> {
    await delay(200);
    let messages = cloneData(MOCK_MESSAGES);
    if (filters) {
      if (filters.clientId) {
        messages = messages.filter((m) => m.clientId === filters.clientId);
      }
      if (filters.type) {
        messages = messages.filter((m) => m.type === filters.type);
      }
      if (filters.status) {
        messages = messages.filter((m) => m.status === filters.status);
      }
      if (filters.trigger) {
        messages = messages.filter((m) => m.trigger === filters.trigger);
      }
    }
    return messages;
  },

  async getMessage(messageId: string): Promise<AutomatedComplianceMessage | null> {
    await delay(200);
    const message = MOCK_MESSAGES.find((m) => m.id === messageId);
    return message ? cloneData(message) : null;
  },

  async createMessage(
    clientId: string,
    type: MessageType,
    trigger: MessageTrigger,
    milestoneData?: MilestoneData,
    relapseData?: RelapseData,
  ): Promise<AutomatedComplianceMessage> {
    await delay(300);
    const newMessage: AutomatedComplianceMessage = {
      id: `message_${Date.now()}`,
      clientId,
      clientName: 'Cliente',
      type,
      trigger,
      message: '',
      channel: 'whatsapp',
      status: 'draft',
      milestoneData,
      relapseData,
      createdAt: new Date().toISOString(),
    };
    return cloneData(newMessage);
  },

  async sendMessage(messageId: string): Promise<AutomatedComplianceMessage> {
    await delay(300);
    const message = MOCK_MESSAGES.find((m) => m.id === messageId);
    if (!message) {
      throw new Error(`Mensaje ${messageId} no encontrado`);
    }
    const updated: AutomatedComplianceMessage = {
      ...message,
      status: 'sent',
      sentAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return cloneData(updated);
  },

  async updateMessageStatus(
    messageId: string,
    status: MessageStatus,
  ): Promise<AutomatedComplianceMessage> {
    await delay(200);
    const message = MOCK_MESSAGES.find((m) => m.id === messageId);
    if (!message) {
      throw new Error(`Mensaje ${messageId} no encontrado`);
    }
    const updated: AutomatedComplianceMessage = {
      ...message,
      status,
      updatedAt: new Date().toISOString(),
    };
    if (status === 'delivered' && !updated.deliveredAt) {
      updated.deliveredAt = new Date().toISOString();
    }
    if (status === 'read' && !updated.readAt) {
      updated.readAt = new Date().toISOString();
    }
    return cloneData(updated);
  },

  async getTemplates(type?: MessageType): Promise<ComplianceMessageTemplate[]> {
    await delay(200);
    const allTemplates = [
      ...MOCK_CONFIG.milestoneMessages.templates,
      ...MOCK_CONFIG.relapseMessages.templates,
    ];
    if (type) {
      return cloneData(allTemplates.filter((t) => t.type === type));
    }
    return cloneData(allTemplates);
  },

  async createTemplate(
    template: Omit<ComplianceMessageTemplate, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<ComplianceMessageTemplate> {
    await delay(300);
    const newTemplate: ComplianceMessageTemplate = {
      ...template,
      id: `template_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return cloneData(newTemplate);
  },

  async updateTemplate(
    templateId: string,
    updates: Partial<ComplianceMessageTemplate>,
  ): Promise<ComplianceMessageTemplate> {
    await delay(200);
    const allTemplates = [
      ...MOCK_CONFIG.milestoneMessages.templates,
      ...MOCK_CONFIG.relapseMessages.templates,
    ];
    const template = allTemplates.find((t) => t.id === templateId);
    if (!template) {
      throw new Error(`Template ${templateId} no encontrado`);
    }
    const updated: ComplianceMessageTemplate = {
      ...template,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return cloneData(updated);
  },

  async detectMilestones(clientId: string): Promise<MilestoneData[]> {
    await delay(400);
    // Simulación de detección de hitos
    return [];
  },

  async detectRelapses(clientId: string): Promise<RelapseData[]> {
    await delay(400);
    // Simulación de detección de recaídas
    return [];
  },
};

function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function cloneData<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value)) as T;
}

