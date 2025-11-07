import React, { useState, useEffect } from 'react';
import { PerformanceData, Metric, Objective } from '../types';
import { getPerformanceDashboard } from '../api/performance';
import { Card, MetricCards, Button } from '../../../components/componentsreutilizables';
import { BarChart3, TrendingUp, TrendingDown, Target, AlertCircle, Loader2, PieChart, LineChart, Activity, Award, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface PerformanceDashboardProps {
  role: 'entrenador' | 'gimnasio';
}

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({ role }) => {
  const [data, setData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  useEffect(() => {
    loadDashboard();
  }, [role, period]);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const dashboardData = await getPerformanceDashboard(role, period);
      setData(dashboardData);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const metricsData = data?.metrics.map((metric) => ({
    id: metric.id,
    title: metric.name,
    value: `${metric.value} ${metric.unit}`,
    subtitle: metric.target ? `Objetivo: ${metric.target} ${metric.unit}` : undefined,
    icon: <BarChart3 className="w-5 h-5" />,
    color: metric.target && metric.value >= metric.target ? 'success' : 
           metric.trend?.direction === 'down' && metric.id !== 'tasa_bajas' ? 'error' : 'primary' as const,
    trend: metric.trend ? {
      value: Math.abs(metric.trend.value),
      direction: metric.trend.direction,
      label: metric.trend.period,
    } : undefined,
  })) || [];

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
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Período:</label>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
          >
            <option value="week">Semana</option>
            <option value="month">Mes</option>
            <option value="quarter">Trimestre</option>
            <option value="year">Año</option>
          </select>
        </div>
      </div>

      {/* Métricas/KPIs principales */}
      <MetricCards data={metricsData} columns={4} />

      {/* Sección de análisis visual */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de evolución temporal */}
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
    </div>
  );
};

