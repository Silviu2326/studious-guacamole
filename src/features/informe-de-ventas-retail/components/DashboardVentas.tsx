import React, { useState, useEffect } from 'react';
import { Card, MetricCards, Badge } from '../../../components/componentsreutilizables';
import { getDashboardVentas } from '../api';
import { DashboardVentasData } from '../types';
import { BarChart3, AlertTriangle, Lightbulb, TrendingUp, DollarSign, ShoppingCart, Percent, Users, Loader2 } from 'lucide-react';

export const DashboardVentas: React.FC = () => {
  const [dashboard, setDashboard] = useState<DashboardVentasData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarDashboard();
  }, []);

  const cargarDashboard = async () => {
    setLoading(true);
    try {
      const fechaInicio = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const fechaFin = new Date().toISOString().split('T')[0];
      const data = await getDashboardVentas(fechaInicio, fechaFin);
      setDashboard(data);
    } catch (error) {
      console.error('Error al cargar dashboard:', error);
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

  const getSeveridadColor = (severidad: 'alta' | 'media' | 'baja'): 'red' | 'yellow' | 'blue' => {
    switch (severidad) {
      case 'alta':
        return 'red';
      case 'media':
        return 'yellow';
      case 'baja':
        return 'blue';
      default:
        return 'blue';
    }
  };

  const getTipoColor = (tipo: string): 'yellow' | 'blue' | 'green' | 'red' => {
    switch (tipo) {
      case 'precio':
        return 'yellow';
      case 'stock':
        return 'blue';
      case 'promocion':
        return 'green';
      case 'eliminacion':
        return 'red';
      default:
        return 'blue';
    }
  };

  const kpis = dashboard ? [
    {
      id: 'ventas-totales',
      title: 'Ventas Totales',
      value: formatearMoneda(dashboard.kpis.ventasTotales),
      subtitle: 'Período actual',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'primary' as const
    },
    {
      id: 'ticket-promedio',
      title: 'Ticket Promedio',
      value: formatearMoneda(dashboard.kpis.ticketPromedio),
      subtitle: 'Por transacción',
      icon: <ShoppingCart className="w-6 h-6" />,
      color: 'success' as const
    },
    {
      id: 'conversion-rate',
      title: 'Tasa de Conversión',
      value: `${dashboard.kpis.conversionRate}%`,
      subtitle: 'Visitantes que compran',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'info' as const
    },
    {
      id: 'unidades-vendidas',
      title: 'Unidades Vendidas',
      value: dashboard.kpis.unidadesVendidas.toString(),
      subtitle: 'Total de productos',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'warning' as const
    },
    {
      id: 'margen-bruto',
      title: 'Margen Bruto',
      value: `${dashboard.kpis.margenBruto}%`,
      subtitle: 'Rentabilidad',
      icon: <Percent className="w-6 h-6" />,
      color: 'success' as const
    },
    {
      id: 'ventas-empleado',
      title: 'Ventas por Empleado',
      value: formatearMoneda(dashboard.kpis.ventasPorEmpleado),
      subtitle: 'Promedio mensual',
      icon: <Users className="w-6 h-6" />,
      color: 'info' as const
    }
  ] : [];

  if (loading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPIs Principales */}
      <MetricCards
        data={kpis}
        columns={3}
      />

      {/* Alertas y Recomendaciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alertas */}
        <Card className="p-4 bg-white shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={18} className="text-yellow-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Alertas
            </h3>
          </div>
          <div className="space-y-3">
            {dashboard?.alertas && dashboard.alertas.length > 0 ? (
              dashboard.alertas.map((alerta) => (
                <div
                  key={alerta.id}
                  className={`p-4 rounded-xl ring-1 ${
                    alerta.severidad === 'alta'
                      ? 'bg-red-50 ring-red-200'
                      : alerta.severidad === 'media'
                      ? 'bg-yellow-50 ring-yellow-200'
                      : 'bg-blue-50 ring-blue-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <p className="text-sm text-gray-700">
                      {alerta.mensaje}
                    </p>
                    <Badge variant={getSeveridadColor(alerta.severidad)}>
                      {alerta.severidad}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-600 text-center py-4">No hay alertas</p>
            )}
          </div>
        </Card>

        {/* Recomendaciones */}
        <Card className="p-4 bg-white shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb size={18} className="text-yellow-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Recomendaciones
            </h3>
          </div>
          <div className="space-y-3">
            {dashboard?.recomendaciones && dashboard.recomendaciones.length > 0 ? (
              dashboard.recomendaciones.map((recomendacion) => (
                <div
                  key={recomendacion.id}
                  className="p-4 rounded-xl bg-blue-50 ring-1 ring-blue-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-medium text-gray-900">
                      {recomendacion.mensaje}
                    </p>
                    <Badge variant={getTipoColor(recomendacion.tipo)}>
                      {recomendacion.tipo}
                    </Badge>
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    {recomendacion.accion} →
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-600 text-center py-4">No hay recomendaciones</p>
            )}
          </div>
        </Card>
      </div>

      {/* Tendencias */}
      <Card className="p-4 bg-white shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Tendencias de Ventas
        </h3>
        {dashboard?.tendencias && dashboard.tendencias.length > 0 ? (
          <div className="space-y-2">
            {dashboard.tendencias.map((tendencia, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">
                  {new Date(tendencia.fecha).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' })}
                </span>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-900">
                    {tendencia.unidades} unidades
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatearMoneda(tendencia.ventas)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-600 text-center py-8">
            No hay datos de tendencias disponibles
          </p>
        )}
      </Card>
    </div>
  );
};

