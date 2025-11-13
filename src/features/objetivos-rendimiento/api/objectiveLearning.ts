import {
  Objective,
  ObjectiveLearningData,
  ObjectiveLearningPattern,
  AIObjectiveAdjustmentSuggestion,
  ObjectiveLearningProfile,
} from '../types';
import { getObjectives } from './objectives';

const STORAGE_KEY_LEARNING_DATA = 'objective-learning-data';
const STORAGE_KEY_LEARNING_PATTERNS = 'objective-learning-patterns';
const STORAGE_KEY_LEARNING_PROFILE = 'objective-learning-profile';
const STORAGE_KEY_ADJUSTMENT_SUGGESTIONS = 'objective-adjustment-suggestions';

/**
 * User Story 1: Registra datos de aprendizaje de un objetivo completado
 */
export const recordObjectiveLearning = async (
  objective: Objective,
  factors?: {
    targetRealistic?: boolean;
    deadlineAdequate?: boolean;
    resourcesSufficient?: boolean;
    strategyEffective?: boolean;
    externalFactors?: string[];
  },
  lessonsLearned?: string[]
): Promise<ObjectiveLearningData> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const learningData: ObjectiveLearningData = {
    objectiveId: objective.id,
    objectiveTitle: objective.title,
    metric: objective.metric,
    category: objective.category,
    finalStatus: objective.status === 'achieved' ? 'achieved' : 
                 objective.status === 'failed' ? 'failed' : 
                 objective.status === 'at_risk' ? 'at_risk' : 'cancelled',
    finalProgress: objective.progress,
    targetValue: objective.targetValue,
    finalValue: objective.currentValue,
    deadline: objective.deadline,
    completedAt: objective.status === 'achieved' || objective.status === 'failed' 
      ? new Date().toISOString() 
      : undefined,
    factors: factors || {},
    lessonsLearned: lessonsLearned || [],
    actionPlanId: objective.links?.actionPlans?.[0]?.id,
    actionPlanEffective: objective.links?.actionPlans?.[0]?.status === 'completed',
    createdAt: objective.createdAt,
    updatedAt: new Date().toISOString(),
  };

  // Guardar en localStorage
  const saved = localStorage.getItem(STORAGE_KEY_LEARNING_DATA);
  const allLearningData: ObjectiveLearningData[] = saved ? JSON.parse(saved) : [];
  allLearningData.push(learningData);
  localStorage.setItem(STORAGE_KEY_LEARNING_DATA, JSON.stringify(allLearningData));

  // Actualizar perfil de aprendizaje
  await updateLearningProfile(learningData);

  return learningData;
};

/**
 * User Story 1: Analiza patrones de éxito y fallo
 */
