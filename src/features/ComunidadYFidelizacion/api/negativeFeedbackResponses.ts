import { NegativeFeedbackAlert, PersonalizedResponse } from '../types';

// Simulación de delay
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Clonar datos para evitar mutaciones
function cloneData<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

export const NegativeFeedbackResponsesAPI = {
  /**
   * Genera una respuesta personalizada para un feedback negativo
   */
  async generatePersonalizedResponse(
    alert: NegativeFeedbackAlert,
  ): Promise<PersonalizedResponse> {
    await delay(600); // Simular generación IA

    const { clientName, comment, rating, clientHistory, recentSessions } = alert;

    // Determinar el tono basado en la severidad y el historial
    let tone: PersonalizedResponse['tone'] = 'empatico';
    let channel: PersonalizedResponse['channel'] = 'whatsapp';

    if (rating && rating <= 2) {
      tone = 'empatico';
      channel = 'phone'; // Para feedback muy negativo, llamar
    } else if (rating === 3) {
      tone = 'profesional';
      channel = 'whatsapp';
    } else {
      tone = 'cercano';
      channel = 'whatsapp';
    }

    // Generar mensaje personalizado basado en el feedback
    const suggestedMessage = generatePersonalizedMessage(
      clientName,
      comment,
      rating,
      clientHistory,
      tone,
    );

    // Generar puntos clave
    const keyPoints = generateKeyPoints(comment, clientHistory, recentSessions);

    // Generar razonamiento
    const reasoning = generateReasoning(alert, tone, channel);

    // Sugerir seguimiento
    const suggestedFollowUp = generateFollowUpSuggestion(alert);

    const response: PersonalizedResponse = {
      id: `response_${Date.now()}`,
      suggestedMessage,
      tone,
      channel,
      reasoning,
      keyPoints,
      suggestedFollowUp,
      generatedAt: new Date().toISOString(),
      confidenceScore: 85, // Simular confianza de IA
    };

    return cloneData(response);
  },

  /**
   * Regenera una respuesta personalizada con un tono diferente
   */
  async regenerateWithTone(
    alert: NegativeFeedbackAlert,
    tone: PersonalizedResponse['tone'],
  ): Promise<PersonalizedResponse> {
    await delay(500);
    const response = await this.generatePersonalizedResponse(alert);
    response.tone = tone;
    response.suggestedMessage = generatePersonalizedMessage(
      alert.clientName,
      alert.comment,
      alert.rating,
      alert.clientHistory,
      tone,
    );
    return response;
  },
};

// Funciones auxiliares para generar contenido

function generatePersonalizedMessage(
  clientName: string,
  comment: string | undefined,
  rating: number | undefined,
  clientHistory: NegativeFeedbackAlert['clientHistory'],
  tone: PersonalizedResponse['tone'],
): string {
  const name = clientName.split(' ')[0]; // Primer nombre
  const isLongTermClient = clientHistory && clientHistory.daysAsClient > 60;
  const hasGoodHistory = clientHistory && (clientHistory.averageSatisfaction || 0) >= 4;

  let message = '';

  switch (tone) {
    case 'empatico':
      message = `Hola ${name}, `;
      if (isLongTermClient) {
        message += `llevamos tiempo trabajando juntos y valoro mucho tu confianza. `;
      }
      message += `He recibido tu feedback sobre la última sesión y me preocupa que no haya cumplido con tus expectativas. `;
      if (comment) {
        const mainIssue = extractMainIssue(comment);
        message += `Entiendo que ${mainIssue}. `;
      }
      message += `Me gustaría hablar contigo para entender mejor cómo puedo ayudarte y ajustar el entrenamiento a tus necesidades. `;
      if (hasGoodHistory) {
        message += `Sé que normalmente disfrutas de nuestras sesiones, así que quiero asegurarme de que volvamos a ese punto. `;
      }
      message += `¿Podríamos agendar una llamada esta semana para revisar tu plan?`;
      break;

    case 'profesional':
      message = `Hola ${name}, `;
      message += `Gracias por compartir tu feedback sobre la sesión. `;
      if (comment) {
        const mainIssue = extractMainIssue(comment);
        message += `He tomado nota de que ${mainIssue}. `;
      }
      message += `Me gustaría revisar contigo el plan de entrenamiento para asegurarme de que está alineado con tus objetivos y preferencias. `;
      if (isLongTermClient) {
        message += `Como cliente de largo plazo, tu satisfacción es muy importante para mí. `;
      }
      message += `¿Te parece bien si coordinamos una conversación para ajustar el programa?`;
      break;

    case 'cercano':
      message = `¡Hola ${name}! 👋 `;
      message += `Vi tu comentario sobre la sesión y quiero asegurarme de que estés contento con todo. `;
      if (comment) {
        const mainIssue = extractMainIssue(comment);
        message += `Veo que ${mainIssue}. `;
      }
      message += `¿Qué te parece si hablamos y ajustamos las cosas para que vuelvas a disfrutar al 100%? `;
      if (hasGoodHistory) {
        message += `Sé que normalmente te encantan las sesiones, así que seguro que encontramos la solución. `;
      }
      message += `¡Avísame cuándo te viene bien! 💪`;
      break;

    case 'motivacional':
      message = `¡Hola ${name}! 💪 `;
      message += `Gracias por ser honesto con tu feedback. `;
      if (comment) {
        const mainIssue = extractMainIssue(comment);
        message += `Veo que ${mainIssue}. `;
      }
      message += `Esto es parte del proceso de encontrar el equilibrio perfecto en tu entrenamiento. `;
      message += `Juntos vamos a ajustar el plan para que vuelvas a sentir esa motivación y progreso. `;
      if (isLongTermClient) {
        message += `Llevamos tiempo trabajando juntos y sé que podemos superar esto. `;
      }
      message += `¿Hablamos esta semana para revisar y mejorar? ¡Vamos a por ello! 🔥`;
      break;
  }

  return message;
}

