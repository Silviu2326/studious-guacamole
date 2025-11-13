import { UnitComparisonData, ComparisonUnitType, ComparisonOpportunity, PerformanceData } from '../types';
import { getObjectives } from './objectives';
import { getPerformanceMetrics } from './performance';

/**
 * Obtiene datos de rendimiento para una unidad específica
 */
const getUnitPerformanceData = async (
  role: 'entrenador' | 'gimnasio',
  unitType: ComparisonUnitType,
  unitId: string,
  period: string
): Promise<PerformanceData> => {
  // Filtrar objetivos por unidad
  const filters: any = {};
  
  if (unitType === 'team') {
    filters.equipo = unitId;
  } else if (unitType === 'site') {
    filters.sede = unitId;
  } else if (unitType === 'responsible') {
    filters.responsible = unitId;
  }
  
  const objectives = await getObjectives(filters, role);
  const metrics = await getPerformanceMetrics(role, period);
  
  // Filtrar métricas por unidad si es necesario
  const filteredMetrics = metrics.filter(metric => {
    if (unitType === 'team' && metric.segmento) {
      return metric.segmento === unitId;
    }
    if (unitType === 'responsible' && metric.responsable) {
      return metric.responsable === unitId;
    }
    return true;
  });
  
  return {
    period,
    metrics: filteredMetrics,
    objectives,
    summary: {
      totalObjectives: objectives.length,
      achievedObjectives: objectives.filter(obj => obj.status === 'achieved').length,
      inProgressObjectives: objectives.filter(obj => obj.status === 'in_progress').length,
      atRiskObjectives: objectives.filter(obj => obj.status === 'at_risk').length,
    },
  };
};

/**
 * Detecta oportunidades de mejora basadas en la comparación
 */
const detectOpportunities = (
  unit1Data: PerformanceData,
  unit2Data: PerformanceData,
  unit1Name: string,
  unit2Name: string
): ComparisonOpportunity[] => {
  const opportunities: ComparisonOpportunity[] = [];
  
  // Comparar métricas
  const unit1Metrics = new Map(unit1Data.metrics.map(m => [m.name, m.value]));
  const unit2Metrics = new Map(unit2Data.metrics.map(m => [m.name, m.value]));
  
  // Encontrar métricas comunes
  const commonMetrics = Array.from(unit1Metrics.keys()).filter(name => unit2Metrics.has(name));
  
  for (const metricName of commonMetrics) {
    const unit1Value = unit1Metrics.get(metricName)!;
    const unit2Value = unit2Metrics.get(metricName)!;
    const difference = unit2Value - unit1Value;
    const differencePercent = unit1Value > 0 ? (difference / unit1Value) * 100 : 0;
    
    // Si la diferencia es significativa (>10%), crear una oportunidad
    if (Math.abs(differencePercent) > 10) {
      const betterUnit = difference > 0 ? unit2Name : unit1Name;
      const worseUnit = difference > 0 ? unit1Name : unit2Name;
      const betterValue = difference > 0 ? unit2Value : unit1Value;
      const worseValue = difference > 0 ? unit1Value : unit2Value;
      
      opportunities.push({
        id: `opp-${metricName}-${Date.now()}`,
        type: difference > 0 ? 'best_practice' : 'performance_gap',
        title: `${betterUnit} supera a ${worseUnit} en ${metricName}`,
        description: `${betterUnit} tiene un ${Math.abs(differencePercent).toFixed(1)}% mejor rendimiento en ${metricName} (${betterValue.toFixed(2)} vs ${worseValue.toFixed(2)})`,
        metric: metricName,
        unit1Value: unit1Value,
        unit2Value: unit2Value,
        recommendation: `Analizar las prácticas de ${betterUnit} y considerar replicarlas en ${worseUnit} para mejorar el rendimiento en ${metricName}`,
        estimatedImpact: Math.abs(differencePercent) > 30 ? 'high' : Math.abs(differencePercent) > 20 ? 'medium' : 'low',
        priority: Math.abs(differencePercent) > 30 ? 'high' : Math.abs(differencePercent) > 20 ? 'medium' : 'low',
      });
    }
  }
  
  // Comparar objetivos
  const unit1Objectives = unit1Data.objectives;
  const unit2Objectives = unit2Data.objectives;
  
  // Oportunidad: Si una unidad tiene más objetivos logrados
  const unit1Achieved = unit1Objectives.filter(obj => obj.status === 'achieved').length;
  const unit2Achieved = unit2Objectives.filter(obj => obj.status === 'achieved').length;
  
  if (Math.abs(unit1Achieved - unit2Achieved) > 0) {
    const betterUnit = unit2Achieved > unit1Achieved ? unit2Name : unit1Name;
    const worseUnit = unit2Achieved > unit1Achieved ? unit1Name : unit2Name;
    const betterCount = Math.max(unit1Achieved, unit2Achieved);
    const worseCount = Math.min(unit1Achieved, unit2Achieved);
    
    opportunities.push({
      id: `opp-objectives-${Date.now()}`,
      type: 'best_practice',
      title: `${betterUnit} tiene mejor tasa de cumplimiento de objetivos`,
      description: `${betterUnit} ha logrado ${betterCount} objetivos mientras que ${worseUnit} ha logrado ${worseCount}`,
      metric: 'Objetivos Logrados',
      unit1Value: unit1Achieved,
      unit2Value: unit2Achieved,
      recommendation: `Revisar la estrategia y procesos de ${betterUnit} para identificar mejores prácticas que puedan aplicarse en ${worseUnit}`,
      estimatedImpact: 'medium',
      priority: 'medium',
    });
  }
  
  return opportunities;
};

