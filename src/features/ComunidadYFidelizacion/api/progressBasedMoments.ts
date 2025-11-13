import {
  ProgressBasedMoment,
  ClientProgressData,
  IdealMomentType,
} from '../types';

// Simular latencia de red
const simulateLatency = <T>(data: T): Promise<T> => {
  return new Promise((resolve) => setTimeout(() => resolve(data), 300));
};

// Obtener datos de progreso de un cliente
export async function getClientProgressData(clientId: string): Promise<ClientProgressData | null> {
  // En producción, esto se conectaría con el módulo de gestión de clientes
  // Por ahora, usamos datos mock
  
  const mockProgressData: ClientProgressData = {
    clientId,
    clientName: 'Cliente Ejemplo',
    objectives: [
      {
        id: 'obj_001',
        title: 'Perder 5 kg',
        progress: 80,
        status: 'in_progress',
        category: 'weight',
      },
      {
        id: 'obj_002',
        title: 'Correr 10 km sin parar',
        progress: 100,
        status: 'achieved',
        achievedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        category: 'endurance',
      },
    ],
    sessions: {
      total: 25,
      completed: 23,
      lastSessionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      milestoneSessions: [5, 10, 20],
    },
    metrics: {
      weightChange: -4.2,
      bodyFatChange: -3.5,
      strengthGains: 15,
      enduranceGains: 25,
    },
    recentAchievements: [
      {
        id: 'ach_001',
        title: 'Objetivo de resistencia alcanzado',
        achievedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        category: 'endurance',
      },
    ],
    daysSinceLastTestimonial: 45,
  };

  return simulateLatency(mockProgressData);
}

// Calcular momentum score basado en progreso
function calculateMomentumScore(progressData: ClientProgressData): number {
  let score = 0;

  // Objetivos recientemente alcanzados (40 puntos)
  const recentAchievements = progressData.recentAchievements.filter((ach) => {
    const daysSince = (Date.now() - new Date(ach.achievedAt).getTime()) / (24 * 60 * 60 * 1000);
    return daysSince <= 7;
  });
  score += Math.min(40, recentAchievements.length * 20);

  // Objetivos en progreso avanzado (30 puntos)
  const advancedObjectives = progressData.objectives.filter(
    (obj) => obj.status === 'in_progress' && obj.progress >= 70,
  );
  score += Math.min(30, advancedObjectives.length * 15);

  // Sesiones recientes y hitos (20 puntos)
  if (progressData.sessions.lastSessionDate) {
    const daysSinceLastSession =
      (Date.now() - new Date(progressData.sessions.lastSessionDate).getTime()) / (24 * 60 * 60 * 1000);
    if (daysSinceLastSession <= 3) score += 10;
    if (progressData.sessions.milestoneSessions.length > 0) score += 10;
  }

  // Métricas de progreso positivo (10 puntos)
  if (progressData.metrics) {
    if (progressData.metrics.weightChange && progressData.metrics.weightChange < 0) score += 3;
    if (progressData.metrics.bodyFatChange && progressData.metrics.bodyFatChange < 0) score += 3;
    if (progressData.metrics.strengthGains && progressData.metrics.strengthGains > 0) score += 2;
    if (progressData.metrics.enduranceGains && progressData.metrics.enduranceGains > 0) score += 2;
  }

  // Penalización si ya se pidió testimonio recientemente
  if (progressData.daysSinceLastTestimonial && progressData.daysSinceLastTestimonial < 30) {
    score -= 20;
  }

  return Math.max(0, Math.min(100, score));
}

// Determinar tipo de momento basado en progreso
function determineMomentType(progressData: ClientProgressData): IdealMomentType {
  // Si hay objetivos recientemente alcanzados
  const recentAchievements = progressData.recentAchievements.filter((ach) => {
    const daysSince = (Date.now() - new Date(ach.achievedAt).getTime()) / (24 * 60 * 60 * 1000);
    return daysSince <= 7;
  });
  if (recentAchievements.length > 0) return 'objetivo-alcanzado';

  // Si hay programas completados
  const completedObjectives = progressData.objectives.filter((obj) => obj.status === 'achieved');
  if (completedObjectives.length > 0) {
    const recentlyCompleted = completedObjectives.filter((obj) => {
      if (!obj.achievedAt) return false;
      const daysSince = (Date.now() - new Date(obj.achievedAt).getTime()) / (24 * 60 * 60 * 1000);
      return daysSince <= 14;
    });
    if (recentlyCompleted.length > 0) return 'programa-completado';
  }

  // Si hay hitos de sesiones
  if (progressData.sessions.milestoneSessions.length > 0) {
    return 'sesiones-completadas';
  }

  return 'feedback-positivo';
}

