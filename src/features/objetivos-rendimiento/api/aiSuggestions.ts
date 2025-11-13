import { AISuggestedObjective, HighlightedInsight, Metric, PerformanceData, ExtendedComparisonData, ComparisonData, DetectedAnomaly, ImportantChange, AIHighlightsConfig, Objective, AIMicroActionSuggestion, MicroActionType, SignificantDifference, PossibleCause, AIComparisonAnalysis } from '../types';

/**
 * User Story: Obtiene benchmarks del sector para una métrica específica
 * En producción, esto vendría de una API externa o base de datos de benchmarks
 */
const getIndustryBenchmark = async (
  metricId: string,
  role: 'entrenador' | 'gimnasio'
): Promise<{ value: number; source: string; percentile: number } | null> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Mock de benchmarks del sector (en producción vendría de una API real)
  const benchmarks: Record<string, { value: number; source: string; percentile: number }> = {
    'facturacion': {
      value: role === 'entrenador' ? 45000 : 500000,
      source: 'Sector Fitness España 2024 - IHRSA',
      percentile: 50, // Mediana
    },
    'adherencia': {
      value: 78,
      source: 'Estudio de Adherencia Fitness Global 2024',
      percentile: 50,
    },
    'retencion': {
      value: 82,
      source: 'Benchmark de Retención Gimnasios España 2024',
      percentile: 50,
    },
    'ocupacion': {
      value: 65,
      source: 'Estudio de Ocupación Media Gimnasios 2024',
      percentile: 50,
    },
    'tasa_bajas': {
      value: 5.2,
      source: 'Análisis de Tasa de Bajas Sector Fitness 2024',
      percentile: 50,
    },
  };
  
  return benchmarks[metricId] || null;
};

/**
 * Genera objetivos automáticos sugeridos por IA basados en datos históricos y benchmarks del sector
 */
export const generateAISuggestedObjectives = async (
  role: 'entrenador' | 'gimnasio',
  currentMetrics: Metric[],
  historicalData?: PerformanceData[]
): Promise<AISuggestedObjective[]> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 800));

  const suggestions: AISuggestedObjective[] = [];

  // Generar sugerencias basadas en las métricas actuales
  for (const metric of currentMetrics) {
    if (!metric.target) continue; // Solo sugerir para métricas con objetivo

    const currentValue = metric.value;
    const currentTarget = metric.target;
    const progress = (currentValue / currentTarget) * 100;
    
    // Calcular promedio histórico si hay datos
    const historicalAverage = historicalData
      ? historicalData.reduce((sum, data) => {
          const histMetric = data.metrics.find(m => m.id === metric.id);
          return sum + (histMetric?.value || 0);
        }, 0) / historicalData.length
      : currentValue * 0.9;

    // Obtener benchmark del sector
    const benchmark = await getIndustryBenchmark(metric.id, role);

    // Determinar tendencia
    const variation = metric.variation || 0;
    const trend = variation > 5 ? 'increasing' : variation < -5 ? 'decreasing' : 'stable';

    // Calcular objetivo sugerido basado en tendencia, promedio histórico y benchmark
    let suggestedTarget = currentTarget;
    let rationale = '';
    
    if (benchmark) {
      // Si hay benchmark, usarlo como referencia
      const benchmarkPercentile = benchmark.percentile;
      const benchmarkValue = benchmark.value;
      
      // Ajustar según el percentil del benchmark
      if (benchmarkPercentile >= 75) {
        // Si el benchmark es del percentil 75 o superior, sugerir un objetivo ambicioso
        suggestedTarget = Math.round(benchmarkValue * 1.1);
        rationale = `Basado en el benchmark del sector (${benchmark.source}), que indica un valor de ${benchmarkValue} ${metric.unit} en el percentil ${benchmarkPercentile}, se sugiere un objetivo de ${suggestedTarget} ${metric.unit}. Este objetivo está ${((suggestedTarget / benchmarkValue - 1) * 100).toFixed(1)}% por encima del benchmark para mantener una posición competitiva.`;
      } else if (benchmarkPercentile >= 50) {
        // Si el benchmark es mediano, sugerir un objetivo alineado o ligeramente superior
        suggestedTarget = Math.round(benchmarkValue * 1.05);
        rationale = `Basado en el benchmark del sector (${benchmark.source}), que indica un valor mediano de ${benchmarkValue} ${metric.unit}, se sugiere un objetivo de ${suggestedTarget} ${metric.unit}. Este objetivo está alineado con los estándares del sector y representa un crecimiento del ${((suggestedTarget - currentTarget) / currentTarget * 100).toFixed(1)}% sobre tu objetivo actual.`;
      } else {
        // Si el benchmark es bajo, sugerir un objetivo más conservador
        suggestedTarget = Math.round(benchmarkValue * 0.95);
        rationale = `Basado en el benchmark del sector (${benchmark.source}), se sugiere un objetivo de ${suggestedTarget} ${metric.unit}, que está alineado con los estándares del sector.`;
      }
    } else {
      // Si no hay benchmark, usar lógica basada en tendencia e histórico
      if (trend === 'increasing' && progress > 80) {
        suggestedTarget = Math.round(currentTarget * 1.15);
        rationale = `Basado en la tendencia creciente del ${Math.abs(variation).toFixed(1)}% y el rendimiento histórico, se sugiere un objetivo de ${suggestedTarget} ${metric.unit}. Esto representa un crecimiento realista del ${((suggestedTarget - currentTarget) / currentTarget * 100).toFixed(1)}% sobre el objetivo actual.`;
      } else if (trend === 'increasing' && progress < 70) {
        suggestedTarget = Math.round(currentTarget * 0.95);
        rationale = `A pesar de la tendencia creciente, el progreso actual (${progress.toFixed(1)}%) sugiere ajustar el objetivo a ${suggestedTarget} ${metric.unit} para mantenerlo alcanzable.`;
      } else if (trend === 'stable' && progress > 90) {
        suggestedTarget = Math.round(currentTarget * 1.05);
        rationale = `Basado en el rendimiento estable y el promedio histórico de ${historicalAverage.toFixed(0)} ${metric.unit}, se sugiere un objetivo de ${suggestedTarget} ${metric.unit}. Este objetivo es alcanzable y mantiene el momentum actual.`;
      } else {
        rationale = `Basado en el promedio histórico de ${historicalAverage.toFixed(0)} ${metric.unit}, se sugiere mantener el objetivo actual de ${suggestedTarget} ${metric.unit}.`;
      }
    }

    // Calcular confianza basada en datos disponibles
    let confidence = 70;
    if (benchmark) confidence += 10; // Aumentar confianza si hay benchmark
    if (historicalData && historicalData.length > 2) confidence += 10; // Aumentar si hay datos históricos
    if (trend === 'stable' || trend === 'increasing') confidence += 5; // Aumentar si la tendencia es positiva

    suggestions.push({
      id: `ai-obj-${metric.id}-${Date.now()}`,
      title: `Objetivo sugerido: ${metric.name}`,
      description: `Objetivo automático sugerido por IA para ${metric.name}${benchmark ? ` basado en benchmarks del sector` : ' basado en datos históricos'}`,
      metric: metric.id,
      suggestedTargetValue: suggestedTarget,
      currentValue: currentValue,
      unit: metric.unit,
      rationale,
      confidence: Math.min(confidence, 100),
      basedOn: {
        historicalAverage: historicalAverage,
        trend,
        similarPeriods: historicalData?.slice(-3).map(d => {
          const m = d.metrics.find(m => m.id === metric.id);
          return m?.value || 0;
        }),
        industryBenchmark: benchmark?.value,
        benchmarkSource: benchmark?.source,
        benchmarkPercentile: benchmark?.percentile,
      },
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 días desde ahora
      category: metric.category,
    });
  }

  return suggestions;
};

