import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Users, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Card, Button } from '../../../components/componentsreutilizables';
import {
  EstadisticasConfirmacionCliente,
} from '../types';
import {
  getTodasEstadisticasConfirmacion,
} from '../api/confirmacionCliente';

export const EstadisticasConfirmacion: React.FC = () => {
  const [estadisticas, setEstadisticas] = useState<EstadisticasConfirmacionCliente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    setLoading(true);
    try {
      const data = await getTodasEstadisticasConfirmacion();
      setEstadisticas(data);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const calcularPromedioTasaConfirmacion = (): number => {
    if (estadisticas.length === 0) return 0;
    const suma = estadisticas.reduce((acc, stat) => acc + stat.tasaConfirmacion, 0);
    return Math.round(suma / estadisticas.length);
  };

  const getColorTasa = (tasa: number): string => {
    if (tasa >= 80) return 'text-green-600';
    if (tasa >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBgColorTasa = (tasa: number): string => {
    if (tasa >= 80) return 'bg-green-100';
    if (tasa >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  if (loading) {
    return (
      <Card className="bg-white shadow-sm">
        <div className="p-6 text-center">Cargando estadísticas...</div>
      </Card>
    );
  }

  const promedioTasa = calcularPromedioTasaConfirmacion();
  const totalSesiones = estadisticas.reduce((acc, stat) => acc + stat.totalSesiones, 0);
  const totalConfirmadas = estadisticas.reduce((acc, stat) => acc + stat.sesionesConfirmadas, 0);
  const totalCanceladas = estadisticas.reduce((acc, stat) => acc + stat.sesionesCanceladas, 0);
  const totalPendientes = estadisticas.reduce((acc, stat) => acc + stat.sesionesPendientes, 0);

  return (
    <div className="space-y-6">
      {/* Resumen general */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Estadísticas de Confirmación</h3>
              <p className="text-sm text-gray-600 mt-1">
                Tasa de confirmación y asistencia de clientes
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-600" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Tasa Promedio</span>
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <p className={`text-2xl font-bold ${getColorTasa(promedioTasa)}`}>
                {promedioTasa}%
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Confirmadas</span>
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-600">{totalConfirmadas}</p>
              <p className="text-xs text-gray-500 mt-1">de {totalSesiones} sesiones</p>
            </div>

            <div className="p-4 bg-red-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Canceladas</span>
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-red-600">{totalCanceladas}</p>
              <p className="text-xs text-gray-500 mt-1">
                {totalSesiones > 0 ? Math.round((totalCanceladas / totalSesiones) * 100) : 0}% del total
              </p>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Pendientes</span>
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-yellow-600">{totalPendientes}</p>
              <p className="text-xs text-gray-500 mt-1">Esperando confirmación</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Estadísticas por cliente */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Por Cliente</h3>
              <p className="text-sm text-gray-600 mt-1">
                Detalle de confirmaciones por cliente
              </p>
            </div>
            <Users className="w-6 h-6 text-gray-400" />
          </div>

          {estadisticas.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay estadísticas disponibles
            </div>
          ) : (
            <div className="space-y-4">
              {estadisticas.map((stat) => (
                <div
                  key={stat.clienteId}
                  className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{stat.clienteNombre}</h4>
                      <p className="text-sm text-gray-600">
                        {stat.totalSesiones} sesiones totales
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getBgColorTasa(stat.tasaConfirmacion)} ${getColorTasa(stat.tasaConfirmacion)}`}>
                      {stat.tasaConfirmacion}%
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>Confirmadas</span>
                      </div>
                      <p className="text-lg font-bold text-green-600">
                        {stat.sesionesConfirmadas}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <XCircle className="w-4 h-4 text-red-600" />
                        <span>Canceladas</span>
                      </div>
                      <p className="text-lg font-bold text-red-600">
                        {stat.sesionesCanceladas}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <Clock className="w-4 h-4 text-yellow-600" />
                        <span>Pendientes</span>
                      </div>
                      <p className="text-lg font-bold text-yellow-600">
                        {stat.sesionesPendientes}
                      </p>
                    </div>
                  </div>

                  {/* Barra de progreso */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${stat.tasaConfirmacion}%` }}
                    />
                  </div>

                  {stat.ultimaConfirmacion && (
                    <p className="text-xs text-gray-500 mt-2">
                      Última confirmación: {stat.ultimaConfirmacion.toLocaleDateString('es-ES')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};


