import React, { useState, useEffect, useMemo } from 'react';
import { PerformanceData, Metric, Objective, Alert } from '../types';
import { getPerformanceOverview } from '../api/performance';
import { Card, MetricCards } from '../../../components/componentsreutilizables';
import { AlertsManager } from './AlertsManager';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  AlertCircle, 
  Loader2, 
  PieChart, 
  LineChart, 
  Activity, 
  Award, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  DollarSign,
  Users,
  TrendingUp as TrendingUpIcon,
  AlertTriangle
} from 'lucide-react';

interface PerformanceDashboardProps {
  role: 'entrenador' | 'gimnasio';
  performanceData?: PerformanceData;
  alerts?: Alert[];
  onError?: (errorMessage: string) => void;
}

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({ 
  role, 
  performanceData: externalData,
  alerts: externalAlerts,
  onError
}) => {
  const [data, setData] = useState<PerformanceData | null>(externalData || null);
  const [loading, setLoading] = useState(!externalData);
  const [period, setPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState<string>('facturacion');

  useEffect(() => {
    if (!externalData) {
      loadDashboard();
    } else {
      setData(externalData);
    }
  }, [role, period, externalData]);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const dashboardData = await getPerformanceOverview(role, period);
      setData(dashboardData);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      const errorMessage = error instanceof Error ? error.message : 'No se pudieron cargar los datos del dashboard';
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // KPIs principales adaptados por rol
  const primaryKPIs = useMemo(() => {
    if (!data) return [];
    
    const kpis = role === 'entrenador' 
      ? [
          { id: 'facturacion', label: 'Facturación Personal', icon: DollarSign, priority: 1 },
          { id: 'adherencia', label: 'Adherencia', icon: Activity, priority: 2 },
          { id: 'retencion', label: 'Retención', icon: Users, priority: 3 },
          { id: 'clientes_activos', label: 'Clientes Activos', icon: Users, priority: 4 },
        ]
      : [
          { id: 'facturacion', label: 'Facturación Total', icon: DollarSign, priority: 1 },
          { id: 'ocupacion', label: 'Ocupación Media', icon: Activity, priority: 2 },
          { id: 'tasa_bajas', label: 'Tasa de Bajas', icon: TrendingDown, priority: 3 },
          { id: 'socios_activos', label: 'Socios Activos', icon: Users, priority: 4 },
        ];
    
    return data.metrics
      .filter(m => kpis.some(k => k.id === m.id))
      .map(metric => {
        const kpiConfig = kpis.find(k => k.id === metric.id)!;
        return {
          id: metric.id,
          title: kpiConfig.label,
          value: `${metric.value.toLocaleString('es-ES')} ${metric.unit}`,
          subtitle: metric.target ? `Objetivo: ${metric.target.toLocaleString('es-ES')} ${metric.unit}` : undefined,
          icon: <kpiConfig.icon className="w-5 h-5" />,
          color: metric.target && metric.value >= metric.target ? 'success' : 
                 metric.trend?.direction === 'down' && metric.id !== 'tasa_bajas' ? 'error' : 'primary' as const,
          trend: metric.trend ? {
            value: Math.abs(metric.trend.value),
            direction: metric.trend.direction,
            label: metric.trend.period,
          } : undefined,
          priority: kpiConfig.priority,
        };
      })
      .sort((a, b) => a.priority - b.priority);
  }, [data, role]);

  // Objetivos en riesgo (para alertas)
  const objectivesAtRisk = useMemo(() => {
    if (!data) return [];
    return data.objectives
      .filter(obj => obj.status === 'at_risk' || obj.status === 'off_track')
      .slice(0, 5);
  }, [data]);

  // Generar alertas desde objetivos en riesgo
  const generatedAlerts: Alert[] = useMemo(() => {
    if (externalAlerts) return externalAlerts;
    
    return objectivesAtRisk.map(obj => ({
      id: `alert-${obj.id}`,
      type: obj.status === 'at_risk' ? 'warning' : 'error',
      title: `Objetivo en riesgo: ${obj.title}`,
      message: `Progreso: ${obj.progress.toFixed(0)}% (${obj.currentValue} / ${obj.targetValue} ${obj.unit})`,
      objectiveId: obj.id,
      severity: obj.status === 'at_risk' ? 'medium' : 'high',
      createdAt: obj.updatedAt,
      read: false,
    }));
  }, [objectivesAtRisk, externalAlerts]);

  // Datos para el gráfico principal usando timeSeries
  const chartData = useMemo(() => {
    if (!data?.timeSeries) return [];
    
    const dates = data.timeSeries.dates || [];
    const metricKey = role === 'entrenador' 
      ? (selectedMetric === 'facturacion' ? 'facturacion' : selectedMetric === 'clientes_activos' ? 'clientes' : 'facturacion')
      : (selectedMetric === 'facturacion' ? 'facturacion' : selectedMetric === 'socios_activos' ? 'clientes' : 'facturacion');
    
    const values = data.timeSeries.metrics?.[metricKey] || data.timeSeries.metrics?.revenueSeries || [];
    
    return dates.map((date, index) => ({
      date: new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
      value: values[index] || 0,
      fullDate: date,
    }));
  }, [data, selectedMetric, role]);

  // Distribución de objetivos por estado
  const statusDistribution = useMemo(() => {
    if (!data) return { achieved: 0, inProgress: 0, atRisk: 0, notStarted: 0 };
    return {
      achieved: data.summary.achievedObjectives,
      inProgress: data.summary.inProgressObjectives,
      atRisk: data.summary.atRiskObjectives,
      notStarted: data.summary.totalObjectives - data.summary.achievedObjectives - data.summary.inProgressObjectives - data.summary.atRiskObjectives,
    };
  }, [data]);

  // Tasa de éxito
  const successRate = useMemo(() => {
    if (!data || data.summary.totalObjectives === 0) return 0;
    return (data.summary.achievedObjectives / data.summary.totalObjectives) * 100;
  }, [data]);

  // Mensaje ejecutivo rápido (3-5 segundos de comprensión)
  const executiveSummary = useMemo(() => {
    if (!data) return null;
    
    const mainMetric = primaryKPIs[0];
    const isOnTrack = mainMetric && mainMetric.color === 'success';
    const riskCount = data.summary.atRiskObjectives;
    
    return {
      status: isOnTrack ? 'positive' : riskCount > 0 ? 'warning' : 'neutral',
      message: role === 'entrenador'
        ? riskCount > 0 
          ? `${riskCount} objetivo${riskCount !== 1 ? 's' : ''} requiere${riskCount === 1 ? '' : 'n'} atención inmediata`
          : `Todo en orden. ${data.summary.achievedObjectives} de ${data.summary.totalObjectives} objetivos alcanzados.`
        : riskCount > 0
        ? `${riskCount} objetivo${riskCount !== 1 ? 's' : ''} global${riskCount !== 1 ? 'es' : ''} en riesgo`
        : `Rendimiento estable. ${data.summary.achievedObjectives} de ${data.summary.totalObjectives} objetivos cumplidos.`,
    };
  }, [data, primaryKPIs, role]);

  if (loading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando dashboard ejecutivo...</p>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay datos disponibles</h3>
        <p className="text-gray-600">No se encontraron datos de rendimiento para mostrar.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumen ejecutivo rápido (3-5 segundos) */}
      {executiveSummary && (
        <Card className={`p-4 bg-white shadow-sm border-l-4 ${
          executiveSummary.status === 'positive' ? 'border-l-green-600 bg-green-50/30' :
          executiveSummary.status === 'warning' ? 'border-l-yellow-600 bg-yellow-50/30' :
          'border-l-blue-600 bg-blue-50/30'
        }`}>
          <div className="flex items-center gap-3">
            {executiveSummary.status === 'positive' ? (
              <TrendingUpIcon className="w-5 h-5 text-green-600" />
            ) : executiveSummary.status === 'warning' ? (
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            ) : (
              <Activity className="w-5 h-5 text-blue-600" />
            )}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                {role === 'entrenador' ? 'Estado del Mes' : 'Estado General'}
              </h3>
              <p className="text-sm text-gray-700">{executiveSummary.message}</p>
            </div>
          </div>
        </Card>
      )}

      {/* ZONA SUPERIOR: KPIs Clave */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {role === 'entrenador' ? 'KPIs Personales' : 'KPIs Globales'}
          </h2>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2 text-sm"
          >
            <option value="week">Semana</option>
            <option value="month">Mes</option>
            <option value="quarter">Trimestre</option>
            <option value="year">Año</option>
          </select>
        </div>
        <MetricCards data={primaryKPIs} columns={4} />
      </div>

      {/* ZONA CENTRAL: Gráfico Principal + Objetivos y Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico principal de evolución - Ocupa 2 columnas */}
        <Card className="lg:col-span-2 p-6 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <LineChart className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                {role === 'entrenador' 
                  ? 'Evolución de Facturación' 
                  : 'Evolución de Facturación Total'}
              </h3>
            </div>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="rounded-lg bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-1.5 text-sm"
            >
              {data.metrics
                .filter(m => ['facturacion', 'clientes_activos', 'socios_activos'].includes(m.id))
                .map(metric => (
                  <option key={metric.id} value={metric.id}>{metric.name}</option>
                ))}
            </select>
          </div>
          
          {chartData.length > 0 ? (
            <>
              <div className="h-64 flex items-end justify-between gap-1">
                {chartData.map((point, index) => {
                  const maxValue = Math.max(...chartData.map(p => p.value));
                  const height = maxValue > 0 ? (point.value / maxValue) * 100 : 0;
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg hover:from-blue-700 hover:to-blue-500 transition-all cursor-pointer group relative"
                        style={{ height: `${height}%`, minHeight: '4px' }}
                        title={`${point.date}: ${point.value.toLocaleString('es-ES')}`}
                      >
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          {point.date}: {point.value.toLocaleString('es-ES')}
                        </div>
                      </div>
                      {index % Math.ceil(chartData.length / 6) === 0 && (
                        <span className="text-xs text-gray-500 mt-1" style={{ fontSize: '10px' }}>
                          {point.date.split(' ')[0]}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Promedio del período</span>
                  <span className="font-semibold text-gray-900">
                    {chartData.length > 0 
                      ? (chartData.reduce((acc, p) => acc + p.value, 0) / chartData.length).toLocaleString('es-ES', { maximumFractionDigits: 0 })
                      : '0'}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400">
              <p>No hay datos para mostrar</p>
            </div>
          )}
        </Card>

        {/* ZONA LATERAL: Distribución de Objetivos + Alertas Compactas */}
        <div className="space-y-6">
          {/* Distribución de Objetivos por Estado */}
          <Card className="p-6 bg-white shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                {role === 'entrenador' ? 'Mis Objetivos' : 'Objetivos Globales'}
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900">Alcanzados</span>
                </div>
                <span className="text-lg font-bold text-green-600">{statusDistribution.achieved}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900">En Progreso</span>
                </div>
                <span className="text-lg font-bold text-blue-600">{statusDistribution.inProgress}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900">En Riesgo</span>
                </div>
                <span className="text-lg font-bold text-yellow-600">{statusDistribution.atRisk}</span>
              </div>
              {statusDistribution.notStarted > 0 && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-900">No Iniciados</span>
                  </div>
                  <span className="text-lg font-bold text-gray-600">{statusDistribution.notStarted}</span>
                </div>
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Tasa de éxito</span>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-yellow-500" />
                  <span className="text-lg font-bold text-gray-900">{successRate.toFixed(1)}%</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(successRate, 100)}%` }}
                ></div>
              </div>
            </div>
          </Card>

          {/* Alertas Próximas - Modo Compacto */}
          <Card className="p-6 bg-white shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Alertas Relevantes</h3>
              {generatedAlerts.filter(a => !a.read).length > 0 && (
                <span className="ml-auto px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                  {generatedAlerts.filter(a => !a.read).length}
                </span>
              )}
            </div>
            <AlertsManager 
              role={role} 
              compact={true} 
              maxAlerts={3}
              alerts={generatedAlerts}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};
