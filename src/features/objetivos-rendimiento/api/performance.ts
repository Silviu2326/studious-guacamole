import { PerformanceData, Metric, ComparisonData, ComparePeriodsParams, ObjectiveStatus, ObjectiveType, Alert, ObjectiveAlertType, AlertType, AlertSeverity } from '../types';

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

/**
 * Genera series temporales mock para gráficos
 * 
 * En producción, estos datos se obtendrían de:
 * - Tabla de facturación (billing/invoices): SUM(amount) GROUP BY date
 * - Tabla de clientes (clients/members): COUNT(*) WHERE active = true GROUP BY date
 * - Tabla de retención (retention_metrics): calculado desde contratos y bajas
 * 
 * @param role - Rol del usuario
 * @param days - Número de días a generar
 * @param baseValue - Valor base para la serie
 * @returns Array de valores numéricos para la serie temporal
 */
const generateTimeSeries = (
  role: 'entrenador' | 'gimnasio',
  days: number,
  baseValue: number,
  trend: 'up' | 'down' | 'stable' = 'up'
): number[] => {
  const series: number[] = [];
  const trendMultiplier = trend === 'up' ? 1.02 : trend === 'down' ? 0.98 : 1;
  const volatility = baseValue * 0.1; // 10% de variabilidad
  
  for (let i = 0; i < days; i++) {
    // Simular tendencia con variación aleatoria
    const trendValue = baseValue * Math.pow(trendMultiplier, i / 7); // Ajuste semanal
    const randomVariation = (Math.random() - 0.5) * volatility;
    const value = Math.max(0, trendValue + randomVariation);
    series.push(Math.round(value * 100) / 100);
  }
  
  return series;
};

/**
 * Genera fechas para series temporales
 * 
 * En producción, estas fechas se obtendrían de:
 * - GROUP BY DATE(created_at) o DATE(period) según la granularidad
 * - Filtradas por el rango de fechas del período seleccionado
 * 
 * @param days - Número de días
 * @param granularity - Granularidad ('day', 'week', 'month')
 * @returns Array de fechas en formato ISO
 */
const generateDates = (days: number, granularity: 'day' | 'week' | 'month' = 'day'): string[] => {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    
    switch (granularity) {
      case 'day':
        date.setDate(date.getDate() - i);
        break;
      case 'week':
        date.setDate(date.getDate() - (i * 7));
        break;
      case 'month':
        date.setMonth(date.getMonth() - i);
        break;
    }
    
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
};

/**
 * Genera objetivos mock con distribución realista por estado
 * 
 * En producción, estos datos se obtendrían de:
 * - Tabla de objetivos (objectives/goals): SELECT * WHERE role = ? AND period BETWEEN ? AND ?
 * - Estados calculados comparando currentValue vs targetValue y deadline
 * - on_track: progress >= expected_progress AND deadline > today
 * - at_risk: progress < expected_progress AND deadline > today AND progress > 0
 * - off_track: progress << expected_progress OR deadline < today
 * - completed: currentValue >= targetValue
 * 
 * @param role - Rol del usuario
 * @returns Array de objetivos con distribución variada de estados
 */
