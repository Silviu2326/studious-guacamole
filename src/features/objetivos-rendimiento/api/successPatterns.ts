import { Objective, SuccessPatternExtended, ReplicationRecommendation, ObjectiveLearningData, ActionPlan } from '../types';
import { analyzeLearningPatterns } from './objectiveLearning';
import { getObjectives } from './objectives';

const STORAGE_KEY_SUCCESS_PATTERNS = 'objectives-success-patterns-extended';
const STORAGE_KEY_REPLICATION_RECOMMENDATIONS = 'objectives-replication-recommendations';

/**
 * User Story 2: Identificar patrones de éxito extendidos (objetivos alcanzados en menos tiempo, planes más efectivos)
 */
export const identifySuccessPatterns = async (): Promise<SuccessPatternExtended[]> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Obtener patrones base
  const basePatterns = await analyzeLearningPatterns();
  const objectives = await getObjectives();
  const savedLearningData = localStorage.getItem('objectives-learning-data');
  const learningData: ObjectiveLearningData[] = savedLearningData ? JSON.parse(savedLearningData) : [];
  
  const extendedPatterns: SuccessPatternExtended[] = [];
  
  // Procesar cada patrón base y extenderlo
  for (const pattern of basePatterns) {
    if (pattern.patternType !== 'success') continue;
    
    // Obtener objetivos exitosos relacionados
    const successfulObjectives = objectives.filter(obj => 
      obj.status === 'achieved' && 
      obj.category === pattern.category &&
      (pattern.metric ? obj.metric === pattern.metric : true)
    );
    
    if (successfulObjectives.length === 0) continue;
    
    // Calcular tiempo de logro
    const timeToAchievement = calculateTimeToAchievement(successfulObjectives);
    
    // Identificar planes más efectivos
    const effectivePlans = identifyEffectivePlans(successfulObjectives, learningData);
    
    // Identificar factores de aceleración
    const accelerationFactors = identifyAccelerationFactors(successfulObjectives, learningData);
    
    // Crear patrón extendido
    const extendedPattern: SuccessPatternExtended = {
      ...pattern,
      timeToAchievement,
      effectivePlans,
      accelerationFactors,
    };
    
    extendedPatterns.push(extendedPattern);
  }
  
  // Guardar en localStorage
  localStorage.setItem(STORAGE_KEY_SUCCESS_PATTERNS, JSON.stringify(extendedPatterns));
  
  return extendedPatterns;
};

/**
 * Calcular tiempo de logro para objetivos exitosos
 */
