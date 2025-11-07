import React from 'react';
import { Suscripcion } from '../types';
import { Card, MetricCards } from '../../../components/componentsreutilizables';
import { Users, TrendingUp, DollarSign, RefreshCw } from 'lucide-react';

interface AnalyticsSuscripcionesProps {
  suscripciones: Suscripcion[];
  userType: 'entrenador' | 'gimnasio';
}

export const AnalyticsSuscripciones: React.FC<AnalyticsSuscripcionesProps> = ({
  suscripciones,
  userType,
}) => {
  const calcularMetricas = () => {
    const activas = suscripciones.filter(s => s.estado === 'activa').length;
    const pausadas = suscripciones.filter(s => s.estado === 'pausada').length;
    const ingresosRecurrentes = suscripciones
      .filter(s => s.estado === 'activa')
      .reduce((sum, s) => sum + s.precio, 0);
    
    const tasaRetencion = suscripciones.length > 0
      ? (suscripciones.filter(s => s.estado === 'activa').length / suscripciones.length) * 100
      : 0;

    return {
      activas,
      pausadas,
      ingresosRecurrentes,
      tasaRetencion,
    };
  };

  const metricas = calcularMetricas();

  const metricCards = userType === 'entrenador'
    ? [
        {
          id: 'activas',
          title: 'Suscripciones Activas',
          value: metricas.activas.toString(),
          subtitle: `${suscripciones.length} total`,
          icon: <Users className="w-5 h-5" />,
          color: 'success' as const,
        },
        {
          id: 'ingresos',
          title: 'Ingresos Recurrentes',
          value: `${metricas.ingresosRecurrentes.toFixed(0)} €`,
          subtitle: 'Mensual',
          icon: <DollarSign className="w-5 h-5" />,
          color: 'primary' as const,
        },
        {
          id: 'sesiones',
          title: 'Sesiones Totales',
          value: suscripciones
            .filter(s => s.sesionesIncluidas)
            .reduce((sum, s) => sum + (s.sesionesIncluidas || 0), 0)
            .toString(),
          subtitle: 'Este mes',
          icon: <RefreshCw className="w-5 h-5" />,
          color: 'info' as const,
        },
        {
          id: 'retencion',
          title: 'Tasa de Retención',
          value: `${metricas.tasaRetencion.toFixed(1)}%`,
          subtitle: metricas.tasaRetencion > 80 ? 'Excelente' : 'Mejorable',
          icon: <TrendingUp className="w-5 h-5" />,
          color: metricas.tasaRetencion > 80 ? ('success' as const) : ('warning' as const),
        },
      ]
    : [
        {
          id: 'activas',
          title: 'Membresías Activas',
          value: metricas.activas.toString(),
          subtitle: `${suscripciones.length} total`,
          icon: <Users className="w-5 h-5" />,
          color: 'success' as const,
        },
        {
          id: 'pausadas',
          title: 'En Freeze',
          value: metricas.pausadas.toString(),
          subtitle: metricas.pausadas > 0 ? 'Requieren atención' : 'Todas activas',
          icon: <RefreshCw className="w-5 h-5" />,
          color: metricas.pausadas > 0 ? ('warning' as const) : ('success' as const),
        },
        {
          id: 'ingresos',
          title: 'Ingresos Recurrentes',
          value: `${metricas.ingresosRecurrentes.toFixed(0)} €`,
          subtitle: 'Mensual estimado',
          icon: <DollarSign className="w-5 h-5" />,
          color: 'primary' as const,
        },
        {
          id: 'retencion',
          title: 'Tasa de Retención',
          value: `${metricas.tasaRetencion.toFixed(1)}%`,
          subtitle: metricas.tasaRetencion > 85 ? 'Excelente' : 'Mejorable',
          icon: <TrendingUp className="w-5 h-5" />,
          color: metricas.tasaRetencion > 85 ? ('success' as const) : ('warning' as const),
        },
      ];

  return (
    <Card className="bg-white shadow-sm p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        Analytics de Suscripciones
      </h3>
      <MetricCards data={metricCards} columns={4} />
    </Card>
  );
};