const generateObjectives = (role: 'entrenador' | 'gimnasio'): PerformanceData['objectives'] => {
  const now = new Date();
  const baseObjectives = role === 'entrenador' 
    ? [
        {
          id: 'obj-1',
          title: 'Facturación Mensual Personal',
          metric: 'facturacion',
          targetValue: 50000,
          currentValue: 35000,
          unit: '€',
          deadline: new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0],
          status: ObjectiveStatus.ON_TRACK,
          progress: 70,
          category: 'financiero',
          tipo: ObjectiveType.FACTURACION,
          createdAt: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
          updatedAt: now.toISOString(),
        },
        {
          id: 'obj-2',
          title: 'Adherencia de Clientes',
          metric: 'adherencia',
          targetValue: 80,
          currentValue: 75,
          unit: '%',
          deadline: new Date(now.getFullYear(), now.getMonth() + 1, 15).toISOString().split('T')[0],
          status: ObjectiveStatus.AT_RISK,
          progress: 93.75,
          category: 'operacional',
          tipo: ObjectiveType.ADHERENCIA,
          createdAt: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
          updatedAt: now.toISOString(),
        },
        {
          id: 'obj-3',
          title: 'Retención de Clientes',
          metric: 'retencion',
          targetValue: 90,
          currentValue: 92,
          unit: '%',
          deadline: new Date(now.getFullYear(), now.getMonth(), 20).toISOString().split('T')[0],
          status: ObjectiveStatus.COMPLETED,
          progress: 100,
          category: 'operacional',
          tipo: ObjectiveType.RETENCION,
          createdAt: new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString(),
          updatedAt: now.toISOString(),
        },
        {
          id: 'obj-4',
          title: 'Nuevos Clientes',
          metric: 'clientes_activos',
          targetValue: 30,
          currentValue: 18,
          unit: 'clientes',
          deadline: new Date(now.getFullYear(), now.getMonth() + 2, 0).toISOString().split('T')[0],
          status: ObjectiveStatus.OFF_TRACK,
          progress: 60,
          category: 'operacional',
          tipo: ObjectiveType.LEADS,
          createdAt: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
          updatedAt: now.toISOString(),
        },
        {
          id: 'obj-5',
          title: 'Sesiones Completadas',
          metric: 'sesiones',
          targetValue: 200,
          currentValue: 185,
          unit: 'sesiones',
          deadline: new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0],
          status: ObjectiveStatus.ON_TRACK,
          progress: 92.5,
          category: 'operacional',
          tipo: ObjectiveType.OPERACIONAL,
          createdAt: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
          updatedAt: now.toISOString(),
        },
      ]
    : [
        {
          id: 'obj-1',
          title: 'Facturación Total del Gimnasio',
          metric: 'facturacion',
          targetValue: 300000,
          currentValue: 250000,
          unit: '€',
          deadline: new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0],
          status: ObjectiveStatus.ON_TRACK,
          progress: 83.33,
          category: 'financiero',
          tipo: ObjectiveType.FACTURACION,
          createdAt: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
          updatedAt: now.toISOString(),
        },
        {
          id: 'obj-2',
          title: 'Ocupación Media',
          metric: 'ocupacion',
          targetValue: 75,
          currentValue: 65,
          unit: '%',
          deadline: new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0],
          status: ObjectiveStatus.AT_RISK,
          progress: 86.67,
          category: 'operacional',
          tipo: ObjectiveType.OCUPACION,
          createdAt: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
          updatedAt: now.toISOString(),
        },
        {
          id: 'obj-3',
          title: 'Reducción de Tasa de Bajas',
          metric: 'tasa_bajas',
          targetValue: 5,
          currentValue: 4.5,
          unit: '%',
          deadline: new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0],
          status: ObjectiveStatus.COMPLETED,
          progress: 100,
          category: 'operacional',
          tipo: ObjectiveType.RETENCION,
          createdAt: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
          updatedAt: now.toISOString(),
        },
        {
          id: 'obj-4',
          title: 'Nuevos Socios',
          metric: 'socios_activos',
          targetValue: 500,
          currentValue: 380,
          unit: 'socios',
          deadline: new Date(now.getFullYear(), now.getMonth() + 2, 0).toISOString().split('T')[0],
          status: ObjectiveStatus.OFF_TRACK,
          progress: 76,
          category: 'comercial',
          tipo: ObjectiveType.LEADS,
          createdAt: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
          updatedAt: now.toISOString(),
        },
        {
          id: 'obj-5',
          title: 'Satisfacción del Cliente',
          metric: 'satisfaccion',
          targetValue: 4.5,
          currentValue: 4.3,
          unit: '/5',
          deadline: new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0],
          status: ObjectiveStatus.ON_TRACK,
          progress: 95.56,
          category: 'calidad',
          tipo: ObjectiveType.CALIDAD,
          createdAt: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
          updatedAt: now.toISOString(),
        },
      ];
  
  return baseObjectives;
};

/**
 * Calcula el resumen de objetivos por estado
 * 
 * En producción, estos datos se calcularían con:
 * - SELECT status, COUNT(*) FROM objectives WHERE role = ? GROUP BY status
 * - O usando agregaciones en la consulta principal
 * 
 * @param objectives - Array de objetivos
 * @returns Resumen con conteos por estado (solo los campos definidos en PerformanceData.summary)
 */
