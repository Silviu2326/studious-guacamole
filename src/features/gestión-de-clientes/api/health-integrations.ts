import {
  HealthIntegration,
  HealthProvider,
  HealthDataPoint,
  HealthMetrics,
  HealthWorkout,
  HealthIntegrationStats,
  HealthDataAnalysis,
  ConnectHealthIntegrationRequest,
  SyncHealthDataRequest,
  SyncHealthDataResponse,
  HealthMetricType,
} from '../types/health-integrations';

// Mock data - En producción esto se reemplazaría con llamadas reales a la API
const MOCK_INTEGRATIONS: Map<string, HealthIntegration[]> = new Map();
const MOCK_HEALTH_DATA: Map<string, HealthDataPoint[]> = new Map();
const MOCK_HEALTH_METRICS: Map<string, HealthMetrics[]> = new Map();

/**
 * Obtiene todas las integraciones de salud de un cliente
 */
export const getClientHealthIntegrations = async (
  clientId: string
): Promise<HealthIntegration[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const integrations = MOCK_INTEGRATIONS.get(clientId) || [];
  return integrations;
};

/**
 * Conecta una integración de salud para un cliente
 */
export const connectHealthIntegration = async (
  request: ConnectHealthIntegrationRequest
): Promise<HealthIntegration> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const integration: HealthIntegration = {
    id: `integration-${request.clientId}-${request.provider}-${Date.now()}`,
    clientId: request.clientId,
    provider: request.provider,
    status: 'connected',
    connectedAt: new Date().toISOString(),
    lastSyncAt: new Date().toISOString(),
    nextSyncAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Próxima sincronización en 24h
    syncFrequency: request.syncFrequency || 'daily',
    enabledMetrics: request.enabledMetrics || [
      'steps',
      'distance',
      'calories',
      'heart-rate',
      'active-energy',
      'workouts',
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  const existing = MOCK_INTEGRATIONS.get(request.clientId) || [];
  existing.push(integration);
  MOCK_INTEGRATIONS.set(request.clientId, existing);
  
  // Simular sincronización inicial
  setTimeout(() => {
    syncHealthData({
      integrationId: integration.id,
    }).catch(console.error);
  }, 1000);
  
  return integration;
};

/**
 * Desconecta una integración de salud
 */
export const disconnectHealthIntegration = async (
  integrationId: string
): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  for (const [clientId, integrations] of MOCK_INTEGRATIONS.entries()) {
    const index = integrations.findIndex(i => i.id === integrationId);
    if (index !== -1) {
      integrations[index].status = 'disconnected';
      integrations[index].updatedAt = new Date().toISOString();
      MOCK_INTEGRATIONS.set(clientId, integrations);
      break;
    }
  }
};

/**
 * Sincroniza datos de salud desde el proveedor
 */