/**
 * Genera insights destacados con explicaciones de IA
 */
export const generateHighlightedInsights = async (
  role: 'entrenador' | 'gimnasio',
  performanceData: PerformanceData,
  period: 'semana' | 'mes' | 'trimestre'
): Promise<HighlightedInsight[]> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 600));

  const insights: HighlightedInsight[] = [];

  // Insight 1: Contribución por día de la semana (ejemplo: martes)
  const facturacionMetric = performanceData.metrics.find(m => m.id === 'facturacion');
  if (facturacionMetric) {
    // Simular datos de días de la semana
    const weeklyDistribution = {
      lunes: 12,
      martes: 40,
      miércoles: 15,
      jueves: 18,
      viernes: 10,
      sábado: 3,
      domingo: 2,
    };

    const maxDay = Object.entries(weeklyDistribution).reduce((a, b) => 
      weeklyDistribution[a[0] as keyof typeof weeklyDistribution] > weeklyDistribution[b[0] as keyof typeof weeklyDistribution] ? a : b
    );

    if (maxDay[1] > 30) {
      insights.push({
        id: `insight-1-${Date.now()}`,
        title: `Día de mayor contribución: ${maxDay[0].charAt(0).toUpperCase() + maxDay[0].slice(1)}`,
        description: `Las sesiones de ${maxDay[0]} contribuyen al ${maxDay[1]}% del objetivo semanal`,
        metric: 'facturacion',
        value: facturacionMetric.value * (maxDay[1] / 100),
        unit: facturacionMetric.unit,
        percentage: maxDay[1],
        type: 'opportunity',
        aiExplanation: `El análisis de patrones semanales revela que ${maxDay[0]} concentra el ${maxDay[1]}% de la facturación semanal. Esto sugiere que los clientes tienen una preferencia marcada por este día, posiblemente debido a factores como disponibilidad, rutina establecida o preferencias personales.`,
        actionableRecommendation: `Considera optimizar la disponibilidad y recursos para ${maxDay[0]}, y explora estrategias para replicar este éxito en otros días de la semana.`,
        impact: 'high',
        period: 'semana',
      });
    }
  }

  // Insight 2: Objetivo en riesgo
  const atRiskObjectives = performanceData.objectives.filter(obj => obj.status === 'at_risk');
  if (atRiskObjectives.length > 0) {
    const riskObjective = atRiskObjectives[0];
    const daysUntilDeadline = Math.ceil(
      (new Date(riskObjective.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    
    insights.push({
      id: `insight-2-${Date.now()}`,
      title: `Objetivo en riesgo: ${riskObjective.title}`,
      description: `${riskObjective.title} está al ${riskObjective.progress.toFixed(0)}% con ${daysUntilDeadline} días restantes`,
      metric: riskObjective.metric,
      value: riskObjective.currentValue,
      unit: riskObjective.unit,
      percentage: riskObjective.progress,
      type: 'warning',
      aiExplanation: `El objetivo "${riskObjective.title}" muestra un progreso del ${riskObjective.progress.toFixed(0)}% con ${daysUntilDeadline} días restantes. Para alcanzarlo, necesitas un incremento promedio diario del ${((riskObjective.targetValue - riskObjective.currentValue) / daysUntilDeadline).toFixed(2)} ${riskObjective.unit}/día.`,
      actionableRecommendation: `Revisa las estrategias actuales y considera acciones inmediatas como aumentar la frecuencia de seguimiento, ajustar recursos asignados o revisar el objetivo si es poco realista.`,
      impact: 'high',
      relatedMetric: riskObjective.metric,
    });
  }

  // Insight 3: Tendencias positivas
  const positiveTrends = performanceData.metrics.filter(m => 
    m.trend?.direction === 'up' && m.variation && m.variation > 5
  );
  
  if (positiveTrends.length > 0) {
    const bestTrend = positiveTrends.reduce((a, b) => 
      (a.variation || 0) > (b.variation || 0) ? a : b
    );

    insights.push({
      id: `insight-3-${Date.now()}`,
      title: `Tendencia positiva destacada: ${bestTrend.name}`,
      description: `${bestTrend.name} ha crecido un ${bestTrend.variation?.toFixed(1)}% respecto al período anterior`,
      metric: bestTrend.id,
      value: bestTrend.value,
      unit: bestTrend.unit,
      percentage: bestTrend.variation,
      type: 'achievement',
      aiExplanation: `${bestTrend.name} muestra un crecimiento excepcional del ${bestTrend.variation?.toFixed(1)}% comparado con el período anterior. Esta tendencia positiva indica que las estrategias implementadas están funcionando efectivamente.`,
      actionableRecommendation: `Identifica qué acciones o factores han contribuido a este crecimiento y considera replicarlos en otras áreas o métricas.`,
      impact: 'medium',
      relatedMetric: bestTrend.id,
    });
  }

  // Insight 4: Oportunidad de mejora
  const belowTarget = performanceData.metrics.filter(m => 
    m.target && m.value < m.target && ((m.value / m.target) * 100) < 80
  );

  if (belowTarget.length > 0) {
    const opportunity = belowTarget[0];
    const gap = opportunity.target! - opportunity.value;
    const gapPercent = ((gap / opportunity.target!) * 100);

    insights.push({
      id: `insight-4-${Date.now()}`,
      title: `Oportunidad de mejora: ${opportunity.name}`,
      description: `${opportunity.name} está al ${((opportunity.value / opportunity.target!) * 100).toFixed(0)}% del objetivo, con una brecha de ${gap.toFixed(0)} ${opportunity.unit}`,
      metric: opportunity.id,
      value: opportunity.value,
      unit: opportunity.unit,
      percentage: (opportunity.value / opportunity.target!) * 100,
      type: 'opportunity',
      aiExplanation: `${opportunity.name} muestra una brecha del ${gapPercent.toFixed(1)}% respecto al objetivo. Aunque está por debajo, hay un potencial claro de mejora. El valor actual de ${opportunity.value} ${opportunity.unit} está a ${gap.toFixed(0)} ${opportunity.unit} del objetivo de ${opportunity.target} ${opportunity.unit}.`,
      actionableRecommendation: `Analiza las causas de la brecha y desarrolla un plan de acción específico. Considera establecer objetivos intermedios para mantener el momentum.`,
      impact: 'medium',
      relatedMetric: opportunity.id,
    });
  }

  return insights;
};

/**
 * Obtiene comparación extendida con objetivos sugeridos por IA
 */
export const getExtendedComparison = async (
  role: 'entrenador' | 'gimnasio',
  currentPeriod: string,
  previousPeriod: string
): Promise<ExtendedComparisonData> => {
  // Importar comparePerformance dinámicamente para evitar dependencias circulares
  const { comparePerformance } = await import('./performance');
  
  // Obtener comparación básica
  const basicComparison = await comparePerformance(role, currentPeriod, previousPeriod);

  // Generar objetivos sugeridos por IA basados en las métricas actuales
  const aiObjectives = await generateAISuggestedObjectives(
    role, 
    basicComparison.currentPeriod.metrics,
    [basicComparison.previousPeriod]
  );

  // Generar comparación con IA
  const comparisonWithAI = aiObjectives.map(obj => {
    const currentMetric = basicComparison.currentPeriod.metrics.find(m => m.id === obj.metric);
    const current = currentMetric?.value || obj.currentValue;
    const difference = obj.suggestedTargetValue - current;
    const differencePercent = current > 0 ? (difference / current) * 100 : 0;

    return {
      metric: obj.title,
      current,
      aiSuggested: obj.suggestedTargetValue,
      difference,
      differencePercent,
      rationale: obj.rationale,
    };
  });

  return {
    ...basicComparison,
    aiSuggestedObjectives: aiObjectives,
    comparisonWithAI,
  };
};

/**
 * User Story: Detecta anomalías en métricas usando IA
 */
export const detectAnomalies = async (
  metrics: Metric[],
  config: AIHighlightsConfig
): Promise<DetectedAnomaly[]> => {
  if (!config.enabled || !config.showAnomalies) {
    return [];
  }

  await new Promise(resolve => setTimeout(resolve, 500));

  const anomalies: DetectedAnomaly[] = [];
  const threshold = config.anomalyThreshold || 20; // Por defecto 20% de desviación

  for (const metric of metrics) {
    // Calcular valor esperado basado en tendencia y promedio histórico
    const expectedValue = metric.previousValue 
      ? metric.previousValue * (1 + (metric.trend?.value || 0) / 100)
      : metric.value * 0.9; // Si no hay valor previo, asumir 90% del actual

    const deviation = expectedValue > 0
      ? Math.abs((metric.value - expectedValue) / expectedValue) * 100
      : 0;

    if (deviation >= threshold) {
      let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
      if (deviation >= 50) severity = 'critical';
      else if (deviation >= 35) severity = 'high';
      else if (deviation >= 25) severity = 'medium';

      const isNegative = metric.value < expectedValue;
      const deviationSign = isNegative ? -deviation : deviation;

      anomalies.push({
        id: `anomaly-${metric.id}-${Date.now()}`,
        metricId: metric.id,
        metricName: metric.name,
        currentValue: metric.value,
        expectedValue,
        deviation: deviationSign,
        severity,
        description: `${metric.name} muestra una desviación del ${deviation.toFixed(1)}% respecto al valor esperado`,
        detectedAt: new Date().toISOString(),
        aiExplanation: `El análisis de patrones históricos y tendencias indica que ${metric.name} debería estar alrededor de ${expectedValue.toFixed(2)} ${metric.unit}, pero el valor actual es ${metric.value} ${metric.unit}. Esta desviación del ${deviation.toFixed(1)}% ${isNegative ? 'por debajo' : 'por encima'} del esperado puede indicar un cambio significativo en el comportamiento de esta métrica.`,
        recommendation: isNegative
          ? `Investiga las causas de la disminución. Considera revisar factores externos, cambios recientes en estrategias o posibles problemas operativos.`
          : `Analiza qué factores han contribuido a este aumento. Si es positivo, considera replicar estas acciones en otras áreas.`,
      });
    }
  }

  return anomalies;
};

/**
 * User Story: Detecta cambios importantes en métricas usando IA
 */
export const detectImportantChanges = async (
  metrics: Metric[],
  config: AIHighlightsConfig
): Promise<ImportantChange[]> => {
  if (!config.enabled || !config.showImportantChanges) {
    return [];
  }

  await new Promise(resolve => setTimeout(resolve, 500));

  const changes: ImportantChange[] = [];
  const threshold = config.changeThreshold || 10; // Por defecto 10% de cambio

  for (const metric of metrics) {
    if (!metric.previousValue || metric.variation === undefined) {
      continue;
    }

    const changePercent = Math.abs(metric.variation);
    
    if (changePercent >= threshold) {
      let changeType: 'increase' | 'decrease' | 'spike' | 'drop' = 'increase';
      let significance: 'low' | 'medium' | 'high' = 'low';

      if (metric.variation > 0) {
        changeType = changePercent >= 30 ? 'spike' : 'increase';
      } else {
        changeType = changePercent >= 30 ? 'drop' : 'decrease';
      }

      if (changePercent >= 25) significance = 'high';
      else if (changePercent >= 15) significance = 'medium';

      changes.push({
        id: `change-${metric.id}-${Date.now()}`,
        metricId: metric.id,
        metricName: metric.name,
        previousValue: metric.previousValue,
        currentValue: metric.value,
        changePercent: metric.variation,
        changeType,
        significance,
        description: `${metric.name} ha ${metric.variation > 0 ? 'aumentado' : 'disminuido'} un ${changePercent.toFixed(1)}% respecto al período anterior`,
        detectedAt: new Date().toISOString(),
        aiExplanation: `${metric.name} muestra un cambio significativo del ${changePercent.toFixed(1)}% comparado con el período anterior (de ${metric.previousValue} ${metric.unit} a ${metric.value} ${metric.unit}). Este tipo de cambio ${changeType === 'spike' || changeType === 'drop' ? 'drástico' : 'importante'} merece atención para entender sus causas y posibles implicaciones.`,
        recommendation: metric.variation > 0
          ? `Identifica los factores que han contribuido a este crecimiento positivo. Considera mantener o ampliar estas acciones si son beneficiosas.`
          : `Investiga las causas de esta disminución. Revisa estrategias recientes, factores externos o posibles problemas que puedan estar afectando esta métrica.`,
      });
    }
  }

  return changes;
};

/**
 * User Story: Obtiene la configuración de highlights de IA desde localStorage
 */
export const getAIHighlightsConfig = (): AIHighlightsConfig => {
  const saved = localStorage.getItem('objetivos-rendimiento-ai-highlights-config');
  if (saved) {
    return JSON.parse(saved);
  }
  return {
    enabled: false,
    showAnomalies: true,
    showImportantChanges: true,
    anomalyThreshold: 20,
    changeThreshold: 10,
  };
};

/**
 * User Story: Guarda la configuración de highlights de IA en localStorage
 */
export const saveAIHighlightsConfig = (config: AIHighlightsConfig): void => {
  localStorage.setItem('objetivos-rendimiento-ai-highlights-config', JSON.stringify(config));
};

/**
 * User Story 2: Genera sugerencias de micro-acciones cuando un objetivo está en riesgo
 */
export const generateMicroActionSuggestions = async (
  objective: Objective
): Promise<AIMicroActionSuggestion[]> => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const suggestions: AIMicroActionSuggestion[] = [];
  
  // Solo generar sugerencias si el objetivo está en riesgo
  if (objective.status !== 'at_risk' && objective.progress >= 50) {
    return suggestions;
  }
  
  const now = new Date();
  const deadline = new Date(objective.deadline);
  const createdAt = new Date(objective.createdAt);
  const daysRemaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const totalDays = Math.ceil((deadline.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
  const elapsedDays = totalDays - daysRemaining;
  const expectedProgress = totalDays > 0 ? (elapsedDays / totalDays) * 100 : 0;
  const progressGap = expectedProgress - objective.progress;
  
  // Calcular velocidad necesaria para alcanzar el objetivo
  const remainingValue = objective.targetValue - objective.currentValue;
  const dailyVelocityNeeded = daysRemaining > 0 ? remainingValue / daysRemaining : 0;
  const currentDailyVelocity = elapsedDays > 0 ? objective.currentValue / elapsedDays : 0;
  
  // Sugerencia 1: Ajustar valor objetivo si el progreso está muy atrasado
  if (progressGap > 20 && objective.progress < 50) {
    const suggestedTarget = Math.round(objective.currentValue * (100 / Math.max(objective.progress, 10)) * 0.9);
    suggestions.push({
      id: `micro-action-${objective.id}-adjust-target-${Date.now()}`,
      objectiveId: objective.id,
      type: 'adjust_target',
      title: 'Ajustar valor objetivo',
      description: `Ajustar el objetivo de ${objective.targetValue} ${objective.unit} a ${suggestedTarget} ${objective.unit} para hacerlo más alcanzable`,
      rationale: `El objetivo está al ${objective.progress.toFixed(1)}% con ${daysRemaining} días restantes. Para alcanzar el objetivo actual, necesitarías un incremento diario de ${dailyVelocityNeeded.toFixed(2)} ${objective.unit}/día, pero el ritmo actual es de ${currentDailyVelocity.toFixed(2)} ${objective.unit}/día. Ajustar el objetivo a ${suggestedTarget} ${objective.unit} lo haría más realista y alcanzable.`,
      priority: 'high',
      estimatedImpact: 'high',
      confidence: 75,
      suggestedValues: {
        newTargetValue: suggestedTarget,
      },
      createdAt: new Date().toISOString(),
    });
  }
  
  // Sugerencia 2: Extender fecha límite si hay tiempo suficiente
  if (daysRemaining < 30 && progressGap > 15) {
    const suggestedDeadline = new Date(deadline);
    suggestedDeadline.setDate(suggestedDeadline.getDate() + Math.ceil(progressGap / 2)); // Extender proporcionalmente
    suggestions.push({
      id: `micro-action-${objective.id}-extend-deadline-${Date.now()}`,
      objectiveId: objective.id,
      type: 'extend_deadline',
      title: 'Extender fecha límite',
      description: `Extender la fecha límite de ${deadline.toLocaleDateString('es-ES')} a ${suggestedDeadline.toLocaleDateString('es-ES')}`,
      rationale: `Con ${daysRemaining} días restantes y un progreso del ${objective.progress.toFixed(1)}%, extender la fecha límite en ${Math.ceil(progressGap / 2)} días daría más tiempo para alcanzar el objetivo sin comprometer la calidad.`,
      priority: 'medium',
      estimatedImpact: 'medium',
      confidence: 70,
      suggestedValues: {
        newDeadline: suggestedDeadline.toISOString().split('T')[0],
      },
      createdAt: new Date().toISOString(),
    });
  }
  
  // Sugerencia 3: Aumentar recursos si el progreso es lento
  if (currentDailyVelocity > 0 && dailyVelocityNeeded > currentDailyVelocity * 1.5) {
    const resourceIncrease = Math.round(((dailyVelocityNeeded / currentDailyVelocity) - 1) * 100);
    suggestions.push({
      id: `micro-action-${objective.id}-increase-resources-${Date.now()}`,
      objectiveId: objective.id,
      type: 'increase_resources',
      title: 'Aumentar recursos asignados',
      description: `Aumentar los recursos asignados al objetivo en aproximadamente ${resourceIncrease}%`,
      rationale: `El ritmo actual de ${currentDailyVelocity.toFixed(2)} ${objective.unit}/día es insuficiente para alcanzar el objetivo. Se necesita un ritmo de ${dailyVelocityNeeded.toFixed(2)} ${objective.unit}/día, lo que sugiere aumentar los recursos asignados en aproximadamente ${resourceIncrease}% para acelerar el progreso.`,
      priority: 'high',
      estimatedImpact: 'high',
      confidence: 80,
      suggestedValues: {
        resourceIncrease: Math.min(resourceIncrease, 100), // Máximo 100%
      },
      createdAt: new Date().toISOString(),
    });
  }
  
  // Sugerencia 4: Agregar checkpoint intermedio
  if (daysRemaining > 14 && objective.progress < expectedProgress) {
    const checkpointDate = new Date(now);
    checkpointDate.setDate(checkpointDate.getDate() + Math.ceil(daysRemaining / 2));
    suggestions.push({
      id: `micro-action-${objective.id}-add-checkpoint-${Date.now()}`,
      objectiveId: objective.id,
      type: 'add_checkpoint',
      title: 'Agregar checkpoint intermedio',
      description: `Agregar un checkpoint intermedio el ${checkpointDate.toLocaleDateString('es-ES')} para revisar el progreso`,
      rationale: `Agregar un checkpoint intermedio ayudaría a monitorear el progreso más de cerca y permitiría hacer ajustes oportunos si es necesario. El checkpoint sugerido está a mitad del tiempo restante.`,
      priority: 'medium',
      estimatedImpact: 'medium',
      confidence: 65,
      suggestedValues: {
        checkpointDate: checkpointDate.toISOString().split('T')[0],
      },
      createdAt: new Date().toISOString(),
    });
  }
  
  // Sugerencia 5: Cambiar estrategia si el progreso está estancado
  if (objective.progress < 30 && elapsedDays > totalDays * 0.3) {
    suggestions.push({
      id: `micro-action-${objective.id}-change-strategy-${Date.now()}`,
      objectiveId: objective.id,
      type: 'change_strategy',
      title: 'Revisar y ajustar estrategia',
      description: 'Revisar la estrategia actual y considerar enfoques alternativos',
      rationale: `El objetivo está al ${objective.progress.toFixed(1)}% después del ${((elapsedDays / totalDays) * 100).toFixed(0)}% del tiempo transcurrido. Esto sugiere que la estrategia actual puede no ser efectiva. Considera revisar el enfoque y explorar alternativas.`,
      priority: 'high',
      estimatedImpact: 'high',
      confidence: 70,
      createdAt: new Date().toISOString(),
    });
  }
  
  // Sugerencia 6: Dividir objetivo en sub-objetivos más pequeños
  if (objective.progress < 40 && remainingValue > objective.targetValue * 0.6) {
    suggestions.push({
      id: `micro-action-${objective.id}-break-down-${Date.now()}`,
      objectiveId: objective.id,
      type: 'break_down',
      title: 'Dividir objetivo en sub-objetivos',
      description: 'Dividir el objetivo en sub-objetivos más pequeños y manejables',
      rationale: `El objetivo grande puede ser abrumador. Dividirlo en sub-objetivos más pequeños facilitaría el seguimiento y aumentaría la probabilidad de éxito. Por ejemplo, podrías dividir el objetivo de ${objective.targetValue} ${objective.unit} en 3-4 hitos intermedios.`,
      priority: 'medium',
      estimatedImpact: 'medium',
      confidence: 75,
      createdAt: new Date().toISOString(),
    });
  }
  
  return suggestions;
};

/**
 * User Story 2: Obtiene las sugerencias de micro-acciones para un objetivo
 */
export const getMicroActionSuggestions = async (objectiveId: string): Promise<AIMicroActionSuggestion[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const savedObjectives = localStorage.getItem('objectives-data');
  const objectives = savedObjectives ? JSON.parse(savedObjectives) : [];
  
  const objective = objectives.find((obj: Objective) => obj.id === objectiveId);
  if (!objective) return [];
  
  // Si ya hay sugerencias guardadas y no están aplicadas, devolverlas
  if (objective.aiMicroActionSuggestions && objective.aiMicroActionSuggestions.length > 0) {
    const activeSuggestions = objective.aiMicroActionSuggestions.filter(s => !s.applied);
    if (activeSuggestions.length > 0) {
      return activeSuggestions;
    }
  }
  
  // Generar nuevas sugerencias si el objetivo está en riesgo
  if (objective.status === 'at_risk' || objective.progress < 50) {
    const suggestions = await generateMicroActionSuggestions(objective);
    
    // Guardar sugerencias en el objetivo
    if (!objective.aiMicroActionSuggestions) {
      objective.aiMicroActionSuggestions = [];
    }
    objective.aiMicroActionSuggestions.push(...suggestions);
    
    const index = objectives.findIndex((obj: Objective) => obj.id === objectiveId);
    objectives[index] = objective;
    localStorage.setItem('objectives-data', JSON.stringify(objectives));
    
    return suggestions;
  }
  
  return [];
};

/**
 * User Story 2: Marca una sugerencia de micro-acción como aplicada
 */
export const applyMicroActionSuggestion = async (
  objectiveId: string,
  suggestionId: string,
  appliedBy?: string
): Promise<Objective> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const savedObjectives = localStorage.getItem('objectives-data');
  const objectives = savedObjectives ? JSON.parse(savedObjectives) : [];
  
  const objective = objectives.find((obj: Objective) => obj.id === objectiveId);
  if (!objective || !objective.aiMicroActionSuggestions) {
    throw new Error('Objective or suggestions not found');
  }
  
  const suggestion = objective.aiMicroActionSuggestions.find(s => s.id === suggestionId);
  if (!suggestion) {
    throw new Error('Suggestion not found');
  }
  
  // Marcar como aplicada
  suggestion.applied = true;
  suggestion.appliedAt = new Date().toISOString();
  suggestion.appliedBy = appliedBy || 'user';
  
  // Aplicar los valores sugeridos según el tipo
  if (suggestion.suggestedValues) {
    if (suggestion.type === 'adjust_target' && suggestion.suggestedValues.newTargetValue) {
      objective.targetValue = suggestion.suggestedValues.newTargetValue;
      objective.progress = Math.min((objective.currentValue / objective.targetValue) * 100, 100);
    } else if (suggestion.type === 'extend_deadline' && suggestion.suggestedValues.newDeadline) {
      objective.deadline = suggestion.suggestedValues.newDeadline;
    } else if (suggestion.type === 'reassign' && suggestion.suggestedValues.newResponsible) {
      objective.responsible = suggestion.suggestedValues.newResponsible;
    }
  }
  
  objective.updatedAt = new Date().toISOString();
  
  const index = objectives.findIndex((obj: Objective) => obj.id === objectiveId);
  objectives[index] = objective;
  localStorage.setItem('objectives-data', JSON.stringify(objectives));
  
  return objective;
};

/**
 * User Story: Analiza diferencias significativas y posibles causas usando IA
 */
export const analyzeSignificantDifferences = async (
  role: 'entrenador' | 'gimnasio',
  currentPeriod: string,
  previousPeriod: string,
  comparisonData: ComparisonData
): Promise<AIComparisonAnalysis> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const significantDifferences: SignificantDifference[] = [];
  const keyInsights: string[] = [];
  const riskAreas: string[] = [];
  const opportunities: string[] = [];
  
  // Umbral para considerar una diferencia como significativa
  const significanceThreshold = 10; // 10% de cambio
  
  for (const change of comparisonData.changes) {
    const absChangePercent = Math.abs(change.changePercent);
    const isSignificant = absChangePercent >= significanceThreshold;
    
    if (!isSignificant) continue;
    
    // Determinar nivel de significancia
    let significance: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (absChangePercent >= 50) significance = 'critical';
    else if (absChangePercent >= 30) significance = 'high';
    else if (absChangePercent >= 15) significance = 'medium';
    
    // Generar posibles causas basadas en el tipo de métrica y el cambio
    const possibleCauses = generatePossibleCauses(change, role, significance);
    
    // Calcular significancia estadística (simulada)
    const statisticalSignificance = Math.min(70 + (absChangePercent / 2), 95);
    
    // Generar explicación de IA
    const aiExplanation = generateAIExplanation(change, role, significance, possibleCauses);
    
    // Generar recomendación
    const recommendation = generateRecommendation(change, role, significance);
    
    // Determinar contexto
    const metric = comparisonData.currentPeriod.metrics.find(m => m.name === change.metric);
    const context = {
      historicalAverage: metric?.previousValue || change.previous,
      trend: change.changePercent > 0 ? 'increasing' as const : 'decreasing' as const,
      seasonality: false,
    };
    
    const significantDiff: SignificantDifference = {
      id: `diff-${change.metric}-${Date.now()}`,
      metric: change.metric.toLowerCase().replace(/\s+/g, '_'),
      metricName: change.metric,
      currentValue: change.current,
      previousValue: change.previous,
      difference: change.change,
      differencePercent: change.changePercent,
      significance,
      isSignificant: true,
      statisticalSignificance,
      possibleCauses,
      aiExplanation,
      recommendation,
      context,
    };
    
    significantDifferences.push(significantDiff);
    
    // Agregar a insights, riesgos u oportunidades
    if (change.changePercent > 0) {
      if (change.metric.toLowerCase().includes('bajas') || change.metric.toLowerCase().includes('tasa')) {
        riskAreas.push(`${change.metric} ha aumentado un ${change.changePercent.toFixed(1)}%`);
      } else {
        opportunities.push(`${change.metric} ha mejorado un ${change.changePercent.toFixed(1)}%`);
        keyInsights.push(`Crecimiento positivo en ${change.metric}: ${change.changePercent.toFixed(1)}%`);
      }
    } else {
      if (change.metric.toLowerCase().includes('bajas') || change.metric.toLowerCase().includes('tasa')) {
        opportunities.push(`${change.metric} ha disminuido un ${Math.abs(change.changePercent).toFixed(1)}%`);
      } else {
        riskAreas.push(`${change.metric} ha disminuido un ${Math.abs(change.changePercent).toFixed(1)}%`);
        keyInsights.push(`Reducción en ${change.metric}: ${change.changePercent.toFixed(1)}%`);
      }
    }
  }
  
  // Generar resumen general
  const overallSummary = generateOverallSummary(significantDifferences, role);
  
  return {
    id: `analysis-${currentPeriod}-${previousPeriod}-${Date.now()}`,
    currentPeriod,
    previousPeriod,
    significantDifferences,
    overallSummary,
    keyInsights,
    riskAreas,
    opportunities,
    generatedAt: new Date().toISOString(),
    confidence: significantDifferences.length > 0 ? 85 : 70,
  };
};

/**
 * Genera posibles causas para un cambio significativo
 */
function generatePossibleCauses(
  change: { metric: string; current: number; previous: number; change: number; changePercent: number },
  role: 'entrenador' | 'gimnasio',
  significance: 'low' | 'medium' | 'high' | 'critical'
): PossibleCause[] {
  const causes: PossibleCause[] = [];
  const metricLower = change.metric.toLowerCase();
  const isPositive = change.changePercent > 0;
  
  // Causas comunes según el tipo de métrica
  if (metricLower.includes('facturación') || metricLower.includes('facturacion')) {
    if (isPositive) {
      causes.push({
        id: 'cause-1',
        cause: 'Aumento en volumen de clientes',
        description: 'El incremento en facturación puede deberse a un mayor número de clientes activos o sesiones realizadas.',
        likelihood: 'high',
        confidence: 75,
        evidence: `El cambio del ${change.changePercent.toFixed(1)}% es consistente con un crecimiento en la base de clientes.`,
        impact: 'high',
      });
      causes.push({
        id: 'cause-2',
        cause: 'Mejora en precios o servicios premium',
        description: 'Posible aumento en el ticket promedio por cliente o introducción de servicios de mayor valor.',
        likelihood: 'medium',
        confidence: 60,
        impact: 'medium',
      });
    } else {
      causes.push({
        id: 'cause-1',
        cause: 'Reducción en volumen de clientes',
        description: 'La disminución puede estar relacionada con pérdida de clientes o reducción en frecuencia de sesiones.',
        likelihood: 'high',
        confidence: 80,
        evidence: `La caída del ${Math.abs(change.changePercent).toFixed(1)}% sugiere una reducción en actividad.`,
        impact: 'high',
      });
      causes.push({
        id: 'cause-2',
        cause: 'Factores estacionales',
        description: 'Posible impacto de temporadas bajas o períodos vacacionales.',
        likelihood: 'medium',
        confidence: 55,
        impact: 'medium',
      });
    }
  } else if (metricLower.includes('retención') || metricLower.includes('retencion')) {
    if (isPositive) {
      causes.push({
        id: 'cause-1',
        cause: 'Mejora en satisfacción del cliente',
        description: 'Los clientes están más satisfechos con el servicio, lo que aumenta la retención.',
        likelihood: 'high',
        confidence: 70,
        impact: 'high',
      });
      causes.push({
        id: 'cause-2',
        cause: 'Programas de fidelización efectivos',
        description: 'Las estrategias de retención implementadas están dando resultados positivos.',
        likelihood: 'medium',
        confidence: 65,
        impact: 'medium',
      });
    } else {
      causes.push({
        id: 'cause-1',
        cause: 'Problemas en la experiencia del cliente',
        description: 'Posibles problemas en la calidad del servicio o atención al cliente.',
        likelihood: 'high',
        confidence: 75,
        evidence: `La reducción del ${Math.abs(change.changePercent).toFixed(1)}% requiere investigación inmediata.`,
        impact: 'critical',
      });
      causes.push({
        id: 'cause-2',
        cause: 'Competencia más agresiva',
        description: 'La competencia puede estar ofreciendo mejores condiciones o servicios.',
        likelihood: 'medium',
        confidence: 60,
        impact: 'high',
      });
    }
  } else if (metricLower.includes('adherencia')) {
    if (isPositive) {
      causes.push({
        id: 'cause-1',
        cause: 'Mejora en programas de seguimiento',
        description: 'Los programas de seguimiento y motivación están siendo más efectivos.',
        likelihood: 'high',
        confidence: 70,
        impact: 'high',
      });
    } else {
      causes.push({
        id: 'cause-1',
        cause: 'Falta de engagement',
        description: 'Los clientes pueden estar perdiendo motivación o encontrando barreras para asistir.',
        likelihood: 'high',
        confidence: 75,
        impact: 'high',
      });
    }
  } else if (metricLower.includes('bajas') || metricLower.includes('tasa')) {
    if (!isPositive) { // Para tasa de bajas, menos es mejor
      causes.push({
        id: 'cause-1',
        cause: 'Mejora en retención',
        description: 'Las estrategias de retención están funcionando, reduciendo las bajas.',
        likelihood: 'high',
        confidence: 75,
        impact: 'high',
      });
    } else {
      causes.push({
        id: 'cause-1',
        cause: 'Problemas en satisfacción',
        description: 'Aumento en insatisfacción que está llevando a más cancelaciones.',
        likelihood: 'high',
        confidence: 80,
        evidence: `El aumento del ${change.changePercent.toFixed(1)}% en bajas es crítico y requiere acción inmediata.`,
        impact: 'critical',
      });
    }
  } else {
    // Causas genéricas
    causes.push({
      id: 'cause-1',
      cause: isPositive ? 'Factores operativos positivos' : 'Factores operativos negativos',
      description: `Cambios en las operaciones que están ${isPositive ? 'mejorando' : 'afectando'} esta métrica.`,
      likelihood: 'medium',
      confidence: 60,
      impact: 'medium',
    });
    causes.push({
      id: 'cause-2',
      cause: 'Factores externos',
      description: 'Influencia de factores externos como economía, competencia o tendencias del mercado.',
      likelihood: 'low',
      confidence: 50,
      impact: 'medium',
    });
  }
  
  return causes;
}

/**
 * Genera explicación de IA para un cambio significativo
 */
function generateAIExplanation(
  change: { metric: string; current: number; previous: number; change: number; changePercent: number },
  role: 'entrenador' | 'gimnasio',
  significance: 'low' | 'medium' | 'high' | 'critical',
  causes: PossibleCause[]
): string {
  const isPositive = change.changePercent > 0;
  const metricLower = change.metric.toLowerCase();
  
  let explanation = `${change.metric} ha ${isPositive ? 'aumentado' : 'disminuido'} un ${Math.abs(change.changePercent).toFixed(1)}% `;
  explanation += `(de ${change.previous.toFixed(2)} a ${change.current.toFixed(2)}). `;
  
  if (significance === 'critical') {
    explanation += `Este cambio es CRÍTICO y requiere atención inmediata. `;
  } else if (significance === 'high') {
    explanation += `Este cambio es significativo y merece análisis detallado. `;
  } else {
    explanation += `Este cambio es notable y debe ser monitoreado. `;
  }
  
  if (causes.length > 0) {
    const topCause = causes[0];
    explanation += `La causa más probable es: ${topCause.cause}. ${topCause.description} `;
    
    if (topCause.evidence) {
      explanation += topCause.evidence;
    }
  }
  
  // Advertencia sobre interpretaciones erróneas
  if (metricLower.includes('bajas') || metricLower.includes('tasa')) {
    explanation += ` Nota importante: Para esta métrica, ${isPositive ? 'un aumento es negativo' : 'una disminución es positiva'}. `;
  }
  
  return explanation;
}

/**
 * Genera recomendación basada en el cambio
 */
function generateRecommendation(
  change: { metric: string; current: number; previous: number; change: number; changePercent: number },
  role: 'entrenador' | 'gimnasio',
  significance: 'low' | 'medium' | 'high' | 'critical'
): string {
  const isPositive = change.changePercent > 0;
  const metricLower = change.metric.toLowerCase();
  const isNegativeMetric = metricLower.includes('bajas') || metricLower.includes('tasa');
  
  if (isNegativeMetric) {
    // Para métricas negativas (bajas, tasa), menos es mejor
    if (isPositive) {
      return `Acción urgente requerida: Investigar las causas del aumento en ${change.metric} y implementar estrategias de retención inmediatas.`;
    } else {
      return `Excelente progreso: Mantener las estrategias actuales que están reduciendo ${change.metric}. Considerar replicar estas prácticas en otras áreas.`;
    }
  } else {
    // Para métricas positivas, más es mejor
    if (isPositive) {
      return `Excelente resultado: Analizar qué factores han contribuido al crecimiento en ${change.metric} y replicarlos en otras áreas.`;
    } else {
      if (significance === 'critical') {
        return `Acción inmediata requerida: Investigar las causas de la caída en ${change.metric} y desarrollar un plan de recuperación urgente.`;
      } else {
        return `Atención necesaria: Revisar las estrategias relacionadas con ${change.metric} y considerar ajustes para revertir la tendencia.`;
      }
    }
  }
}

/**
 * Genera resumen general del análisis
 */
function generateOverallSummary(
  differences: SignificantDifference[],
  role: 'entrenador' | 'gimnasio'
): string {
  if (differences.length === 0) {
    return 'No se detectaron diferencias significativas entre los períodos comparados. Los cambios observados están dentro de rangos normales.';
  }
  
  const critical = differences.filter(d => d.significance === 'critical').length;
  const high = differences.filter(d => d.significance === 'high').length;
  const positive = differences.filter(d => d.differencePercent > 0).length;
  const negative = differences.filter(d => d.differencePercent < 0).length;
  
  let summary = `Se detectaron ${differences.length} diferencia${differences.length > 1 ? 's' : ''} significativa${differences.length > 1 ? 's' : ''} entre los períodos. `;
  
  if (critical > 0) {
    summary += `${critical} ${critical > 1 ? 'son críticas' : 'es crítica'} y requieren atención inmediata. `;
  }
  
  if (high > 0) {
    summary += `${high} ${high > 1 ? 'son de alta significancia' : 'es de alta significancia'}. `;
  }
  
  summary += `${positive} métrica${positive > 1 ? 's muestran' : ' muestra'} tendencia positiva, mientras que ${negative} ${negative > 1 ? 'muestran' : 'muestra'} tendencia negativa. `;
  
  summary += 'Se recomienda revisar las causas identificadas para cada diferencia y tomar acciones apropiadas.';
  
  return summary;
}