export const analyzeLearningPatterns = async (): Promise<ObjectiveLearningPattern[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));

  const saved = localStorage.getItem(STORAGE_KEY_LEARNING_DATA);
  const allLearningData: ObjectiveLearningData[] = saved ? JSON.parse(saved) : [];

  if (allLearningData.length === 0) {
    return [];
  }

  const patterns: ObjectiveLearningPattern[] = [];

  // Agrupar por categoría y métrica
  const byCategory: Record<string, ObjectiveLearningData[]> = {};
  const byMetric: Record<string, ObjectiveLearningData[]> = {};

  allLearningData.forEach(data => {
    if (!byCategory[data.category]) {
      byCategory[data.category] = [];
    }
    byCategory[data.category].push(data);

    if (!byMetric[data.metric]) {
      byMetric[data.metric] = [];
    }
    byMetric[data.metric].push(data);
  });

  // Analizar patrones de éxito por categoría
  Object.entries(byCategory).forEach(([category, data]) => {
    const successful = data.filter(d => d.finalStatus === 'achieved');
    const failed = data.filter(d => d.finalStatus === 'failed');
    const atRisk = data.filter(d => d.finalStatus === 'at_risk');

    if (successful.length > 0) {
      const avgProgress = successful.reduce((sum, d) => sum + d.finalProgress, 0) / successful.length;
      const targetValues = successful.map(d => d.targetValue);
      const deadlines = successful.map(d => {
        const deadline = new Date(d.deadline);
        const createdAt = new Date(d.createdAt);
        return Math.ceil((deadline.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
      });

      patterns.push({
        id: `pattern-success-${category}-${Date.now()}`,
        patternType: 'success',
        category,
        characteristics: {
          targetRange: {
            min: Math.min(...targetValues),
            max: Math.max(...targetValues),
          },
          deadlineRange: {
            min: Math.min(...deadlines),
            max: Math.max(...deadlines),
          },
          averageProgress: avgProgress,
          commonFactors: extractCommonFactors(successful),
        },
        occurrenceCount: successful.length,
        successRate: (successful.length / data.length) * 100,
        recommendations: generateSuccessRecommendations(successful, category),
        exampleObjectiveIds: successful.slice(0, 3).map(d => d.objectiveId),
        lastSeen: successful[successful.length - 1].completedAt || successful[successful.length - 1].updatedAt,
        confidence: Math.min(100, successful.length * 10),
      });
    }

    if (failed.length > 0) {
      const avgProgress = failed.reduce((sum, d) => sum + d.finalProgress, 0) / failed.length;
      const targetValues = failed.map(d => d.targetValue);
      const deadlines = failed.map(d => {
        const deadline = new Date(d.deadline);
        const createdAt = new Date(d.createdAt);
        return Math.ceil((deadline.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
      });

      patterns.push({
        id: `pattern-failure-${category}-${Date.now()}`,
        patternType: 'failure',
        category,
        characteristics: {
          targetRange: {
            min: Math.min(...targetValues),
            max: Math.max(...targetValues),
          },
          deadlineRange: {
            min: Math.min(...deadlines),
            max: Math.max(...deadlines),
          },
          averageProgress: avgProgress,
          commonFactors: extractCommonFactors(failed),
        },
        occurrenceCount: failed.length,
        failureRate: (failed.length / data.length) * 100,
        recommendations: generateFailureRecommendations(failed, category),
        exampleObjectiveIds: failed.slice(0, 3).map(d => d.objectiveId),
        lastSeen: failed[failed.length - 1].completedAt || failed[failed.length - 1].updatedAt,
        confidence: Math.min(100, failed.length * 10),
      });
    }

    if (atRisk.length > 0) {
      patterns.push({
        id: `pattern-risk-${category}-${Date.now()}`,
        patternType: 'risk',
        category,
        characteristics: {
          averageProgress: atRisk.reduce((sum, d) => sum + d.finalProgress, 0) / atRisk.length,
          commonFactors: extractCommonFactors(atRisk),
        },
        occurrenceCount: atRisk.length,
        recommendations: generateRiskRecommendations(atRisk, category),
        exampleObjectiveIds: atRisk.slice(0, 3).map(d => d.objectiveId),
        lastSeen: atRisk[atRisk.length - 1].updatedAt,
        confidence: Math.min(100, atRisk.length * 10),
      });
    }
  });

  // Guardar patrones
  localStorage.setItem(STORAGE_KEY_LEARNING_PATTERNS, JSON.stringify(patterns));

  return patterns;
};

/**
 * User Story 1: Genera sugerencias de ajuste basadas en aprendizaje
 */
export const generateAdjustmentSuggestions = async (
  objective: Partial<Objective> & { metric: string; category: string; targetValue?: number; deadline?: string }
): Promise<AIObjectiveAdjustmentSuggestion[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const patterns = await analyzeLearningPatterns();
  const saved = localStorage.getItem(STORAGE_KEY_LEARNING_DATA);
  const allLearningData: ObjectiveLearningData[] = saved ? JSON.parse(saved) : [];

  const suggestions: AIObjectiveAdjustmentSuggestion[] = [];

  // Buscar patrones relevantes
  const relevantPatterns = patterns.filter(p => 
    p.category === objective.category || p.metric === objective.metric
  );

  // Sugerencia 1: Ajuste de target basado en patrones de éxito
  const successPatterns = relevantPatterns.filter(p => p.patternType === 'success');
  if (successPatterns.length > 0 && objective.targetValue) {
    const bestPattern = successPatterns.reduce((a, b) => 
      (b.successRate || 0) > (a.successRate || 0) ? b : a
    );

    if (bestPattern.characteristics.targetRange) {
      const { min, max } = bestPattern.characteristics.targetRange;
      const avgTarget = (min + max) / 2;

      if (Math.abs(objective.targetValue - avgTarget) > avgTarget * 0.2) {
        suggestions.push({
          id: `suggestion-target-${Date.now()}`,
          objectiveId: objective.id,
          type: 'target_adjustment',
          title: 'Ajustar valor objetivo basado en éxitos anteriores',
          description: `Los objetivos exitosos en esta categoría suelen tener valores objetivo entre ${min} y ${max}. Tu objetivo actual es ${objective.targetValue}.`,
          rationale: `Basado en el análisis de ${bestPattern.occurrenceCount} objetivos exitosos en la categoría "${objective.category}", se recomienda ajustar el objetivo a ${avgTarget.toFixed(0)} para aumentar las probabilidades de éxito. La tasa de éxito de objetivos similares es del ${bestPattern.successRate?.toFixed(1)}%.`,
          suggestedValues: {
            newTargetValue: Math.round(avgTarget),
          },
          basedOn: {
            learningPatternId: bestPattern.id,
            successRate: bestPattern.successRate,
            confidence: bestPattern.confidence,
          },
          estimatedImpact: 'high',
          priority: 'high',
          createdAt: new Date().toISOString(),
        });
      }
    }
  }

  // Sugerencia 2: Ajuste de deadline basado en patrones
  const failurePatterns = relevantPatterns.filter(p => p.patternType === 'failure');
  if (failurePatterns.length > 0 && objective.deadline) {
    const deadline = new Date(objective.deadline);
    const now = new Date();
    const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    failurePatterns.forEach(pattern => {
      if (pattern.characteristics.deadlineRange) {
        const { min, max } = pattern.characteristics.deadlineRange;
        if (daysUntilDeadline < min || daysUntilDeadline > max) {
          const suggestedDays = Math.round((min + max) / 2);
          const suggestedDeadline = new Date(now);
          suggestedDeadline.setDate(suggestedDeadline.getDate() + suggestedDays);

          suggestions.push({
            id: `suggestion-deadline-${Date.now()}`,
            objectiveId: objective.id,
            type: 'deadline_adjustment',
            title: 'Ajustar fecha límite basado en patrones de fallo',
            description: `Los objetivos que fallaron en esta categoría tenían plazos similares. Se sugiere ajustar a ${suggestedDays} días.`,
            rationale: `Basado en el análisis de objetivos fallidos, se recomienda un plazo de ${suggestedDays} días para aumentar las probabilidades de éxito. Los objetivos con plazos fuera del rango ${min}-${max} días tienen una tasa de fallo del ${pattern.failureRate?.toFixed(1)}%.`,
            suggestedValues: {
              newDeadline: suggestedDeadline.toISOString().split('T')[0],
            },
            basedOn: {
              learningPatternId: pattern.id,
              confidence: pattern.confidence,
            },
            estimatedImpact: 'high',
            priority: 'medium',
            createdAt: new Date().toISOString(),
          });
        }
      }
    });
  }

  // Sugerencia 3: Estrategia basada en lecciones aprendidas
  const similarObjectives = allLearningData.filter(d => 
    d.category === objective.category && d.metric === objective.metric
  );
  const successfulObjectives = similarObjectives.filter(d => d.finalStatus === 'achieved');
  
  if (successfulObjectives.length > 0) {
    const commonLessons = extractCommonLessons(successfulObjectives);
    if (commonLessons.length > 0) {
      suggestions.push({
        id: `suggestion-strategy-${Date.now()}`,
        objectiveId: objective.id,
        type: 'strategy_adjustment',
        title: 'Aplicar estrategias de objetivos exitosos similares',
        description: `Basado en ${successfulObjectives.length} objetivos exitosos similares, se recomiendan las siguientes estrategias.`,
        rationale: `Los objetivos exitosos en esta categoría comparten características comunes. Aplicar estas estrategias puede aumentar las probabilidades de éxito.`,
        suggestedValues: {
          newStrategy: commonLessons.join('; '),
        },
        basedOn: {
          similarObjectives: successfulObjectives.slice(0, 5).map(d => d.objectiveId),
          successRate: (successfulObjectives.length / similarObjectives.length) * 100,
          confidence: Math.min(100, successfulObjectives.length * 15),
        },
        estimatedImpact: 'medium',
        priority: 'medium',
        createdAt: new Date().toISOString(),
      });
    }
  }

  // Guardar sugerencias
  const savedSuggestions = localStorage.getItem(STORAGE_KEY_ADJUSTMENT_SUGGESTIONS);
  const allSuggestions: AIObjectiveAdjustmentSuggestion[] = savedSuggestions 
    ? JSON.parse(savedSuggestions) 
    : [];
  allSuggestions.push(...suggestions);
  localStorage.setItem(STORAGE_KEY_ADJUSTMENT_SUGGESTIONS, JSON.stringify(allSuggestions));

  return suggestions;
};

/**
 * User Story 1: Obtiene el perfil de aprendizaje
 */
export const getLearningProfile = async (userId?: string): Promise<ObjectiveLearningProfile> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const saved = localStorage.getItem(STORAGE_KEY_LEARNING_PROFILE);
  if (saved) {
    return JSON.parse(saved);
  }

  // Crear perfil inicial
  const savedData = localStorage.getItem(STORAGE_KEY_LEARNING_DATA);
  const allLearningData: ObjectiveLearningData[] = savedData ? JSON.parse(savedData) : [];
  const patterns = await analyzeLearningPatterns();

  const achieved = allLearningData.filter(d => d.finalStatus === 'achieved');
  const failed = allLearningData.filter(d => d.finalStatus === 'failed');

  const profile: ObjectiveLearningProfile = {
    id: `profile-${Date.now()}`,
    userId,
    totalObjectives: allLearningData.length,
    achievedObjectives: achieved.length,
    failedObjectives: failed.length,
    successRate: allLearningData.length > 0 
      ? (achieved.length / allLearningData.length) * 100 
      : 0,
    patterns,
    recentSuggestions: [],
    preferences: {
      preferredTargetRanges: {},
      preferredDeadlineRanges: {},
      effectiveStrategies: [],
      ineffectiveStrategies: [],
    },
    lastAnalyzed: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEY_LEARNING_PROFILE, JSON.stringify(profile));
  return profile;
};

/**
 * User Story 1: Aplica una sugerencia de ajuste
 */
export const applyAdjustmentSuggestion = async (
  suggestionId: string,
  appliedBy?: string
): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const saved = localStorage.getItem(STORAGE_KEY_ADJUSTMENT_SUGGESTIONS);
  const suggestions: AIObjectiveAdjustmentSuggestion[] = saved ? JSON.parse(saved) : [];

  const suggestion = suggestions.find(s => s.id === suggestionId);
  if (suggestion) {
    suggestion.applied = true;
    suggestion.appliedAt = new Date().toISOString();
    suggestion.appliedBy = appliedBy || 'user';
    localStorage.setItem(STORAGE_KEY_ADJUSTMENT_SUGGESTIONS, JSON.stringify(suggestions));
  }
};

// Funciones auxiliares

function extractCommonFactors(data: ObjectiveLearningData[]): string[] {
  const factors: string[] = [];
  
  const targetRealisticCount = data.filter(d => d.factors.targetRealistic === true).length;
  const deadlineAdequateCount = data.filter(d => d.factors.deadlineAdequate === true).length;
  const resourcesSufficientCount = data.filter(d => d.factors.resourcesSufficient === true).length;
  const strategyEffectiveCount = data.filter(d => d.factors.strategyEffective === true).length;

  if (targetRealisticCount > data.length * 0.7) {
    factors.push('Target realista');
  }
  if (deadlineAdequateCount > data.length * 0.7) {
    factors.push('Deadline adecuado');
  }
  if (resourcesSufficientCount > data.length * 0.7) {
    factors.push('Recursos suficientes');
  }
  if (strategyEffectiveCount > data.length * 0.7) {
    factors.push('Estrategia efectiva');
  }

  return factors;
}

function generateSuccessRecommendations(
  data: ObjectiveLearningData[],
  category: string
): string[] {
  const recommendations: string[] = [];
  
  const avgProgress = data.reduce((sum, d) => sum + d.finalProgress, 0) / data.length;
  if (avgProgress > 90) {
    recommendations.push(`Mantener objetivos ambiciosos pero alcanzables en la categoría ${category}`);
  }

  const effectiveStrategies = data
    .filter(d => d.factors.strategyEffective === true)
    .length;
  if (effectiveStrategies > data.length * 0.8) {
    recommendations.push('Continuar con estrategias similares que han demostrado ser efectivas');
  }

  return recommendations;
}

function generateFailureRecommendations(
  data: ObjectiveLearningData[],
  category: string
): string[] {
  const recommendations: string[] = [];

  const unrealisticTargets = data.filter(d => d.factors.targetRealistic === false).length;
  if (unrealisticTargets > data.length * 0.5) {
    recommendations.push(`Revisar y ajustar valores objetivo en la categoría ${category} para hacerlos más realistas`);
  }

  const inadequateDeadlines = data.filter(d => d.factors.deadlineAdequate === false).length;
  if (inadequateDeadlines > data.length * 0.5) {
    recommendations.push('Ajustar plazos para dar más tiempo a la ejecución');
  }

  return recommendations;
}

function generateRiskRecommendations(
  data: ObjectiveLearningData[],
  category: string
): string[] {
  return [
    `Monitorear más de cerca los objetivos en la categoría ${category}`,
    'Implementar checkpoints intermedios para detectar riesgos temprano',
    'Asignar recursos adicionales si es necesario',
  ];
}

function extractCommonLessons(data: ObjectiveLearningData[]): string[] {
  const allLessons: string[] = [];
  data.forEach(d => {
    if (d.lessonsLearned) {
      allLessons.push(...d.lessonsLearned);
    }
  });

  // Contar frecuencia de lecciones
  const lessonCounts: Record<string, number> = {};
  allLessons.forEach(lesson => {
    lessonCounts[lesson] = (lessonCounts[lesson] || 0) + 1;
  });

  // Retornar las más comunes (aparecen en al menos 30% de los objetivos)
  const threshold = data.length * 0.3;
  return Object.entries(lessonCounts)
    .filter(([_, count]) => count >= threshold)
    .map(([lesson, _]) => lesson)
    .slice(0, 5);
}

async function updateLearningProfile(learningData: ObjectiveLearningData): Promise<void> {
  const profile = await getLearningProfile();
  
  // Actualizar estadísticas
  profile.totalObjectives += 1;
  if (learningData.finalStatus === 'achieved') {
    profile.achievedObjectives += 1;
  } else if (learningData.finalStatus === 'failed') {
    profile.failedObjectives += 1;
  }
  profile.successRate = profile.totalObjectives > 0
    ? (profile.achievedObjectives / profile.totalObjectives) * 100
    : 0;

  // Actualizar preferencias
  if (learningData.finalStatus === 'achieved') {
    const category = learningData.category;
    if (!profile.preferences.preferredTargetRanges) {
      profile.preferences.preferredTargetRanges = {};
    }
    if (!profile.preferences.preferredTargetRanges[category]) {
      profile.preferences.preferredTargetRanges[category] = {
        min: learningData.targetValue,
        max: learningData.targetValue,
      };
    } else {
      profile.preferences.preferredTargetRanges[category] = {
        min: Math.min(profile.preferences.preferredTargetRanges[category].min, learningData.targetValue),
        max: Math.max(profile.preferences.preferredTargetRanges[category].max, learningData.targetValue),
      };
    }
  }

  profile.lastAnalyzed = new Date().toISOString();
  profile.updatedAt = new Date().toISOString();

  localStorage.setItem(STORAGE_KEY_LEARNING_PROFILE, JSON.stringify(profile));
}

