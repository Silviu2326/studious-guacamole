import { Client, RetentionSuggestion, RetentionSuggestionContext, ClientInteraction, ClientHistoryItem } from '../types';

/**
 * Genera sugerencias personalizadas de retención para un cliente en riesgo
 */
export const generateRetentionSuggestions = async (
  client: Client,
  context?: RetentionSuggestionContext
): Promise<RetentionSuggestion[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const suggestions: RetentionSuggestion[] = [];
  const riskScore = client.riskScore || 0;
  const daysSinceLastVisit = client.daysSinceLastVisit || 0;
  const adherenceRate = client.adherenceRate || 0;

  // Analizar factores de riesgo y generar sugerencias

  // 1. Si han pasado muchos días sin visita
  if (daysSinceLastVisit > 14) {
    suggestions.push({
      id: `suggestion-${client.id}-1`,
      clientId: client.id,
      priority: 'high',
      actionType: 'call',
      title: 'Llamada de seguimiento urgente',
      description: `Han pasado ${daysSinceLastVisit} días desde la última visita. Se recomienda una llamada personal para entender la situación.`,
      suggestedMessage: `Hola ${client.name}, noté que hace ${daysSinceLastVisit} días que no te vemos. ¿Todo bien? Me gustaría saber cómo va tu progreso y si hay algo en lo que pueda ayudarte.`,
      suggestedTiming: 'Mañana por la mañana (9:00-12:00)',
      reasoning: 'Los clientes que no visitan en más de 14 días tienen un alto riesgo de abandono. Una llamada personal demuestra preocupación genuina.',
      expectedImpact: 'high',
      confidence: 85,
      relatedFactors: ['días sin visita', 'riesgo de abandono'],
      createdAt: new Date().toISOString(),
    });
  }

  // 2. Si la adherencia es baja
  if (adherenceRate < 50) {
    suggestions.push({
      id: `suggestion-${client.id}-2`,
      clientId: client.id,
      priority: 'high',
      actionType: 'personalized-message',
      title: 'Mensaje de motivación personalizado',
      description: `La adherencia actual es del ${adherenceRate}%. Un mensaje de motivación puede ayudar a reactivar el compromiso.`,
      suggestedMessage: `Hola ${client.name}, he visto que últimamente has estado menos activo. Sé que mantener la constancia puede ser difícil, pero recuerda tus objetivos. ¿Qué tal si reprogramamos tus sesiones para que se ajusten mejor a tu horario?`,
      suggestedTiming: 'Hoy por la tarde',
      reasoning: 'La baja adherencia indica falta de compromiso. Un mensaje personalizado puede reactivar la motivación.',
      expectedImpact: 'medium',
      confidence: 70,
      relatedFactors: ['baja adherencia', 'falta de compromiso'],
      createdAt: new Date().toISOString(),
    });
  }

  // 3. Si el riesgo es muy alto
  if (riskScore > 80) {
    suggestions.push({
      id: `suggestion-${client.id}-3`,
      clientId: client.id,
      priority: 'high',
      actionType: 'offer',
      title: 'Oferta de reactivación',
      description: `El cliente tiene un riesgo muy alto (${riskScore}%). Una oferta especial puede ayudar a retenerlo.`,
      suggestedMessage: `Hola ${client.name}, noté que hace tiempo que no entrenamos juntos. Para ayudarte a retomar tu rutina, tengo una oferta especial: 2 sesiones extra este mes sin costo adicional. ¿Te parece bien?`,
      suggestedTiming: 'Esta semana',
      reasoning: 'Los clientes con riesgo muy alto requieren acciones inmediatas. Una oferta de valor puede cambiar la decisión.',
      expectedImpact: 'high',
      confidence: 75,
      relatedFactors: ['alto riesgo', 'necesita incentivo'],
      createdAt: new Date().toISOString(),
    });
  }

  // 4. Si hay problemas de pago
  if (client.paymentStatus === 'atrasado' || client.paymentStatus === 'moroso') {
    suggestions.push({
      id: `suggestion-${client.id}-4`,
      clientId: client.id,
      priority: 'medium',
      actionType: 'email',
      title: 'Email sobre situación de pago',
      description: 'El cliente tiene pagos pendientes. Un email profesional puede resolver la situación.',
      suggestedMessage: `Hola ${client.name}, espero que estés bien. He notado que hay un pago pendiente en tu cuenta. Si hay algún problema o necesitas flexibilidad, por favor hablemos. Mi objetivo es ayudarte a mantener tu rutina de entrenamiento.`,
      suggestedTiming: 'Esta semana',
      reasoning: 'Los problemas de pago pueden ser una barrera. Abordar el tema de forma profesional y empática es clave.',
      expectedImpact: 'medium',
      confidence: 65,
      relatedFactors: ['pago atrasado', 'barrera financiera'],
      createdAt: new Date().toISOString(),
    });
  }

  // 5. Si han pasado entre 7-14 días sin visita
  if (daysSinceLastVisit >= 7 && daysSinceLastVisit <= 14) {
    suggestions.push({
      id: `suggestion-${client.id}-5`,
      clientId: client.id,
      priority: 'medium',
      actionType: 'whatsapp',
      title: 'WhatsApp de recordatorio amigable',
      description: `Han pasado ${daysSinceLastVisit} días. Un mensaje amigable puede recordarle al cliente su compromiso.`,
      suggestedMessage: `¡Hola ${client.name}! 👋 Hace ${daysSinceLastVisit} días que no te veo. ¿Cómo va todo? ¿Te gustaría agendar una sesión esta semana?`,
      suggestedTiming: 'Hoy',
      reasoning: 'Un recordatorio amigable antes de que el problema se agrave puede prevenir el abandono.',
      expectedImpact: 'medium',
      confidence: 60,
      relatedFactors: ['días sin visita moderados', 'prevención'],
      createdAt: new Date().toISOString(),
    });
  }

  // 6. Si la adherencia está entre 50-70%
  if (adherenceRate >= 50 && adherenceRate < 70) {
    suggestions.push({
      id: `suggestion-${client.id}-6`,
      clientId: client.id,
      priority: 'low',
      actionType: 'email',
      title: 'Email de seguimiento y planificación',
      description: `La adherencia es del ${adherenceRate}%. Un email de planificación puede ayudar a mejorar la consistencia.`,
      suggestedMessage: `Hola ${client.name}, he revisado tu progreso y veo que tu adherencia es del ${adherenceRate}%. Para ayudarte a alcanzar tus objetivos, propongo revisar tu plan de entrenamiento y ajustarlo si es necesario. ¿Cuándo te viene bien hablar?`,
      suggestedTiming: 'Esta semana',
      reasoning: 'Una adherencia moderada puede mejorarse con planificación y ajustes.',
      expectedImpact: 'medium',
      confidence: 55,
      relatedFactors: ['adherencia moderada', 'oportunidad de mejora'],
      createdAt: new Date().toISOString(),
    });
  }

  // Ordenar por prioridad y confianza
  return suggestions.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return b.confidence - a.confidence;
  });
};

/**
 * Genera sugerencias para múltiples clientes
 */
export const generateBulkRetentionSuggestions = async (
  clients: Client[]
): Promise<RetentionSuggestion[]> => {
  const allSuggestions: RetentionSuggestion[] = [];
  
  for (const client of clients) {
    if (client.status === 'en-riesgo') {
      const suggestions = await generateRetentionSuggestions(client);
      allSuggestions.push(...suggestions);
    }
  }
  
  return allSuggestions;
};

/**
 * Aplica una sugerencia creando una acción de retención
 */
export const applyRetentionSuggestion = async (
  suggestion: RetentionSuggestion
): Promise<{ success: boolean; actionId?: string }> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // En producción, esto crearía una RetentionAction
  // Por ahora, retornamos éxito
  return {
    success: true,
    actionId: `action-${Date.now()}`,
  };
};

