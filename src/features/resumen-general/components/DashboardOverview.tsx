import React from 'react';
import { MetricCards, MetricCardData } from '../../../components/componentsreutilizables';
import { DashboardMetrics } from '../api/metrics';
import { Users, DollarSign, Calendar, Building2, TrendingUp, Wrench } from 'lucide-react';

interface DashboardOverviewProps {
  metrics: DashboardMetrics | null;
  role: 'entrenador' | 'gimnasio';
  loading?: boolean;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  metrics,
  role,
  loading = false,
}) => {
  const getMetricCards = (): MetricCardData[] => {
    if (!metrics) return [];
    
    if (role === 'entrenador') {
      return [
        {
          id: 'clientes',
          title: 'Clientes Activos',
          value: metrics.clientesActivos,
          subtitle: 'Total de clientes',
          icon: <Users className="w-6 h-6" />,
          color: 'primary',
          loading,
          trend: {
            value: 8,
            direction: 'up',
            label: 'vs mes anterior',
          },
        },
        {
          id: 'ingresos',
          title: 'Ingresos del Mes',
          value: `€${metrics.ingresosMes.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`,
          subtitle: 'Total facturado',
          icon: <DollarSign className="w-6 h-6" />,
          color: 'success',
          loading,
          trend: {
            value: 15.5,
            direction: 'up',
            label: 'vs mes anterior',
          },
        },
        {
          id: 'sesiones',
          title: 'Sesiones de Hoy',
          value: metrics.sesionesHoy,
          subtitle: 'Próximas sesiones',
          icon: <Calendar className="w-6 h-6" />,
          color: 'info',
          loading,
        },
        {
          id: 'progreso',
          title: 'Progreso Promedio',
          value: `${metrics.progresoClientes || 0}%`,
          subtitle: 'Adherencia de clientes',
          icon: <TrendingUp className="w-6 h-6" />,
          color: 'success',
          loading,
        },
      ];
    } else {
      return [
        {
          id: 'clientes',
          title: 'Socios Activos',
          value: metrics.clientesActivos,
          subtitle: 'Total de miembros',
          icon: <Users className="w-6 h-6" />,
          color: 'primary',
          loading,
          trend: {
            value: 12,
            direction: 'up',
            label: 'vs mes anterior',
          },
        },
        {
          id: 'ocupacion',
          title: 'Ocupación del Centro',
          value: `${metrics.ocupacionCentro || 0}%`,
          subtitle: 'Capacidad actual',
          icon: <Building2 className="w-6 h-6" />,
          color: metrics.ocupacionCentro && metrics.ocupacionCentro > 80 ? 'warning' : 'success',
          loading,
        },
        {
          id: 'facturacion',
          title: 'Facturación del Día',
          value: `€${(metrics.facturacionDia || 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })}`,
          subtitle: 'Ingresos de hoy',
          icon: <DollarSign className="w-6 h-6" />,
          color: 'success',
          loading,
        },
        {
          id: 'incidencias',
          title: 'Incidencias Activas',
          value: metrics.incidenciasSalas || 0,
          subtitle: 'Requieren atención',
          icon: <Wrench className="w-6 h-6" />,
          color: (metrics.incidenciasSalas || 0) > 0 ? 'error' : 'success',
          loading,
        },
      ];
    }
  };

  return (
    <div className="w-full">
      <MetricCards data={getMetricCards()} columns={4} />
    </div>
  );
};

