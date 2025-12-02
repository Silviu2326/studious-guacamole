import React, { useState, useEffect } from 'react';
import { Card, MetricCards, Table } from '../../../components/componentsreutilizables';
import { getAnalytics, getResponses } from '../api';
import { SatisfactionMetrics, SurveyResponse } from '../types';
import { TrendingUp, TrendingDown, BarChart3, Users, MessageSquare, Loader2 } from 'lucide-react';

export const SatisfactionDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<SatisfactionMetrics | null>(null);
  const [recentResponses, setRecentResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [analyticsData, responsesData] = await Promise.all([
        getAnalytics(),
        getResponses(),
      ]);
      setMetrics(analyticsData);
      setRecentResponses(responsesData.slice(0, 10));
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </Card>
    );
  }

  if (!metrics) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay datos disponibles</h3>
        <p className="text-gray-600">
          Aún no se han registrado respuestas a las encuestas
        </p>
      </Card>
    );
  }

  const metricCards = [
    {
      id: 'nps',
      title: 'NPS Score',
      value: metrics.nps.score,
      subtitle: `${metrics.nps.total} respuestas`,
      icon: <TrendingUp className="w-5 h-5" />,
      color: metrics.nps.score >= 50 ? 'success' : metrics.nps.score >= 0 ? 'warning' : 'error' as const,
      trend: {
        value: 5.2,
        direction: metrics.nps.score >= 50 ? 'up' as const : 'down' as const,
        label: 'vs mes anterior',
      },
    },
    {
      id: 'csat',
      title: 'CSAT Promedio',
      value: metrics.csat.average.toFixed(1),
      subtitle: `${metrics.csat.total} respuestas`,
      icon: <BarChart3 className="w-5 h-5" />,
      color: metrics.csat.average >= 4 ? 'success' : metrics.csat.average >= 3 ? 'warning' : 'error' as const,
      trend: {
        value: 2.1,
        direction: 'up' as const,
        label: 'vs mes anterior',
      },
    },
    {
      id: 'promotors',
      title: 'Promotores',
      value: metrics.nps.promotors,
      subtitle: `${Math.round((metrics.nps.promotors / metrics.nps.total) * 100) || 0}% del total`,
      icon: <Users className="w-5 h-5" />,
      color: 'success' as const,
    },
    {
      id: 'detractors',
      title: 'Detractores',
      value: metrics.nps.detractors,
      subtitle: `${Math.round((metrics.nps.detractors / metrics.nps.total) * 100) || 0}% del total`,
      icon: <TrendingDown className="w-5 h-5" />,
      color: 'error' as const,
    },
  ];

  const tableColumns = [
    {
      key: 'clientName',
      label: 'Cliente',
    },
    {
      key: 'score',
      label: 'Puntuación',
      render: (value: number) => {
        const colorClass = value >= 7 
          ? 'text-green-600 font-semibold' 
          : value <= 6 
          ? 'text-red-600 font-semibold' 
          : 'text-yellow-600 font-semibold';
        return <span className={colorClass}>{value}</span>;
      },
    },
    {
      key: 'classification',
      label: 'Clasificación',
      render: (value: string) => {
        if (!value) return '-';
        const colorClasses: Record<string, string> = {
          promotor: 'bg-green-100 text-green-800',
          neutral: 'bg-yellow-100 text-yellow-800',
          detractor: 'bg-red-100 text-red-800',
        };
        return (
          <span className={`px-2 py-1 rounded-md text-xs font-medium ${colorClasses[value] || 'bg-gray-100 text-gray-800'}`}>
            {value}
          </span>
        );
      },
    },
    {
      key: 'comments',
      label: 'Comentarios',
      render: (value: string) => value || '-',
    },
    {
      key: 'respondedAt',
      label: 'Fecha',
      render: (value: string) => new Date(value).toLocaleDateString('es-ES'),
    },
  ];

  return (
    <div className="space-y-6">
      <MetricCards data={metricCards} columns={4} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4 bg-white shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Distribución NPS
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Promotores (9-10)
              </span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${(metrics.nps.promotors / metrics.nps.total) * 100 || 0}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                  {metrics.nps.promotors}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Neutrales (7-8)
              </span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500 rounded-full"
                    style={{ width: `${(metrics.nps.neutrals / metrics.nps.total) * 100 || 0}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                  {metrics.nps.neutrals}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Detractores (0-6)
              </span>
              <div className="flex items-center gap-2">
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full"
                    style={{ width: `${(metrics.nps.detractors / metrics.nps.total) * 100 || 0}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                  {metrics.nps.detractors}
                </span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Distribución CSAT
          </h3>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((score) => {
              const count = metrics.csat.distribution[score] || 0;
              const percentage = metrics.csat.total > 0 ? (count / metrics.csat.total) * 100 : 0;
              return (
                <div key={score} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900 w-4">
                      {score}
                    </span>
                    <span className="text-sm text-gray-600">
                      {score === 5 ? 'Excelente' : score === 4 ? 'Bueno' : score === 3 ? 'Regular' : score === 2 ? 'Malo' : 'Muy malo'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${score >= 4 ? 'bg-green-500' : score === 3 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <Card className="p-4 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            Respuestas Recientes
          </h3>
          <MessageSquare className="w-5 h-5 text-gray-600" />
        </div>
        <Table
          data={recentResponses}
          columns={tableColumns}
          emptyMessage="No hay respuestas recientes"
        />
      </Card>
    </div>
  );
};

