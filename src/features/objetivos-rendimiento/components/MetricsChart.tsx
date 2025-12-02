import React, { useState, useEffect, useMemo } from 'react';
import { Metric, PerformanceData, MetricCategory } from '../types';
import { getPerformanceMetrics, getPerformanceOverview } from '../api/performance';
import { Card, Button, Select, Badge } from '../../../components/componentsreutilizables';
import { BarChart3, TrendingUp, TrendingDown, Minus, Loader2, LineChart, PieChart, Calendar, Target, Activity, Filter, Info } from 'lucide-react';

export type ChartType = 'bar' | 'line' | 'list';
export type PeriodType = 'week' | 'month' | 'quarter' | 'year' | '30days' | '90days' | '365days';

interface MetricsChartProps {
  /** Rol del usuario */
  role: 'entrenador' | 'gimnasio';
  /** Categoría inicial para filtrar (opcional) */
  category?: string;
  /** Datos de rendimiento completos (opcional, si no se proporciona se cargarán automáticamente) */
  performanceData?: PerformanceData;
  /** Tipo de gráfico inicial (opcional, por defecto 'list') */
  initialChartType?: ChartType;
  /** Período inicial (opcional, por defecto 'month') */
  initialPeriod?: PeriodType;
  /** Callback cuando cambia la categoría seleccionada */
  onCategoryChange?: (category: string) => void;
  /** Callback cuando cambia el período */
  onPeriodChange?: (period: PeriodType) => void;
  /** Callback cuando cambia el tipo de gráfico */
  onChartTypeChange?: (chartType: ChartType) => void;
  /** Si es true, el componente carga sus propios datos */
  autoLoad?: boolean;
  /** Callback para manejar errores */
  onError?: (errorMessage: string) => void;
}