/**
 * Obtiene comparación entre dos unidades
 */
export const getUnitComparison = async (
  role: 'entrenador' | 'gimnasio',
  unitType: ComparisonUnitType,
  unit1Id: string,
  unit2Id: string,
  period: string
): Promise<UnitComparisonData> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Obtener nombres de unidades (en producción vendría de una API)
  const getUnitName = (id: string, type: ComparisonUnitType): string => {
    if (type === 'team') {
      const teams: Record<string, string> = {
        'team-1': 'Equipo A',
        'team-2': 'Equipo B',
        'team-3': 'Equipo C',
      };
      return teams[id] || `Equipo ${id}`;
    } else if (type === 'site') {
      const sites: Record<string, string> = {
        'site-1': 'Sede 1',
        'site-2': 'Sede 2',
        'site-3': 'Sede 3',
      };
      return sites[id] || `Sede ${id}`;
    }
    return `Unidad ${id}`;
  };
  
  const unit1Name = getUnitName(unit1Id, unitType);
  const unit2Name = getUnitName(unit2Id, unitType);
  
  // Obtener datos de rendimiento para ambas unidades
  const [unit1Data, unit2Data] = await Promise.all([
    getUnitPerformanceData(role, unitType, unit1Id, period),
    getUnitPerformanceData(role, unitType, unit2Id, period),
  ]);
  
  // Comparar métricas comunes
  const unit1Metrics = new Map(unit1Data.metrics.map(m => [m.name, m.value]));
  const unit2Metrics = new Map(unit2Data.metrics.map(m => [m.name, m.value]));
  const commonMetrics = Array.from(unit1Metrics.keys()).filter(name => unit2Metrics.has(name));
  
  const changes = commonMetrics.map(metricName => {
    const unit1Value = unit1Metrics.get(metricName)!;
    const unit2Value = unit2Metrics.get(metricName)!;
    const difference = unit2Value - unit1Value;
    const differencePercent = unit1Value > 0 ? (difference / unit1Value) * 100 : 0;
    
    return {
      metric: metricName,
      unit1Value,
      unit2Value,
      difference,
      differencePercent,
      winner: difference > 0 ? 'unit2' as const : difference < 0 ? 'unit1' as const : 'tie' as const,
    };
  });
  
  // Detectar oportunidades
  const opportunities = detectOpportunities(unit1Data, unit2Data, unit1Name, unit2Name);
  
  return {
    unitType,
    unit1: {
      id: unit1Id,
      name: unit1Name,
      data: unit1Data,
    },
    unit2: {
      id: unit2Id,
      name: unit2Name,
      data: unit2Data,
    },
    period,
    changes,
    opportunities,
  };
};

