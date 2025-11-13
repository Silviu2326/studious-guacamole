import React, { useState, useEffect, useMemo, useRef } from 'react';
import { PerformanceData, Metric, Objective, GlobalFilters, KPI, HighlightedInsight, DetectedAnomaly, ImportantChange, AIHighlightsConfig } from '../types';
import { getPerformanceDashboard } from '../api/performance';
import { getKPIs } from '../api/metrics';
import { generateHighlightedInsights, detectAnomalies, detectImportantChanges, getAIHighlightsConfig, saveAIHighlightsConfig } from '../api/aiSuggestions';
import { getSyncConfigs, syncAllWidgets } from '../api/sync';
import { WidgetSyncConfig } from './WidgetSyncConfig';
import { ObjectivesWidget } from './ObjectivesWidget';
import { Card, MetricCards, Button, Badge } from '../../../components/componentsreutilizables';
import { BarChart3, TrendingUp, TrendingDown, Target, AlertCircle, Loader2, PieChart, LineChart, Activity, Award, Calendar, ArrowUpRight, ArrowDownRight, DollarSign, Users, Heart, TrendingUp as TrendingUpIcon, Percent, Sparkles, Lightbulb, AlertTriangle, CheckCircle2, Info, RefreshCw, Zap, Download, FileDown, Image, Code, Copy } from 'lucide-react';
import { exportMetricsToCSV, exportChartAsImage, generateEmbedCode, copyEmbedCode } from '../utils/export';