function calculateTimeToAchievement(objectives: Objective[]): SuccessPatternExtended['timeToAchievement'] {
  const times: number[] = [];
  
  objectives.forEach(obj => {
    if (obj.status === 'achieved') {
      const createdAt = new Date(obj.createdAt);
      const updatedAt = new Date(obj.updatedAt);
      const days = Math.ceil((updatedAt.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
      times.push(days);
    }
  });
  
  if (times.length === 0) {
    return {
      averageDays: 0,
      fastestDays: 0,
      medianDays: 0,
      timeEfficiency: 0,
    };
  }
  
  times.sort((a, b) => a - b);
  const averageDays = Math.round(times.reduce((sum, t) => sum + t, 0) / times.length);
  const fastestDays = times[0];
  const medianDays = times[Math.floor(times.length / 2)];
  
  // Calcular eficiencia de tiempo (0-100)
  // Objetivos que se logran en menos tiempo tienen mayor eficiencia
  const maxExpectedDays = Math.max(...times) * 1.5;
  const timeEfficiency = Math.round((1 - (averageDays / maxExpectedDays)) * 100);
  
  return {
    averageDays,
    fastestDays,
    medianDays,
    timeEfficiency: Math.max(0, Math.min(100, timeEfficiency)),
  };
}

/**
 * Identificar planes de acción más efectivos
 */
function identifyEffectivePlans(
  objectives: Objective[],
  learningData: ObjectiveLearningData[]
): SuccessPatternExtended['effectivePlans'] {
  const planEffectiveness: Map<string, {
    planId: string;
    planName: string;
    objectives: Objective[];
    times: number[];
    successCount: number;
    totalCount: number;
  }> = new Map();
  
  objectives.forEach(obj => {
    const actionPlans = obj.links?.actionPlans || [];
    
    actionPlans.forEach(plan => {
      if (!planEffectiveness.has(plan.id)) {
        planEffectiveness.set(plan.id, {
          planId: plan.id,
          planName: plan.title,
          objectives: [],
          times: [],
          successCount: 0,
          totalCount: 0,
        });
      }
      
      const planData = planEffectiveness.get(plan.id)!;
      planData.objectives.push(obj);
      planData.totalCount++;
      
      if (obj.status === 'achieved') {
        planData.successCount++;
        const createdAt = new Date(obj.createdAt);
        const updatedAt = new Date(obj.updatedAt);
        const days = Math.ceil((updatedAt.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
        planData.times.push(days);
      }
    });
  });
  
  // Convertir a array y calcular scores
  const effectivePlans = Array.from(planEffectiveness.values())
    .filter(plan => plan.successCount > 0)
    .map(plan => {
      const avgTime = plan.times.length > 0
        ? Math.round(plan.times.reduce((sum, t) => sum + t, 0) / plan.times.length)
        : 0;
      const successRate = (plan.successCount / plan.totalCount) * 100;
      
      // Calcular score de efectividad (0-100)
      // Combina tasa de éxito y tiempo promedio
      const timeScore = avgTime > 0 ? Math.max(0, 100 - (avgTime / 10)) : 50;
      const effectivenessScore = Math.round((successRate * 0.6) + (timeScore * 0.4));
      
      // Obtener acciones clave del plan
      const firstPlan = plan.objectives[0]?.links?.actionPlans?.find(p => p.id === plan.planId);
      const keyActions = firstPlan?.steps
        .filter(step => step.completed)
        .slice(0, 5)
        .map(step => step.title) || [];
      
      return {
        planId: plan.planId,
        planName: plan.planName,
        effectivenessScore,
        averageTimeToComplete: avgTime,
        successRate,
        keyActions,
        usageCount: plan.totalCount,
      };
    })
    .sort((a, b) => b.effectivenessScore - a.effectivenessScore)
    .slice(0, 5); // Top 5 planes más efectivos
  
  return effectivePlans;
}

/**
 * Identificar factores de aceleración
 */
function identifyAccelerationFactors(
  objectives: Objective[],
  learningData: ObjectiveLearningData[]
): SuccessPatternExtended['accelerationFactors'] {
  const factors: Map<string, { count: number; objectives: Objective[] }> = new Map();
  
  objectives.forEach(obj => {
    // Factor 1: Plan de acción presente
    if (obj.links?.actionPlans && obj.links.actionPlans.length > 0) {
      const key = 'Plan de acción estructurado';
      if (!factors.has(key)) {
        factors.set(key, { count: 0, objectives: [] });
      }
      factors.get(key)!.count++;
      factors.get(key)!.objectives.push(obj);
    }
    
    // Factor 2: Check-ins regulares
    if (obj.checkIns && obj.checkIns.length >= 3) {
      const key = 'Check-ins regulares';
      if (!factors.has(key)) {
        factors.set(key, { count: 0, objectives: [] });
      }
      factors.get(key)!.count++;
      factors.get(key)!.objectives.push(obj);
    }
    
    // Factor 3: Objetivo SMART bien definido
    if (obj.smartFields) {
      const key = 'Objetivo SMART bien definido';
      if (!factors.has(key)) {
        factors.set(key, { count: 0, objectives: [] });
      }
      factors.get(key)!.count++;
      factors.get(key)!.objectives.push(obj);
    }
    
    // Factor 4: Recursos adecuados
    const learningDataForObj = learningData.find(ld => ld.objectiveId === obj.id);
    if (learningDataForObj?.factors.resourcesSufficient) {
      const key = 'Recursos adecuados';
      if (!factors.has(key)) {
        factors.set(key, { count: 0, objectives: [] });
      }
      factors.get(key)!.count++;
      factors.get(key)!.objectives.push(obj);
    }
    
    // Factor 5: Estrategia efectiva
    if (learningDataForObj?.factors.strategyEffective) {
      const key = 'Estrategia efectiva';
      if (!factors.has(key)) {
        factors.set(key, { count: 0, objectives: [] });
      }
      factors.get(key)!.count++;
      factors.get(key)!.objectives.push(obj);
    }
  });
  
  // Convertir a array y calcular impacto
  const totalObjectives = objectives.length;
  const accelerationFactors = Array.from(factors.entries())
    .map(([factor, data]) => {
      const frequency = (data.count / totalObjectives) * 100;
      let impact: 'high' | 'medium' | 'low' = 'low';
      
      if (frequency >= 70) impact = 'high';
      else if (frequency >= 40) impact = 'medium';
      
      return {
        factor,
        description: getFactorDescription(factor),
        impact,
        frequency: Math.round(frequency),
      };
    })
    .sort((a, b) => {
      const impactOrder = { high: 3, medium: 2, low: 1 };
      return impactOrder[b.impact] - impactOrder[a.impact];
    });
  
  return accelerationFactors;
}

function getFactorDescription(factor: string): string {
  const descriptions: Record<string, string> = {
    'Plan de acción estructurado': 'Objetivos con planes de acción detallados y seguimiento regular',
    'Check-ins regulares': 'Objetivos con actualizaciones periódicas de progreso',
    'Objetivo SMART bien definido': 'Objetivos con campos SMART completos y realistas',
    'Recursos adecuados': 'Objetivos con recursos suficientes asignados',
    'Estrategia efectiva': 'Objetivos con estrategias probadas y efectivas',
  };
  
  return descriptions[factor] || 'Factor que contribuye al éxito del objetivo';
}

/**
 * User Story 2: Generar recomendaciones de replicación basadas en patrones de éxito
 */
export const generateReplicationRecommendations = async (
  objectiveId?: string
): Promise<ReplicationRecommendation[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const patterns = await identifySuccessPatterns();
  const objectives = await getObjectives();
  const targetObjective = objectiveId ? objectives.find(obj => obj.id === objectiveId) : undefined;
  
  const recommendations: ReplicationRecommendation[] = [];
  
  for (const pattern of patterns) {
    if (!pattern.effectivePlans || pattern.effectivePlans.length === 0) continue;
    
    // Si hay un objetivo específico, generar recomendación para él
    if (targetObjective && targetObjective.category === pattern.category) {
      const topPlan = pattern.effectivePlans[0];
      
      const recommendation: ReplicationRecommendation = {
        id: `rec-${pattern.id}-${Date.now()}`,
        patternId: pattern.id,
        patternName: pattern.category,
        objectiveId: targetObjective.id,
        recommendationType: 'replicate_plan',
        title: `Replicar plan efectivo: ${topPlan.planName}`,
        description: `Este plan ha demostrado una efectividad del ${topPlan.effectivenessScore}% con una tasa de éxito del ${topPlan.successRate.toFixed(1)}%`,
        rationale: `Basado en ${pattern.occurrenceCount} objetivos exitosos en la categoría ${pattern.category}, este plan ha sido el más efectivo`,
        elementsToReplicate: {
          actionPlan: topPlan.planId,
          timeline: pattern.timeToAchievement ? {
            suggestedStartDate: new Date().toISOString().split('T')[0],
            suggestedDeadline: new Date(Date.now() + pattern.timeToAchievement.averageDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            estimatedDays: pattern.timeToAchievement.averageDays,
          } : undefined,
          strategy: topPlan.keyActions,
        },
        expectedImpact: {
          successProbability: topPlan.successRate,
          estimatedTimeReduction: pattern.timeToAchievement ? 
            Math.max(0, 100 - (pattern.timeToAchievement.averageDays / 10) * 10) : undefined,
          estimatedEffectiveness: topPlan.effectivenessScore,
          confidence: Math.min(100, pattern.confidence + 10),
        },
        basedOn: {
          similarObjectives: pattern.exampleObjectiveIds,
          patternOccurrences: pattern.occurrenceCount,
          averageSuccessRate: pattern.successRate || 0,
        },
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      
      recommendations.push(recommendation);
    } else {
      // Generar recomendación general para la categoría
      const topPlan = pattern.effectivePlans[0];
      
      const recommendation: ReplicationRecommendation = {
        id: `rec-${pattern.id}-general-${Date.now()}`,
        patternId: pattern.id,
        patternName: pattern.category,
        recommendationType: 'replicate_strategy',
        title: `Replicar estrategia exitosa en ${pattern.category}`,
        description: `Patrón identificado con ${pattern.occurrenceCount} objetivos exitosos. Plan más efectivo: ${topPlan.planName}`,
        rationale: `Este patrón ha demostrado una tasa de éxito del ${pattern.successRate?.toFixed(1)}% con un tiempo promedio de ${pattern.timeToAchievement?.averageDays} días`,
        elementsToReplicate: {
          strategy: topPlan.keyActions,
          timeline: pattern.timeToAchievement ? {
            suggestedStartDate: new Date().toISOString().split('T')[0],
            suggestedDeadline: new Date(Date.now() + pattern.timeToAchievement.averageDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            estimatedDays: pattern.timeToAchievement.averageDays,
          } : undefined,
        },
        expectedImpact: {
          successProbability: pattern.successRate || 0,
          estimatedTimeReduction: pattern.timeToAchievement ? 
            Math.max(0, 100 - (pattern.timeToAchievement.averageDays / 10) * 10) : undefined,
          estimatedEffectiveness: topPlan.effectivenessScore,
          confidence: pattern.confidence,
        },
        basedOn: {
          similarObjectives: pattern.exampleObjectiveIds,
          patternOccurrences: pattern.occurrenceCount,
          averageSuccessRate: pattern.successRate || 0,
        },
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      
      recommendations.push(recommendation);
    }
  }
  
  // Guardar recomendaciones
  const saved = localStorage.getItem(STORAGE_KEY_REPLICATION_RECOMMENDATIONS);
  const allRecommendations: ReplicationRecommendation[] = saved ? JSON.parse(saved) : [];
  allRecommendations.push(...recommendations);
  localStorage.setItem(STORAGE_KEY_REPLICATION_RECOMMENDATIONS, JSON.stringify(allRecommendations));
  
  return recommendations;
};

/**
 * User Story 2: Aplicar recomendación de replicación
 */
export const applyReplicationRecommendation = async (
  recommendationId: string,
  userId: string
): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const saved = localStorage.getItem(STORAGE_KEY_REPLICATION_RECOMMENDATIONS);
  const recommendations: ReplicationRecommendation[] = saved ? JSON.parse(saved) : [];
  
  const recommendation = recommendations.find(r => r.id === recommendationId);
  if (recommendation) {
    recommendation.status = 'applied';
    recommendation.appliedAt = new Date().toISOString();
    recommendation.appliedBy = userId;
    
    localStorage.setItem(STORAGE_KEY_REPLICATION_RECOMMENDATIONS, JSON.stringify(recommendations));
  }
};

/**
 * User Story 2: Obtener recomendaciones de replicación
 */
export const getReplicationRecommendations = async (
  objectiveId?: string
): Promise<ReplicationRecommendation[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const saved = localStorage.getItem(STORAGE_KEY_REPLICATION_RECOMMENDATIONS);
  const recommendations: ReplicationRecommendation[] = saved ? JSON.parse(saved) : [];
  
  if (objectiveId) {
    return recommendations.filter(r => r.objectiveId === objectiveId && r.status === 'pending');
  }
  
  return recommendations.filter(r => r.status === 'pending');
};

