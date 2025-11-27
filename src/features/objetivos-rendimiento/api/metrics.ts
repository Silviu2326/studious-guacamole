import { KPI, Metric, MetricCategory } from '../types';

/**
 * Datos mock iniciales de KPIs para entrenadores y gimnasios
 * 
 * Cada KPI incluye:
 * - id: Identificador único
 * - nombre: Nombre del KPI
 * - categoría: Categoría de la métrica
 * - valor actual: Valor actual de la métrica (en metricData.value)
 * - objetivo opcional: Valor objetivo (en target/targetValue)
 * - isVisible: Bandera de visibilidad
 */
const mockKPIs: KPI[] = [
  {
    id: 'kpi-facturacion-mensual',
    name: 'Facturación Mensual',
    description: 'Ingresos totales facturados en el mes actual',
    metric: 'facturacion_mensual',
    unit: '€',
    category: MetricCategory.FINANZAS,
    target: 50000,
    targetValue: 50000,
    enabled: true,
    isVisible: true,
    role: ['entrenador', 'gimnasio'],
    metricData: {
      id: 'metric-facturacion-mensual',
      name: 'Facturación Mensual',
      value: 42500,
      valorActual: 42500,
      unit: '€',
      unidad: '€',
      category: MetricCategory.FINANZAS,
      categoria: MetricCategory.FINANZAS,
      target: 50000,
      valorObjetivoOpcional: 50000,
      trend: {
        value: 5.2,
        direction: 'up',
        period: 'vs mes anterior',
      },
    },
  },
  {
    id: 'kpi-retencion-clientes',
    name: 'Retención de Clientes',
    description: 'Porcentaje de clientes que se mantienen activos mes a mes',
    metric: 'retencion',
    unit: '%',
    category: MetricCategory.CLIENTES,
    target: 85,
    targetValue: 85,
    enabled: true,
    isVisible: true,
    role: ['entrenador', 'gimnasio'],
    metricData: {
      id: 'metric-retencion',
      name: 'Retención de Clientes',
      value: 82.5,
      valorActual: 82.5,
      unit: '%',
      unidad: '%',
      category: MetricCategory.CLIENTES,
      categoria: MetricCategory.CLIENTES,
      target: 85,
      valorObjetivoOpcional: 85,
      trend: {
        value: -1.2,
        direction: 'down',
        period: 'vs mes anterior',
      },
    },
  },
  {
    id: 'kpi-adherencia',
    name: 'Adherencia de Clientes',
    description: 'Porcentaje de clientes que cumplen con sus entrenamientos programados',
    metric: 'adherencia',
    unit: '%',
    category: MetricCategory.OPERACIONES,
    target: 75,
    targetValue: 75,
    enabled: true,
    isVisible: true,
    role: ['entrenador'],
    metricData: {
      id: 'metric-adherencia',
      name: 'Adherencia de Clientes',
      value: 78.3,
      valorActual: 78.3,
      unit: '%',
      unidad: '%',
      category: MetricCategory.OPERACIONES,
      categoria: MetricCategory.OPERACIONES,
      target: 75,
      valorObjetivoOpcional: 75,
      trend: {
        value: 3.1,
        direction: 'up',
        period: 'vs mes anterior',
      },
    },
  },
  {
    id: 'kpi-clientes-activos',
    name: 'Clientes Activos',
    description: 'Número total de clientes activos en el mes',
    metric: 'clientes_activos',
    unit: 'clientes',
    category: MetricCategory.CLIENTES,
    target: 200,
    targetValue: 200,
    enabled: true,
    isVisible: true,
    role: ['entrenador', 'gimnasio'],
    metricData: {
      id: 'metric-clientes-activos',
      name: 'Clientes Activos',
      value: 187,
      valorActual: 187,
      unit: 'clientes',
      unidad: 'clientes',
      category: MetricCategory.CLIENTES,
      categoria: MetricCategory.CLIENTES,
      target: 200,
      valorObjetivoOpcional: 200,
      trend: {
        value: 4.5,
        direction: 'up',
        period: 'vs mes anterior',
      },
    },
  },
  {
    id: 'kpi-ticket-medio',
    name: 'Ticket Medio',
    description: 'Valor promedio de cada transacción o suscripción',
    metric: 'ticket_medio',
    unit: '€',
    category: MetricCategory.FINANZAS,
    target: 120,
    targetValue: 120,
    enabled: true,
    isVisible: true,
    role: ['gimnasio'],
    metricData: {
      id: 'metric-ticket-medio',
      name: 'Ticket Medio',
      value: 115.50,
      valorActual: 115.50,
      unit: '€',
      unidad: '€',
      category: MetricCategory.FINANZAS,
      categoria: MetricCategory.FINANZAS,
      target: 120,
      valorObjetivoOpcional: 120,
      trend: {
        value: 2.3,
        direction: 'up',
        period: 'vs mes anterior',
      },
    },
  },
  {
    id: 'kpi-ocupacion-media',
    name: 'Ocupación Media',
    description: 'Porcentaje medio de ocupación de las instalaciones',
    metric: 'ocupacion',
    unit: '%',
    category: MetricCategory.OPERACIONES,
    target: 70,
    targetValue: 70,
    enabled: true,
    isVisible: true,
    role: ['gimnasio'],
    metricData: {
      id: 'metric-ocupacion',
      name: 'Ocupación Media',
      value: 68.2,
      valorActual: 68.2,
      unit: '%',
      unidad: '%',
      category: MetricCategory.OPERACIONES,
      categoria: MetricCategory.OPERACIONES,
      target: 70,
      valorObjetivoOpcional: 70,
      trend: {
        value: -0.8,
        direction: 'down',
        period: 'vs mes anterior',
      },
    },
  },
  {
    id: 'kpi-tasa-bajas',
    name: 'Tasa de Bajas',
    description: 'Porcentaje de socios que dan de baja mensualmente',
    metric: 'tasa_bajas',
    unit: '%',
    category: MetricCategory.CLIENTES,
    target: 5,
    targetValue: 5,
    enabled: true,
    isVisible: false, // Oculto por defecto
    role: ['gimnasio'],
    metricData: {
      id: 'metric-tasa-bajas',
      name: 'Tasa de Bajas',
      value: 4.2,
      valorActual: 4.2,
      unit: '%',
      unidad: '%',
      category: MetricCategory.CLIENTES,
      categoria: MetricCategory.CLIENTES,
      target: 5,
      valorObjetivoOpcional: 5,
      trend: {
        value: -0.5,
        direction: 'down',
        period: 'vs mes anterior',
      },
    },
  },
  {
    id: 'kpi-leads-nuevos',
    name: 'Leads Nuevos',
    description: 'Número de nuevos leads captados en el mes',
    metric: 'leads_nuevos',
    unit: 'leads',
    category: MetricCategory.MARKETING,
    target: 50,
    targetValue: 50,
    enabled: true,
    isVisible: true,
    role: ['entrenador', 'gimnasio'],
    metricData: {
      id: 'metric-leads-nuevos',
      name: 'Leads Nuevos',
      value: 43,
      valorActual: 43,
      unit: 'leads',
      unidad: 'leads',
      category: MetricCategory.MARKETING,
      categoria: MetricCategory.MARKETING,
      target: 50,
      valorObjetivoOpcional: 50,
      trend: {
        value: 8.0,
        direction: 'up',
        period: 'vs mes anterior',
      },
    },
  },
  {
    id: 'kpi-conversion-leads',
    name: 'Tasa de Conversión de Leads',
    description: 'Porcentaje de leads que se convierten en clientes',
    metric: 'conversion_leads',
    unit: '%',
    category: MetricCategory.MARKETING,
    target: 25,
    targetValue: 25,
    enabled: true,
    isVisible: false, // Oculto por defecto
    role: ['entrenador', 'gimnasio'],
    metricData: {
      id: 'metric-conversion-leads',
      name: 'Tasa de Conversión de Leads',
      value: 23.5,
      valorActual: 23.5,
      unit: '%',
      unidad: '%',
      category: MetricCategory.MARKETING,
      categoria: MetricCategory.MARKETING,
      target: 25,
      valorObjetivoOpcional: 25,
      trend: {
        value: 1.2,
        direction: 'up',
        period: 'vs mes anterior',
      },
    },
  },
  {
    id: 'kpi-satisfaccion-clientes',
    name: 'Satisfacción de Clientes',
    description: 'Puntuación promedio de satisfacción de los clientes (escala 1-10)',
    metric: 'satisfaccion',
    unit: '/10',
    category: MetricCategory.CALIDAD,
    target: 8.5,
    targetValue: 8.5,
    enabled: true,
    isVisible: true,
    role: ['entrenador', 'gimnasio'],
    metricData: {
      id: 'metric-satisfaccion',
      name: 'Satisfacción de Clientes',
      value: 8.7,
      valorActual: 8.7,
      unit: '/10',
      unidad: '/10',
      category: MetricCategory.CALIDAD,
      categoria: MetricCategory.CALIDAD,
      target: 8.5,
      valorObjetivoOpcional: 8.5,
      trend: {
        value: 0.2,
        direction: 'up',
        period: 'vs mes anterior',
      },
    },
  },
];

