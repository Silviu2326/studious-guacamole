import React, { useState, useEffect } from 'react';
import { Card, MetricCards } from '../../../components/componentsreutilizables';
import { salasApi, materialApi } from '../api';
import { BarChart3, TrendingUp, Clock, Building2, Package, Calendar } from 'lucide-react';

export const AnalyticsRecursos: React.FC = () => {
  const [stats, setStats] = useState({
    ocupacionPromedio: 0,
    horasUsoTotal: 0,
    materialMasUsado: '',
    salaMasOcupada: '',
    tasaUtilizacion: 0,
    reservasMes: 0,
    mantenimientosPendientes: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarAnalytics();
  }, []);

  const cargarAnalytics = async () => {
    try {
      setLoading(true);
      const [salas, material] = await Promise.all([
        salasApi.obtenerSalas(),
        materialApi.obtenerMaterial()
      ]);

      const ocupacionPromedio = salas.length > 0
        ? Math.round(salas.reduce((sum, s) => sum + (s.ocupacionActual / s.capacidad * 100), 0) / salas.length)
        : 0;

      const materialMasUsado = material.reduce((max, m) => 
        m.cantidadEnUso > (max?.cantidadEnUso || 0) ? m : max
      , material[0] || null);

      const salaMasOcupada = salas.reduce((max, s) => 
        (s.ocupacionActual / s.capacidad) > ((max?.ocupacionActual || 0) / (max?.capacidad || 1)) ? s : max
      , salas[0] || null);

      const tasaUtilizacion = salas.length > 0
        ? Math.round((salas.reduce((sum, s) => sum + s.ocupacionActual, 0) / 
                     salas.reduce((sum, s) => sum + s.capacidad, 0)) * 100)
        : 0;

      const mantenimientos = await materialApi.obtenerMantenimientosPreventivos();
      const mantenimientosPendientes = mantenimientos.filter(m => 
        m.estado === 'programado' || m.estado === 'atrasado'
      ).length;

      setStats({
        ocupacionPromedio,
        horasUsoTotal: 0, // Calcular según reservas reales
        materialMasUsado: materialMasUsado?.nombre || 'N/A',
        salaMasOcupada: salaMasOcupada?.nombre || 'N/A',
        tasaUtilizacion,
        reservasMes: 0, // Calcular según reservas reales
        mantenimientosPendientes
      });
    } catch (error) {
      console.error('Error al cargar analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const metricas = [
    {
      id: 'ocupacion-promedio',
      title: 'Ocupación Promedio',
      value: `${stats.ocupacionPromedio}%`,
      subtitle: 'Por sala',
      icon: <TrendingUp className="w-6 h-6" />,
      color: stats.ocupacionPromedio > 80 ? 'success' as const : stats.ocupacionPromedio > 50 ? 'info' as const : 'warning' as const,
      loading
    },
    {
      id: 'tasa-utilizacion',
      title: 'Tasa de Utilización',
      value: `${stats.tasaUtilizacion}%`,
      subtitle: 'Global del centro',
      icon: <BarChart3 className="w-6 h-6" />,
      color: stats.tasaUtilizacion > 70 ? 'success' as const : stats.tasaUtilizacion > 40 ? 'info' as const : 'warning' as const,
      loading
    },
    {
      id: 'sala-mas-ocupada',
      title: 'Sala Más Ocupada',
      value: stats.salaMasOcupada,
      subtitle: 'Por ocupación',
      icon: <Building2 className="w-6 h-6" />,
      color: 'primary' as const,
      loading
    },
    {
      id: 'material-mas-usado',
      title: 'Material Más Usado',
      value: stats.materialMasUsado,
      subtitle: 'Actualmente',
      icon: <Package className="w-6 h-6" />,
      color: 'info' as const,
      loading
    },
    {
      id: 'reservas-mes',
      title: 'Reservas Este Mes',
      value: stats.reservasMes,
      subtitle: 'Total reservas',
      icon: <Calendar className="w-6 h-6" />,
      color: 'primary' as const,
      loading
    },
    {
      id: 'mantenimientos-pendientes',
      title: 'Mantenimientos Pendientes',
      value: stats.mantenimientosPendientes,
      subtitle: 'Programados',
      icon: <Clock className="w-6 h-6" />,
      color: stats.mantenimientosPendientes > 5 ? 'warning' as const : 'success' as const,
      loading
    }
  ];

  return (
    <div className="space-y-6">
      <MetricCards data={metricas} columns={3} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4 bg-white shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Resumen de Utilización
          </h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Ocupación Promedio</span>
              <span className="text-base font-semibold text-gray-900">
                {stats.ocupacionPromedio}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full ${
                  stats.ocupacionPromedio > 80 ? 'bg-green-500' :
                  stats.ocupacionPromedio > 50 ? 'bg-yellow-500' : 'bg-orange-500'
                }`}
                style={{ width: `${Math.min(stats.ocupacionPromedio, 100)}%` }}
              />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Indicadores Clave
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Tasa de Utilización Global</span>
              <span className="text-base font-semibold text-blue-600">
                {stats.tasaUtilizacion}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Reservas Este Mes</span>
              <span className="text-base font-semibold text-gray-900">
                {stats.reservasMes}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Mantenimientos Pendientes</span>
              <span className={`text-base font-semibold ${
                stats.mantenimientosPendientes > 5 ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {stats.mantenimientosPendientes}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