export const MetricsChart: React.FC<MetricsChartProps> = ({ 
  role, 
  category: initialCategory,
  performanceData: externalPerformanceData,
  initialChartType = 'list',
  initialPeriod = 'month',
  onCategoryChange,
  onPeriodChange,
  onChartTypeChange,
  autoLoad = true,
  onError,
}) => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(externalPerformanceData || null);
  const [loading, setLoading] = useState(autoLoad && !externalPerformanceData);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [chartType, setChartType] = useState<ChartType>(initialChartType);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [period, setPeriod] = useState<PeriodType>(initialPeriod);

  // Mapear PeriodType a formato de API
  const mapPeriodToApiFormat = (period: PeriodType): string => {
    if (period === '30days' || period === '90days' || period === '365days') {
      return period === '30days' ? 'month' : period === '90days' ? 'quarter' : 'year';
    }
    return period;
  };

  useEffect(() => {
    if (externalPerformanceData) {
      setPerformanceData(externalPerformanceData);
      setMetrics(externalPerformanceData.metrics);
      setLoading(false);
    } else if (autoLoad) {
      loadMetrics();
    }
  }, [role, externalPerformanceData, autoLoad]);

  useEffect(() => {
    if (autoLoad && !externalPerformanceData) {
      loadMetrics();
    }
  }, [period, role]);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      // Usar getPerformanceOverview para obtener datos completos con timeSeries
      const apiPeriod = mapPeriodToApiFormat(period);
      const data = await getPerformanceOverview(role, apiPeriod);
      setPerformanceData(data);
      let filtered = data.metrics;
      if (initialCategory && initialCategory !== 'all') {
        filtered = data.metrics.filter(m => m.category === initialCategory);
      }
      setMetrics(filtered);
    } catch (error) {
      console.error('Error loading metrics:', error);
      // Fallback a getPerformanceMetrics si getPerformanceOverview falla
      try {
        const apiPeriod = mapPeriodToApiFormat(period);
        const fallbackData = await getPerformanceMetrics(role, apiPeriod);
        setMetrics(fallbackData);
      } catch (fallbackError) {
        console.error('Error loading fallback metrics:', fallbackError);
        const errorMessage = fallbackError instanceof Error ? fallbackError.message : 'No se pudieron cargar las métricas';
        if (onError) {
          onError(errorMessage);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  // Obtener datos de series temporales desde PerformanceData
  const getTimeSeriesData = (metricId: string): Array<{ date: string; value: number }> => {
    if (!performanceData?.timeSeries) {
      return [];
    }

    const metric = metrics.find(m => m.id === metricId);
    if (!metric) return [];

    // Buscar la serie correspondiente en timeSeries.metrics
    // Puede estar por id, name, o por alias común
    const seriesKey = Object.keys(performanceData.timeSeries.metrics).find(key => {
      const lowerKey = key.toLowerCase();
      const lowerMetricId = metricId.toLowerCase();
      const lowerMetricName = metric.name.toLowerCase();
      return lowerKey === lowerMetricId || 
             lowerKey.includes(lowerMetricId) || 
             lowerKey === lowerMetricName.toLowerCase() ||
             lowerKey.includes('facturacion') && metricId === 'facturacion' ||
             lowerKey.includes('retencion') && metricId === 'retencion' ||
             lowerKey.includes('adherencia') && metricId === 'adherencia' ||
             lowerKey.includes('ocupacion') && metricId === 'ocupacion' ||
             lowerKey.includes('clientes') && metricId === 'clientes_activos';
    });

    if (!seriesKey) return [];

    const values = performanceData.timeSeries.metrics[seriesKey];
    const dates = performanceData.timeSeries.dates;

    if (!values || !dates || values.length !== dates.length) {
      return [];
    }

    return dates.map((date, index) => ({
      date: formatDate(date),
      value: values[index] || 0,
    }));
  };

  // Formatear fecha para mostrar
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
    } catch {
      return dateString;
    }
  };

  // Manejar cambio de categoría
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (onCategoryChange) {
      onCategoryChange(category);
    }
  };

  // Manejar cambio de período
  const handlePeriodChange = (newPeriod: PeriodType) => {
    setPeriod(newPeriod);
    if (onPeriodChange) {
      onPeriodChange(newPeriod);
    }
  };

  // Manejar cambio de tipo de gráfico
  const handleChartTypeChange = (newChartType: ChartType) => {
    setChartType(newChartType);
    if (onChartTypeChange) {
      onChartTypeChange(newChartType);
    }
  };

  // Filtrar métricas por categoría
  const filteredMetrics = useMemo(() => {
    if (selectedCategory === 'all') return metrics;
    return metrics.filter(m => m.category === selectedCategory);
  }, [metrics, selectedCategory]);

  // Categorías únicas
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(metrics.map(m => m.category)));
    return uniqueCategories;
  }, [metrics]);

  // Calcular estadísticas agregadas
  const stats = useMemo(() => {
    const total = filteredMetrics.length;
    const withTarget = filteredMetrics.filter(m => m.target).length;
    const onTarget = filteredMetrics.filter(m => m.target && m.value >= m.target).length;
    const avgProgress = withTarget > 0
      ? filteredMetrics
          .filter(m => m.target)
          .reduce((acc, m) => acc + ((m.value / m.target!) * 100), 0) / withTarget
      : 0;

    return { total, withTarget, onTarget, avgProgress };
  }, [filteredMetrics]);

  // Datos del gráfico usando series temporales reales
  const chartData = useMemo(() => {
    const metricId = selectedMetric || filteredMetrics[0]?.id || '';
    if (!metricId) return [];
    return getTimeSeriesData(metricId);
  }, [selectedMetric, filteredMetrics, performanceData]);

  const getTrendIcon = (direction: 'up' | 'down' | 'neutral') => {
    switch (direction) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getProgressColor = (value: number, target?: number) => {
    if (!target) return 'bg-blue-600';
    const percentage = (value / target) * 100;
    if (percentage >= 100) return 'bg-green-600';
    if (percentage >= 75) return 'bg-blue-600';
    if (percentage >= 50) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  // Return condicional DESPUÉS de todos los hooks
  if (loading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar superior */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Análisis de Métricas</h2>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={period}
            onChange={(e) => handlePeriodChange(e.target.value as PeriodType)}
            className="rounded-lg bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-1.5 text-sm"
          >
            <option value="week">Última semana</option>
            <option value="30days">Últimos 30 días</option>
            <option value="month">Último mes</option>
            <option value="90days">Últimos 90 días</option>
            <option value="quarter">Último trimestre</option>
            <option value="365days">Último año</option>
            <option value="year">Año completo</option>
          </select>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-white shadow-sm border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Total Métricas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Activity className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4 bg-white shadow-sm border-l-4 border-l-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Con Objetivo</p>
              <p className="text-2xl font-bold text-green-600">{stats.withTarget}</p>
            </div>
            <Target className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4 bg-white shadow-sm border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Alcanzando Objetivo</p>
              <p className="text-2xl font-bold text-purple-600">{stats.onTarget}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
        <Card className="p-4 bg-white shadow-sm border-l-4 border-l-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">Progreso Medio</p>
              <p className="text-2xl font-bold text-orange-600">{stats.avgProgress.toFixed(0)}%</p>
            </div>
            <BarChart3 className="w-8 h-8 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Filtros y vista */}
      <Card className="p-4 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-600" />
            <label className="text-sm font-medium text-gray-700">Categoría:</label>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="rounded-lg bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-1.5 text-sm"
            >
              <option value="all">Todas</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'financiero' ? 'Finanzas' :
                   cat === 'operacional' ? 'Operaciones' :
                   cat === 'clientes' ? 'Clientes' :
                   cat === 'comercial' ? 'Comercial' :
                   cat === 'calidad' ? 'Calidad' :
                   cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleChartTypeChange('list')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                chartType === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Lista
            </button>
            <button
              onClick={() => handleChartTypeChange('bar')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                chartType === 'bar' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-1" />
              Barras
            </button>
            <button
              onClick={() => handleChartTypeChange('line')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                chartType === 'line' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <LineChart className="w-4 h-4 inline mr-1" />
              Líneas
            </button>
          </div>
        </div>
      </Card>

      {/* Gráfico de barras */}
      {chartType === 'bar' && filteredMetrics.length > 0 && (
        <Card className="p-6 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedMetric && chartData.length > 0 
                  ? 'Evolución Temporal (Barras)' 
                  : 'Comparativa de Métricas'}
              </h3>
            </div>
            <select
              value={selectedMetric || ''}
              onChange={(e) => setSelectedMetric(e.target.value || null)}
              className="rounded-lg bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-1.5 text-sm"
            >
              <option value="">Todas las métricas</option>
              {filteredMetrics.map(metric => (
                <option key={metric.id} value={metric.id}>{metric.name}</option>
              ))}
            </select>
          </div>
          
          {/* Si hay una métrica seleccionada y datos de series temporales, mostrar evolución temporal */}
          {selectedMetric && chartData.length > 0 ? (
            <div className="h-80 flex items-end justify-between gap-1">
              {chartData.map((point, index) => {
                const maxValue = Math.max(...chartData.map(p => p.value), 1);
                const valueHeight = (point.value / maxValue) * 100;
                const metric = filteredMetrics.find(m => m.id === selectedMetric);
                const targetHeight = metric?.target ? (metric.target / maxValue) * 100 : 0;
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-1 group">
                    <div className="relative w-full h-full flex flex-col justify-end">
                      {metric?.target && (
                        <div
                          className="w-full bg-gray-300 rounded-t opacity-30 mb-0.5"
                          style={{ height: `${targetHeight}%`, minHeight: '2px' }}
                          title={`Objetivo: ${metric.target} ${metric.unit}`}
                        />
                      )}
                      <div
                        className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t hover:from-blue-700 hover:to-blue-500 transition-all cursor-pointer group relative"
                        style={{ height: `${valueHeight}%`, minHeight: '4px' }}
                        title={`${point.date}: ${point.value.toFixed(metric?.unit === '%' ? 1 : 0)} ${metric?.unit || ''}`}
                      >
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          {point.date}: {point.value.toFixed(metric?.unit === '%' ? 1 : 0)} {metric?.unit || ''}
                          {metric?.target && ` (Objetivo: ${metric.target} ${metric.unit})`}
                        </div>
                      </div>
                    </div>
                    {index % Math.max(1, Math.floor(chartData.length / 8)) === 0 && (
                      <div className="text-xs text-gray-500 text-center mt-2 px-1" style={{ fontSize: '10px', maxHeight: '100px' }}>
                        {point.date.split(' ')[0]}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* Comparativa de múltiples métricas */
            <div className="h-80 flex items-end justify-between gap-2">
              {filteredMetrics.map((metric) => {
                const maxValue = Math.max(...filteredMetrics.map(m => m.target ? Math.max(m.value, m.target) : m.value), 1);
                const valueHeight = (metric.value / maxValue) * 100;
                const targetHeight = metric.target ? (metric.target / maxValue) * 100 : 0;
                
                return (
                  <div key={metric.id} className="flex-1 flex flex-col items-center gap-1 group">
                    <div className="relative w-full h-full flex flex-col justify-end">
                      {metric.target && (
                        <div
                          className="w-full bg-gray-300 rounded-t opacity-30 mb-0.5"
                          style={{ height: `${targetHeight}%`, minHeight: '2px' }}
                          title={`Objetivo: ${metric.target} ${metric.unit}`}
                        />
                      )}
                      <div
                        className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t hover:from-blue-700 hover:to-blue-500 transition-all cursor-pointer group relative"
                        style={{ height: `${valueHeight}%`, minHeight: '4px' }}
                        title={`${metric.name}: ${metric.value} ${metric.unit}`}
                      >
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          {metric.name}: {metric.value} {metric.unit}
                          {metric.target && ` (Objetivo: ${metric.target} ${metric.unit})`}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 text-center mt-2 px-1" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', maxHeight: '100px' }}>
                      {metric.name.split(' ').slice(0, 2).join(' ')}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      )}

      {/* Gráfico de líneas temporal */}
      {chartType === 'line' && filteredMetrics.length > 0 && (
        <Card className="p-6 bg-white shadow-sm">
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
              {filteredMetrics.map(metric => (
                <option key={metric.id} value={metric.id}>{metric.name}</option>
              ))}
            </select>
          </div>
          {chartData.length > 0 && selectedMetric ? (
            <div className="h-80 flex items-end justify-between gap-1 relative">
              {/* Línea de conexión */}
              <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
                <polyline
                  points={chartData.map((point, index) => {
                    const maxValue = Math.max(...chartData.map(p => p.value), 1);
                    const height = (point.value / maxValue) * 100;
                    const x = ((index + 0.5) / chartData.length) * 100;
                    const y = 100 - height;
                    return `${x}%,${y}%`;
                  }).join(' ')}
                  fill="none"
                  stroke="#9333EA"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {/* Puntos de datos */}
              {chartData.map((point, index) => {
                const maxValue = Math.max(...chartData.map(p => p.value), 1);
                const height = (point.value / maxValue) * 100;
                const metric = filteredMetrics.find(m => m.id === selectedMetric);
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center relative z-10">
                    <div
                      className="w-3 h-3 bg-purple-600 rounded-full hover:bg-purple-700 hover:scale-125 transition-all cursor-pointer group relative"
                      style={{ marginBottom: `${height}%` }}
                      title={`${point.date}: ${point.value.toFixed(metric?.unit === '%' ? 1 : 0)} ${metric?.unit || ''}`}
                    >
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                        {point.date}: {point.value.toFixed(metric?.unit === '%' ? 1 : 0)} {metric?.unit || ''}
                      </div>
                    </div>
                    {index % Math.max(1, Math.floor(chartData.length / 8)) === 0 && (
                      <span className="text-xs text-gray-500 mt-1" style={{ fontSize: '10px' }}>
                        {point.date.split(' ')[0]}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <LineChart className="w-12 h-12 mx-auto mb-2" />
              <p>{selectedMetric ? 'No hay datos disponibles para esta métrica' : 'Selecciona una métrica para ver su evolución'}</p>
            </div>
          )}
        </Card>
      )}

      {/* Vista de lista mejorada */}
      {(chartType === 'list' || (chartType !== 'bar' && chartType !== 'line')) && (
        <Card className="p-6 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Métricas y KPIs</h3>
            </div>
            <Badge variant="blue">{filteredMetrics.length} métricas</Badge>
          </div>

          <div className="space-y-6">
            {filteredMetrics.map((metric) => {
              const progress = metric.target ? (metric.value / metric.target) * 100 : 0;
              const isAboveTarget = metric.target && metric.value >= metric.target;
              
              return (
                <Card key={metric.id} className="p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          isAboveTarget ? 'bg-green-100' :
                          progress >= 75 ? 'bg-blue-100' :
                          progress >= 50 ? 'bg-yellow-100' :
                          'bg-red-100'
                        }`}>
                          <BarChart3 className={`w-5 h-5 ${
                            isAboveTarget ? 'text-green-600' :
                            progress >= 75 ? 'text-blue-600' :
                            progress >= 50 ? 'text-yellow-600' :
                            'text-red-600'
                          }`} />
                        </div>
                        <div>
                          <p className="text-base font-semibold text-gray-900">
                            {metric.name}
                          </p>
                          <div className="flex items-center gap-3 mt-1">
                            <Badge variant={metric.category === 'financiero' ? 'green' : 'blue'}>
                              {metric.category}
                            </Badge>
                            {metric.target && (
                              <span className="text-xs text-gray-500">
                                Objetivo: {metric.target} {metric.unit}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${
                          isAboveTarget ? 'text-green-600' :
                          progress >= 75 ? 'text-blue-600' :
                          progress >= 50 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {metric.value} {metric.unit}
                        </p>
                        {metric.trend && (
                          <div className="flex items-center justify-end gap-1 mt-1">
                            {getTrendIcon(metric.trend.direction)}
                            <span className={`text-xs font-medium ${
                              metric.trend.direction === 'up' ? 'text-green-600' :
                              metric.trend.direction === 'down' ? 'text-red-600' :
                              'text-gray-500'
                            }`}>
                              {metric.trend.value}% {metric.trend.period}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {metric.target && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>Progreso hacia objetivo</span>
                          <span className="font-semibold">{progress.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3 relative">
                          <div
                            className={`h-3 rounded-full ${getProgressColor(metric.value, metric.target)} transition-all`}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                          {progress < 100 && (
                            <div className="absolute right-0 top-0 h-3 w-0.5 bg-gray-400" style={{ right: `${100 - progress}%` }} />
                          )}
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{metric.value} {metric.unit}</span>
                          <span>{metric.target} {metric.unit}</span>
                        </div>
                      </div>
                    )}
                    
                    {!metric.target && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Info className="w-4 h-4" />
                        <span>No hay objetivo definido para esta métrica</span>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          {filteredMetrics.length === 0 && (
            <div className="text-center py-12">
              <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay métricas disponibles</h3>
              <p className="text-gray-600">No se encontraron métricas para mostrar.</p>
            </div>
          )}
        </Card>
      )}

      {/* Análisis por categoría */}
      {categories.length > 1 && (
        <Card className="p-6 bg-white shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Resumen por Categoría</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((category) => {
              const categoryMetrics = filteredMetrics.filter(m => m.category === category);
              const avgProgress = categoryMetrics.length > 0 && categoryMetrics.some(m => m.target)
                ? categoryMetrics
                    .filter(m => m.target)
                    .reduce((acc, m) => acc + ((m.value / m.target!) * 100), 0) / categoryMetrics.filter(m => m.target).length
                : 0;
              const onTarget = categoryMetrics.filter(m => m.target && m.value >= m.target).length;
              
              return (
                <div key={category} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 capitalize">{category}</h4>
                    <Badge variant="blue">{categoryMetrics.length}</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Métricas con objetivo</span>
                      <span className="font-semibold">{categoryMetrics.filter(m => m.target).length}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Alcanzando objetivo</span>
                      <span className="font-semibold text-green-600">{onTarget}</span>
                    </div>
                    {avgProgress > 0 && (
                      <div className="pt-2 border-t border-gray-200">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Progreso promedio</span>
                          <span className="font-semibold">{avgProgress.toFixed(0)}%</span>
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
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};

