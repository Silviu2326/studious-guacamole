import { Scenario, ScenarioModification, ScenarioImpact, ScenarioComparison, Objective, Metric } from '../types';
import { getObjectives } from './objectives';
import { getPerformanceMetrics } from './performance';

/**
 * User Story: Simulación de escenarios hipotéticos
 * Permite a los managers simular cambios en objetivos y ver el impacto proyectado
 */

/**
 * Calcula el impacto proyectado de una modificación en un objetivo
 */
const calculateImpact = async (
  objective: Objective,
  modification: ScenarioModification,
  role: 'entrenador' | 'gimnasio',
  period: string
): Promise<ScenarioImpact[]> => {
  // Obtener métricas relacionadas
  const metrics = await getPerformanceMetrics(role, period);
  const impacts: ScenarioImpact[] = [];

  // Calcular nuevo valor objetivo
  let newTargetValue = objective.targetValue;
  if (modification.modificationType === 'target_increase') {
    newTargetValue = objective.targetValue * (1 + modification.value / 100);
  } else if (modification.modificationType === 'target_decrease') {
    newTargetValue = objective.targetValue * (1 - modification.value / 100);
  } else if (modification.modificationType === 'target_set') {
    newTargetValue = modification.value;
  }

  // Calcular impacto en la métrica principal del objetivo
  const mainMetric = metrics.find(m => m.id === objective.metric || m.name === objective.metric);
  if (mainMetric) {
    const currentProgress = objective.currentValue / objective.targetValue;
    const projectedValue = newTargetValue * currentProgress;
    const change = projectedValue - mainMetric.value;
    const changePercent = mainMetric.value > 0 ? (change / mainMetric.value) * 100 : 0;

    impacts.push({
      metricId: mainMetric.id,
      metricName: mainMetric.name,
      currentValue: mainMetric.value,
      projectedValue,
      change,
      changePercent,
      unit: mainMetric.unit,
      confidence: 75, // Confianza media en la proyección
      reasoning: `Si aumentamos el objetivo de ${objective.metric} en ${modification.value}${modification.unit || '%'}, proyectamos un valor de ${projectedValue.toFixed(2)} ${mainMetric.unit} basado en el progreso actual.`,
    });
  }

  // Calcular impacto en métricas relacionadas
  // Para facturación, puede impactar en otras métricas financieras
  if (objective.metric.toLowerCase().includes('facturacion') || objective.metric.toLowerCase().includes('ventas')) {
    // Impacto en retención (más ventas pueden mejorar retención)
    const retencionMetric = metrics.find(m => m.name.toLowerCase().includes('retencion'));
    if (retencionMetric) {
      const projectedRetention = retencionMetric.value * (1 + (modification.value / 100) * 0.1); // 10% del impacto en retención
      impacts.push({
        metricId: retencionMetric.id,
        metricName: retencionMetric.name,
        currentValue: retencionMetric.value,
        projectedValue: projectedRetention,
        change: projectedRetention - retencionMetric.value,
        changePercent: retencionMetric.value > 0 ? ((projectedRetention - retencionMetric.value) / retencionMetric.value) * 100 : 0,
        unit: retencionMetric.unit,
        confidence: 60,
        reasoning: `Un aumento en ventas puede mejorar la retención de clientes debido a mayor satisfacción y compromiso.`,
      });
    }

    // Impacto en NPS
    const npsMetric = metrics.find(m => m.name.toLowerCase().includes('nps'));
    if (npsMetric) {
      const projectedNPS = npsMetric.value + (modification.value / 100) * 2; // Impacto moderado en NPS
      impacts.push({
        metricId: npsMetric.id,
        metricName: npsMetric.name,
        currentValue: npsMetric.value,
        projectedValue: projectedNPS,
        change: projectedNPS - npsMetric.value,
        changePercent: npsMetric.value > 0 ? ((projectedNPS - npsMetric.value) / npsMetric.value) * 100 : 0,
        unit: npsMetric.unit,
        confidence: 55,
        reasoning: `Mayores ventas pueden correlacionarse con mejor satisfacción del cliente, impactando positivamente el NPS.`,
      });
    }
  }

  // Para retención, puede impactar en facturación
  if (objective.metric.toLowerCase().includes('retencion')) {
    const facturacionMetric = metrics.find(m => m.name.toLowerCase().includes('facturacion') || m.name.toLowerCase().includes('ventas'));
    if (facturacionMetric) {
      const projectedRevenue = facturacionMetric.value * (1 + (modification.value / 100) * 0.15); // 15% del impacto en facturación
      impacts.push({
        metricId: facturacionMetric.id,
        metricName: facturacionMetric.name,
        currentValue: facturacionMetric.value,
        projectedValue: projectedRevenue,
        change: projectedRevenue - facturacionMetric.value,
        changePercent: facturacionMetric.value > 0 ? ((projectedRevenue - facturacionMetric.value) / facturacionMetric.value) * 100 : 0,
        unit: facturacionMetric.unit,
        confidence: 70,
        reasoning: `Mejor retención de clientes se traduce en mayor facturación recurrente.`,
      });
    }
  }

  return impacts;
};

/**
 * Simula un escenario hipotético
 */
