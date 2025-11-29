import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Clock, AlertCircle, Users } from 'lucide-react';
import { Card, Button, Select, MetricCards, Table } from '../../../components/componentsreutilizables';
import { EstadisticasCumplimientoPolitica as EstadisticasCumplimiento } from '../types';
import { getEstadisticasCumplimientoPolitica } from '../api/metricasNoShows';
import { useAuth } from '../../../context/AuthContext';

export const EstadisticasCumplimientoPolitica: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [estadisticas, setEstadisticas] = useState<EstadisticasCumplimiento | null>(null);
  const [periodo, setPeriodo] = useState<'mes' | 'trimestre' | 'anio'>('mes');

  useEffect(() => {
    cargarEstadisticas();
  }, [periodo]);

  const cargarEstadisticas = async () => {
    setLoading(true);
    try {
      let fechaInicio: Date;
      const fechaFin = new Date();

      if (periodo === 'mes') {
        fechaInicio = new Date(fechaFin.getFullYear(), fechaFin.getMonth(), 1);
      } else if (periodo === 'trimestre') {
        const trimestreActual = Math.floor(fechaFin.getMonth() / 3);
        fechaInicio = new Date(fechaFin.getFullYear(), trimestreActual * 3, 1);
      } else {
        fechaInicio = new Date(fechaFin.getFullYear(), 0, 1);
      }

      const stats = await getEstadisticasCumplimientoPolitica(user?.id, {
        inicio: fechaInicio,
        fin: fechaFin,
      });
      setEstadisticas(stats);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const metricasData = estadisticas ? [
    {
      id: 'cumplimiento',
      title: 'Tasa de Cumplimiento',
      value: `${estadisticas.tasaCumplimiento}%`,
      subtitle: `${estadisticas.cancelacionesOnTime} de ${estadisticas.totalCancelaciones} cancelaciones`,
      icon: <TrendingUp className="w-6 h-6" />,
      color: estadisticas.tasaCumplimiento >= 80 ? 'success' as const : estadisticas.tasaCumplimiento >= 60 ? 'warning' as const : 'error' as const,
      loading,
    },
    {
      id: 'cancelaciones-tardias',
      title: 'Cancelaciones Tardías',
      value: estadisticas.cancelacionesTardias.toString(),
      subtitle: `${estadisticas.totalCancelaciones - estadisticas.cancelacionesTardias} a tiempo`,
      icon: <AlertCircle className="w-6 h-6" />,
      color: 'error' as const,
      loading,
    },
    {
      id: 'promedio-horas',
      title: 'Promedio Horas Anticipación',
      value: `${estadisticas.promedioHorasAnticipacion.toFixed(1)}h`,
      subtitle: 'Tiempo promedio de anticipación',
      icon: <Clock className="w-6 h-6" />,
      color: 'info' as const,
      loading,
    },
    {
      id: 'penalizaciones',
      title: 'Penalizaciones Aplicadas',
      value: estadisticas.penalizacionesAplicadas.toString(),
      subtitle: `${estadisticas.excepcionesAplicadas} excepciones aplicadas`,
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'warning' as const,
      loading,
    },
  ] : [];

  const columnasPorCliente = [
    {
      key: 'clienteNombre',
      label: 'Cliente',
      render: (cliente: any) => cliente.clienteNombre,
    },
    {
      key: 'totalCancelaciones',
      label: 'Total Cancelaciones',
      render: (cliente: any) => cliente.totalCancelaciones,
    },
    {
      key: 'cancelacionesTardias',
      label: 'Cancelaciones Tardías',
      render: (cliente: any) => (
        <span className={cliente.cancelacionesTardias > 0 ? 'text-red-600 font-semibold' : 'text-gray-600'}>
          {cliente.cancelacionesTardias}
        </span>
      ),
    },
    {
      key: 'tasaCumplimiento',
      label: 'Tasa de Cumplimiento',
      render: (cliente: any) => (
        <span className={
          cliente.tasaCumplimiento >= 80 ? 'text-green-600 font-semibold' :
          cliente.tasaCumplimiento >= 60 ? 'text-yellow-600 font-semibold' :
          'text-red-600 font-semibold'
        }>
          {cliente.tasaCumplimiento}%
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Estadísticas de Cumplimiento de Política</h2>
            </div>
            <Select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value as 'mes' | 'trimestre' | 'anio')}
              options={[
                { value: 'mes', label: 'Este Mes' },
                { value: 'trimestre', label: 'Este Trimestre' },
                { value: 'anio', label: 'Este Año' },
              ]}
            />
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-500">Cargando estadísticas...</div>
          ) : estadisticas ? (
            <>
              <MetricCards data={metricasData} columns={4} />

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Cumplimiento por Cliente
                </h3>
                {estadisticas.porCliente.length > 0 ? (
                  <Table
                    data={estadisticas.porCliente}
                    columns={columnasPorCliente}
                  />
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No hay datos de cancelaciones en este período
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">No se pudieron cargar las estadísticas</div>
          )}
        </div>
      </Card>
    </div>
  );
};


