// API para respuestas automáticas

import { SocialPlatform } from './social';

export type Sentiment = 'positive' | 'negative' | 'neutral' | 'question';

export interface AutoReplyRule {
  id: string;
  name: string;
  enabled: boolean;
  platforms: SocialPlatform[];
  trigger: {
    type: 'keyword' | 'sentiment' | 'question' | 'all';
    keywords?: string[];
    sentiment?: Sentiment;
  };
  response: {
    template: string;
    variables?: string[];
    delay?: number; // segundos antes de responder
  };
  conditions?: {
    maxRepliesPerDay?: number;
    avoidDuplicateReplies?: boolean;
    onlyBusinessHours?: boolean;
    businessHours?: {
      start: string; // HH:mm
      end: string; // HH:mm
      timezone: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface AutoReplyLog {
  id: string;
  ruleId: string;
  platform: SocialPlatform;
  messageId: string;
  originalMessage: string;
  sentiment: Sentiment;
  response: string;
  sentAt: string;
  status: 'sent' | 'failed' | 'pending';
  error?: string;
}

export interface AutoReplySettings {
  enabled: boolean;
  rules: AutoReplyRule[];
  logs: AutoReplyLog[];
  statistics: {
    totalReplies: number;
    repliesToday: number;
    averageResponseTime: number;
    sentimentDistribution: Record<Sentiment, number>;
  };
}

export const getAutoReplySettings = async (): Promise<AutoReplySettings> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    enabled: true,
    rules: [
      {
        id: 'rule_001',
        name: 'Respuesta a Preguntas Frecuentes',
        enabled: true,
        platforms: ['instagram', 'facebook'],
        trigger: {
          type: 'keyword',
          keywords: ['precio', 'costo', 'cuanto', 'horario', 'disponibilidad', 'clase']
        },
        response: {
          template: '¡Hola! Gracias por tu interés. {respuesta}\n\nPara más información, puedes visitar nuestro perfil o escribirnos por DM. 😊',
          variables: ['respuesta'],
          delay: 30
        },
        conditions: {
          maxRepliesPerDay: 50,
          avoidDuplicateReplies: true,
          onlyBusinessHours: true,
          businessHours: {
            start: '09:00',
            end: '21:00',
            timezone: 'Europe/Madrid'
          }
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-27T00:00:00Z'
      },
      {
        id: 'rule_002',
        name: 'Respuesta a Comentarios Positivos',
        enabled: true,
        platforms: ['instagram', 'facebook'],
        trigger: {
          type: 'sentiment',
          sentiment: 'positive'
        },
        response: {
          template: '¡Muchas gracias por tu comentario! 😊 Nos alegra saber que te gusta nuestro contenido. ¡Sigue así! 💪',
          delay: 60
        },
        conditions: {
          maxRepliesPerDay: 100
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-27T00:00:00Z'
      },
      {
        id: 'rule_003',
        name: 'Respuesta a Preguntas',
        enabled: true,
        platforms: ['instagram', 'facebook'],
        trigger: {
          type: 'question'
        },
        response: {
          template: '¡Hola! Gracias por tu pregunta. {respuesta}\n\nSi necesitas más información, no dudes en escribirnos. 😊',
          variables: ['respuesta'],
          delay: 45
        },
        conditions: {
          maxRepliesPerDay: 30
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-27T00:00:00Z'
      }
    ],
    logs: [
      {
        id: 'log_001',
        ruleId: 'rule_001',
        platform: 'instagram',
        messageId: 'msg_001',
        originalMessage: '¿Cuál es el precio de las clases?',
        sentiment: 'question',
        response: '¡Hola! Gracias por tu interés. El precio de las clases es de 50€/mes. Para más información, puedes visitar nuestro perfil o escribirnos por DM. 😊',
        sentAt: '2024-01-27T10:30:00Z',
        status: 'sent'
      },
      {
        id: 'log_002',
        ruleId: 'rule_002',
        platform: 'facebook',
        messageId: 'msg_002',
        originalMessage: '¡Me encanta tu contenido!',
        sentiment: 'positive',
        response: '¡Muchas gracias por tu comentario! 😊 Nos alegra saber que te gusta nuestro contenido. ¡Sigue así! 💪',
        sentAt: '2024-01-27T11:15:00Z',
        status: 'sent'
      }
    ],
    statistics: {
      totalReplies: 245,
      repliesToday: 12,
      averageResponseTime: 45,
      sentimentDistribution: {
        positive: 120,
        negative: 15,
        neutral: 80,
        question: 30
      }
    }
  };
};

export const createAutoReplyRule = async (
  rule: Omit<AutoReplyRule, 'id' | 'createdAt' | 'updatedAt'>
): Promise<AutoReplyRule> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return {
    id: `rule_${Date.now()}`,
    ...rule,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

export const updateAutoReplyRule = async (
  ruleId: string,
  updates: Partial<AutoReplyRule>
): Promise<AutoReplyRule> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const settings = await getAutoReplySettings();
  const rule = settings.rules.find(r => r.id === ruleId);
  
  if (!rule) {
    throw new Error('Regla no encontrada');
  }
  
  return {
    ...rule,
    ...updates,
    updatedAt: new Date().toISOString()
  };
};

export const deleteAutoReplyRule = async (ruleId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  // En producción, eliminar de la base de datos
};

export const analyzeSentiment = async (message: string): Promise<Sentiment> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Simulación simple de análisis de sentimiento
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('?') || lowerMessage.includes('¿')) {
    return 'question';
  }
  
  const positiveWords = ['gracias', 'genial', 'excelente', 'me encanta', 'perfecto', 'amazing', 'love'];
  const negativeWords = ['mal', 'horrible', 'no me gusta', 'terrible', 'disgusting'];
  
  if (positiveWords.some(word => lowerMessage.includes(word))) {
    return 'positive';
  }
  
  if (negativeWords.some(word => lowerMessage.includes(word))) {
    return 'negative';
  }
  
  return 'neutral';
};

export const processAutoReply = async (
  platform: SocialPlatform,
  messageId: string,
  message: string
): Promise<{ shouldReply: boolean; response?: string; ruleId?: string }> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const settings = await getAutoReplySettings();
  if (!settings.enabled) {
    return { shouldReply: false };
  }
  
  const sentiment = await analyzeSentiment(message);
  
  // Buscar regla que coincida
  for (const rule of settings.rules.filter(r => r.enabled && r.platforms.includes(platform))) {
    let matches = false;
    
    switch (rule.trigger.type) {
      case 'keyword':
        if (rule.trigger.keywords) {
          matches = rule.trigger.keywords.some(keyword =>
            message.toLowerCase().includes(keyword.toLowerCase())
          );
        }
        break;
      case 'sentiment':
        matches = rule.trigger.sentiment === sentiment;
        break;
      case 'question':
        matches = sentiment === 'question';
        break;
      case 'all':
        matches = true;
        break;
    }
    
    if (matches) {
      // Generar respuesta
      let response = rule.response.template;
      
      // Reemplazar variables básicas
      if (rule.response.variables) {
        rule.response.variables.forEach(variable => {
          // En producción, esto se reemplazaría con datos reales
          response = response.replace(`{${variable}}`, '[Respuesta personalizada]');
        });
      }
      
      return {
        shouldReply: true,
        response,
        ruleId: rule.id
      };
    }
  }
  
  return { shouldReply: false };
};

export const getAutoReplyLogs = async (limit?: number): Promise<AutoReplyLog[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const settings = await getAutoReplySettings();
  const logs = settings.logs.sort((a, b) => 
    new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
  );
  
  return limit ? logs.slice(0, limit) : logs;
};