const calculateObjectiveSummary = (objectives: PerformanceData['objectives']): PerformanceData['summary'] => {
  let achievedObjectives = 0;
  let inProgressObjectives = 0;
  let atRiskObjectives = 0;
  
  objectives.forEach(obj => {
    switch (obj.status) {
      case ObjectiveStatus.COMPLETED:
      case ObjectiveStatus.ACHIEVED:
        achievedObjectives++;
        break;
      case ObjectiveStatus.ON_TRACK:
      case ObjectiveStatus.IN_PROGRESS:
        inProgressObjectives++;
        break;
      case ObjectiveStatus.AT_RISK:
        atRiskObjectives++;
        break;
      // OFF_TRACK y NOT_STARTED se cuentan como inProgress para mantener compatibilidad
      case ObjectiveStatus.OFF_TRACK:
      case ObjectiveStatus.NOT_STARTED:
        inProgressObjectives++;
        break;
    }
  });
  
  return {
    totalObjectives: objectives.length,
    achievedObjectives,
    inProgressObjectives,
    atRiskObjectives,
  };
};

/**
 * Obtiene una vista general completa del rendimiento con métricas agregadas,
 * gráficos y distribución de estado de objetivos.
 * 
 * Esta función centraliza todos los datos necesarios para el dashboard de rendimiento,
 * adaptándose al rol del usuario (entrenador vs gimnasio).
 * 
 * Mapeo desde base de datos real:
 * 
 * KPIs principales:
 * - facturacion: SELECT SUM(amount) FROM invoices WHERE user_id = ? AND period = ?
 *   Para gimnasio: agregar por todos los entrenadores del gimnasio
 * - adherencia: SELECT AVG(attendance_rate) FROM client_attendance WHERE trainer_id = ?
 * - retencion: SELECT (COUNT(active_clients) / COUNT(total_clients)) * 100 FROM clients WHERE ...
 * - clientes_activos: SELECT COUNT(*) FROM clients WHERE active = true AND trainer_id = ?
 * 
 * Distribución de objetivos:
 * - SELECT status, COUNT(*) FROM objectives WHERE role = ? AND period = ? GROUP BY status
 * - Estados calculados dinámicamente comparando currentValue vs targetValue y deadline
 * 
 * Series temporales:
 * - revenueSeries: SELECT DATE(created_at), SUM(amount) FROM invoices 
 *                  WHERE period BETWEEN ? AND ? GROUP BY DATE(created_at) ORDER BY date
 * - clientsSeries: SELECT DATE(created_at), COUNT(*) FROM clients 
 *                  WHERE created_at BETWEEN ? AND ? GROUP BY DATE(created_at)
 * - retentionSeries: SELECT date, retention_rate FROM retention_metrics 
 *                    WHERE period BETWEEN ? AND ? ORDER BY date
 * 
 * @param role - Rol del usuario ('entrenador' o 'gimnasio')
 * @param period - Período de análisis (opcional, por defecto 'month')
 * @returns Datos completos de rendimiento con KPIs, objetivos y series temporales
 */
