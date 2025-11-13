import { Objective, ActionPlan } from '../types';

/**
 * User Story 2: Resultado de la simulación del impacto de un plan de acción
 */
export interface ActionPlanSimulationResult {
  planId: string;
  planTitle: string;
  objectivesImpact: ObjectiveImpact[];
  overallImpact: {
    positiveImpact: number; // Porcentaje de impacto positivo esperado (0-100)
    riskLevel: 'low' | 'medium' | 'high';
    confidence: number; // Nivel de confianza de la simulación (0-100)
    estimatedCompletionDate: string;
    successProbability: number; // Probabilidad de éxito (0-100)
  };
  recommendations: SimulationRecommendation[];
  warnings: SimulationWarning[];
  createdAt: string;
}

/**
 * Impacto esperado en un objetivo específico
 */
export interface ObjectiveImpact {
  objectiveId: string;
  objectiveTitle: string;
  currentProgress: number;
  currentStatus: Objective['status'];
  predictedProgress: number; // Progreso predicho después del plan
  predictedStatus: Objective['status'];
  progressIncrease: number; // Incremento esperado en porcentaje
  impactScore: number; // Puntuación de impacto (0-100)
  contributingSteps: string[]; // IDs de pasos que contribuyen a este objetivo
  timeline: {
    milestone: string;
    expectedProgress: number;
    date: string;
  }[];
  risks: {
    type: 'delay' | 'resource' | 'dependency' | 'scope';
    description: string;
    severity: 'low' | 'medium' | 'high';
  }[];
}

/**
 * Recomendación de la simulación
 */
export interface SimulationRecommendation {
  type: 'optimize' | 'adjust' | 'add_step' | 'remove_step' | 'change_priority' | 'extend_timeline';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  suggestedAction?: string;
  expectedBenefit?: string;
}

/**
 * Advertencia de la simulación
 */
export interface SimulationWarning {
  type: 'conflict' | 'overload' | 'timeline' | 'resource' | 'dependency';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  affectedObjectives?: string[];
  suggestedMitigation?: string;
}

/**
 * User Story 2: Simula el impacto de un plan de acción en los objetivos relacionados
 */
export const simulateActionPlanImpact = async (
  actionPlan: ActionPlan,
  objectives: Objective[]
): Promise<ActionPlanSimulationResult> => {
  // Simular delay de procesamiento de IA
  await new Promise(resolve => setTimeout(resolve, 2000));

  const objectivesImpact: ObjectiveImpact[] = [];
  const recommendations: SimulationRecommendation[] = [];
  const warnings: SimulationWarning[] = [];

  // Analizar impacto en cada objetivo relacionado
  for (const objective of objectives) {
    const impact = analyzeObjectiveImpact(actionPlan, objective);
    objectivesImpact.push(impact);

    // Generar advertencias si hay riesgos
    if (impact.risks.length > 0) {
      impact.risks.forEach(risk => {
        if (risk.severity === 'high' || risk.severity === 'medium') {
          warnings.push({
            type: risk.type === 'delay' ? 'timeline' : 
                  risk.type === 'resource' ? 'resource' : 
                  risk.type === 'dependency' ? 'dependency' : 'conflict',
            severity: risk.severity,
            title: `Riesgo en ${objective.title}`,
            description: risk.description,
            affectedObjectives: [objective.id],
            suggestedMitigation: getMitigationSuggestion(risk.type),
          });
        }
      });
    }
  }

  // Calcular impacto general
  const overallImpact = calculateOverallImpact(objectivesImpact, actionPlan);

  // Generar recomendaciones basadas en el análisis
  generateRecommendations(actionPlan, objectivesImpact, recommendations, warnings);

  return {
    planId: actionPlan.id,
    planTitle: actionPlan.title,
    objectivesImpact,
    overallImpact,
    recommendations,
    warnings,
    createdAt: new Date().toISOString(),
  };
};

/**
 * Analiza el impacto del plan de acción en un objetivo específico
 */
