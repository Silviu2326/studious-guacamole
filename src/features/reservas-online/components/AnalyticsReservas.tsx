import React, { useState, useEffect } from 'react';
import { Card, MetricCards, Button, Input } from '../../../components/componentsreutilizables';
import { AnalyticsReservas as AnalyticsType } from '../types';
import { getAnalyticsReservas } from '../api/analytics';
import { useAuth } from '../../../context/AuthContext';
import { BarChart3, TrendingUp, DollarSign, Calendar, Loader2, XCircle, AlertTriangle, Filter } from 'lucide-react';

interface AnalyticsReservasProps {
  role: 'entrenador' | 'gimnasio';
}

export const AnalyticsReservas: React.FC<AnalyticsReservasProps> = ({ role }) => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [fechaInicio, setFechaInicio] = useState<string>(() => {
    const fecha = new Date();
    fecha.setMonth(fecha.getMonth() - 3);
    return fecha.toISOString().split('T')[0];
  });
  const [fechaFin, setFechaFin] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [entrenadorId, setEntrenadorId] = useState<string>('');

  const cargarAnalytics = async () => {
    setLoading(true);
    try {
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);
      fin.setHours(23, 59, 59, 999); // Incluir todo el día

      const datos = await getAnalyticsReservas(
        {
          fechaInicio: inicio,
          fechaFin: fin,
          entrenadorId: entrenadorId || undefined,
        },
        role
      );
      setAnalytics(datos);
    } catch (error) {
      console.error('Error cargando analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, fechaInicio, fechaFin, entrenadorId]);

  if (loading || !analytics) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </Card>
    );
  }

  // Calcular ratios y métricas adicionales
  const ratioCancelaciones = analytics.totalReservas > 0
    ? Math.round((analytics.reservasCanceladas / analytics.totalReservas) * 100)
    : 0;

  const metrics = [
    {
      id: 'total-reservas',
      title: 'Total Reservas',
      value: analytics.totalReservas.toString(),
      icon: <Calendar className="w-6 h-6" />,
      color: 'info' as const,
      trend: {
        value: 0,
        direction: 'up' as const,
      },
    },
    {
      id: 'tasa-ocupacion',
      title: 'Tasa de Ocupación',
      value: `${analytics.tasaOcupacion}%`,
      icon: <TrendingUp className="w-6 h-6" />,
      color: analytics.tasaOcupacion >= 80 ? 'success' : analytics.tasaOcupacion >= 60 ? 'warning' : 'danger' as const,
      trend: {
        value: 0,
        direction: 'up' as const,
      },
    },
    {
      id: 'ratio-cancelaciones',
      title: 'Ratio Cancelaciones',
      value: `${ratioCancelaciones}%`,
      icon: <XCircle className="w-6 h-6" />,
      color: ratioCancelaciones <= 10 ? 'success' : ratioCancelaciones <= 20 ? 'warning' : 'danger' as const,
      trend: {
        value: 0,
        direction: ratioCancelaciones <= 20 ? 'down' : 'up' as const,
      },
    },
    {
      id: 'ingresos-totales',
      title: 'Ingresos Totales',
      value: `€${analytics.ingresosTotales.toLocaleString()}`,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'primary' as const,
      trend: {
        value: 0,
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
        value: 0,
        direction: 'up' as const,
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card className="bg-white shadow-sm">
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">
              Filtros
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Inicio
              </label>
              <Input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Fin
              </label>
              <Input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>
            {role === 'gimnasio' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Entrenador (Opcional)
                </label>
                <Input
                  type="text"
                  placeholder="ID del entrenador"
                  value={entrenadorId}
                  onChange={(e) => setEntrenadorId(e.target.value)}
                />
              </div>
            )}
            <div className="flex items-end">
              <Button
                variant="primary"
                onClick={cargarAnalytics}
                className="w-full"
              >
                Actualizar
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Métricas principales */}
      <Card className="bg-white shadow-sm">
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-900">
              Resumen General
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
