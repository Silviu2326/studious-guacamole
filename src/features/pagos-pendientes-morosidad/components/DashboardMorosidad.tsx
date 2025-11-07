import React, { useState, useEffect } from 'react';
import { Card, MetricCards, Badge } from '../../../components/componentsreutilizables';
import { EstadisticasMorosidad, PagoPendiente } from '../types';
import { morosidadAPI } from '../api/morosidad';
import { DollarSign, AlertCircle, TrendingUp, Clock, Users, Target } from 'lucide-react';

interface DashboardMorosidadProps {
  onRefresh?: () => void;
}

export const DashboardMorosidad: React.FC<DashboardMorosidadProps> = ({ onRefresh }) => {
  const [estadisticas, setEstadisticas] = useState<EstadisticasMorosidad | null>(null);
  const [pagos, setPagos] = useState<PagoPendiente[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [estadisticasData, pagosData] = await Promise.all([
        morosidadAPI.obtenerEstadisticas(),
        morosidadAPI.obtenerPagosPendientes()
      ]);
      setEstadisticas(estadisticasData);
      setPagos(pagosData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  const metricas = estadisticas ? [
    {
      id: 'total-pendientes',
      title: 'Total Pendientes',
      value: estadisticas.totalPendientes.toString(),
      subtitle: formatearMoneda(estadisticas.montoTotalPendiente),
      icon: <DollarSign className="w-6 h-6" />,
      color: 'warning' as const
    },
    {
      id: 'total-vencidos',
      title: 'Vencidos',
      value: estadisticas.totalVencidos.toString(),
      subtitle: formatearMoneda(estadisticas.montoTotalVencido),
      icon: <AlertCircle className="w-6 h-6" />,
      color: 'error' as const
    },
    {
      id: 'promedio-retraso',
      title: 'Promedio Retraso',
      value: `${Math.round(estadisticas.promedioDiasRetraso)} días`,
      subtitle: 'Tiempo promedio de mora',
      icon: <Clock className="w-6 h-6" />,
      color: 'warning' as const
    },
    {
      id: 'tasa-recuperacion',
      title: 'Tasa Recuperación',
      value: `${(estadisticas.tasaRecuperacion * 100).toFixed(1)}%`,
      subtitle: 'Porcentaje de éxito',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'success' as const
    }
  ] : [];

  const pagosUrgentes = pagos
    .filter(p => p.diasRetraso > 30 || p.riesgo === 'critico')
    .slice(0, 5);

  const pagosRecientes = pagos
    .sort((a, b) => b.diasRetraso - a.diasRetraso)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Dashboard de Morosidad
        </h2>
        <p className="text-gray-600">
          Vista general de la situación de pagos pendientes y morosidad
        </p>
      </div>

      {/* Métricas principales */}
      <MetricCards data={metricas} columns={4} />

      {/* Desglose por nivel */}
      {estadisticas && (
        <Card className="bg-white shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Distribución por Nivel de Morosidad
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {Object.entries(estadisticas.porNivel).map(([nivel, datos]) => (
                <div key={nivel} className="p-4 bg-gray-50 rounded-lg ring-1 ring-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700 capitalize">{nivel}</span>
                    <Badge 
                      variant={
                        nivel === 'negro' || nivel === 'rojo' ? 'red' : 
                        nivel === 'naranja' ? 'yellow' : 'green'
                      } 
                      size="sm"
                    >
                      {datos.cantidad}
                    </Badge>
                  </div>
                  <div className="text-xl font-bold text-gray-900">{formatearMoneda(datos.monto)}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Casos urgentes */}
      {pagosUrgentes.length > 0 && (
        <Card className="bg-white shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Casos que Requieren Atención Urgente
            </h3>
            <div className="space-y-3">
              {pagosUrgentes.map(pago => (
                <div
                  key={pago.id}
                  className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-xl"
                >
                  <div className="flex-1">
                    <div className="font-medium text-red-900">{pago.numeroFactura}</div>
                    <div className="text-sm text-red-700">{pago.cliente.nombre}</div>
                    <div className="text-xs text-red-600 mt-1">
                      {pago.diasRetraso} días de retraso • {formatearMoneda(pago.montoPendiente)}
                    </div>
                  </div>
                  <Badge variant="red" size="md">
                    {pago.riesgo === 'critico' ? 'Crítico' : 'Urgente'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Pagos con más retraso */}
      {pagosRecientes.length > 0 && (
        <Card className="bg-white shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Pagos con Mayor Retraso
            </h3>
            <div className="space-y-2">
              {pagosRecientes.map(pago => (
                <div
                  key={pago.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <span className="font-medium text-gray-900">{pago.numeroFactura}</span>
                    <span className="text-sm text-gray-500 ml-2">- {pago.cliente.nombre}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={pago.diasRetraso > 30 ? 'red' : pago.diasRetraso > 15 ? 'yellow' : 'green'} size="sm">
                      {pago.diasRetraso} días
                    </Badge>
                    <span className="font-semibold text-gray-900">{formatearMoneda(pago.montoPendiente)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