const analyzeObjectiveImpact = (
  actionPlan: ActionPlan,
  objective: Objective
): ObjectiveImpact => {
  // Identificar pasos relevantes para este objetivo
  const relevantSteps = actionPlan.steps.filter(step => 
    step.title.toLowerCase().includes(objective.title.toLowerCase()) ||
    step.description.toLowerCase().includes(objective.metric.toLowerCase()) ||
    step.assignedTo === objective.responsible
  );

  // Calcular progreso predicho
  const currentProgress = objective.progress;
  const gap = 100 - currentProgress;
  
  // Estimar el impacto basado en:
  // 1. Número de pasos relevantes
  // 2. Prioridad de los pasos
  // 3. Estado actual del objetivo
  // 4. Tiempo hasta la fecha límite
  
  const stepsWeight = relevantSteps.reduce((sum, step) => {
    const priorityWeight = step.priority === 'high' ? 1.0 : step.priority === 'medium' ? 0.7 : 0.4;
    return sum + priorityWeight;
  }, 0);

  const baseImpact = Math.min(gap * 0.6, 40); // Impacto base del 60% del gap, máximo 40%
  const stepsImpact = Math.min(stepsWeight * 5, 30); // Impacto adicional por pasos, máximo 30%
  const progressIncrease = Math.min(baseImpact + stepsImpact, gap);

  const predictedProgress = Math.min(currentProgress + progressIncrease, 100);
  
  // Determinar estado predicho
  let predictedStatus: Objective['status'] = objective.status;
  if (predictedProgress >= 100) {
    predictedStatus = 'achieved';
  } else if (predictedProgress >= 80) {
    predictedStatus = 'in_progress';
  } else if (predictedProgress < 50 && objective.status === 'in_progress') {
    predictedStatus = 'at_risk';
  }

  // Calcular puntuación de impacto (0-100)
  const impactScore = Math.min(
    (progressIncrease / gap) * 100,
    100
  );

  // Generar timeline de hitos
  const timeline = generateTimeline(actionPlan, objective, predictedProgress);

  // Identificar riesgos
  const risks = identifyRisks(actionPlan, objective, relevantSteps);

  return {
    objectiveId: objective.id,
    objectiveTitle: objective.title,
    currentProgress,
    currentStatus: objective.status,
    predictedProgress,
    predictedStatus,
    progressIncrease,
    impactScore,
    contributingSteps: relevantSteps.map(s => s.id),
    timeline,
    risks,
  };
};

/**
 * Genera una línea de tiempo con hitos esperados
 */
const generateTimeline = (
  actionPlan: ActionPlan,
  objective: Objective,
  finalProgress: number
): ObjectiveImpact['timeline'] => {
  const timeline: ObjectiveImpact['timeline'] = [];
  const now = new Date();
  const deadline = new Date(objective.deadline);
  const totalDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (totalDays <= 0) return timeline;

  // Hito 1: 25% del tiempo
  const milestone1Date = new Date(now.getTime() + (totalDays * 0.25 * 24 * 60 * 60 * 1000));
  timeline.push({
    milestone: 'Inicio de implementación',
    expectedProgress: Math.min(objective.progress + (finalProgress - objective.progress) * 0.25, 100),
    date: milestone1Date.toISOString(),
  });

  // Hito 2: 50% del tiempo
  const milestone2Date = new Date(now.getTime() + (totalDays * 0.5 * 24 * 60 * 60 * 1000));
  timeline.push({
    milestone: 'Mitad del plan',
    expectedProgress: Math.min(objective.progress + (finalProgress - objective.progress) * 0.5, 100),
    date: milestone2Date.toISOString(),
  });

  // Hito 3: 75% del tiempo
  const milestone3Date = new Date(now.getTime() + (totalDays * 0.75 * 24 * 60 * 60 * 1000));
  timeline.push({
    milestone: 'Revisión final',
    expectedProgress: Math.min(objective.progress + (finalProgress - objective.progress) * 0.75, 100),
    date: milestone3Date.toISOString(),
  });

  return timeline;
};

/**
 * Identifica riesgos potenciales
 */
const identifyRisks = (
  actionPlan: ActionPlan,
  objective: Objective,
  relevantSteps: ActionPlan['steps']
): ObjectiveImpact['risks'] => {
  const risks: ObjectiveImpact['risks'] = [];
  const now = new Date();
  const deadline = new Date(objective.deadline);
  const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  // Riesgo de retraso si hay muchos pasos y poco tiempo
  if (relevantSteps.length > 5 && daysUntilDeadline < 30) {
    risks.push({
      type: 'delay',
      description: `Muchos pasos (${relevantSteps.length}) para un plazo corto (${daysUntilDeadline} días)`,
      severity: daysUntilDeadline < 14 ? 'high' : 'medium',
    });
  }

  // Riesgo si hay muchos pasos secuenciales (simulando dependencias)
  // En un sistema real, las dependencias estarían explícitamente definidas
  if (relevantSteps.length > 5) {
    risks.push({
      type: 'dependency',
      description: `Muchos pasos (${relevantSteps.length}) que podrían tener dependencias entre sí`,
      severity: relevantSteps.length > 8 ? 'high' : 'medium',
    });
  }

  // Riesgo de recursos si el objetivo está en riesgo y hay muchos pasos
  if (objective.status === 'at_risk' && relevantSteps.length > 3) {
    risks.push({
      type: 'resource',
      description: 'Objetivo en riesgo requiere más recursos de los planificados',
      severity: 'high',
    });
  }

  return risks;
};

