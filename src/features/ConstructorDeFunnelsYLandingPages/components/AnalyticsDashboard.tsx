import React from 'react';
import { FunnelAnalytics } from '../api/funnels';
import { TrendingUp, Users, UserPlus, BarChart3 } from 'lucide-react';

interface AnalyticsDashboardProps {
  analytics: FunnelAnalytics;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ analytics }) => {
  return (
    <div className="space-y-6">
      {/* Resumen Principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Total Visitantes</span>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{analytics.summary.totalVisitors.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Total Leads</span>
            <UserPlus className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{analytics.summary.totalLeads.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Tasa de Conversión</span>
            <TrendingUp className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{analytics.summary.conversionRate.toFixed(2)}%</p>
        </div>
      </div>

      {/* Desglose por Paso */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Desglose por Página
        </h3>
        <div className="space-y-4">
          {analytics.steps.map((step) => (
            <div key={step.pageId} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{step.name}</h4>
                <span className="text-sm font-semibold text-purple-600">
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
      </div>

      {/* Rango de Fechas */}
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-sm text-gray-600">
          Periodo analizado: {new Date(analytics.range.start).toLocaleDateString('es-ES')} - {new Date(analytics.range.end).toLocaleDateString('es-ES')}
        </p>
      </div>
    </div>
  );
};


