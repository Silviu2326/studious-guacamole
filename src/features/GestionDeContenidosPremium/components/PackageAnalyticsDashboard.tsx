import React from 'react';
import { PackageAnalytics } from '../api/contentPackages';
import { Users, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react';
import { MetricCards, Card } from '../../../components/componentsreutilizables';

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
      <MetricCards
        data={[
          {
            id: 'inscritos',
            title: 'Total Inscritos',
            value: analytics.totalEnrolled,
            color: 'info',
            icon: <Users />
          },
          {
            id: 'activos',
            title: 'Usuarios Activos',
            value: analytics.activeUsers,
            subtitle: `${(analytics.activeUsers / analytics.totalEnrolled * 100).toFixed(0)}% del total`,
            color: 'success',
            icon: <TrendingUp />
          },
          {
            id: 'finalizacion',
            title: 'Tasa Finalización',
            value: `${(analytics.completionRate * 100).toFixed(0)}%`,
            color: 'primary',
            icon: <TrendingUp />
          },
          {
            id: 'progreso',
            title: 'Progreso Promedio',
            value: `${(analytics.averageProgress * 100).toFixed(0)}%`,
            color: 'success',
            icon: <DollarSign />
          }
        ]}
        columns={4}
      />

      {/* Puntos de abandono */}
      {analytics.dropoutPoints.length > 0 && (
        <Card className="p-6 bg-white shadow-sm">
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
        </Card>
      )}

      {/* Contenido más visto */}
      {analytics.topItems.length > 0 && (
        <Card className="p-6 bg-white shadow-sm">
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
        </Card>
      )}
    </div>
  );
};