export const getPerformanceOverview = async (
  role: 'entrenador' | 'gimnasio',
  period: string = 'month'
): Promise<PerformanceData> => {
  // Simular latencia de red/consulta
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Generar métricas/KPIs principales adaptados al rol
  const metrics = generateMetrics(role);
  
  // Generar objetivos con distribución realista de estados
  const objectives = generateObjectives(role);
  
  // Calcular resumen de objetivos por estado
  const summary = calculateObjectiveSummary(objectives);
  
  // Determinar número de días según el período
  // En producción, esto se calcularía desde las fechas del período
  const days = period === 'week' ? 7 
    : period === '30days' ? 30
    : period === 'month' ? 30 
    : period === '90days' ? 90
    : period === 'quarter' ? 90 
    : period === '365days' ? 365
    : period === 'year' ? 365 
    : 30; // Default a 30 días
  
  const granularity = period === 'week' || period === '30days' || period === 'month' ? 'day' 
    : period === '90days' || period === 'quarter' ? 'week' 
    : 'month';
  
  // Generar fechas para las series temporales
  const dates = generateDates(days, granularity);
  
  // Generar series temporales según el rol
  // En producción, estas consultas se harían con JOINs entre tablas relacionadas
  const revenueBase = role === 'entrenador' ? 35000 : 250000;
  const clientsBase = role === 'entrenador' ? 24 : 450;
  const retentionBase = role === 'entrenador' ? 85 : 88;
  
  const revenueSeries = generateTimeSeries(role, days, revenueBase, 'up');
  const clientsSeries = generateTimeSeries(role, days, clientsBase, 'up');
  const retentionSeries = generateTimeSeries(role, days, retentionBase, 'stable');
  
  // Construir objeto PerformanceData completo
  return {
    period,
    metrics,
    objectives,
    summary: {
      totalObjectives: summary.totalObjectives,
      achievedObjectives: summary.achievedObjectives,
      inProgressObjectives: summary.inProgressObjectives,
      atRiskObjectives: summary.atRiskObjectives,
    },
    // Series temporales para gráficos
    // En producción, estas series se mapearían desde consultas SQL con GROUP BY date
    timeSeries: {
      dates,
      metrics: {
        // Serie de facturación/revenue
        // Mapeo: SELECT DATE(created_at) as date, SUM(amount) as revenue 
        //        FROM invoices WHERE period BETWEEN ? AND ? GROUP BY DATE(created_at)
        revenueSeries,
        facturacion: revenueSeries, // Alias en español
        
        // Serie de clientes activos
        // Mapeo: SELECT DATE(created_at) as date, COUNT(*) as clients
        //        FROM clients WHERE active = true AND created_at BETWEEN ? AND ? GROUP BY DATE(created_at)
        clientsSeries,
        clientes: clientsSeries, // Alias en español
        
        // Serie de retención
        // Mapeo: SELECT date, retention_rate FROM retention_metrics 
        //        WHERE period BETWEEN ? AND ? ORDER BY date
        retentionSeries,
        retencion: retentionSeries, // Alias en español
        
        // Para entrenador: serie de adherencia
        // Mapeo: SELECT DATE(session_date) as date, AVG(attendance_rate) as adherence
        //        FROM training_sessions WHERE trainer_id = ? AND session_date BETWEEN ? AND ? GROUP BY DATE(session_date)
        ...(role === 'entrenador' && {
          adherencia: generateTimeSeries(role, days, 75, 'up'),
        }),
        
        // Para gimnasio: serie de ocupación
        // Mapeo: SELECT DATE(check_in_time) as date, AVG(occupancy_rate) as occupancy
        //        FROM gym_check_ins WHERE gym_id = ? AND check_in_time BETWEEN ? AND ? GROUP BY DATE(check_in_time)
        ...(role === 'gimnasio' && {
          ocupacion: generateTimeSeries(role, days, 65, 'up'),
        }),
      },
    },
  };
};

/**
 * Compara el rendimiento entre dos períodos de fechas, calculando variaciones
 * absolutas y porcentuales para las métricas clave.
 * 
 * Esta función es útil para análisis comparativos (mes actual vs mes anterior,
 * trimestre actual vs trimestre anterior, etc.).
 * 
 * Mapeo desde base de datos real:
 * 
 * Para cada período:
 * - Métricas: SELECT metric_id, SUM(value) FROM metric_values 
 *             WHERE period BETWEEN start_date AND end_date GROUP BY metric_id
 * - Objetivos: SELECT * FROM objectives WHERE deadline BETWEEN start_date AND end_date
 * - Series temporales: Similar a getPerformanceOverview pero filtrado por rango de fechas
 * 
 * Cálculo de variaciones:
 * - change = current_value - previous_value
 * - changePercent = (change / previous_value) * 100
 * - Se calcula para cada métrica y objetivo
 * 
 * @param params - Parámetros de comparación con rangos de fechas
 * @returns Datos de comparación con períodos y cambios calculados
 */
