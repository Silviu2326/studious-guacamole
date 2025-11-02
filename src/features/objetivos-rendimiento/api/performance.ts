import { PerformanceData, Metric, ComparisonData } from '../types';

const generateMetrics = (role: 'entrenador' | 'gimnasio'): Metric[] => {
  if (role === 'entrenador') {
    return [
      {
        id: 'facturacion',
        name: 'Facturación Personal',
        value: 35000,
        unit: '€',
        trend: {
          value: 5.2,
          direction: 'up',
          period: 'vs mes anterior',
        },
        target: 50000,
        category: 'financiero',
      },
      {
        id: 'adherencia',
        name: 'Adherencia de Clientes',
        value: 75,
        unit: '%',
        trend: {
          value: 3.1,
          direction: 'up',
          period: 'vs mes anterior',
        },
        target: 80,
        category: 'operacional',
      },
      {
        id: 'retencion',
        name: 'Retención de Clientes',
        value: 85,
        unit: '%',
        trend: {
          value: -2.3,
          direction: 'down',
          period: 'vs mes anterior',
        },
        target: 90,
        category: 'operacional',
      },
      {
        id: 'clientes_activos',
        name: 'Clientes Activos',
        value: 24,
        unit: 'clientes',
        trend: {
          value: 8.7,
          direction: 'up',
          period: 'vs mes anterior',
        },
        category: 'operacional',
      },
    ];
  } else {
    return [
      {
        id: 'facturacion',
        name: 'Facturación Total',
        value: 250000,
        unit: '€',
        trend: {
          value: 12.5,
          direction: 'up',
          period: 'vs mes anterior',
        },
        target: 300000,
        category: 'financiero',
      },
      {
        id: 'ocupacion',
        name: 'Ocupación Media',
        value: 65,
        unit: '%',
        trend: {
          value: 4.2,
          direction: 'up',
          period: 'vs mes anterior',
        },
        target: 75,
        category: 'operacional',
      },
      {
        id: 'tasa_bajas',
        name: 'Tasa de Bajas',
        value: 8,
        unit: '%',
        trend: {
          value: -1.5,
          direction: 'down',
          period: 'vs mes anterior',
        },
        target: 5,
        category: 'operacional',
      },
      {
        id: 'socios_activos',
        name: 'Socios Activos',
        value: 450,
        unit: 'socios',
        trend: {
          value: 15.3,
          direction: 'up',
          period: 'vs mes anterior',
        },
        category: 'operacional',
      },
    ];
  }
};

export const getPerformanceMetrics = async (role: 'entrenador' | 'gimnasio', period: string = 'month'): Promise<Metric[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return generateMetrics(role);
};

export const getPerformanceDashboard = async (role: 'entrenador' | 'gimnasio', period: string = 'month'): Promise<PerformanceData> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const metrics = generateMetrics(role);
  
  // Simular objetivos
  const objectives = [
    {
      id: '1',
      title: role === 'entrenador' ? 'Facturación Mensual' : 'Objetivos Comerciales',
      metric: 'facturacion',
      targetValue: role === 'entrenador' ? 50000 : 300000,
      currentValue: role === 'entrenador' ? 35000 : 250000,
      unit: '€',
      deadline: '2024-12-31',
      status: 'in_progress' as const,
      category: 'financiero',
      progress: role === 'entrenador' ? 70 : 83,
      createdAt: '2024-01-01',
      updatedAt: '2024-11-15',
    },
  ];
  
  return {
    period,
    metrics,
    objectives,
    summary: {
      totalObjectives: 5,
      achievedObjectives: 2,
      inProgressObjectives: 2,
      atRiskObjectives: 1,
    },
  };
};

export const comparePerformance = async (
  role: 'entrenador' | 'gimnasio',
  currentPeriod: string,
  previousPeriod: string
): Promise<ComparisonData> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const currentMetrics = generateMetrics(role);
  const previousMetrics = generateMetrics(role).map(m => ({
    ...m,
    value: m.value * 0.95, // Simular valores anteriores
  }));
  
  const changes = currentMetrics.map((current, index) => {
    const previous = previousMetrics[index];
    const change = current.value - previous.value;
    const changePercent = previous.value > 0 ? (change / previous.value) * 100 : 0;
    
    return {
      metric: current.name,
      current: current.value,
      previous: previous.value,
      change,
      changePercent,
    };
  });
  
  return {
    currentPeriod: {
      period: currentPeriod,
      metrics: currentMetrics,
      objectives: [],
      summary: {
        totalObjectives: 5,
        achievedObjectives: 2,
        inProgressObjectives: 2,
        atRiskObjectives: 1,
      },
    },
    previousPeriod: {
      period: previousPeriod,
      metrics: previousMetrics,
      objectives: [],
      summary: {
        totalObjectives: 5,
        achievedObjectives: 1,
        inProgressObjectives: 3,
        atRiskObjectives: 1,
      },
    },
    changes,
  };
};

