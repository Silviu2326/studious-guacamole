// User Story 1: API para sincronización de widgets con otras áreas del ERP
import { WidgetSyncConfig, ERPSyncData, ERPSource, WidgetSyncStatus } from '../types';

// Mock de configuraciones de sincronización guardadas
const mockSyncConfigs: WidgetSyncConfig[] = [];

// Simular datos de finanzas
const getFinanzasData = async (metric: string): Promise<ERPSyncData | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Simular datos según la métrica solicitada
  const finanzasData: Record<string, ERPSyncData> = {
    facturacion: {
      source: 'finanzas',
      metric: 'facturacion',
      value: 35000,
      unit: '€',
      timestamp: new Date().toISOString(),
      metadata: {
        period: 'mes',
        category: 'ingresos',
      },
    },
    ingresos: {
      source: 'finanzas',
      metric: 'ingresos',
      value: 35000,
      unit: '€',
      timestamp: new Date().toISOString(),
      metadata: {
        period: 'mes',
        category: 'ingresos',
      },
    },
    gastos: {
      source: 'finanzas',
      metric: 'gastos',
      value: 12000,
      unit: '€',
      timestamp: new Date().toISOString(),
      metadata: {
        period: 'mes',
        category: 'gastos',
      },
    },
  };
  
  return finanzasData[metric] || null;
};

// Simular datos de adherencia
const getAdherenciaData = async (metric: string): Promise<ERPSyncData | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const adherenciaData: Record<string, ERPSyncData> = {
    adherencia: {
      source: 'adherencia',
      metric: 'adherencia',
      value: 75,
      unit: '%',
      timestamp: new Date().toISOString(),
      metadata: {
        period: 'mes',
        category: 'operacional',
      },
    },
    sesiones_completadas: {
      source: 'adherencia',
      metric: 'sesiones_completadas',
      value: 120,
      unit: 'sesiones',
      timestamp: new Date().toISOString(),
      metadata: {
        period: 'mes',
        category: 'operacional',
      },
    },
    retencion: {
      source: 'adherencia',
      metric: 'retencion',
      value: 85,
      unit: '%',
      timestamp: new Date().toISOString(),
      metadata: {
        period: 'mes',
        category: 'operacional',
      },
    },
  };
  
  return adherenciaData[metric] || null;
};

// Simular datos de campañas
const getCampanasData = async (metric: string): Promise<ERPSyncData | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const campanasData: Record<string, ERPSyncData> = {
    leads_generados: {
      source: 'campanas',
      metric: 'leads_generados',
      value: 45,
      unit: 'leads',
      timestamp: new Date().toISOString(),
      metadata: {
        period: 'mes',
        category: 'marketing',
      },
    },
    conversion_rate: {
      source: 'campanas',
      metric: 'conversion_rate',
      value: 12.5,
      unit: '%',
      timestamp: new Date().toISOString(),
      metadata: {
        period: 'mes',
        category: 'marketing',
      },
    },
    roi: {
      source: 'campanas',
      metric: 'roi',
      value: 250,
      unit: '%',
      timestamp: new Date().toISOString(),
      metadata: {
        period: 'mes',
        category: 'marketing',
      },
    },
  };
  
  return campanasData[metric] || null;
};

// User Story: Simular datos de nutrición
const getNutricionData = async (metric: string): Promise<ERPSyncData | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const nutricionData: Record<string, ERPSyncData> = {
    adherencia_nutricional: {
      source: 'nutricion',
      metric: 'adherencia_nutricional',
      value: 82,
      unit: '%',
      timestamp: new Date().toISOString(),
      metadata: {
        period: 'mes',
        category: 'nutricion',
      },
    },
    check_ins_completados: {
      source: 'nutricion',
      metric: 'check_ins_completados',
      value: 45,
      unit: 'check-ins',
      timestamp: new Date().toISOString(),
      metadata: {
        period: 'mes',
        category: 'nutricion',
      },
    },
    cumplimiento_macros: {
      source: 'nutricion',
      metric: 'cumplimiento_macros',
      value: 85,
      unit: '%',
      timestamp: new Date().toISOString(),
      metadata: {
        period: 'mes',
        category: 'nutricion',
      },
    },
    clientes_con_plan_nutricional: {
      source: 'nutricion',
      metric: 'clientes_con_plan_nutricional',
      value: 120,
      unit: 'clientes',
      timestamp: new Date().toISOString(),
      metadata: {
        period: 'mes',
        category: 'nutricion',
      },
    },
  };
  
  return nutricionData[metric] || null;
};