function extractMainIssue(comment: string): string {
  const lowerComment = comment.toLowerCase();
  
  if (lowerComment.includes('intens') || lowerComment.includes('duro') || lowerComment.includes('difícil')) {
    return 'la intensidad fue demasiado alta';
  }
  if (lowerComment.includes('fácil') || lowerComment.includes('poco') || lowerComment.includes('no avanz')) {
    return 'no sentiste suficiente progreso o desafío';
  }
  if (lowerComment.includes('aburr') || lowerComment.includes('monótono') || lowerComment.includes('repetitivo')) {
    return 'la rutina no fue lo suficientemente variada';
  }
  if (lowerComment.includes('tiempo') || lowerComment.includes('duración')) {
    return 'hubo un problema con la duración o el tiempo';
  }
  if (lowerComment.includes('dolor') || lowerComment.includes('molestia')) {
    return 'experimentaste alguna molestia o dolor';
  }
  
  return 'hubo algo que no funcionó como esperabas';
}

function generateKeyPoints(
  comment: string | undefined,
  clientHistory: NegativeFeedbackAlert['clientHistory'],
  recentSessions: NegativeFeedbackAlert['recentSessions'],
): string[] {
  const points: string[] = [];

  if (comment) {
    const mainIssue = extractMainIssue(comment);
    points.push(`Reconocer: ${mainIssue}`);
  }

  if (clientHistory) {
    if (clientHistory.averageSatisfaction && clientHistory.averageSatisfaction >= 4) {
      points.push(`Mencionar historial positivo: ${clientHistory.totalSessions} sesiones con satisfacción promedio de ${clientHistory.averageSatisfaction.toFixed(1)}`);
    }
    if (clientHistory.daysAsClient > 60) {
      points.push('Valorar la relación de largo plazo');
    }
  }

  if (recentSessions && recentSessions.length > 1) {
    const previousSessions = recentSessions.slice(1);
    const goodSessions = previousSessions.filter(s => (s.satisfactionScore || 0) >= 4);
    if (goodSessions.length > 0) {
      points.push('Referenciar sesiones anteriores exitosas');
    }
  }

  points.push('Ofrecer ajuste personalizado del plan');
  points.push('Proponer seguimiento cercano');

  return points;
}

function generateReasoning(
  alert: NegativeFeedbackAlert,
  tone: PersonalizedResponse['tone'],
  channel: PersonalizedResponse['channel'],
): string {
  const reasons: string[] = [];

  if (alert.rating && alert.rating <= 2) {
    reasons.push('Feedback muy negativo (≤2 estrellas) requiere respuesta empática inmediata');
  }

  if (tone === 'empatico') {
    reasons.push('Tono empático para mostrar comprensión y preocupación genuina');
  } else if (tone === 'profesional') {
    reasons.push('Tono profesional para mantener credibilidad y confianza');
  }

  if (channel === 'phone') {
    reasons.push('Canal telefónico recomendado para feedback crítico para comunicación más personal');
  } else if (channel === 'whatsapp') {
    reasons.push('WhatsApp permite respuesta rápida y conversación fluida');
  }

  if (alert.clientHistory && alert.clientHistory.daysAsClient > 60) {
    reasons.push('Cliente de largo plazo: importante preservar la relación');
  }

  return reasons.join('. ') + '.';
}

function generateFollowUpSuggestion(alert: NegativeFeedbackAlert): string {
  if (alert.rating && alert.rating <= 2) {
    return 'Agendar llamada dentro de 24 horas para revisar el plan de entrenamiento y ajustar intensidad/rutina';
  }
  if (alert.priority === 'urgent') {
    return 'Contactar dentro de 48 horas y ofrecer sesión de ajuste gratuita';
  }
  return 'Seguimiento en 3-5 días para verificar que los ajustes funcionaron';
}

