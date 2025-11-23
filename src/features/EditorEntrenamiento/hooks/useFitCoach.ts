import { useState, useCallback } from 'react';

export interface ActionCardData {
  title: string;
  description: string;
  actions: {
    label: string;
    onClick: () => void;
    type?: 'primary' | 'secondary';
  }[];
}

export interface Message {
  id: number;
  text: string;
  isUser: boolean;
  actionCard?: ActionCardData;
}

export interface Alert {
  id: string;
  level: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  action?: {
    label: string;
    handler: () => void;
  };
}

import { FitCoachMemoryService } from '../services/FitCoachMemoryService';

export const useFitCoach = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: '¡Hola! Estoy analizando el programa de María López. ¿En qué puedo ayudarte?', isUser: false },
    { id: 2, text: 'Optimiza la semana 1', isUser: true },
    { id: 3, text: 'He analizado la Semana 1 y encontré 3 oportunidades de mejora: 1. Balance Push/Pull. 2. Volumen de Core. 3. Distribución de RPE.', isUser: false },
    { id: 4, text: '¿Quieres que aplique todas las mejoras?', isUser: false },
  ]);

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      level: 'critical',
      title: 'Progresión de volumen excesiva',
      message: 'Sem 2 -> Sem 3: +18% de volumen. Recomendado: máximo +10% semanal.',
      action: {
        label: 'Ajustar automáticamente',
        handler: () => console.log('Ajustando volumen...'),
      },
    },
    {
      id: '2',
      level: 'warning',
      title: 'Desequilibrio Push/Pull',
      message: 'Ratio actual: 65/35 (recomendado: 55/45).',
      action: {
        label: 'Ver sugerencias',
        handler: () => console.log('Ver sugerencias push/pull...'),
      },
    },
    {
      id: '3',
      level: 'info',
      title: 'Día domingo vacío',
      message: 'El día domingo no tiene asignación. ¿Deseas agregar descanso activo?',
      action: {
        label: 'Agregar descanso',
        handler: () => console.log('Agregando descanso...'),
      },
    },
  ]);

  const [isTyping, setIsTyping] = useState(false);

  const processCommand = (text: string): Partial<Message> | null => {
    const lowerText = text.toLowerCase();

    // Check for memories first to personalize
    const patterns = FitCoachMemoryService.analyzePatterns();
    const recentMemories = FitCoachMemoryService.getMemories().slice(0, 3);

    if (lowerText.includes('sugerencia') || lowerText.includes('ayuda') || lowerText.includes('que hago')) {
      if (patterns.length > 0) {
        let suggestionText = `He notado algunos patrones en tu estilo de programación: ${patterns.join(', ')}.`;

        if (patterns.includes('Prefiere reutilizar días existentes')) {
          suggestionText += ' Dado que sueles reutilizar días, ¿te gustaría que active el modo "Smart Fill" para completar la semana basándome en tus días favoritos?';
          return {
            text: suggestionText,
            actionCard: {
              title: 'Sugerencia de Productividad',
              description: 'Activar Smart Fill para autocompletar.',
              actions: [
                { label: 'Activar Smart Fill', onClick: () => console.log('Activating Smart Fill'), type: 'primary' }
              ]
            }
          };
        }

        return {
          text: `${suggestionText} ¿Quieres que optimice el plan basándome en esto?`,
          actionCard: {
            title: 'Sugerencia Personalizada',
            description: 'Basado en tus acciones recientes.',
            actions: [
              { label: 'Aplicar optimizaciones', onClick: () => console.log('Applying personalized opts'), type: 'primary' }
            ]
          }
        };
      }
    }

    if (lowerText.includes('optimiza')) {
      return {
        text: 'He detectado que la intensidad del Martes es muy alta seguida de otro día intenso. Recomiendo alternar con un día de recuperación activa.',
        actionCard: {
          title: 'Optimización de Recuperación',
          description: 'Mover sesión de HIIT del Miércoles al Viernes para permitir recuperación del SNC.',
          actions: [
            {
              label: 'Aplicar cambio',
              onClick: () => console.log('Optimizando calendario...'),
              type: 'primary'
            },
            {
              label: 'Ignorar',
              onClick: () => console.log('Ignorado'),
              type: 'secondary'
            }
          ]
        }
      };
    }

    if (lowerText.includes('rodilla') || lowerText.includes('lesion') || lowerText.includes('dolor')) {
      return {
        text: 'Entendido. Para proteger la rodilla, sugiero modificar los ejercicios de alto impacto y flexión profunda.',
        actionCard: {
          title: 'Modificación por Lesión (Rodilla)',
          description: 'Sustituir "Jump Squats" y "Lunges" por ejercicios de bajo impacto.',
          actions: [
            {
              label: 'Sustituir ejercicios',
              onClick: () => console.log('Sustituyendo ejercicios...'),
              type: 'primary'
            },
            {
              label: 'Ver alternativas',
              onClick: () => console.log('Mostrando alternativas'),
              type: 'secondary'
            }
          ]
        }
      };
    }

    if (lowerText.includes('tiempo') || lowerText.includes('corto') || lowerText.includes('rapido')) {
      return {
        text: 'Puedo ajustar el volumen para sesiones más cortas sin perder intensidad clave.',
        actionCard: {
          title: 'Ajuste de Tiempo',
          description: 'Convertir sesiones de fuerza de 60min a formato Super-Sets (45min).',
          actions: [
            {
              label: 'Aplicar Super-Sets',
              onClick: () => console.log('Aplicando super-sets...'),
              type: 'primary'
            },
            {
              label: 'Mantener actual',
              onClick: () => console.log('Mantener'),
              type: 'secondary'
            }
          ]
        }
      };
    }

    if (lowerText.includes('balance') || lowerText.includes('push')) {
      return {
        text: 'He analizado el balance de tu programa y detecté una oportunidad de mejora importante.',
        actionCard: {
          title: 'Desbalance Push/Pull',
          description: 'Ratio actual 3:1. Se recomienda acercarse a 1:1 para prevenir lesiones.',
          actions: [
            {
              label: 'Corregir (+Remo)',
              onClick: () => console.log('Agregando ejercicios de remo...'),
              type: 'primary'
            },
            {
              label: 'Ignorar',
              onClick: () => console.log('Alerta ignorada'),
              type: 'secondary'
            }
          ]
        }
      };
    }

    // Default response with memory context
    let defaultText = 'Entendido. Estoy procesando tu solicitud para optimizar el programa. ¿Necesitas ayuda con algo específico como lesiones, tiempo o balance?';

    if (recentMemories.length > 0) {
      const lastAction = recentMemories[0];
      defaultText += ` (Por cierto, vi que recientemente: ${lastAction.content})`;
    }

    return {
      text: defaultText,
    };
  };

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = { id: Date.now(), text, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const response = processCommand(text);

      if (response) {
        const botMessage: Message = {
          id: Date.now() + 1,
          text: response.text || '',
          isUser: false,
          actionCard: response.actionCard
        };
        setMessages(prev => [...prev, botMessage]);
      }

      setIsTyping(false);
    }, 1500);
  }, []);

  const dismissAlert = useCallback((id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  return {
    messages,
    alerts,
    isTyping,
    sendMessage,
    dismissAlert,
    setAlerts
  };
};