export const comparePeriods = async (
  params: ComparePeriodsParams
): Promise<ComparisonData> => {
  // Simular latencia de consultas a base de datos
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const { role, currentPeriodStart, currentPeriodEnd, previousPeriodStart, previousPeriodEnd, granularity = 'day' } = params;
  
  // Calcular número de días para cada período
  const currentStart = new Date(currentPeriodStart);
  const currentEnd = new Date(currentPeriodEnd);
  const previousStart = new Date(previousPeriodStart);
  const previousEnd = new Date(previousPeriodEnd);
  
  const currentDays = Math.ceil((currentEnd.getTime() - currentStart.getTime()) / (1000 * 60 * 60 * 24));
  const previousDays = Math.ceil((previousEnd.getTime() - previousStart.getTime()) / (1000 * 60 * 60 * 24));
  
  // Generar datos para el período actual
  // En producción: consultas SQL filtradas por currentPeriodStart y currentPeriodEnd
  const currentMetrics = generateMetrics(role);
  const currentObjectives = generateObjectives(role);
  const currentSummary = calculateObjectiveSummary(currentObjectives);
  
  // Generar datos para el período anterior (valores ligeramente inferiores)
  // En producción: consultas SQL filtradas por previousPeriodStart y previousPeriodEnd
  const previousMetrics = generateMetrics(role).map(m => ({
    ...m,
    value: m.value * (0.92 + Math.random() * 0.06), // Variación entre 92% y 98%
  }));
  
  // Simular objetivos anteriores con diferentes estados
  const previousObjectives = generateObjectives(role).map((obj, index) => {
    const progressVariation = 0.85 + Math.random() * 0.15; // 85% a 100% del progreso actual
    return {
      ...obj,
      id: `prev-${obj.id}`,
      currentValue: obj.currentValue * progressVariation,
      progress: obj.progress * progressVariation,
      status: obj.progress * progressVariation < 70 
        ? ObjectiveStatus.AT_RISK 
        : obj.progress * progressVariation >= 100 
        ? ObjectiveStatus.COMPLETED 
        : obj.status,
    };
  });
  
  const previousSummary = calculateObjectiveSummary(previousObjectives);
  
  // Calcular cambios entre períodos
  // En producción, estos cálculos se harían en SQL o en la capa de aplicación
  const changes = currentMetrics.map((current, index) => {
    const previous = previousMetrics[index];
    const change = current.value - previous.value;
    const changePercent = previous.value > 0 ? (change / previous.value) * 100 : 0;
    
    return {
      metric: current.name,
      current: current.value,
      previous: previous.value,
      change,
      changePercent: Math.round(changePercent * 100) / 100, // Redondear a 2 decimales
    };
  });
  
  // Generar series temporales para ambos períodos
  const revenueBase = role === 'entrenador' ? 35000 : 250000;
  const clientsBase = role === 'entrenador' ? 24 : 450;
  const retentionBase = role === 'entrenador' ? 85 : 88;
  
  const currentDates = generateDates(currentDays, granularity);
  const previousDates = generateDates(previousDays, granularity);
  
  const currentRevenueSeries = generateTimeSeries(role, currentDays, revenueBase, 'up');
  const previousRevenueSeries = generateTimeSeries(role, previousDays, revenueBase * 0.92, 'up');
  
  const currentClientsSeries = generateTimeSeries(role, currentDays, clientsBase, 'up');
  const previousClientsSeries = generateTimeSeries(role, previousDays, clientsBase * 0.95, 'up');
  
  const currentRetentionSeries = generateTimeSeries(role, currentDays, retentionBase, 'stable');
  const previousRetentionSeries = generateTimeSeries(role, previousDays, retentionBase * 0.98, 'stable');
  
  // Construir objeto de comparación completo
  return {
    currentPeriod: {
      period: `${currentPeriodStart} to ${currentPeriodEnd}`,
      metrics: currentMetrics,
      objectives: currentObjectives,
      summary: currentSummary,
      timeSeries: {
        dates: currentDates,
        metrics: {
          revenueSeries: currentRevenueSeries,
          facturacion: currentRevenueSeries,
          clientsSeries: currentClientsSeries,
          clientes: currentClientsSeries,
          retentionSeries: currentRetentionSeries,
          retencion: currentRetentionSeries,
          ...(role === 'entrenador' && {
            adherencia: generateTimeSeries(role, currentDays, 75, 'up'),
          }),
          ...(role === 'gimnasio' && {
            ocupacion: generateTimeSeries(role, currentDays, 65, 'up'),
          }),
        },
      },
    },
    previousPeriod: {
      period: `${previousPeriodStart} to ${previousPeriodEnd}`,
      metrics: previousMetrics,
      objectives: previousObjectives,
      summary: previousSummary,
      timeSeries: {
        dates: previousDates,
        metrics: {
          revenueSeries: previousRevenueSeries,
          facturacion: previousRevenueSeries,
          clientsSeries: previousClientsSeries,
          clientes: previousClientsSeries,
          retentionSeries: previousRetentionSeries,
          retencion: previousRetentionSeries,
          ...(role === 'entrenador' && {
            adherencia: generateTimeSeries(role, previousDays, 75 * 0.95, 'up'),
          }),
          ...(role === 'gimnasio' && {
            ocupacion: generateTimeSeries(role, previousDays, 65 * 0.95, 'up'),
          }),
        },
      },
    },
    changes,
  };
};

// ============================================================================
// FUNCIONES DE ALERTAS
// ============================================================================