/**
 * Obtiene la lista completa de KPIs (visibles y no visibles)
 * 
 * @param role - Rol del usuario para filtrar KPIs por permisos (opcional)
 * @returns Promise con la lista de KPIs
 * 
 * TODO: Reemplazar con llamada HTTP real:
 * GET /api/kpis?role={role}
 * o GraphQL query:
 * query GetKPIs($role: UserRole) { kpis(role: $role) { ... } }
 */
export const getKPIs = async (role?: 'entrenador' | 'gimnasio'): Promise<KPI[]> => {
  // Simula delay de red
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let filteredKPIs = mockKPIs;
  
  // Filtrar por rol si se proporciona
  if (role) {
    filteredKPIs = mockKPIs.filter(kpi => kpi.role.includes(role));
  }
  
  return [...filteredKPIs];
};

/**
 * Obtiene un KPI específico por su ID
 * 
 * @param id - Identificador único del KPI
 * @returns Promise con el KPI encontrado o null
 * 
 * TODO: Reemplazar con llamada HTTP real:
 * GET /api/kpis/{id}
 */
export const getKPI = async (id: string): Promise<KPI | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const kpi = mockKPIs.find(k => k.id === id);
  return kpi ? { ...kpi } : null;
};

/**
 * Actualiza la visibilidad de un KPI
 * 
 * @param kpiId - Identificador único del KPI
 * @param isVisible - Nueva visibilidad del KPI
 * @returns Promise con la lista completa de KPIs actualizada
 * 
 * TODO: Reemplazar con llamada HTTP real:
 * PATCH /api/kpis/{kpiId}/visibility
 * Body: { isVisible: boolean }
 * o GraphQL mutation:
 * mutation UpdateKPIVisibility($kpiId: ID!, $isVisible: Boolean!) { ... }
 */