export const syncHealthData = async (
  request: SyncHealthDataRequest
): Promise<SyncHealthDataResponse> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Buscar la integración
  let integration: HealthIntegration | null = null;
  for (const integrations of MOCK_INTEGRATIONS.values()) {
    const found = integrations.find(i => i.id === request.integrationId);
    if (found) {
      integration = found;
      break;
    }
  }
  
  if (!integration) {
    throw new Error('Integración no encontrada');
  }
  
  // Simular datos de salud
  const dataPoints: HealthDataPoint[] = [];
  const startDate = request.startDate 
    ? new Date(request.startDate) 
    : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // Últimos 7 días por defecto
  const endDate = request.endDate ? new Date(request.endDate) : new Date();
  
  const metrics = request.metrics || integration.enabledMetrics;
  
  // Generar datos mock para cada día
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    
    if (metrics.includes('steps')) {
      dataPoints.push({
        id: `dp-${integration.clientId}-steps-${dateStr}`,
        clientId: integration.clientId,
        integrationId: integration.id,
        metricType: 'steps',
        value: Math.floor(Math.random() * 5000) + 5000, // 5000-10000 pasos
        unit: 'count',
        timestamp: `${dateStr}T12:00:00Z`,
        source: integration.provider,
      });
    }
    
    if (metrics.includes('distance')) {
      dataPoints.push({
        id: `dp-${integration.clientId}-distance-${dateStr}`,
        clientId: integration.clientId,
        integrationId: integration.id,
        metricType: 'distance',
        value: Math.floor(Math.random() * 5000) + 3000, // 3-8 km
        unit: 'meters',
        timestamp: `${dateStr}T12:00:00Z`,
        source: integration.provider,
      });
    }
    
    if (metrics.includes('calories')) {
      dataPoints.push({
        id: `dp-${integration.clientId}-calories-${dateStr}`,
        clientId: integration.clientId,
        integrationId: integration.id,
        metricType: 'calories',
        value: Math.floor(Math.random() * 500) + 1500, // 1500-2000 kcal
        unit: 'kilocalories',
        timestamp: `${dateStr}T12:00:00Z`,
        source: integration.provider,
      });
    }
    
    if (metrics.includes('heart-rate')) {
      dataPoints.push({
        id: `dp-${integration.clientId}-heart-rate-${dateStr}`,
        clientId: integration.clientId,
        integrationId: integration.id,
        metricType: 'heart-rate',
        value: Math.floor(Math.random() * 30) + 60, // 60-90 bpm
        unit: 'bpm',
        timestamp: `${dateStr}T12:00:00Z`,
        source: integration.provider,
      });
    }
  }
  
  // Guardar datos
  const existing = MOCK_HEALTH_DATA.get(integration.clientId) || [];
  existing.push(...dataPoints);
  MOCK_HEALTH_DATA.set(integration.clientId, existing);
  
  // Actualizar integración
  for (const integrations of MOCK_INTEGRATIONS.values()) {
    const index = integrations.findIndex(i => i.id === request.integrationId);
    if (index !== -1) {
      integrations[index].lastSyncAt = new Date().toISOString();
      integrations[index].status = 'connected';
      integrations[index].nextSyncAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      integrations[index].updatedAt = new Date().toISOString();
      break;
    }
  }
  
  return {
    success: true,
    integrationId: integration.id,
    dataPointsSynced: dataPoints.length,
    lastSyncAt: new Date().toISOString(),
  };
};

/**
 * Obtiene métricas de salud agregadas para un cliente
 */
export const getClientHealthMetrics = async (
  clientId: string,
  startDate?: string,
  endDate?: string
): Promise<HealthMetrics[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const dataPoints = MOCK_HEALTH_DATA.get(clientId) || [];
  const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const end = endDate ? new Date(endDate) : new Date();
  
  // Agrupar por fecha
  const metricsByDate = new Map<string, HealthMetrics>();
  
  for (const point of dataPoints) {
    const date = point.timestamp.split('T')[0];
    const pointDate = new Date(point.timestamp);
    
    if (pointDate >= start && pointDate <= end) {
      if (!metricsByDate.has(date)) {
        metricsByDate.set(date, {
          clientId,
          date,
        });
      }
      
      const metrics = metricsByDate.get(date)!;
      
      switch (point.metricType) {
        case 'steps':
          metrics.steps = point.value;
          break;
        case 'distance':
          metrics.distance = point.value;
          break;
        case 'calories':
          metrics.calories = point.value;
          break;
        case 'heart-rate':
          if (!metrics.heartRate) {
            metrics.heartRate = {
              average: point.value,
              resting: point.value - 10,
              max: point.value + 20,
              min: point.value - 15,
            };
          } else {
            metrics.heartRate.average = point.value;
          }
          break;
      }
    }
  }
  
  return Array.from(metricsByDate.values()).sort((a, b) => 
    a.date.localeCompare(b.date)
  );
};

/**
 * Obtiene análisis de datos de salud
 */