interface PerformanceDashboardProps {
  role: 'entrenador' | 'gimnasio';
  globalFilters?: GlobalFilters;
  periodo?: 'semana' | 'mes' | 'trimestre';
}

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({ role, globalFilters, periodo }) => {
  const [data, setData] = useState<PerformanceData | null>(null);
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // User Story: Estados para highlights automáticos de IA
  const [aiHighlightsConfig, setAiHighlightsConfig] = useState<AIHighlightsConfig>(getAIHighlightsConfig);
  const [insights, setInsights] = useState<HighlightedInsight[]>([]);
  const [anomalies, setAnomalies] = useState<DetectedAnomaly[]>([]);
  const [importantChanges, setImportantChanges] = useState<ImportantChange[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(false);
  
  // User Story: Referencias para gráficos para exportación
  const chartRefs = useRef<Map<string, HTMLElement>>(new Map());
  
  // Mapear periodo a formato de API
  const period = periodo === 'semana' ? 'week' : periodo === 'trimestre' ? 'quarter' : 'month';

  useEffect(() => {
    loadDashboard();
  }, [role, period, globalFilters]);

  // User Story: Cargar highlights cuando se activan o cuando cambian los datos
  useEffect(() => {
    if (aiHighlightsConfig.enabled && data) {
      loadAIHighlights(data);
    }
  }, [aiHighlightsConfig.enabled, data]);

  // User Story 1: Sincronización en tiempo real
  useEffect(() => {
    const startAutoSync = async () => {
      // Limpiar intervalo anterior si existe
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }

      // Obtener configuraciones de sincronización activas
      const configs = await getSyncConfigs();
      const activeConfigs = configs.filter(c => c.syncEnabled && c.autoSync);

      if (activeConfigs.length === 0) {
        return;
      }

      // Encontrar el intervalo mínimo
      const minInterval = Math.min(...activeConfigs.map(c => c.syncInterval));

      // Configurar sincronización automática
      syncIntervalRef.current = setInterval(async () => {
        try {
          const results = await syncAllWidgets();
          
          // Actualizar métricas si hay cambios
          const updatedMetrics = [...(data?.metrics || [])];
          let hasChanges = false;

          results.forEach((result) => {
            if (result.success && result.data) {
              const metricIndex = updatedMetrics.findIndex(m => m.id === result.widgetId);
              if (metricIndex >= 0) {
                updatedMetrics[metricIndex] = {
                  ...updatedMetrics[metricIndex],
                  value: result.data.value,
                  unit: result.data.unit,
                };
                hasChanges = true;
              }
            }
          });

          if (hasChanges && data) {
            setData({
              ...data,
              metrics: updatedMetrics,
            });
          }
        } catch (error) {
          console.error('Error in auto-sync:', error);
        }
      }, minInterval * 1000);
    };

    if (data) {
      startAutoSync();
    }

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [data]);

  // Listen for KPI configuration changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.startsWith('kpi-config-') || e.key === 'widget-sync-configs') {
        loadDashboard();
      }
    };
    
    const handleCustomRefresh = () => {
      loadDashboard();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('kpi-config-updated', handleCustomRefresh);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('kpi-config-updated', handleCustomRefresh);
    };
  }, [role, period, globalFilters]);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [dashboardData, kpiConfig] = await Promise.all([
        getPerformanceDashboard(role, period),
        getKPIs(role),
      ]);
      setData(dashboardData);
      setKpis(kpiConfig);
      
      // User Story: Cargar insights y detectar anomalías si los highlights están activados
      if (aiHighlightsConfig.enabled && dashboardData) {
        loadAIHighlights(dashboardData);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // User Story: Cargar highlights de IA (insights, anomalías y cambios importantes)
  const loadAIHighlights = async (dashboardData: PerformanceData) => {
    setLoadingInsights(true);
    try {
      const [insightsData, anomaliesData, changesData] = await Promise.all([
        generateHighlightedInsights(role, dashboardData, periodo || 'mes'),
        detectAnomalies(dashboardData.metrics, aiHighlightsConfig),
        detectImportantChanges(dashboardData.metrics, aiHighlightsConfig),
      ]);
      setInsights(insightsData);
      setAnomalies(anomaliesData);
      setImportantChanges(changesData);
    } catch (error) {
      console.error('Error loading AI highlights:', error);
    } finally {
      setLoadingInsights(false);
    }
  };

  // User Story: Toggle de highlights de IA
  const handleToggleAIHighlights = (enabled: boolean) => {
    const newConfig = { ...aiHighlightsConfig, enabled };
    setAiHighlightsConfig(newConfig);
    saveAIHighlightsConfig(newConfig);
    
    if (enabled && data) {
      loadAIHighlights(data);
    } else {
      setInsights([]);
      setAnomalies([]);
      setImportantChanges([]);
    }
  };

  // User Story: Handlers de exportación
  const handleExportCSV = () => {
    if (data) {
      exportMetricsToCSV(data.metrics, 'dashboard_metricas');
    }
  };

  const handleExportChart = async (chartId: string, format: 'png' | 'jpg' | 'svg' = 'png') => {
    const chartElement = chartRefs.current.get(chartId);
    if (chartElement) {
      await exportChartAsImage(chartElement, format, `dashboard_${chartId}`);
    }
  };

  const handleCopyEmbedCode = async (chartId: string) => {
    const embedCode = generateEmbedCode(chartId);
    const success = await copyEmbedCode(embedCode);
    if (success) {
      alert('Código embed copiado al portapapeles');
    } else {
      alert('Error al copiar el código embed');
    }
  };

  // Iconos para cada KPI
  const getKPIIcon = (metricId: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      facturacion: <DollarSign className="w-5 h-5" />,
      retencion: <Users className="w-5 h-5" />,
      nps: <Heart className="w-5 h-5" />,
      adherencia: <Activity className="w-5 h-5" />,
      ocupacion: <Percent className="w-5 h-5" />,
      tasa_bajas: <TrendingDown className="w-5 h-5" />,
    };
    return iconMap[metricId] || <BarChart3 className="w-5 h-5" />;
  };

  // Filtrar y ordenar métricas según configuración de KPIs
  const filteredAndOrderedMetrics = useMemo(() => {
    if (!data) return [];
    
    // Obtener KPIs visibles y ordenados
    const visibleKPIs = kpis
      .filter(kpi => kpi.visible !== false && kpi.enabled)
      .sort((a, b) => (a.order || 999) - (b.order || 999));
    
    // Mapear métricas según configuración de KPIs
    const metricsMap = new Map(data.metrics.map(m => [m.id, m]));
    
    return visibleKPIs
      .map(kpi => metricsMap.get(kpi.metric))
      .filter((metric): metric is Metric => metric !== undefined);
  }, [data, kpis]);

  // User Story 1: Manejar sincronización de métricas
  const handleMetricSync = (metricId: string, syncData: { value: number; unit: string }) => {
    if (!data) return;
    
    const updatedMetrics = data.metrics.map(m => 
      m.id === metricId 
        ? { ...m, value: syncData.value, unit: syncData.unit }
        : m
    );
    
    setData({
      ...data,
      metrics: updatedMetrics,
    });
  };

  // Crear datos para las tarjetas de métricas mejoradas
  const metricsData = useMemo(() => {
    return filteredAndOrderedMetrics.map((metric) => {
      // Calcular progreso hacia la meta
      const progressToTarget = metric.target 
        ? Math.min((metric.value / metric.target) * 100, 100)
        : null;
      
      // Determinar color según estado
      let color: 'primary' | 'success' | 'warning' | 'error' | 'info' = 'primary';
      if (metric.target) {
        if (metric.value >= metric.target) {
          color = 'success';
        } else if (progressToTarget && progressToTarget >= 75) {
          color = 'info';
        } else if (progressToTarget && progressToTarget >= 50) {
          color = 'warning';
        } else {
          color = 'error';
        }
      } else if (metric.trend?.direction === 'down' && metric.id !== 'tasa_bajas') {
        color = 'error';
      } else if (metric.trend?.direction === 'up') {
        color = 'success';
      }

      // Formatear valor
      const formattedValue = metric.unit === '€' 
        ? new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(metric.value)
        : `${metric.value} ${metric.unit}`;

      // Crear subtítulo con meta y variación
      const subtitleParts: string[] = [];
      if (metric.target) {
        const targetFormatted = metric.unit === '€'
          ? new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(metric.target)
          : `${metric.target} ${metric.unit}`;
        subtitleParts.push(`Meta: ${targetFormatted}`);
      }
      if (metric.variation !== undefined) {
        const variationSign = metric.variation >= 0 ? '+' : '';
        subtitleParts.push(`Var: ${variationSign}${metric.variation.toFixed(1)}%`);
      }

      return {
        id: metric.id,
        title: metric.name,
        value: formattedValue,
        subtitle: subtitleParts.join(' • '),
        icon: getKPIIcon(metric.id),
        color,
        trend: metric.trend ? {
          value: Math.abs(metric.trend.value),
          direction: metric.trend.direction,
          label: metric.trend.period,
        } : undefined,
      };
    });
  }, [filteredAndOrderedMetrics]);

  // Calcular tasa de éxito de objetivos
  const successRate = data ? (data.summary.achievedObjectives / data.summary.totalObjectives) * 100 : 0;
  
  // Objetivos próximos a vencer (próximos 30 días)
  const upcomingDeadlines = data?.objectives.filter(obj => {
    const deadline = new Date(obj.deadline);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 30;
  }) || [];

  // Generar datos simulados para gráficos
  const generateChartData = (metricId: string, days: number = 30) => {
    const data = [];
    const baseValue = role === 'entrenador' ? 35000 : 250000;
    for (let i = 0; i < days; i++) {
      data.push({
        date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
        value: baseValue + (Math.random() * 5000 - 2500) + (i * 100),
      });
    }
    return data;
  };

  const getStatusDistribution = () => {
    if (!data) return { achieved: 0, inProgress: 0, atRisk: 0, notStarted: 0 };
    return {
      achieved: data.summary.achievedObjectives,
      inProgress: data.summary.inProgressObjectives,
      atRisk: data.summary.atRiskObjectives,
      notStarted: data.summary.totalObjectives - data.summary.achievedObjectives - data.summary.inProgressObjectives - data.summary.atRiskObjectives,
    };
  };

  const statusDistribution = getStatusDistribution();

  if (loading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
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

  const chartData = selectedMetric ? generateChartData(selectedMetric) : generateChartData('facturacion');

  return (
    <div className="space-y-6">
      {/* Toolbar superior */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Resumen Ejecutivo</h2>
        </div>
        
        {/* User Story: Toggle de highlights automáticos de IA */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200">
            <Zap className={`w-4 h-4 ${aiHighlightsConfig.enabled ? 'text-yellow-500' : 'text-gray-400'}`} />
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={aiHighlightsConfig.enabled}
                onChange={(e) => handleToggleAIHighlights(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Highlights IA
              </span>
            </label>
          </div>
          
          {/* User Story: Botón de exportación */}
          <div className="relative group">
            <Button
              variant="secondary"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Exportar
            </Button>
            <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <button
                onClick={handleExportCSV}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <FileDown className="w-4 h-4" />
                Exportar CSV
              </button>
              <button
                onClick={() => handleExportChart('evolution-chart', 'png')}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Image className="w-4 h-4" />
                Exportar Gráfico (PNG)
              </button>
              <button
                onClick={() => handleCopyEmbedCode('evolution-chart')}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Code className="w-4 h-4" />
                Copiar Código Embed
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Métricas/KPIs principales - Tarjetas mejoradas con tendencias, metas y variaciones */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Indicadores Clave (KPIs)</h3>
            <p className="text-sm text-gray-600 mt-1">
              Visión panorámica de los indicadores clave con tendencias, metas y variaciones
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={async () => {
                const results = await syncAllWidgets();
                loadDashboard();
              }}
              className="text-sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Sincronizar Todo
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metricsData.map((metric) => (
            <Card key={metric.id} className="p-4 bg-white shadow-sm relative">
              <div className="absolute top-2 right-2">
                <WidgetSyncConfig
                  widgetId={metric.id}
                  widgetName={metric.title}
                  currentValue={parseFloat(metric.value.replace(/[^\d.-]/g, ''))}
                  currentUnit={metric.value.replace(/[\d.-]/g, '').trim()}
                  onSync={(syncData) => handleMetricSync(metric.id, syncData)}
                />
              </div>
              <div className="pr-8">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    {metric.icon}
                    <span className="text-sm font-medium text-gray-700">{metric.title}</span>
                  </div>
                </div>
                <div className="mb-2">
                  <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                  {metric.subtitle && (
                    <div className="text-xs text-gray-500 mt-1">{metric.subtitle}</div>
                  )}
                </div>
                {metric.trend && (
                  <div className={`flex items-center gap-1 text-xs ${
                    metric.trend.direction === 'up' ? 'text-green-600' :
                    metric.trend.direction === 'down' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {metric.trend.direction === 'up' ? <ArrowUpRight className="w-3 h-3" /> :
                     metric.trend.direction === 'down' ? <ArrowDownRight className="w-3 h-3" /> :
                     null}
                    <span>
                      {metric.trend.direction === 'up' ? '+' : ''}
                      {metric.trend.value}% {metric.trend.label}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Sección de análisis visual */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de evolución temporal */}
        <Card 
          className="p-6 bg-white shadow-sm"
          ref={(el) => {
            if (el) chartRefs.current.set('evolution-chart', el);
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <LineChart className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Evolución Temporal</h3>
            </div>
            <select
              value={selectedMetric || ''}
              onChange={(e) => setSelectedMetric(e.target.value || null)}
              className="rounded-lg bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-1.5 text-sm"
            >
              <option value="">Seleccionar métrica</option>
              {data.metrics.map(metric => (
                <option key={metric.id} value={metric.id}>{metric.name}</option>
              ))}
            </select>
          </div>
          <div className="h-64 flex items-end justify-between gap-1">
            {chartData.map((point, index) => {
              const maxValue = Math.max(...chartData.map(p => p.value));
              const height = (point.value / maxValue) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg hover:from-blue-700 hover:to-blue-500 transition-all cursor-pointer group relative"
                    style={{ height: `${height}%`, minHeight: '4px' }}
                    title={`${point.date}: ${point.value.toFixed(0)}`}
                  >
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {point.date}: {point.value.toFixed(0)}
                    </div>
                  </div>
                  {index % 5 === 0 && (
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
                {(chartData.reduce((acc, p) => acc + p.value, 0) / chartData.length).toFixed(0)}
              </span>
            </div>
          </div>
        </Card>

        {/* Distribución de objetivos por estado */}
        <Card className="p-6 bg-white shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Distribución de Objetivos</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">Alcanzados</span>
              </div>
              <span className="text-lg font-bold text-green-600">{statusDistribution.achieved}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">En Progreso</span>
              </div>
              <span className="text-lg font-bold text-blue-600">{statusDistribution.inProgress}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-600 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">En Riesgo</span>
              </div>
              <span className="text-lg font-bold text-yellow-600">{statusDistribution.atRisk}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">No Iniciados</span>
              </div>
              <span className="text-lg font-bold text-gray-600">{statusDistribution.notStarted}</span>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Tasa de éxito</span>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-500" />
                <span className="text-lg font-bold text-gray-900">{successRate.toFixed(1)}%</span>
              </div>
            </div>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${successRate}%` }}
              ></div>
            </div>
          </div>
        </Card>
      </div>

      {/* Cards de resumen mejorados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-white shadow-sm border-l-4 border-l-blue-600">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900">
              Objetivos Totales
            </h3>
            <Target className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">
            {data.summary.totalObjectives}
          </p>
          <p className="text-xs text-gray-500">Activos y completados</p>
        </Card>

        <Card className="p-6 bg-white shadow-sm border-l-4 border-l-green-600">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900">
              Alcanzados
            </h3>
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-600 mb-2">
            {data.summary.achievedObjectives}
          </p>
          <div className="flex items-center gap-1 text-xs text-green-600">
            <ArrowUpRight className="w-3 h-3" />
            <span>+{((data.summary.achievedObjectives / data.summary.totalObjectives) * 100).toFixed(0)}%</span>
          </div>
        </Card>

        <Card className="p-6 bg-white shadow-sm border-l-4 border-l-yellow-600">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900">
              En Riesgo
            </h3>
            <AlertCircle className="w-6 h-6 text-yellow-600" />
          </div>
          <p className="text-3xl font-bold text-yellow-600 mb-2">
            {data.summary.atRiskObjectives}
          </p>
          <p className="text-xs text-gray-500">Requieren atención</p>
        </Card>

        <Card className="p-6 bg-white shadow-sm border-l-4 border-l-purple-600">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900">
              En Progreso
            </h3>
            <Activity className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-purple-600 mb-2">
            {data.summary.inProgressObjectives}
          </p>
          <p className="text-xs text-gray-500">En desarrollo activo</p>
        </Card>
      </div>

      {/* Widget de Objetivos - User Story: Incrustar widgets en Plan de Acción */}
      <ObjectivesWidget
        maxObjectives={5}
        statusFilter="in_progress"
        compact={false}
        title="Objetivos Activos con Plan de Acción"
        showAllLink={true}
      />

      {/* Objetivos próximos a vencer */}
      {upcomingDeadlines.length > 0 && (
        <Card className="p-6 bg-white shadow-sm border-l-4 border-l-orange-500">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">Objetivos Próximos a Vencer</h3>
            <span className="ml-auto px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
              {upcomingDeadlines.length}
            </span>
          </div>
          <div className="space-y-3">
            {upcomingDeadlines.slice(0, 3).map((objective) => {
              const deadline = new Date(objective.deadline);
              const today = new Date();
              const diffTime = deadline.getTime() - today.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              
              return (
                <div key={objective.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-900">{objective.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      Vence en {diffDays} día{diffDays !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-orange-700">
                      {objective.progress.toFixed(0)}%
                    </div>
                    <div className="text-xs text-gray-500">
                      {objective.currentValue} / {objective.targetValue} {objective.unit}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Análisis de tendencias por categoría */}
      <Card className="p-6 bg-white shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Análisis por Categoría</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['financiero', 'operacional'].map((category) => {
            const categoryMetrics = data.metrics.filter(m => m.category === category);
            const avgProgress = categoryMetrics.length > 0
              ? categoryMetrics.reduce((acc, m) => {
                  const progress = m.target ? (m.value / m.target) * 100 : 0;
                  return acc + progress;
                }, 0) / categoryMetrics.length
              : 0;
            
            return (
              <div key={category} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 capitalize">{category}</span>
                  <span className={`text-sm font-semibold ${
                    avgProgress >= 100 ? 'text-green-600' :
                    avgProgress >= 75 ? 'text-blue-600' :
                    avgProgress >= 50 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {avgProgress.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      avgProgress >= 100 ? 'bg-green-600' :
                      avgProgress >= 75 ? 'bg-blue-600' :
                      avgProgress >= 50 ? 'bg-yellow-600' :
                      'bg-red-600'
                    }`}
                    style={{ width: `${Math.min(avgProgress, 100)}%` }}
                  ></div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {categoryMetrics.length} métrica{categoryMetrics.length !== 1 ? 's' : ''} activa{categoryMetrics.length !== 1 ? 's' : ''}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* User Story: Anomalías detectadas */}
      {aiHighlightsConfig.enabled && anomalies.length > 0 && (
        <Card className="p-6 bg-white shadow-sm border-l-4 border-l-red-500">
          <div className="flex items-center gap-2 mb-6">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900">Anomalías Detectadas</h3>
            <Badge variant="red" className="ml-2">{anomalies.length}</Badge>
          </div>
          <div className="space-y-3">
            {anomalies.map((anomaly) => (
              <div key={anomaly.id} className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{anomaly.metricName}</h4>
                    <p className="text-sm text-gray-600">{anomaly.description}</p>
                  </div>
                  <Badge variant={anomaly.severity === 'critical' ? 'red' : anomaly.severity === 'high' ? 'orange' : 'yellow'}>
                    {anomaly.severity}
                  </Badge>
                </div>
                <div className="mt-2 text-sm text-gray-700">
                  <p><strong>Valor actual:</strong> {anomaly.currentValue.toFixed(2)} | <strong>Valor esperado:</strong> {anomaly.expectedValue.toFixed(2)}</p>
                  <p className="mt-1 text-xs text-gray-600">{anomaly.aiExplanation}</p>
                  {anomaly.recommendation && (
                    <p className="mt-2 text-xs text-blue-700"><strong>Recomendación:</strong> {anomaly.recommendation}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* User Story: Cambios importantes detectados */}
      {aiHighlightsConfig.enabled && importantChanges.length > 0 && (
        <Card className="p-6 bg-white shadow-sm border-l-4 border-l-orange-500">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">Cambios Importantes</h3>
            <Badge variant="orange" className="ml-2">{importantChanges.length}</Badge>
          </div>
          <div className="space-y-3">
            {importantChanges.map((change) => (
              <div key={change.id} className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{change.metricName}</h4>
                    <p className="text-sm text-gray-600">{change.description}</p>
                  </div>
                  <Badge variant={change.significance === 'high' ? 'orange' : 'yellow'}>
                    {change.significance}
                  </Badge>
                </div>
                <div className="mt-2 text-sm text-gray-700">
                  <p><strong>Anterior:</strong> {change.previousValue.toFixed(2)} | <strong>Actual:</strong> {change.currentValue.toFixed(2)} ({change.changePercent > 0 ? '+' : ''}{change.changePercent.toFixed(1)}%)</p>
                  <p className="mt-1 text-xs text-gray-600">{change.aiExplanation}</p>
                  {change.recommendation && (
                    <p className="mt-2 text-xs text-blue-700"><strong>Recomendación:</strong> {change.recommendation}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Insights destacados con explicaciones de IA */}
      {aiHighlightsConfig.enabled && insights.length > 0 && (
        <Card className="p-6 bg-white shadow-sm border-l-4 border-l-blue-500">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Insights Destacados con IA</h3>
            {loadingInsights && (
              <Loader2 className="w-4 h-4 text-gray-400 animate-spin ml-auto" />
            )}
          </div>
          
          <div className="space-y-4">
            {insights.map((insight) => {
              const getInsightIcon = () => {
                switch (insight.type) {
                  case 'opportunity':
                    return <Lightbulb className="w-5 h-5 text-yellow-500" />;
                  case 'achievement':
                    return <CheckCircle2 className="w-5 h-5 text-green-500" />;
                  case 'warning':
                    return <AlertTriangle className="w-5 h-5 text-orange-500" />;
                  case 'trend':
                    return <TrendingUp className="w-5 h-5 text-blue-500" />;
                  default:
                    return <Info className="w-5 h-5 text-gray-500" />;
                }
              };

              const getInsightColor = () => {
                switch (insight.type) {
                  case 'opportunity':
                    return 'bg-yellow-50 border-yellow-200';
                  case 'achievement':
                    return 'bg-green-50 border-green-200';
                  case 'warning':
                    return 'bg-orange-50 border-orange-200';
                  case 'trend':
                    return 'bg-blue-50 border-blue-200';
                  default:
                    return 'bg-gray-50 border-gray-200';
                }
              };

              const getImpactBadge = () => {
                const colors = {
                  high: 'bg-red-100 text-red-700',
                  medium: 'bg-yellow-100 text-yellow-700',
                  low: 'bg-gray-100 text-gray-700',
                };
                return colors[insight.impact];
              };

              return (
                <Card
                  key={insight.id}
                  variant="hover"
                  className={`p-5 border-l-4 ${getInsightColor()}`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    {getInsightIcon()}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-base font-semibold text-gray-900">
                          {insight.title}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactBadge()}`}>
                          Impacto {insight.impact}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        {insight.description}
                      </p>
                      {insight.percentage && (
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${Math.min(insight.percentage, 100)}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold text-gray-700">
                            {insight.percentage.toFixed(0)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Explicación de IA */}
                  <div className="bg-white rounded-lg p-4 mb-3 border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium text-gray-700">Explicación de IA:</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {insight.aiExplanation}
                    </p>
                  </div>

                  {/* Recomendación accionable */}
                  {insight.actionableRecommendation && (
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <div className="flex items-start gap-2">
                        <Target className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-blue-900 mb-1">Recomendación:</p>
                          <p className="text-sm text-blue-800 leading-relaxed">
                            {insight.actionableRecommendation}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Información adicional */}
                  <div className="mt-3 pt-3 border-t border-gray-200 flex items-center gap-4 text-xs text-gray-500">
                    {insight.value && (
                      <span>
                        Valor: {insight.value.toFixed(2)} {insight.unit}
                      </span>
                    )}
                    {insight.period && (
                      <span>
                        Período: {insight.period}
                      </span>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </Card>
      )}

      {!loadingInsights && insights.length === 0 && data && (
        <Card className="p-6 bg-white shadow-sm">
          <div className="text-center py-4">
            <Sparkles className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No hay insights destacados disponibles en este momento</p>
          </div>
        </Card>
      )}
    </div>
  );
};

