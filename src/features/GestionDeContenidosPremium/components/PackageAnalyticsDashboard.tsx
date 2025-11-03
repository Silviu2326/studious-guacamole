import React from 'react';
import { PackageAnalytics } from '../api/contentPackages';
import { Users, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react';

interface PackageAnalyticsDashboardProps {
  analytics: PackageAnalytics;
}

/**
 * Dashboard de analíticas para un paquete de contenido
 */
export const PackageAnalyticsDashboard: React.FC<PackageAnalyticsDashboardProps> = ({
  analytics
}) => {
  return (
    <div className="space-y-6">
      {/* KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Total Inscritos</span>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{analytics.totalEnrolled}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Usuarios Activos</span>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{analytics.activeUsers}</p>
          <p className="text-xs text-gray-500 mt-1">
            {(analytics.activeUsers / analytics.totalEnrolled * 100).toFixed(0)}% del total
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Tasa Finalización</span>
            <TrendingUp className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {(analytics.completionRate * 100).toFixed(0)}%
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Progreso Promedio</span>
            <DollarSign className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {(analytics.averageProgress * 100).toFixed(0)}%
          </p>
        </div>
      </div>

      {/* Puntos de abandono */}
      {analytics.dropoutPoints.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-gray-900">Puntos de Abandono</h3>
          </div>
          <div className="space-y-3">
            {analytics.dropoutPoints.map((point, index) => (
              <div key={index} className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{point.moduleTitle}</span>
                  <span className="text-sm font-semibold text-orange-700">
                    {(point.dropoutRate * 100).toFixed(0)}% abandono
                  </span>
                </div>
                <div className="w-full bg-orange-200 rounded-full h-2">
                  <div
                    className="bg-orange-600 h-2 rounded-full"
                    style={{ width: `${point.dropoutRate * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contenido más visto */}
      {analytics.topItems.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contenido Más Visto</h3>
          <div className="space-y-2">
            {analytics.topItems.map((item, index) => (
              <div key={item.itemId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-semibold text-sm">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-900">{item.itemTitle}</span>
                </div>
                <span className="text-sm text-gray-600">{item.viewCount} visualizaciones</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