export const getHealthDataAnalysis = async (
  clientId: string,
  period: 'week' | 'month' | 'quarter' | 'year' = 'month'
): Promise<HealthDataAnalysis> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const now = new Date();
  let startDate: Date;
  let endDate = new Date(now);
  
  switch (period) {
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      break;
    case 'quarter':
      startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
      break;
    case 'year':
      startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
      break;
  }
  
  const metrics = await getClientHealthMetrics(
    clientId,
    startDate.toISOString().split('T')[0],
    endDate.toISOString().split('T')[0]
  );
  
  // Calcular tendencias
  const currentWeek = metrics.slice(-7);
  const previousWeek = metrics.slice(-14, -7);
  
  const calculateTrend = (metric: keyof HealthMetrics): any => {
    const current = currentWeek.reduce((sum, m) => {
      const val = m[metric];
      return sum + (typeof val === 'number' ? val : 0);
    }, 0) / currentWeek.length;
    
    const previous = previousWeek.reduce((sum, m) => {
      const val = m[metric];
      return sum + (typeof val === 'number' ? val : 0);
    }, 0) / previousWeek.length;
    
    const change = previous > 0 ? ((current - previous) / previous) * 100 : 0;
    
    return {
      current: Math.round(current),
      previous: Math.round(previous),
      change: Math.round(change * 10) / 10,
      trend: change > 5 ? 'increasing' : change < -5 ? 'decreasing' : 'stable',
      significance: Math.abs(change) > 10 ? 'high' : Math.abs(change) > 5 ? 'medium' : 'low',
    };
  };
  
  const insights: string[] = [];
  const recommendations: string[] = [];
  
  // Generar insights basados en los datos
  const avgSteps = currentWeek.reduce((sum, m) => sum + (m.steps || 0), 0) / currentWeek.length;
  if (avgSteps < 5000) {
    insights.push('Tu promedio de pasos diarios está por debajo de la recomendación de 10,000 pasos');
    recommendations.push('Intenta aumentar tu actividad caminando más durante el día');
  }
  
  const avgCalories = currentWeek.reduce((sum, m) => sum + (m.calories || 0), 0) / currentWeek.length;
  if (avgCalories > 2000) {
    insights.push('Tu consumo calórico diario es alto, lo cual es positivo para el entrenamiento');
  }
  
  return {
    clientId,
    period,
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    trends: {
      steps: calculateTrend('steps'),
      calories: calculateTrend('calories'),
      heartRate: calculateTrend('heartRate') || {
        current: 70,
        previous: 72,
        change: -2.8,
        trend: 'stable',
        significance: 'low',
      },
      workouts: {
        current: 4,
        previous: 3,
        change: 33.3,
        trend: 'increasing',
        significance: 'medium',
      },
    },
    insights,
    recommendations,
  };
};

/**
 * Obtiene estadísticas de integraciones de salud
 */
export const getHealthIntegrationStats = async (
  role: 'entrenador' | 'gimnasio',
  userId?: string
): Promise<HealthIntegrationStats> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let totalIntegrations = 0;
  let activeIntegrations = 0;
  let totalDataPoints = 0;
  const metricsByProvider: Record<HealthProvider, number> = {
    'apple-health': 0,
    'google-fit': 0,
    'garmin': 0,
  };
  let syncErrors = 0;
  
  for (const integrations of MOCK_INTEGRATIONS.values()) {
    for (const integration of integrations) {
      totalIntegrations++;
      if (integration.status === 'connected') {
        activeIntegrations++;
        metricsByProvider[integration.provider]++;
      }
      if (integration.status === 'error') {
        syncErrors++;
      }
    }
  }
  
  for (const dataPoints of MOCK_HEALTH_DATA.values()) {
    totalDataPoints += dataPoints.length;
  }
  
  return {
    totalIntegrations,
    activeIntegrations,
    totalDataPoints,
    metricsByProvider,
    syncErrors,
  };
};