export const updateKPIVisibility = async (
  kpiId: string,
  isVisible: boolean
): Promise<KPI[]> => {
  // Simula delay de red
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const index = mockKPIs.findIndex(kpi => kpi.id === kpiId);
  
  if (index === -1) {
    throw new Error(`KPI con id "${kpiId}" no encontrado`);
  }
  
  // Actualizar visibilidad
  mockKPIs[index] = {
    ...mockKPIs[index],
    enabled: isVisible,
    isVisible: isVisible,
  };
  
  // Retornar lista completa actualizada
  return [...mockKPIs];
};

/**
 * Actualiza el valor objetivo de un KPI
 * 
 * @param kpiId - Identificador único del KPI
 * @param newTarget - Nuevo valor objetivo
 * @returns Promise con el KPI actualizado
 * 
 * TODO: Reemplazar con llamada HTTP real:
 * PATCH /api/kpis/{kpiId}/target
 * Body: { target: number }
 * o GraphQL mutation:
 * mutation UpdateKPITarget($kpiId: ID!, $target: Float!) { ... }
 */
export const updateKPITarget = async (
  kpiId: string,
  newTarget: number,
  warningThreshold?: number,
  dangerThreshold?: number
): Promise<KPI> => {
  // Simula delay de red
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const index = mockKPIs.findIndex(kpi => kpi.id === kpiId);
  
  if (index === -1) {
    throw new Error(`KPI con id "${kpiId}" no encontrado`);
  }
  
  // Actualizar objetivo en el KPI y en su metricData si existe
  const updatedKPI: KPI = {
    ...mockKPIs[index],
    target: newTarget,
    targetValue: newTarget,
    warningThreshold: warningThreshold !== undefined ? warningThreshold : mockKPIs[index].warningThreshold,
    dangerThreshold: dangerThreshold !== undefined ? dangerThreshold : mockKPIs[index].dangerThreshold,
    metricData: mockKPIs[index].metricData
      ? {
          ...mockKPIs[index].metricData!,
          target: newTarget,
          valorObjetivoOpcional: newTarget,
        }
      : undefined,
  };
  
  mockKPIs[index] = updatedKPI;
  
  return { ...updatedKPI };
};

