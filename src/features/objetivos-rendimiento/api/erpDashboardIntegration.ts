/**
 * API para consolidación de métricas de objetivos en dashboards globales del ERP
 * User Story: Como manager quiero consolidar métricas de objetivos en dashboards globales del ERP
 */

import { Objective, Metric } from '../types';

export type ERPDashboardType = 'finanzas' | 'marketing' | 'operaciones';

export interface ERPDashboardMetric {
  id: string;
  dashboardType: ERPDashboardType;
  objectiveId: string;
  objectiveTitle: string;
  metric: string;
  currentValue: number;
  targetValue: number;
  progress: number; // 0-100
  unit: string;
  status: 'on_track' | 'at_risk' | 'behind' | 'exceeded';
  lastUpdated: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
    period: string;
  };
}

export interface Dashboard360Report {
  id: string;
  period: string;
  generatedAt: string;
  generatedBy: string;
  generatedByName: string;
  dashboards: {
    finanzas: ERPDashboardMetric[];
    marketing: ERPDashboardMetric[];
    operaciones: ERPDashboardMetric[];
  };
  summary: {
    totalObjectives: number;
    onTrackObjectives: number;
    atRiskObjectives: number;
    overallProgress: number; // 0-100
    keyInsights: string[];
  };
  crossDashboardInsights?: {
    id: string;
    title: string;
    description: string;
    relatedDashboards: ERPDashboardType[];
    impact: 'high' | 'medium' | 'low';
  }[];
}

export interface ERPDashboardConfig {
  dashboardType: ERPDashboardType;
  enabled: boolean;
  objectives: string[]; // IDs de objetivos a incluir
  metrics: string[]; // IDs de métricas a incluir
  refreshInterval?: number; // Intervalo de actualización en segundos
  lastSync?: string;
}

// Simulación de datos - en producción vendría de una API real
const mockERPMetrics: ERPDashboardMetric[] = [
  {
    id: 'erp-1',
    dashboardType: 'finanzas',
    objectiveId: 'obj-1',
    objectiveTitle: 'Aumentar facturación mensual',
    metric: 'Facturación mensual',
    currentValue: 45000,
    targetValue: 50000,
    progress: 90,
    unit: '€',
    status: 'on_track',
    lastUpdated: new Date().toISOString(),
    trend: {
      value: 5,
      direction: 'up',
      period: 'mes',
    },
  },
  {
    id: 'erp-2',
    dashboardType: 'marketing',
    objectiveId: 'obj-2',
    objectiveTitle: 'Aumentar leads generados',
    metric: 'Leads generados',
    currentValue: 120,
    targetValue: 150,
    progress: 80,
    unit: 'leads',
    status: 'on_track',
    lastUpdated: new Date().toISOString(),
    trend: {
      value: 10,
      direction: 'up',
      period: 'mes',
    },
  },
  {
    id: 'erp-3',
    dashboardType: 'operaciones',
    objectiveId: 'obj-3',
    objectiveTitle: 'Mejorar adherencia de clientes',
    metric: 'Tasa de adherencia',
    currentValue: 70,
    targetValue: 75,
    progress: 93,
    unit: '%',
    status: 'on_track',
    lastUpdated: new Date().toISOString(),
    trend: {
      value: 2,
      direction: 'up',
      period: 'mes',
    },
  },
];

export const getERPDashboardMetrics = async (
  dashboardType: ERPDashboardType
): Promise<ERPDashboardMetric[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockERPMetrics.filter(m => m.dashboardType === dashboardType);
};

export const getAllERPDashboardMetrics = async (): Promise<Record<ERPDashboardType, ERPDashboardMetric[]>> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return {
    finanzas: mockERPMetrics.filter(m => m.dashboardType === 'finanzas'),
    marketing: mockERPMetrics.filter(m => m.dashboardType === 'marketing'),
    operaciones: mockERPMetrics.filter(m => m.dashboardType === 'operaciones'),
  };
};

export const generate360Report = async (
  period: string,
  userId: string,
  userName: string
): Promise<Dashboard360Report> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const allMetrics = await getAllERPDashboardMetrics();
  
  const totalObjectives = Object.values(allMetrics).flat().length;
  const onTrackObjectives = Object.values(allMetrics)
    .flat()
    .filter(m => m.status === 'on_track').length;
  const atRiskObjectives = Object.values(allMetrics)
    .flat()
    .filter(m => m.status === 'at_risk' || m.status === 'behind').length;
  const overallProgress =
    Object.values(allMetrics)
      .flat()
      .reduce((sum, m) => sum + m.progress, 0) / totalObjectives;
  
  const report: Dashboard360Report = {
    id: `report-${Date.now()}`,
    period,
    generatedAt: new Date().toISOString(),
    generatedBy: userId,
    generatedByName: userName,
    dashboards: allMetrics,
    summary: {
      totalObjectives,
      onTrackObjectives,
      atRiskObjectives,
      overallProgress: Math.round(overallProgress),
      keyInsights: [
        'La facturación está en línea con los objetivos establecidos',
        'El marketing muestra un crecimiento constante en leads',
        'La adherencia de clientes ha mejorado significativamente',
      ],
    },
    crossDashboardInsights: [
      {
        id: 'insight-1',
        title: 'Correlación entre marketing y finanzas',
        description: 'El aumento en leads generados está correlacionado con el crecimiento en facturación',
        relatedDashboards: ['marketing', 'finanzas'],
        impact: 'high',
      },
    ],
  };
  
  return report;
};

export const getERPDashboardConfig = async (
  dashboardType: ERPDashboardType
): Promise<ERPDashboardConfig | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // En producción, esto vendría de la base de datos
  return {
    dashboardType,
    enabled: true,
    objectives: [],
    metrics: [],
    refreshInterval: 3600, // 1 hora
  };
};

export const updateERPDashboardConfig = async (
  config: ERPDashboardConfig
): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  // En producción, esto actualizaría la configuración en la base de datos
  console.log('Configuración actualizada:', config);
};

export const syncObjectivesToERPDashboard = async (
  dashboardType: ERPDashboardType,
  objectiveIds: string[]
): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  // En producción, esto sincronizaría los objetivos con el dashboard del ERP
  console.log(`Sincronizando objetivos con dashboard ${dashboardType}:`, objectiveIds);
};