// User Story: Simular datos de ventas
const getVentasData = async (metric: string): Promise<ERPSyncData | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const ventasData: Record<string, ERPSyncData> = {
    facturacion_mensual: {
      source: 'ventas',
      metric: 'facturacion_mensual',
      value: 35000,
      unit: '€',
      timestamp: new Date().toISOString(),
      metadata: {
        period: 'mes',
        category: 'ventas',
      },
    },
    ingresos_totales: {
      source: 'ventas',
      metric: 'ingresos_totales',
      value: 98200,
      unit: '€',
      timestamp: new Date().toISOString(),
      metadata: {
        period: 'mes',
        category: 'ventas',
      },
    },
    nuevos_clientes: {
      source: 'ventas',
      metric: 'nuevos_clientes',
      value: 25,
      unit: 'clientes',
      timestamp: new Date().toISOString(),
      metadata: {
        period: 'mes',
        category: 'ventas',
      },
    },
    tasa_conversion: {
      source: 'ventas',
      metric: 'tasa_conversion',
      value: 15.5,
      unit: '%',
      timestamp: new Date().toISOString(),
      metadata: {
        period: 'mes',
        category: 'ventas',
      },
    },
    ventas_plan_mensual: {
      source: 'ventas',
      metric: 'ventas_plan_mensual',
      value: 45,
      unit: 'planes',
      timestamp: new Date().toISOString(),
      metadata: {
        period: 'mes',
        category: 'ventas',
      },
    },
  };
  
  return ventasData[metric] || null;
};

// Obtener datos de una fuente ERP específica
export const getERPSyncData = async (
  source: ERPSource,
  metric: string
): Promise<ERPSyncData | null> => {
  switch (source) {
    case 'finanzas':
      return getFinanzasData(metric);
    case 'adherencia':
      return getAdherenciaData(metric);
    case 'campanas':
      return getCampanasData(metric);
    case 'nutricion':
      return getNutricionData(metric);
    case 'ventas':
      return getVentasData(metric);
    default:
      return null;
  }
};

// Obtener todas las configuraciones de sincronización
export const getSyncConfigs = async (): Promise<WidgetSyncConfig[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Cargar desde localStorage
  const saved = localStorage.getItem('widget-sync-configs');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading sync configs:', e);
    }
  }
  
  return [...mockSyncConfigs];
};

// Obtener configuración de sincronización para un widget específico
export const getSyncConfig = async (widgetId: string): Promise<WidgetSyncConfig | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const configs = await getSyncConfigs();
  return configs.find(config => config.widgetId === widgetId) || null;
};

// Crear o actualizar configuración de sincronización
export const saveSyncConfig = async (config: WidgetSyncConfig): Promise<WidgetSyncConfig> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const configs = await getSyncConfigs();
  const existingIndex = configs.findIndex(c => c.widgetId === config.widgetId);
  
  const updatedConfig = {
    ...config,
    lastSync: config.lastSync || new Date().toISOString(),
  };
  
  if (existingIndex >= 0) {
    configs[existingIndex] = updatedConfig;
  } else {
    configs.push(updatedConfig);
  }
  
  // Guardar en localStorage
  localStorage.setItem('widget-sync-configs', JSON.stringify(configs));
  
  return updatedConfig;
};

// Eliminar configuración de sincronización
export const deleteSyncConfig = async (widgetId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const configs = await getSyncConfigs();
  const filtered = configs.filter(c => c.widgetId !== widgetId);
  localStorage.setItem('widget-sync-configs', JSON.stringify(filtered));
};

