/**
 * API para el sistema de aprendizaje de recomendaciones
 * Permite al asistente aprender de las decisiones del coach (aceptar/descartar)
 */

export type RecommendationDecision = 'accepted' | 'discarded';

export interface RecommendationFeedback {
  id: string;
  suggestionId: string;
  suggestionType: 'template' | 'exercise' | 'session' | 'block' | 'formula';
  decision: RecommendationDecision;
  coachId: string;
  context: {
    day?: string;
    focus?: string;
    intensity?: string;
    modality?: string;
    tags?: string[];
    activeView?: 'weekly' | 'daily' | 'excel';
  };
  suggestionData: {
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    reason: string;
    metadata?: Record<string, any>;
  };
  timestamp: string;
}

export interface CoachLearningProfile {
  coachId: string;
  preferences: {
    // Preferencias por tipo de sugerencia
    preferredTypes: Record<string, number>; // type -> score (higher = more preferred)
    // Preferencias por contexto
    contextPreferences: Record<string, Record<string, number>>; // contextKey -> value -> score
    // Preferencias por prioridad
    priorityWeights: {
      high: number;
      medium: number;
      low: number;
    };
    // Patrones aprendidos
    patterns: {
      acceptedPatterns: string[]; // Patrones de sugerencias aceptadas
      discardedPatterns: string[]; // Patrones de sugerencias descartadas
    };
  };
  feedbackHistory: RecommendationFeedback[];
  lastUpdated: string;
}

const STORAGE_KEY_PREFIX = 'coach_recommendation_learning_';

/**
 * Guarda el feedback del coach sobre una recomendación
 */
export async function saveRecommendationFeedback(
  coachId: string,
  suggestionId: string,
  suggestion: {
    type: RecommendationFeedback['suggestionType'];
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    reason: string;
    metadata?: Record<string, any>;
  },
  decision: RecommendationDecision,
  context: RecommendationFeedback['context']
): Promise<RecommendationFeedback> {
  const feedback: RecommendationFeedback = {
    id: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    suggestionId,
    suggestionType: suggestion.type,
    decision,
    coachId,
    context,
    suggestionData: {
      title: suggestion.title,
      description: suggestion.description,
      priority: suggestion.priority,
      reason: suggestion.reason,
      metadata: suggestion.metadata,
    },
    timestamp: new Date().toISOString(),
  };

  // Guardar feedback en localStorage
  try {
    const key = `${STORAGE_KEY_PREFIX}feedback_${coachId}`;
    const existing = localStorage.getItem(key);
    const feedbackList: RecommendationFeedback[] = existing ? JSON.parse(existing) : [];
    feedbackList.push(feedback);
    
    // Mantener solo los últimos 1000 feedbacks
    const trimmed = feedbackList.slice(-1000);
    localStorage.setItem(key, JSON.stringify(trimmed));
  } catch (error) {
    console.error('Error saving recommendation feedback:', error);
  }

  // Actualizar perfil de aprendizaje
  await updateCoachLearningProfile(coachId, feedback);

  return feedback;
}

/**
 * Obtiene el perfil de aprendizaje del coach
 */
