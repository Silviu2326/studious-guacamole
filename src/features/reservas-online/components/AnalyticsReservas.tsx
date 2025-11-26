import React, { useState, useEffect } from 'react';
import { Card, MetricCards } from '../../../components/componentsreutilizables';
import { AnalyticsReservas as AnalyticsType } from '../types';
import { BarChart3, TrendingUp, DollarSign, Calendar, Loader2 } from 'lucide-react';

interface AnalyticsReservasProps {
  role: 'entrenador' | 'gimnasio';
}

export const AnalyticsReservas: React.FC<AnalyticsReservasProps> = ({ role }) => {
  const [analytics, setAnalytics] = useState<AnalyticsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de analytics
    setTimeout(() => {
      const datos: AnalyticsType = {
        totalReservas: 156,
        reservasConfirmadas: 142,
        reservasCanceladas: 14,
        tasaOcupacion: role === 'entrenador' ? 85 : 72,
        ingresosTotales: role === 'entrenador' ? 7800 : 2130,
        promedioPorReserva: role === 'entrenador' ? 54.9 : 15.0,
        reservasPorTipo: {
          'sesion-1-1': role === 'entrenador' ? 120 : 0,
          'clase-grupal': role === 'gimnasio' ? 36 : 0,
          'spinning': role === 'gimnasio' ? 28 : 0,
          'boxeo': role === 'gimnasio' ? 15 : 0,
        },
        reservasPorMes: [
          { mes: 'Enero', cantidad: 45 },
          { mes: 'Febrero', cantidad: 52 },
          { mes: 'Marzo', cantidad: 59 },
        ],
        horariosMasReservados: [
          { hora: '10:00', cantidad: 28 },
          { hora: '12:00', cantidad: 35 },
          { hora: '18:00', cantidad: 42 },
        ],
      };
      setAnalytics(datos);
      setLoading(false);
    }, 300);
  }, [role]);

  if (loading || !analytics) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </Card>
    );
  }

  const metrics = [
    {
      id: 'total-reservas',
      title: 'Total Reservas',
      value: analytics.totalReservas.toString(),
      icon: <Calendar className="w-6 h-6" />,
      color: 'info' as const,
      trend: {
        value: 12,
        direction: 'up' as const,
      },
    },
    {
      id: 'tasa-ocupacion',
      title: 'Tasa de Ocupación',
      value: `${analytics.tasaOcupacion}%`,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'success' as const,
      trend: {
        value: 5,
        direction: 'up' as const,
      },
    },
    {
      id: 'ingresos-totales',
      title: 'Ingresos Totales',
      value: `€${analytics.ingresosTotales.toLocaleString()}`,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'primary' as const,
      trend: {
        value: 18,
        direction: 'up' as const,
      },
    },
    {
      id: 'promedio-reserva',
      title: 'Promedio por Reserva',
      value: `€${analytics.promedioPorReserva.toFixed(2)}`,
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'warning' as const,
      trend: {
        value: 3,
        direction: 'up' as const,
      },
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm">
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">
              Analytics de Reservas
            </h3>
          </div>

          <MetricCards data={metrics} />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white shadow-sm">
          <div className="p-6 space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">
              Reservas por Tipo
            </h4>
            <div className="space-y-3">
              {Object.entries(analytics.reservasPorTipo).map(([tipo, cantidad]) => (
                <div key={tipo} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">
                    {tipo.replace('-', ' ')}
                  </span>
                  <span className="text-base font-semibold text-gray-900">
                    {cantidad}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="bg-white shadow-sm">
          <div className="p-6 space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">
              Horarios Más Reservados
            </h4>
            <div className="space-y-3">
              {analytics.horariosMasReservados.map((horario, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {horario.hora}
                  </span>
                  <span className="text-base font-semibold text-gray-900">
                    {horario.cantidad}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