// Sincronizar un widget específico
export const syncWidget = async (widgetId: string): Promise<ERPSyncData | null> => {
  const config = await getSyncConfig(widgetId);
  
  if (!config || !config.syncEnabled) {
    return null;
  }
  
  try {
    const data = await getERPSyncData(config.source, config.sourceMetric);
    
    // Actualizar última sincronización
    if (data) {
      await saveSyncConfig({
        ...config,
        lastSync: new Date().toISOString(),
      });
    }
    
    return data;
  } catch (error) {
    console.error('Error syncing widget:', error);
    throw error;
  }
};

// Obtener estado de sincronización de un widget
export const getSyncStatus = async (widgetId: string): Promise<WidgetSyncStatus> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const config = await getSyncConfig(widgetId);
  
  if (!config) {
    return {
      widgetId,
      isSyncing: false,
      lastSyncStatus: 'pending',
    };
  }
  
  const nextSyncTime = config.lastSync && config.autoSync
    ? new Date(new Date(config.lastSync).getTime() + config.syncInterval * 1000).toISOString()
    : undefined;
  
  return {
    widgetId,
    isSyncing: false,
    lastSyncTime: config.lastSync,
    lastSyncStatus: config.lastSync ? 'success' : 'pending',
    nextSyncTime,
  };
};

// Sincronizar todos los widgets activos
export const syncAllWidgets = async (): Promise<{ widgetId: string; success: boolean; data?: ERPSyncData }[]> => {
  const configs = await getSyncConfigs();
  const activeConfigs = configs.filter(c => c.syncEnabled && c.autoSync);
  
  const results = await Promise.allSettled(
    activeConfigs.map(async (config) => {
      try {
        const data = await syncWidget(config.widgetId);
        return {
          widgetId: config.widgetId,
          success: !!data,
          data: data || undefined,
        };
      } catch (error) {
        return {
          widgetId: config.widgetId,
          success: false,
        };
      }
    })
  );
  
  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    }
    return {
      widgetId: activeConfigs[index].widgetId,
      success: false,
    };
  });
};

// Obtener métricas disponibles por fuente ERP
export const getAvailableMetrics = async (source: ERPSource): Promise<{ id: string; name: string; unit: string }[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const metrics: Record<ERPSource, { id: string; name: string; unit: string }[]> = {
    finanzas: [
      { id: 'facturacion', name: 'Facturación', unit: '€' },
      { id: 'ingresos', name: 'Ingresos', unit: '€' },
      { id: 'gastos', name: 'Gastos', unit: '€' },
      { id: 'beneficio', name: 'Beneficio', unit: '€' },
    ],
    adherencia: [
      { id: 'adherencia', name: 'Adherencia', unit: '%' },
      { id: 'sesiones_completadas', name: 'Sesiones Completadas', unit: 'sesiones' },
      { id: 'retencion', name: 'Retención', unit: '%' },
      { id: 'clientes_activos', name: 'Clientes Activos', unit: 'clientes' },
    ],
    campanas: [
      { id: 'leads_generados', name: 'Leads Generados', unit: 'leads' },
      { id: 'conversion_rate', name: 'Tasa de Conversión', unit: '%' },
      { id: 'roi', name: 'ROI', unit: '%' },
      { id: 'gasto_campana', name: 'Gasto en Campaña', unit: '€' },
    ],
    nutricion: [
      { id: 'adherencia_nutricional', name: 'Adherencia Nutricional', unit: '%' },
      { id: 'check_ins_completados', name: 'Check-ins Completados', unit: 'check-ins' },
      { id: 'cumplimiento_macros', name: 'Cumplimiento Macros', unit: '%' },
      { id: 'clientes_con_plan_nutricional', name: 'Clientes con Plan Nutricional', unit: 'clientes' },
    ],
    ventas: [
      { id: 'facturacion_mensual', name: 'Facturación Mensual', unit: '€' },
      { id: 'ingresos_totales', name: 'Ingresos Totales', unit: '€' },
      { id: 'nuevos_clientes', name: 'Nuevos Clientes', unit: 'clientes' },
      { id: 'tasa_conversion', name: 'Tasa de Conversión', unit: '%' },
      { id: 'ventas_plan_mensual', name: 'Ventas Plan Mensual', unit: 'planes' },
    ],
  };
  
  return metrics[source] || [];
};