/**
 * Calcula el impacto general del plan
 */
const calculateOverallImpact = (
  objectivesImpact: ObjectiveImpact[],
  actionPlan: ActionPlan
): ActionPlanSimulationResult['overallImpact'] => {
  if (objectivesImpact.length === 0) {
    return {
      positiveImpact: 0,
      riskLevel: 'low',
      confidence: 0,
      estimatedCompletionDate: new Date().toISOString(),
      successProbability: 0,
    };
  }

  // Calcular impacto positivo promedio
  const avgImpact = objectivesImpact.reduce((sum, impact) => sum + impact.impactScore, 0) / objectivesImpact.length;
  
  // Calcular nivel de riesgo basado en las advertencias
  const highRiskCount = objectivesImpact.reduce((sum, impact) => 
    sum + impact.risks.filter(r => r.severity === 'high').length, 0
  );
  const mediumRiskCount = objectivesImpact.reduce((sum, impact) => 
    sum + impact.risks.filter(r => r.severity === 'medium').length, 0
  );

  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  if (highRiskCount > 2 || (highRiskCount > 0 && mediumRiskCount > 3)) {
    riskLevel = 'high';
  } else if (highRiskCount > 0 || mediumRiskCount > 2) {
    riskLevel = 'medium';
  }

  // Calcular probabilidad de éxito
  const baseSuccess = Math.min(avgImpact, 100);
  const riskPenalty = riskLevel === 'high' ? 20 : riskLevel === 'medium' ? 10 : 0;
  const successProbability = Math.max(baseSuccess - riskPenalty, 0);

  // Calcular confianza (basada en número de objetivos y calidad de datos)
  const confidence = Math.min(
    60 + (objectivesImpact.length * 5) + (actionPlan.steps.length > 0 ? 10 : 0),
    95
  );

  // Calcular fecha de finalización estimada
  const latestStep = actionPlan.steps.reduce((latest, step) => {
    if (!step.dueDate) return latest;
    const stepDate = new Date(step.dueDate);
    return stepDate > latest ? stepDate : latest;
  }, new Date());

  return {
    positiveImpact: Math.round(avgImpact),
    riskLevel,
    confidence: Math.round(confidence),
    estimatedCompletionDate: latestStep.toISOString(),
    successProbability: Math.round(successProbability),
  };
};

/**
 * Genera recomendaciones basadas en el análisis
 */
const generateRecommendations = (
  actionPlan: ActionPlan,
  objectivesImpact: ObjectiveImpact[],
  recommendations: SimulationRecommendation[],
  warnings: SimulationWarning[]
): void => {
  // Recomendación si hay muchos riesgos
  if (warnings.filter(w => w.severity === 'high').length > 0) {
    recommendations.push({
      type: 'adjust',
      priority: 'high',
      title: 'Revisar plan debido a riesgos identificados',
      description: 'Se han identificado riesgos de alta severidad que podrían afectar el éxito del plan.',
      suggestedAction: 'Considerar ajustar fechas límite o redistribuir recursos',
    });
  }

  // Recomendación si el impacto es bajo
  const avgImpact = objectivesImpact.reduce((sum, impact) => sum + impact.impactScore, 0) / objectivesImpact.length;
  if (avgImpact < 30) {
    recommendations.push({
      type: 'optimize',
      priority: 'medium',
      title: 'Optimizar plan para mayor impacto',
      description: `El impacto esperado es bajo (${avgImpact.toFixed(0)}%). Considera agregar pasos adicionales o aumentar prioridades.`,
      expectedBenefit: 'Aumento del 15-25% en el impacto esperado',
    });
  }

  // Recomendación si hay pasos de baja prioridad
  const lowPrioritySteps = actionPlan.steps.filter(s => s.priority === 'low');
  if (lowPrioritySteps.length > actionPlan.steps.length * 0.5) {
    recommendations.push({
      type: 'change_priority',
      priority: 'medium',
      title: 'Aumentar prioridad de pasos críticos',
      description: `Más del 50% de los pasos tienen prioridad baja. Considera aumentar la prioridad de pasos críticos.`,
      suggestedAction: 'Revisar y ajustar prioridades según impacto en objetivos',
    });
  }
};

/**
 * Obtiene sugerencia de mitigación según el tipo de riesgo
 */
const getMitigationSuggestion = (riskType: string): string => {
  switch (riskType) {
    case 'delay':
      return 'Considera extender el plazo o reducir el alcance del plan';
    case 'resource':
      return 'Asigna recursos adicionales o redistribuye la carga de trabajo';
    case 'dependency':
      return 'Revisa y optimiza las dependencias entre pasos';
    case 'scope':
      return 'Considera dividir el plan en fases más pequeñas';
    default:
      return 'Revisa el plan y ajusta según sea necesario';
  }
};

