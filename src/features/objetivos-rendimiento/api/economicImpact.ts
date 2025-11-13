import { Objective, EconomicImpact, OperationalImpact } from '../types';

const STORAGE_KEY_ECONOMIC_IMPACT = 'objectives-economic-impact';
const STORAGE_KEY_OPERATIONAL_IMPACT = 'objectives-operational-impact';

/**
 * User Story 1: Obtener impacto económico de un objetivo
 */
export const getEconomicImpact = async (objectiveId: string): Promise<EconomicImpact | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const saved = localStorage.getItem(STORAGE_KEY_ECONOMIC_IMPACT);
  const impacts: Record<string, EconomicImpact> = saved ? JSON.parse(saved) : {};
  
  return impacts[objectiveId] || null;
};

/**
 * User Story 1: Calcular impacto económico de un objetivo
 */
export const calculateEconomicImpact = async (objective: Objective): Promise<EconomicImpact> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simular cálculo basado en el objetivo
  const now = new Date();
  const deadline = new Date(objective.deadline);
  const createdAt = new Date(objective.createdAt);
  const daysElapsed = Math.ceil((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
  const totalDays = Math.ceil((deadline.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
  const progressRatio = objective.progress / 100;
  
  // Calcular inversión (simulado basado en el tipo de objetivo)
  let investment = 0;
  const investmentBreakdown = {
    resources: 0,
    tools: 0,
    marketing: 0,
    other: 0,
  };
  
  if (objective.category === 'financiero') {
    investment = objective.targetValue * 0.1; // 10% del target como inversión
    investmentBreakdown.resources = investment * 0.4;
    investmentBreakdown.tools = investment * 0.2;
    investmentBreakdown.marketing = investment * 0.3;
    investmentBreakdown.other = investment * 0.1;
  } else if (objective.category === 'operacional') {
    investment = objective.targetValue * 0.05; // 5% del target como inversión
    investmentBreakdown.resources = investment * 0.5;
    investmentBreakdown.tools = investment * 0.3;
    investmentBreakdown.other = investment * 0.2;
  } else {
    investment = objective.targetValue * 0.08;
    investmentBreakdown.resources = investment * 0.45;
    investmentBreakdown.tools = investment * 0.25;
    investmentBreakdown.marketing = investment * 0.2;
    investmentBreakdown.other = investment * 0.1;
  }
  
  // Calcular ingresos incrementales basados en el progreso
  let incrementalRevenue = 0;
  const revenueBreakdown = {
    newCustomers: 0,
    upsells: 0,
    retention: 0,
    other: 0,
  };
  
  if (objective.metric === 'facturacion' || objective.metric.includes('revenue') || objective.metric.includes('ingreso')) {
    // Para objetivos de facturación, el ingreso incremental es proporcional al progreso
    incrementalRevenue = objective.currentValue * progressRatio;
    revenueBreakdown.newCustomers = incrementalRevenue * 0.4;
    revenueBreakdown.upsells = incrementalRevenue * 0.3;
    revenueBreakdown.retention = incrementalRevenue * 0.2;
    revenueBreakdown.other = incrementalRevenue * 0.1;
  } else if (objective.metric === 'retencion' || objective.metric.includes('retention')) {
    // Para objetivos de retención, estimar ingresos por clientes retenidos
    const retainedCustomers = (objective.currentValue / 100) * 1000; // Asumir 1000 clientes base
    const avgRevenuePerCustomer = 50; // € por cliente/mes
    incrementalRevenue = retainedCustomers * avgRevenuePerCustomer * (daysElapsed / 30);
    revenueBreakdown.retention = incrementalRevenue * 0.8;
    revenueBreakdown.upsells = incrementalRevenue * 0.2;
  } else {
    // Para otros objetivos, estimar basado en el valor actual
    incrementalRevenue = objective.currentValue * 10 * progressRatio;
    revenueBreakdown.newCustomers = incrementalRevenue * 0.5;
    revenueBreakdown.other = incrementalRevenue * 0.5;
  }
  
  // Calcular ROI
  const roiAmount = incrementalRevenue - investment;
  const roi = investment > 0 ? (roiAmount / investment) * 100 : 0;
  
  // Calcular período de recuperación
  const monthlyRevenue = incrementalRevenue / (daysElapsed / 30);
  const paybackPeriod = monthlyRevenue > 0 ? (investment / monthlyRevenue) * 30 : undefined;
  
  // Proyecciones
  const projectedRevenue = incrementalRevenue / progressRatio;
  const projectedROI = investment > 0 ? ((projectedRevenue - investment) / investment) * 100 : 0;
  
  // Línea base (sin el objetivo)
  const baselineRevenue = incrementalRevenue * 0.7; // Asumir 70% sin el objetivo
  const revenueLift = baselineRevenue > 0 ? ((incrementalRevenue - baselineRevenue) / baselineRevenue) * 100 : 0;
  
  // Fecha de equilibrio
  const breakevenDate = paybackPeriod 
    ? new Date(now.getTime() + paybackPeriod * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    : undefined;
  
  const impact: EconomicImpact = {
    investment,
    investmentBreakdown,
    incrementalRevenue,
    revenueBreakdown,
    roi,
    roiAmount,
    paybackPeriod,
    breakevenDate,
    projectedRevenue,
    projectedROI,
    baselineRevenue,
    revenueLift,
    analysisPeriod: {
      startDate: objective.createdAt,
      endDate: now.toISOString().split('T')[0],
      period: totalDays <= 30 ? 'month' : totalDays <= 90 ? 'quarter' : 'year',
    },
    lastCalculated: now.toISOString(),
    calculatedBy: 'system',
  };
  
  // Guardar en localStorage
  const saved = localStorage.getItem(STORAGE_KEY_ECONOMIC_IMPACT);
  const impacts: Record<string, EconomicImpact> = saved ? JSON.parse(saved) : {};
  impacts[objective.id] = impact;
  localStorage.setItem(STORAGE_KEY_ECONOMIC_IMPACT, JSON.stringify(impacts));
  
  return impact;
};

/**
 * User Story 1: Obtener impacto operativo de un objetivo
 */
export const getOperationalImpact = async (objectiveId: string): Promise<OperationalImpact | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const saved = localStorage.getItem(STORAGE_KEY_OPERATIONAL_IMPACT);
  const impacts: Record<string, OperationalImpact> = saved ? JSON.parse(saved) : {};
  
  return impacts[objectiveId] || null;
};

/**
 * User Story 1: Calcular impacto operativo de un objetivo
 */
export const calculateOperationalImpact = async (objective: Objective): Promise<OperationalImpact> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const now = new Date();
  const createdAt = new Date(objective.createdAt);
  const daysElapsed = Math.ceil((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
  const progressRatio = objective.progress / 100;
  
  // Calcular clientes retenidos
  let retainedCustomers = 0;
  let retentionRate = 0;
  let retentionLift = 0;
  
  if (objective.metric === 'retencion' || objective.metric.includes('retention')) {
    const baseRetention = 70; // 70% retención base
    retentionRate = objective.currentValue;
    retentionLift = retentionRate - baseRetention;
    retainedCustomers = Math.round((retentionLift / 100) * 1000 * progressRatio); // Asumir 1000 clientes base
  } else if (objective.metric === 'adherencia' || objective.metric.includes('adherence')) {
    // Adherencia puede correlacionarse con retención
    const adherenceImpact = (objective.currentValue - 60) / 100; // Impacto sobre retención
    retentionRate = 70 + (adherenceImpact * 15); // Hasta 15% de mejora
    retentionLift = retentionRate - 70;
    retainedCustomers = Math.round((retentionLift / 100) * 1000 * progressRatio);
  } else {
    // Para otros objetivos, estimar retención basada en progreso
    retentionRate = 70 + (progressRatio * 10);
    retentionLift = progressRatio * 10;
    retainedCustomers = Math.round((retentionLift / 100) * 500 * progressRatio);
  }
  
  // Calcular ganancias de eficiencia
  const efficiencyGains = {
    timeSaved: Math.round(progressRatio * 40), // Horas ahorradas
    costReduction: Math.round(progressRatio * 5000), // Reducción de costos (€)
    productivityIncrease: Math.round(progressRatio * 15), // Incremento de productividad (%)
    processImprovement: `Mejoras en ${objective.category} mediante optimización de procesos`,
  };
  
  // Métricas operativas
  const operationalMetrics = [
    {
      metricName: 'Eficiencia',
      currentValue: 70 + (progressRatio * 20),
      baselineValue: 70,
      improvement: progressRatio * 20,
      unit: '%',
    },
    {
      metricName: 'Tiempo de respuesta',
      currentValue: 100 - (progressRatio * 30),
      baselineValue: 100,
      improvement: progressRatio * 30,
      unit: 'min',
    },
  ];
  
  // Impacto en satisfacción
  const satisfactionImpact = {
    customerSatisfaction: 75 + (progressRatio * 10),
    employeeSatisfaction: 70 + (progressRatio * 15),
    satisfactionLift: progressRatio * 12.5,
  };
  
  // Impacto en capacidad
  const capacityImpact = {
    capacityIncrease: Math.round(progressRatio * 25),
    scalabilityImprovement: 'Mejora en la capacidad de escalar operaciones',
  };
  
  const impact: OperationalImpact = {
    retainedCustomers,
    retentionRate,
    retentionLift,
    efficiencyGains,
    operationalMetrics,
    satisfactionImpact,
    capacityImpact,
    analysisPeriod: {
      startDate: objective.createdAt,
      endDate: now.toISOString().split('T')[0],
      period: daysElapsed <= 30 ? 'month' : daysElapsed <= 90 ? 'quarter' : 'year',
    },
    lastCalculated: now.toISOString(),
    calculatedBy: 'system',
  };
  
  // Guardar en localStorage
  const saved = localStorage.getItem(STORAGE_KEY_OPERATIONAL_IMPACT);
  const impacts: Record<string, OperationalImpact> = saved ? JSON.parse(saved) : {};
  impacts[objective.id] = impact;
  localStorage.setItem(STORAGE_KEY_OPERATIONAL_IMPACT, JSON.stringify(impacts));
  
  return impact;
};

/**
 * User Story 1: Actualizar impacto económico y operativo de todos los objetivos
 */
export const refreshAllImpacts = async (objectives: Objective[]): Promise<void> => {
  await Promise.all(
    objectives.map(async (objective) => {
      await calculateEconomicImpact(objective);
      await calculateOperationalImpact(objective);
    })
  );
};

