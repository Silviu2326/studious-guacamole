import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Metric, GlobalFilters, ChartAnnotation, SavedMetricView } from '../types';
import { getPerformanceMetrics } from '../api/performance';
import { getChartAnnotations } from '../api/externalSources';
import { createSavedView, getSavedViewByToken } from '../api/savedViews';
import { Card, Button, Select, Badge, Modal, Input, Textarea } from '../../../components/componentsreutilizables';
import { BarChart3, TrendingUp, TrendingDown, Minus, Loader2, LineChart, PieChart, Calendar, Target, Activity, Filter, Info, Bookmark, Save } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useSearchParams } from 'react-router-dom';

interface MetricsChartProps {
  role: 'entrenador' | 'gimnasio';
  category?: string;
  globalFilters?: GlobalFilters;
  periodo?: 'semana' | 'mes' | 'trimestre';
}

export const MetricsChart: React.FC<MetricsChartProps> = ({ role, category, globalFilters, periodo }) => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [chartType, setChartType] = useState<'bar' | 'line' | 'list'>('list');
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  
  // User Story 1: Estados para anotaciones de fuentes externas
  const [annotations, setAnnotations] = useState<ChartAnnotation[]>([]);
  const [showAnnotations, setShowAnnotations] = useState(true);
  
  // User Story 2: Estados para vistas guardadas
  const [isSaveViewModalOpen, setIsSaveViewModalOpen] = useState(false);
  const [savedViewName, setSavedViewName] = useState('');
  const [savedViewDescription, setSavedViewDescription] = useState('');

  // User Story 2: Cargar vista desde URL si existe
  useEffect(() => {
    const viewToken = searchParams.get('view');
    if (viewToken) {
      loadViewFromToken(viewToken);
    }
  }, [searchParams]);

  useEffect(() => {
    loadMetrics();
  }, [role, category, period]);
  
  // User Story 1: Cargar anotaciones cuando cambian los datos
  useEffect(() => {
    if (selectedMetric) {
      loadAnnotations();
    }
  }, [selectedMetric, period]);
  
  // User Story 1: Cargar anotaciones
  const loadAnnotations = async () => {
    try {
      if (selectedMetric) {
        const data = await getChartAnnotations([selectedMetric]);
        setAnnotations(data);
      } else {
        setAnnotations([]);
      }
    } catch (error) {
      console.error('Error loading annotations:', error);
    }
  };
  
  // User Story 2: Cargar vista desde token
  const loadViewFromToken = async (token: string) => {
    try {
      const view = await getSavedViewByToken(token);
      if (view) {
        setChartType(view.config.chartType as 'bar' | 'line' | 'list');
        setPeriod(view.config.period);
        if (view.config.selectedMetrics && view.config.selectedMetrics.length > 0) {
          setSelectedMetric(view.config.selectedMetrics[0]);
        }
        if (view.config.category) {
          setSelectedCategory(view.config.category);
        }
        if (view.config.chartOptions?.showAnnotations !== undefined) {
          setShowAnnotations(view.config.chartOptions.showAnnotations);
        }
      }
    } catch (error) {
      console.error('Error loading view from token:', error);
    }
  };
  
  // User Story 2: Guardar vista actual
  const handleSaveView = async () => {
    if (!savedViewName.trim()) {
      alert('Por favor ingresa un nombre para la vista');
      return;
    }
    
    try {
      await createSavedView({
        name: savedViewName,
        description: savedViewDescription,
        createdBy: user?.id || 'unknown',
        shared: false,
        sharedWith: [],
        config: {
          chartType: chartType as 'list' | 'bar' | 'line' | 'interactive' | 'multi-kpi',
          selectedMetrics: selectedMetric ? [selectedMetric] : [],
          selectedKPIs: [],
          period,
          filters: globalFilters || {},
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          chartOptions: {
            showTargets: true,
            showTrends: true,
            showAnnotations,
          },
        },
      });
      
      setIsSaveViewModalOpen(false);
      setSavedViewName('');
      setSavedViewDescription('');
      alert('Vista guardada exitosamente');
    } catch (error) {
      console.error('Error saving view:', error);
      alert('Error al guardar la vista');
    }
  };

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const data = await getPerformanceMetrics(role, period);
      let filtered = data;
      if (category) {
        filtered = data.filter(m => m.category === category);
      }
      setMetrics(filtered);
    } catch (error) {
      console.error('Error loading metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generar datos para gráficos (función auxiliar, no hook)
  const generateTimeSeriesData = (metricId: string, days: number = 30) => {
    const data = [];
    const metric = metrics.find(m => m.id === metricId);
    if (!metric) return [];
    
    const baseValue = metric.value;
    for (let i = 0; i < days; i++) {
      data.push({
        date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
        value: baseValue + (Math.random() * baseValue * 0.1 - baseValue * 0.05) + (i * baseValue * 0.01),
      });
    }
    return data;
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

  // Datos del gráfico
  const chartData = useMemo(() => {
    const metricId = selectedMetric || metrics[0]?.id || '';
    return generateTimeSeriesData(metricId);
  }, [selectedMetric, metrics]);

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
          {/* User Story 1: Toggle anotaciones */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowAnnotations(!showAnnotations)}
            title={showAnnotations ? 'Ocultar anotaciones' : 'Mostrar anotaciones'}
          >
            <Filter className="w-4 h-4 mr-2" />
            {showAnnotations ? 'Ocultar Etiquetas' : 'Mostrar Etiquetas'}
          </Button>
          {/* User Story 2: Guardar vista */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsSaveViewModalOpen(true)}
          >
            <Save className="w-4 h-4 mr-2" />
            Guardar Vista
          </Button>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as any)}
            className="rounded-lg bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-1.5 text-sm"
          >
            <option value="week">Semana</option>
            <option value="month">Mes</option>
            <option value="quarter">Trimestre</option>
            <option value="year">Año</option>
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
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-lg bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-1.5 text-sm"
            >
              <option value="all">Todas</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setChartType('list')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                chartType === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Lista
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                chartType === 'bar' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-1" />
              Barras
            </button>
            <button
              onClick={() => setChartType('line')}
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
              <h3 className="text-lg font-semibold text-gray-900">Comparativa de Métricas</h3>
            </div>
            {selectedMetric && (
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value || null)}
                className="rounded-lg bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-1.5 text-sm"
              >
                <option value="">Todas las métricas</option>
                {filteredMetrics.map(metric => (
                  <option key={metric.id} value={metric.id}>{metric.name}</option>
                ))}
              </select>
            )}
          </div>
          <div className="h-80 flex items-end justify-between gap-2">
            {(selectedMetric ? [filteredMetrics.find(m => m.id === selectedMetric)].filter(Boolean) : filteredMetrics).map((metric) => {
              const maxValue = Math.max(...filteredMetrics.map(m => m.target ? Math.max(m.value, m.target) : m.value));
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
        </Card>
      )}

      {/* Gráfico de líneas temporal */}
      {chartType === 'line' && filteredMetrics.length > 0 && (
        <Card 
          className="p-6 bg-white shadow-sm"
          ref={(el) => {
            if (el) chartRefs.current.set('line-chart', el);
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
              {filteredMetrics.map(metric => (
                <option key={metric.id} value={metric.id}>{metric.name}</option>
              ))}
            </select>
          </div>
          {chartData.length > 0 && (
            <div className="h-80 flex items-end justify-between gap-1 relative">
              {chartData.map((point, index) => {
                const maxValue = Math.max(...chartData.map(p => p.value));
                const height = (point.value / maxValue) * 100;
                const metric = metrics.find(m => m.id === selectedMetric || selectedMetric === null);
                
                // User Story 1: Buscar anotaciones para esta fecha
                const pointDate = new Date(point.date);
                const relevantAnnotations = showAnnotations && selectedMetric
                  ? annotations.filter(ann => {
                      const annDate = new Date(ann.date);
                      return ann.metricIds.includes(selectedMetric) &&
                             annDate.toDateString() === pointDate.toDateString();
                    })
                  : [];
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center relative">
                    {/* User Story 1: Mostrar anotaciones */}
                    {relevantAnnotations.length > 0 && (
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-20 mb-1">
                        {relevantAnnotations.map((ann) => (
                          <div
                            key={ann.id}
                            className="mb-1 px-2 py-1 rounded text-xs font-medium text-white shadow-md"
                            style={{ backgroundColor: ann.color || '#3B82F6' }}
                            title={ann.description || ann.label}
                          >
                            {ann.label}
                          </div>
                        ))}
                      </div>
                    )}
                    <div
                      className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg hover:from-purple-700 hover:to-purple-500 transition-all cursor-pointer group relative"
                      style={{ height: `${height}%`, minHeight: '4px' }}
                      title={`${point.date}: ${point.value.toFixed(0)} ${metric?.unit || ''}`}
                    >
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        {point.date}: {point.value.toFixed(0)} {metric?.unit || ''}
                        {relevantAnnotations.length > 0 && (
                          <div className="mt-1 pt-1 border-t border-gray-700">
                            {relevantAnnotations.map(ann => (
                              <div key={ann.id} className="text-xs">
                                {ann.label}: {ann.description}
                              </div>
                            ))}
                          </div>
                        )}
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
          )}
          {chartData.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <LineChart className="w-12 h-12 mx-auto mb-2" />
              <p>Selecciona una métrica para ver su evolución</p>
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

      {/* User Story 2: Modal para guardar vista */}
      <Modal
        isOpen={isSaveViewModalOpen}
        onClose={() => {
          setIsSaveViewModalOpen(false);
          setSavedViewName('');
          setSavedViewDescription('');
        }}
        title="Guardar Vista Personalizada"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <Input
              value={savedViewName}
              onChange={(e) => setSavedViewName(e.target.value)}
              placeholder="Ej: Vista Mensual de Facturación"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <Textarea
              value={savedViewDescription}
              onChange={(e) => setSavedViewDescription(e.target.value)}
              placeholder="Describe esta vista personalizada..."
              rows={3}
            />
          </div>
          <div className="pt-4 border-t">
            <p className="text-xs text-gray-500 mb-2">
              Se guardará la configuración actual: tipo de gráfico, métricas seleccionadas, filtros y período.
            </p>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setIsSaveViewModalOpen(false);
                setSavedViewName('');
                setSavedViewDescription('');
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleSaveView}>
              <Save className="w-4 h-4 mr-2" />
              Guardar Vista
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