export const simulateScenario = async (
  role: 'entrenador' | 'gimnasio',
  objectiveId: string,
  modifications: ScenarioModification[],
  period: string = 'month',
  userId: string = 'current-user',
  userName: string = 'Usuario Actual'
): Promise<Scenario> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  // Obtener el objetivo base
  const objectives = await getObjectives({}, role);
  const objective = objectives.find(obj => obj.id === objectiveId);

  if (!objective) {
    throw new Error(`Objetivo con ID ${objectiveId} no encontrado`);
  }

  // Calcular impactos para cada modificación
  const allImpacts: ScenarioImpact[] = [];
  for (const modification of modifications) {
    const impacts = await calculateImpact(objective, modification, role, period);
    allImpacts.push(...impacts);
  }

  // Consolidar impactos por métrica (sumar cambios si hay múltiples modificaciones)
  const impactsMap = new Map<string, ScenarioImpact>();
  for (const impact of allImpacts) {
    const existing = impactsMap.get(impact.metricId);
    if (existing) {
      existing.projectedValue += impact.change;
      existing.change += impact.change;
      existing.changePercent = existing.currentValue > 0 ? (existing.change / existing.currentValue) * 100 : 0;
      existing.confidence = Math.min(existing.confidence, impact.confidence); // Usar la menor confianza
    } else {
      impactsMap.set(impact.metricId, { ...impact });
    }
  }

  const scenario: Scenario = {
    id: `scenario-${Date.now()}`,
    name: `Escenario: ${modifications.map(m => `${m.objectiveTitle} ${m.modificationType === 'target_increase' ? '+' : m.modificationType === 'target_decrease' ? '-' : ''}${m.value}${m.unit || '%'}`).join(', ')}`,
    description: `Simulación de cambios en ${objective.title}`,
    baseObjectiveId: objective.id,
    baseObjectiveTitle: objective.title,
    modifications,
    impacts: Array.from(impactsMap.values()),
    createdAt: new Date().toISOString(),
    createdBy: userId,
    createdByName: userName,
    period,
  };

  return scenario;
};

/**
 * Compara múltiples escenarios
 */
export const compareScenarios = async (
  role: 'entrenador' | 'gimnasio',
  objectiveId: string,
  scenarios: Scenario[],
  period: string = 'month'
): Promise<ScenarioComparison> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  // Obtener el objetivo base
  const objectives = await getObjectives({}, role);
  const objective = objectives.find(obj => obj.id === objectiveId);

  if (!objective) {
    throw new Error(`Objetivo con ID ${objectiveId} no encontrado`);
  }

  // Encontrar el mejor y peor escenario basado en el impacto total
  let bestScenario: string | undefined;
  let worstScenario: string | undefined;
  let maxTotalImpact = -Infinity;
  let minTotalImpact = Infinity;

  for (const scenario of scenarios) {
    const totalImpact = scenario.impacts.reduce((sum, impact) => sum + impact.changePercent, 0);
    if (totalImpact > maxTotalImpact) {
      maxTotalImpact = totalImpact;
      bestScenario = scenario.id;
    }
    if (totalImpact < minTotalImpact) {
      minTotalImpact = totalImpact;
      worstScenario = scenario.id;
    }
  }

  // Recomendar el escenario con mejor balance impacto/confianza
  let recommendedScenario: string | undefined;
  let bestScore = -Infinity;

  for (const scenario of scenarios) {
    const avgConfidence = scenario.impacts.reduce((sum, impact) => sum + impact.confidence, 0) / scenario.impacts.length;
    const totalImpact = scenario.impacts.reduce((sum, impact) => sum + impact.changePercent, 0);
    const score = (totalImpact * avgConfidence) / 100; // Score combinado
    if (score > bestScore) {
      bestScore = score;
      recommendedScenario = scenario.id;
    }
  }

  const recommended = scenarios.find(s => s.id === recommendedScenario);
  const recommendationReason = recommended
    ? `Este escenario ofrece el mejor balance entre impacto proyectado (${recommended.impacts.reduce((sum, i) => sum + i.changePercent, 0).toFixed(1)}% cambio total) y confianza en las proyecciones (${(recommended.impacts.reduce((sum, i) => sum + i.confidence, 0) / recommended.impacts.length).toFixed(0)}% promedio).`
    : undefined;

  return {
    baseScenario: {
      objectiveId: objective.id,
      objectiveTitle: objective.title,
      currentValue: objective.currentValue,
      targetValue: objective.targetValue,
      progress: objective.progress,
      unit: objective.unit,
    },
    scenarios,
    summary: {
      bestScenario,
      worstScenario,
      recommendedScenario,
      recommendationReason,
    },
  };
};

/**
 * Guarda un escenario para referencia futura
 */
export const saveScenario = async (scenario: Scenario): Promise<Scenario> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  // En producción, esto guardaría en la base de datos
  // Por ahora, solo retornamos el escenario
  return scenario;
};

/**
 * Obtiene escenarios guardados
 */
export const getSavedScenarios = async (role: 'entrenador' | 'gimnasio'): Promise<Scenario[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  // En producción, esto obtendría de la base de datos
  return [];
};

