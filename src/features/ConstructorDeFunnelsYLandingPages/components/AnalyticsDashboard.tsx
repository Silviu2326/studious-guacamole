import React from 'react';
import { FunnelAnalytics } from '../api/funnels';
import { TrendingUp, Users, UserPlus, BarChart3 } from 'lucide-react';
import { Card, MetricCards } from '../../../components/componentsreutilizables';
import type { MetricCardData } from '../../../components/componentsreutilizables';

interface AnalyticsDashboardProps {
  analytics: FunnelAnalytics;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ analytics }) => {
  const metricsData: MetricCardData[] = [
    {
      id: 'visitors',
      title: 'Total Visitantes',
      value: analytics.summary.totalVisitors.toLocaleString(),
      color: 'info',
      icon: <Users size={20} />
    },
    {
      id: 'leads',
      title: 'Total Leads',
      value: analytics.summary.totalLeads.toLocaleString(),
      color: 'success',
      icon: <UserPlus size={20} />
    },
    {
      id: 'conversion',
      title: 'Tasa de Conversión',
      value: `${analytics.summary.conversionRate.toFixed(2)}%`,
      color: 'primary',
      icon: <TrendingUp size={20} />
    }
  ];

  return (
    <div className="space-y-6">
      {/* Resumen Principal */}
      <MetricCards data={metricsData} columns={3} />

      {/* Desglose por Paso */}
      <Card className="p-6 bg-white shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          Desglose por Página
        </h3>
        <div className="space-y-4">
          {analytics.steps.map((step) => (
            <div key={step.pageId} className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{step.name}</h4>
                <span className="text-sm font-semibold text-blue-600">
                  {step.conversionRate.toFixed(2)}% conversión
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Visitantes</p>
                  <p className="text-lg font-semibold text-gray-900">{step.visitors.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Leads</p>
                  <p className="text-lg font-semibold text-green-600">{step.leads.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Rango de Fechas */}
      <Card className="p-4 bg-white shadow-sm">
        <p className="text-sm text-gray-600">
          Periodo analizado: {new Date(analytics.range.start).toLocaleDateString('es-ES')} - {new Date(analytics.range.end).toLocaleDateString('es-ES')}
        </p>
      </Card>
    </div>
  );
};