// Generar mensaje sugerido basado en progreso
function generateSuggestedMessage(progressData: ClientProgressData, momentType: IdealMomentType): string {
  const clientName = progressData.clientName.split(' ')[0];

  switch (momentType) {
    case 'objetivo-alcanzado':
      const latestAchievement = progressData.recentAchievements[0];
      return `¡Hola ${clientName}! Vi que acabas de alcanzar "${latestAchievement.title}". ¡Felicitaciones! 🎉 ¿Te gustaría compartir tu experiencia con otros que están en el mismo camino?`;

    case 'programa-completado':
      return `¡Hola ${clientName}! Has completado un objetivo importante. Tu dedicación es inspiradora. ¿Podrías contarnos qué significó para ti este logro?`;

    case 'sesiones-completadas':
      const sessionCount = progressData.sessions.completed;
      return `¡Hola ${clientName}! Has completado ${sessionCount} sesiones. Eso es consistencia real. ¿Qué te ha motivado a mantenerte constante? Nos encantaría conocer tu historia.`;

    default:
      return `¡Hola ${clientName}! Hemos notado tu excelente progreso. ¿Te gustaría compartir tu experiencia con nuestra comunidad?`;
  }
}

// Detectar momentos ideales basados en progreso real
export async function detectProgressBasedMoments(
  clientIds: string[],
): Promise<ProgressBasedMoment[]> {
  const moments: ProgressBasedMoment[] = [];

  for (const clientId of clientIds) {
    const progressData = await getClientProgressData(clientId);
    if (!progressData) continue;

    const momentumScore = calculateMomentumScore(progressData);
    
    // Solo crear momento si el momentum score es suficiente (>= 50)
    if (momentumScore < 50) continue;

    const momentType = determineMomentType(progressData);
    const recommendedAction: 'request-now' | 'wait-optimal' | 'schedule-follow-up' =
      momentumScore >= 80 ? 'request-now' : momentumScore >= 60 ? 'wait-optimal' : 'schedule-follow-up';

    const suggestedMessage = generateSuggestedMessage(progressData, momentType);

    // Determinar timing óptimo
    let optimalTiming: string | undefined;
    if (recommendedAction === 'wait-optimal') {
      // Sugerir solicitar en 1-2 días si hay un logro muy reciente
      const latestAchievement = progressData.recentAchievements[0];
      if (latestAchievement) {
        const optimalDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // Mañana
        optimalTiming = optimalDate.toISOString();
      }
    }

    const moment: ProgressBasedMoment = {
      id: `progress-moment-${clientId}-${Date.now()}`,
      clientId: progressData.clientId,
      clientName: progressData.clientName,
      momentType,
      description: generateMomentDescription(progressData, momentType),
      detectedAt: new Date().toISOString(),
      status: 'pending',
      progressData,
      momentumScore,
      recommendedAction,
      optimalTiming,
      suggestedMessage,
    };

    moments.push(moment);
  }

  return simulateLatency(moments);
}

// Generar descripción del momento
function generateMomentDescription(progressData: ClientProgressData, momentType: IdealMomentType): string {
  switch (momentType) {
    case 'objetivo-alcanzado':
      const achievement = progressData.recentAchievements[0];
      return `Alcanzó el objetivo: "${achievement.title}" hace ${Math.floor(
        (Date.now() - new Date(achievement.achievedAt).getTime()) / (24 * 60 * 60 * 1000),
      )} días. Momentum alto para solicitar testimonio.`;

    case 'programa-completado':
      const completed = progressData.objectives.filter((obj) => obj.status === 'achieved');
      return `Completó ${completed.length} objetivo(s). Progreso significativo en ${progressData.sessions.completed} sesiones.`;

    case 'sesiones-completadas':
      return `Completó ${progressData.sessions.completed} sesiones. Hitos alcanzados: ${progressData.sessions.milestoneSessions.join(', ')}.`;

    default:
      return `Progreso positivo detectado. Momentum score: ${calculateMomentumScore(progressData)}/100.`;
  }
}

// Obtener momentos basados en progreso para múltiples clientes
export async function getProgressBasedMoments(): Promise<ProgressBasedMoment[]> {
  // En producción, esto obtendría la lista de clientes activos
  const mockClientIds = ['cliente_001', 'cliente_002', 'cliente_003'];
  return detectProgressBasedMoments(mockClientIds);
}

