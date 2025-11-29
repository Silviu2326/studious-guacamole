import React from 'react';
import { MetricCards, MetricCardData, Button } from '../../../components/componentsreutilizables';
import { DashboardMetrics } from '../api';
import { 
  Users, 
  DollarSign, 
  Calendar, 
  Building2, 
  TrendingUp, 
  Activity,
  Target,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

interface DashboardOverviewProps {
  metrics: DashboardMetrics | null;
  role: 'entrenador' | 'gimnasio';
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
}

/**
 * Componente DashboardOverview
 * 
 * Muestra las tarjetas de KPIs principales del dashboard, diseñadas para que el usuario
 * entienda de un vistazo la salud del negocio. Utiliza directamente los campos de DashboardMetrics
 * sin duplicar lógica.
 */
export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  metrics,
  role,
  loading = false,
  error,
  onRetry,
}) => {
  /**
   * Calcula la variación porcentual simulada basada en métricas disponibles.
   * En producción, esto vendría del backend comparando períodos anteriores.
   */
  const calculateTrend = (
    current: number,
    newItems: number,
    churnedItems: number
  ): { value: number; direction: 'up' | 'down' | 'neutral' } => {
    if (newItems === 0 && churnedItems === 0) {
      return { value: 0, direction: 'neutral' };
    }
    
    const netChange = newItems - churnedItems;
    const previousValue = current - netChange;
    
    if (previousValue === 0) {
      return { value: 100, direction: 'up' };
    }
    
    const percentageChange = (netChange / previousValue) * 100;
    
    if (Math.abs(percentageChange) < 0.1) {
      return { value: 0, direction: 'neutral' };
    }
    
    return {
      value: Math.abs(percentageChange),
      direction: percentageChange > 0 ? 'up' : 'down',
    };
  };

  /**
   * Formatea valores monetarios en euros
   */
  const formatCurrency = (value: number): string => {
    return `€${value.toLocaleString('es-ES', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  /**
   * Formatea números grandes con separadores de miles
   */
  const formatNumber = (value: number): string => {
    return value.toLocaleString('es-ES');
  };

  /**
   * Genera las tarjetas de métricas según el rol del usuario
   */
  const getMetricCards = (): MetricCardData[] => {
    if (!metrics) return [];
    
    if (role === 'entrenador') {
      // KPIs para entrenador personal
      const totalClientsTrend = calculateTrend(
        metrics.totalClients,
        metrics.newClientsThisMonth,
        metrics.churnThisMonth
      );

      return [
        {
          id: 'total-clientes',
          title: 'Total de Clientes',
          value: formatNumber(metrics.totalClients),
          subtitle: 'Clientes activos en tu cartera',
          icon: <Users className="w-6 h-6" />,
          color: 'primary',
          loading,
          trend: {
            ...totalClientsTrend,
            label: 'vs mes anterior',
          },
        },
        {
          id: 'clientes-activos-hoy',
          title: 'Clientes Activos Hoy',
          value: formatNumber(metrics.activeClientsToday),
          subtitle: `${metrics.activeClientsToday > 0 
            ? `${Math.round((metrics.activeClientsToday / metrics.totalClients) * 100)}% de tu cartera activa hoy`
            : 'Sin sesiones programadas hoy'}`,
          icon: <Activity className="w-6 h-6" />,
          color: metrics.activeClientsToday > 0 ? 'success' : 'info',
          loading,
        },
        {
          id: 'sesiones-hoy',
          title: 'Sesiones de Hoy',
          value: formatNumber(metrics.sessionsToday),
          subtitle: metrics.sessionsToday > 0
            ? `Promedio: ${Math.round(metrics.averageSessionDuration)} min/sesión`
            : 'No hay sesiones programadas',
          icon: <Calendar className="w-6 h-6" />,
          color: 'info',
          loading,
        },
        {
          id: 'ocupacion-media',
          title: 'Ocupación Media',
          value: `${metrics.occupancyRate}%`,
          subtitle: metrics.occupancyRate >= 80
            ? 'Excelente utilización de tu tiempo'
            : metrics.occupancyRate >= 60
            ? 'Buena ocupación'
            : 'Oportunidad de crecimiento',
          icon: <Target className="w-6 h-6" />,
          color: metrics.occupancyRate >= 80 
            ? 'success' 
            : metrics.occupancyRate >= 60 
            ? 'warning' 
            : 'info',
          loading,
        },
        {
          id: 'ingresos-mes',
          title: 'Ingresos del Mes',
          value: formatCurrency(metrics.monthlyRevenue),
          subtitle: `Promedio diario: ${formatCurrency(metrics.monthlyRevenue / 30)}`,
          icon: <DollarSign className="w-6 h-6" />,
          color: 'success',
          loading,
          trend: {
            value: 12.5,
            direction: 'up',
            label: 'vs mes anterior',
          },
        },
        {
          id: 'retencion-clientes',
          title: 'Retención de Clientes',
          value: `${metrics.clientRetentionRate}%`,
          subtitle: metrics.churnThisMonth > 0
            ? `${metrics.churnThisMonth} baja${metrics.churnThisMonth > 1 ? 's' : ''} este mes`
            : 'Sin bajas este mes',
          icon: <TrendingUp className="w-6 h-6" />,
          color: metrics.clientRetentionRate >= 85 
            ? 'success' 
            : metrics.clientRetentionRate >= 70 
            ? 'warning' 
            : 'error',
          loading,
        },
      ];
    } else {
      // KPIs para gimnasio
      const totalClientsTrend = calculateTrend(
        metrics.totalClients,
        metrics.newClientsThisMonth,
        metrics.churnThisMonth
      );

      return [
        {
          id: 'total-clientes',
          title: 'Total de Socios',
          value: formatNumber(metrics.totalClients),
          subtitle: 'Miembros activos en el centro',
          icon: <Users className="w-6 h-6" />,
          color: 'primary',
          loading,
          trend: {
            ...totalClientsTrend,
            label: 'vs mes anterior',
          },
        },
        {
          id: 'clientes-activos-hoy',
          title: 'Socios Activos Hoy',
          value: formatNumber(metrics.activeClientsToday),
          subtitle: `${metrics.activeClientsToday > 0 
            ? `${Math.round((metrics.activeClientsToday / metrics.totalClients) * 100)}% de socios activos hoy`
            : 'Sin actividad registrada hoy'}`,
          icon: <Activity className="w-6 h-6" />,
          color: metrics.activeClientsToday > 0 ? 'success' : 'info',
          loading,
        },
        {
          id: 'sesiones-hoy',
          title: 'Sesiones de Hoy',
          value: formatNumber(metrics.sessionsToday),
          subtitle: metrics.sessionsToday > 0
            ? `Promedio: ${Math.round(metrics.averageSessionDuration)} min/sesión`
            : 'No hay sesiones programadas',
          icon: <Calendar className="w-6 h-6" />,
          color: 'info',
          loading,
        },
        {
          id: 'ocupacion-media',
          title: 'Ocupación Media',
          value: `${metrics.occupancyRate}%`,
          subtitle: metrics.occupancyRate >= 80
            ? 'Capacidad casi al máximo'
            : metrics.occupancyRate >= 60
            ? 'Ocupación saludable'
            : 'Oportunidad de optimizar',
          icon: <Building2 className="w-6 h-6" />,
          color: metrics.occupancyRate >= 80 
            ? 'warning' 
            : metrics.occupancyRate >= 60 
            ? 'success' 
            : 'info',
          loading,
        },
        {
          id: 'ingresos-mes',
          title: 'Ingresos del Mes',
          value: formatCurrency(metrics.monthlyRevenue),
          subtitle: `Promedio diario: ${formatCurrency(metrics.monthlyRevenue / 30)}`,
          icon: <DollarSign className="w-6 h-6" />,
          color: 'success',
          loading,
          trend: {
            value: 8.3,
            direction: 'up',
            label: 'vs mes anterior',
          },
        },
        {
          id: 'retencion-clientes',
          title: 'Retención de Socios',
          value: `${metrics.clientRetentionRate}%`,
          subtitle: metrics.churnThisMonth > 0
            ? `${metrics.churnThisMonth} baja${metrics.churnThisMonth > 1 ? 's' : ''} este mes`
            : 'Sin bajas este mes',
          icon: <TrendingUp className="w-6 h-6" />,
          color: metrics.clientRetentionRate >= 90 
            ? 'success' 
            : metrics.clientRetentionRate >= 80 
            ? 'warning' 
            : 'error',
          loading,
        },
      ];
    }
  };

  if (error) {
    return (
      <div className="w-full">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-red-900 mb-1">
                Error al cargar las métricas
              </h3>
              <p className="text-sm text-red-700 mb-3">
                {error}
              </p>
              {onRetry && (
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={onRetry}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reintentar
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <MetricCards 
        data={getMetricCards()} 
        columns={role === 'entrenador' ? 3 : 4}
        className="mb-6"
      />
    </div>
  );
};