export async function getCoachLearningProfile(coachId: string): Promise<CoachLearningProfile | null> {
  try {
    const key = `${STORAGE_KEY_PREFIX}profile_${coachId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading coach learning profile:', error);
  }
  return null;
}

/**
 * Actualiza el perfil de aprendizaje del coach basado en nuevo feedback
 */
async function updateCoachLearningProfile(
  coachId: string,
  feedback: RecommendationFeedback
): Promise<CoachLearningProfile> {
  let profile = await getCoachLearningProfile(coachId);

  if (!profile) {
    // Crear perfil inicial
    profile = {
      coachId,
      preferences: {
        preferredTypes: {},
        contextPreferences: {},
        priorityWeights: {
          high: 1.0,
          medium: 1.0,
          low: 1.0,
        },
        patterns: {
          acceptedPatterns: [],
          discardedPatterns: [],
        },
      },
      feedbackHistory: [],
      lastUpdated: new Date().toISOString(),
    };
  }

  // Actualizar preferencias por tipo
  const typeKey = feedback.suggestionType;
  const currentTypeScore = profile.preferences.preferredTypes[typeKey] || 0;
  const adjustment = feedback.decision === 'accepted' ? 1 : -0.5;
  profile.preferences.preferredTypes[typeKey] = Math.max(0, currentTypeScore + adjustment);

  // Actualizar preferencias por contexto
  Object.entries(feedback.context).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    
    if (!profile.preferences.contextPreferences[key]) {
      profile.preferences.contextPreferences[key] = {};
    }
    
    const valueStr = String(value);
    const currentScore = profile.preferences.contextPreferences[key][valueStr] || 0;
    const contextAdjustment = feedback.decision === 'accepted' ? 0.5 : -0.3;
    profile.preferences.contextPreferences[key][valueStr] = Math.max(0, currentScore + contextAdjustment);
  });

  // Actualizar pesos de prioridad
  const priorityKey = feedback.suggestionData.priority;
  const currentWeight = profile.preferences.priorityWeights[priorityKey];
  const weightAdjustment = feedback.decision === 'accepted' ? 0.1 : -0.05;
  profile.preferences.priorityWeights[priorityKey] = Math.max(0.1, Math.min(2.0, currentWeight + weightAdjustment));

  // Actualizar patrones
  const pattern = `${feedback.suggestionType}_${feedback.context.focus || 'any'}_${feedback.context.intensity || 'any'}`;
  if (feedback.decision === 'accepted') {
    if (!profile.preferences.patterns.acceptedPatterns.includes(pattern)) {
      profile.preferences.patterns.acceptedPatterns.push(pattern);
    }
    // Remover de descartados si estaba ahí
    profile.preferences.patterns.discardedPatterns = profile.preferences.patterns.discardedPatterns.filter(
      p => p !== pattern
    );
  } else {
    if (!profile.preferences.patterns.discardedPatterns.includes(pattern)) {
      profile.preferences.patterns.discardedPatterns.push(pattern);
    }
    // Remover de aceptados si estaba ahí
    profile.preferences.patterns.acceptedPatterns = profile.preferences.patterns.acceptedPatterns.filter(
      p => p !== pattern
    );
  }

  // Agregar feedback al historial
  profile.feedbackHistory.push(feedback);
  profile.feedbackHistory = profile.feedbackHistory.slice(-500); // Mantener últimos 500

  profile.lastUpdated = new Date().toISOString();

  // Guardar perfil actualizado
  try {
    const key = `${STORAGE_KEY_PREFIX}profile_${coachId}`;
    localStorage.setItem(key, JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving coach learning profile:', error);
  }

  return profile;
}

/**
 * Obtiene el historial de feedback del coach
 */
export async function getCoachFeedbackHistory(
  coachId: string,
  limit: number = 50
): Promise<RecommendationFeedback[]> {
  try {
    const key = `${STORAGE_KEY_PREFIX}feedback_${coachId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      const feedbackList: RecommendationFeedback[] = JSON.parse(saved);
      return feedbackList.slice(-limit).reverse(); // Más recientes primero
    }
  } catch (error) {
    console.error('Error loading feedback history:', error);
  }
  return [];
}

/**
 * Calcula un score de relevancia para una sugerencia basado en el perfil de aprendizaje
 */
export async function calculateSuggestionRelevance(
  coachId: string,
  suggestion: {
    type: RecommendationFeedback['suggestionType'];
    priority: 'high' | 'medium' | 'low';
    reason: string;
  },
  context: RecommendationFeedback['context']
): Promise<number> {
  const profile = await getCoachLearningProfile(coachId);
  
  if (!profile) {
    // Sin perfil, usar score base según prioridad
    const baseScores = { high: 1.0, medium: 0.7, low: 0.4 };
    return baseScores[suggestion.priority];
  }

  let score = 0.5; // Score base

  // Ajustar por tipo de sugerencia
  const typeScore = profile.preferences.preferredTypes[suggestion.type] || 0;
  score += typeScore * 0.2;

  // Ajustar por contexto
  Object.entries(context).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    const contextScore = profile.preferences.contextPreferences[key]?.[String(value)] || 0;
    score += contextScore * 0.1;
  });

  // Ajustar por prioridad (usar pesos aprendidos)
  const priorityWeight = profile.preferences.priorityWeights[suggestion.priority];
  score *= priorityWeight;

  // Verificar patrones
  const pattern = `${suggestion.type}_${context.focus || 'any'}_${context.intensity || 'any'}`;
  if (profile.preferences.patterns.acceptedPatterns.includes(pattern)) {
    score *= 1.3; // Boost si coincide con patrón aceptado
  }
  if (profile.preferences.patterns.discardedPatterns.includes(pattern)) {
    score *= 0.5; // Reducir si coincide con patrón descartado
  }

  // Normalizar entre 0 y 1
  return Math.max(0, Math.min(1, score));
}

/**
 * Filtra y ordena sugerencias basado en el perfil de aprendizaje
 */
export async function rankSuggestionsByRelevance<T extends {
  type: RecommendationFeedback['suggestionType'];
  priority: 'high' | 'medium' | 'low';
  reason: string;
}>(
  coachId: string,
  suggestions: T[],
  context: RecommendationFeedback['context']
): Promise<T[]> {
  const scored = await Promise.all(
    suggestions.map(async (suggestion) => {
      const relevance = await calculateSuggestionRelevance(coachId, suggestion, context);
      return { suggestion, relevance };
    })
  );

  // Ordenar por relevancia (mayor primero)
  scored.sort((a, b) => b.relevance - a.relevance);

  return scored.map(({ suggestion }) => suggestion);
}