/**
 * Crea una métrica personalizada (KPI custom)
 * 
 * @param metricData - Datos de la nueva métrica personalizada
 * @returns Promise con el nuevo KPI creado
 * 
 * TODO: Reemplazar con llamada HTTP real:
 * POST /api/kpis/custom
 * Body: { name, description, metric, unit, category, target?, role }
 * o GraphQL mutation:
 * mutation CreateCustomMetric($input: CustomMetricInput!) { ... }
 */
export const createCustomMetric = async (
  metricData: Omit<KPI, 'id' | 'metricData'> & {
    currentValue?: number;
    target?: number;
  }
): Promise<KPI> => {
  // Simula delay de red
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newKPI: KPI = {
    ...metricData,
    id: `kpi-custom-${Date.now()}`,
    enabled: metricData.enabled ?? true,
    isVisible: metricData.isVisible ?? metricData.enabled ?? true,
    metricData: {
      id: `metric-custom-${Date.now()}`,
      name: metricData.name,
      nombre: metricData.name,
      value: metricData.currentValue ?? 0,
      valorActual: metricData.currentValue ?? 0,
      unit: metricData.unit,
      unidad: metricData.unit,
      category: metricData.category,
      categoria: metricData.category,
      target: metricData.target,
      valorObjetivoOpcional: metricData.target,
    },
  };
  
  mockKPIs.push(newKPI);
  
  return { ...newKPI };
};

/**
 * Actualiza un KPI existente (función genérica)
 * 
 * @param id - Identificador único del KPI
 * @param updates - Campos a actualizar
 * @returns Promise con el KPI actualizado
 * 
 * TODO: Reemplazar con llamada HTTP real:
 * PATCH /api/kpis/{id}
 * Body: Partial<KPI>
 */
export const updateKPI = async (id: string, updates: Partial<KPI>): Promise<KPI> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const index = mockKPIs.findIndex(kpi => kpi.id === id);
  if (index === -1) throw new Error(`KPI con id "${id}" no encontrado`);
  
  const updated = {
    ...mockKPIs[index],
    ...updates,
  };
  
  mockKPIs[index] = updated;
  return { ...updated };
};

/**
 * Actualiza los umbrales de alerta de un KPI
 * 
 * @param kpiId - Identificador único del KPI
 * @param warningThreshold - Umbral de advertencia (opcional)
 * @param dangerThreshold - Umbral de peligro (opcional)
 * @returns Promise con el KPI actualizado
 * 
 * TODO: Reemplazar con llamada HTTP real:
 * PATCH /api/kpis/{kpiId}/thresholds
 * Body: { warningThreshold?: number, dangerThreshold?: number }
 */
export const updateKPIThresholds = async (
  kpiId: string,
  warningThreshold?: number,
  dangerThreshold?: number
): Promise<KPI> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const index = mockKPIs.findIndex(kpi => kpi.id === kpiId);
  
  if (index === -1) {
    throw new Error(`KPI con id "${kpiId}" no encontrado`);
  }
  
  const updatedKPI: KPI = {
    ...mockKPIs[index],
    warningThreshold: warningThreshold !== undefined ? warningThreshold : mockKPIs[index].warningThreshold,
    dangerThreshold: dangerThreshold !== undefined ? dangerThreshold : mockKPIs[index].dangerThreshold,
  };
  
  mockKPIs[index] = updatedKPI;
  
  return { ...updatedKPI };
};

/**
 * Obtiene métricas filtradas por categoría
 * 
 * @param category - Categoría de métricas a obtener
 * @param role - Rol del usuario para filtrar (opcional)
 * @returns Promise con la lista de métricas
 * 
 * TODO: Reemplazar con llamada HTTP real:
 * GET /api/metrics?category={category}&role={role}
 */
export const getMetricsByCategory = async (
  category: string,
  role?: 'entrenador' | 'gimnasio'
): Promise<Metric[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  let filteredKPIs = mockKPIs;
  
  if (role) {
    filteredKPIs = mockKPIs.filter(kpi => kpi.role.includes(role));
  }
  
  const categoryKPIs = filteredKPIs.filter(
    kpi => kpi.category === category || kpi.categoria === category
  );
  
  // Extraer metricData de los KPIs
  return categoryKPIs
    .map(kpi => kpi.metricData)
    .filter((metric): metric is Metric => metric !== undefined);
};