/**
 * Genera alertas basadas en los objetivos y su estado actual
 * 
 * En producción, estas alertas se generarían automáticamente cuando:
 * - Un objetivo tiene progreso por debajo del esperado (riesgo)
 * - Un objetivo alcanza un hito importante (hito alcanzado)
 * - Un objetivo se completa exitosamente
 * - Un objetivo falla o está fuera de ruta
 * 
 * @param role - Rol del usuario
 * @returns Array de alertas generadas
 */
const generateAlerts = async (role: 'entrenador' | 'gimnasio'): Promise<Alert[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const objectives = generateObjectives(role);
  const now = new Date();
  const alerts: Alert[] = [];
  
  objectives.forEach((obj) => {
    // Alerta de riesgo: progreso bajo o fecha límite próxima
    if (obj.status === ObjectiveStatus.AT_RISK || obj.status === ObjectiveStatus.OFF_TRACK) {
      const daysUntilDeadline = Math.ceil(
        (new Date(obj.deadline).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      alerts.push({
        id: `alert-risk-${obj.id}`,
        type: 'warning' as AlertType,
        tipo: 'warning',
        tipoObjetivo: ObjectiveAlertType.RIESGO_PROGRESO,
        title: `Objetivo en riesgo: ${obj.title}`,
        titulo: `Objetivo en riesgo: ${obj.title}`,
        message: `El objetivo "${obj.title}" tiene un progreso del ${obj.progress.toFixed(0)}%, por debajo del esperado. ${daysUntilDeadline > 0 ? `Faltan ${daysUntilDeadline} días para la fecha límite.` : 'La fecha límite ya ha pasado.'}`,
        mensaje: `El objetivo "${obj.title}" tiene un progreso del ${obj.progress.toFixed(0)}%, por debajo del esperado. ${daysUntilDeadline > 0 ? `Faltan ${daysUntilDeadline} días para la fecha límite.` : 'La fecha límite ya ha pasado.'}`,
        objectiveId: obj.id,
        severity: obj.progress < 30 ? 'high' : obj.progress < 50 ? 'medium' : 'low' as AlertSeverity,
        severidad: obj.progress < 30 ? 'high' : obj.progress < 50 ? 'medium' : 'low' as AlertSeverity,
        riesgo: obj.progress < 30 ? 'alto' : obj.progress < 50 ? 'medio' : 'bajo',
        umbral: obj.progress,
        createdAt: new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(), // Últimos 7 días
        read: false,
        isRead: false,
      });
    }
    
    // Alerta de hito alcanzado: objetivo completado
    if (obj.status === ObjectiveStatus.COMPLETED || obj.status === ObjectiveStatus.ACHIEVED) {
      alerts.push({
        id: `alert-milestone-${obj.id}`,
        type: 'success' as AlertType,
        tipo: 'success',
        tipoObjetivo: ObjectiveAlertType.OBJETIVO_CUMPLIDO,
        title: `¡Hito alcanzado: ${obj.title}!`,
        titulo: `¡Hito alcanzado: ${obj.title}!`,
        message: `Felicitaciones! Has alcanzado el objetivo "${obj.title}" con un ${obj.progress.toFixed(0)}% de progreso.`,
        mensaje: `Felicitaciones! Has alcanzado el objetivo "${obj.title}" con un ${obj.progress.toFixed(0)}% de progreso.`,
        objectiveId: obj.id,
        severity: 'low' as AlertSeverity,
        severidad: 'low',
        riesgo: 'bajo',
        createdAt: new Date(now.getTime() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(), // Últimos 14 días
        read: Math.random() > 0.5, // Algunas alertas de éxito ya leídas
        isRead: Math.random() > 0.5,
      });
    }
    
    // Alerta de fecha próxima: objetivo con fecha límite cercana
    const daysUntilDeadline = Math.ceil(
      (new Date(obj.deadline).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysUntilDeadline > 0 && daysUntilDeadline <= 7 && 
        obj.status !== ObjectiveStatus.COMPLETED && 
        obj.status !== ObjectiveStatus.ACHIEVED) {
      alerts.push({
        id: `alert-deadline-${obj.id}`,
        type: 'info' as AlertType,
        tipo: 'info',
        tipoObjetivo: ObjectiveAlertType.FECHA_PROXIMA,
        title: `Fecha límite próxima: ${obj.title}`,
        titulo: `Fecha límite próxima: ${obj.title}`,
        message: `El objetivo "${obj.title}" vence en ${daysUntilDeadline} día${daysUntilDeadline !== 1 ? 's' : ''}. Progreso actual: ${obj.progress.toFixed(0)}%.`,
        mensaje: `El objetivo "${obj.title}" vence en ${daysUntilDeadline} día${daysUntilDeadline !== 1 ? 's' : ''}. Progreso actual: ${obj.progress.toFixed(0)}%.`,
        objectiveId: obj.id,
        severity: daysUntilDeadline <= 3 ? 'high' : 'medium' as AlertSeverity,
        severidad: daysUntilDeadline <= 3 ? 'high' : 'medium',
        riesgo: daysUntilDeadline <= 3 ? 'alto' : 'medio',
        createdAt: new Date(now.getTime() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString(), // Últimos 3 días
        read: false,
        isRead: false,
      });
    }
  });
  
  // Ordenar por fecha (más recientes primero)
  return alerts.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

/**
 * Obtiene todas las alertas para un rol específico
 * 
 * En producción, esto consultaría una tabla de alertas:
 * SELECT * FROM alerts WHERE role = ? AND (read = false OR created_at > ?) ORDER BY created_at DESC
 * 
 * @param role - Rol del usuario
 * @param filters - Filtros opcionales para las alertas
 * @returns Array de alertas filtradas
 */
export interface AlertFilters {
  /** Filtrar por tipo de alerta (riesgo, hito, sistema) */
  tipoObjetivo?: ObjectiveAlertType | string;
  /** Filtrar por severidad */
  severity?: AlertSeverity;
  /** Filtrar por estado de lectura */
  isRead?: boolean;
  /** Filtrar solo alertas en riesgo */
  onlyAtRisk?: boolean;
}

export const getAlerts = async (
  role: 'entrenador' | 'gimnasio',
  filters?: AlertFilters
): Promise<Alert[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let alerts = await generateAlerts(role);
  
  // Aplicar filtros
  if (filters) {
    if (filters.tipoObjetivo) {
      alerts = alerts.filter(a => a.tipoObjetivo === filters.tipoObjetivo);
    }
    
    if (filters.severity) {
      alerts = alerts.filter(a => a.severity === filters.severity);
    }
    
    if (filters.isRead !== undefined) {
      alerts = alerts.filter(a => {
        const read = a.read ?? a.isRead ?? false;
        return read === filters.isRead;
      });
    }
    
    if (filters.onlyAtRisk) {
      alerts = alerts.filter(a => 
        a.tipoObjetivo === ObjectiveAlertType.RIESGO_PROGRESO ||
        a.riesgo === 'alto' ||
        a.severity === 'high'
      );
    }
  }
  
  return alerts;
};

/**
 * Marca una alerta como leída o no leída
 * 
 * En producción, esto actualizaría la base de datos:
 * UPDATE alerts SET read = ?, updated_at = NOW() WHERE id = ?
 * 
 * @param alertId - ID de la alerta a actualizar
 * @param isRead - Estado de lectura (true = leída, false = no leída)
 * @returns La alerta actualizada
 */
export const updateAlertReadStatus = async (
  alertId: string,
  isRead: boolean
): Promise<Alert> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // En producción, esto consultaría la base de datos
  // Por ahora, simulamos que la alerta se actualiza
  // En una implementación real, necesitarías mantener un estado global o consultar la BD
  
  // Mock: retornar una alerta actualizada (en producción esto vendría de la BD)
  const mockAlert: Alert = {
    id: alertId,
    type: 'warning',
    title: 'Alerta actualizada',
    message: 'Esta alerta ha sido actualizada',
    severity: 'medium',
    createdAt: new Date().toISOString(),
    read: isRead,
    isRead: isRead,
  };
  
  return mockAlert;
};

/**
 * Marca todas las alertas como leídas
 * 
 * En producción:
 * UPDATE alerts SET read = true, updated_at = NOW() WHERE role = ? AND read = false
 * 
 * @param role - Rol del usuario
 * @returns Número de alertas marcadas como leídas
 */
export const markAllAlertsAsRead = async (
  role: 'entrenador' | 'gimnasio'
): Promise<number> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const alerts = await generateAlerts(role);
  const unreadCount = alerts.filter(a => !(a.read ?? a.isRead ?? false)).length;
  
  // En producción, esto actualizaría la base de datos
  return unreadCount;
};

