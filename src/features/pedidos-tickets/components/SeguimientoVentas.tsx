import React, { useState, useEffect } from 'react';
import { Card, MetricCards } from '../../../components/componentsreutilizables';
import { seguimientoApi } from '../api/seguimiento';
import { SeguimientoVenta } from '../types';
import { TrendingUp, DollarSign, ShoppingBag, CreditCard, Wallet } from 'lucide-react';

export const SeguimientoVentas: React.FC = () => {
  const [seguimiento, setSeguimiento] = useState<SeguimientoVenta[]>([]);
  const [resumen, setResumen] = useState<SeguimientoVenta | null>(null);
  const [periodo, setPeriodo] = useState<'dia' | 'semana' | 'mes' | 'año'>('mes');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, [periodo]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [seguimientoData, resumenData] = await Promise.all([
        seguimientoApi.obtenerSeguimiento(),
        seguimientoApi.obtenerResumen(periodo),
      ]);
      setSeguimiento(seguimientoData);
      setResumen(resumenData);
    } catch (error) {
      console.error('Error al cargar seguimiento:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(valor);
  };

  if (!resumen) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">
            Cargando datos de seguimiento...
          </p>
        </div>
      </div>
    );
  }

  const metricas = [
    {
      id: 'total-ventas',
      title: 'Total de Ventas',
      value: formatearMoneda(resumen.totalVentas),
      subtitle: `Período: ${periodo}`,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'primary' as const,
      trend: {
        value: 12.5,
        direction: 'up' as const,
        label: 'vs período anterior',
      },
    },
    {
      id: 'cantidad-pedidos',
      title: 'Cantidad de Pedidos',
      value: resumen.cantidadPedidos,
      subtitle: 'Pedidos procesados',
      icon: <ShoppingBag className="w-6 h-6" />,
      color: 'info' as const,
      trend: {
        value: 8.2,
        direction: 'up' as const,
        label: 'vs período anterior',
      },
    },
    {
      id: 'promedio-ticket',
      title: 'Promedio por Ticket',
      value: formatearMoneda(resumen.promedioTicket),
      subtitle: 'Ticket promedio',
      icon: <CreditCard className="w-6 h-6" />,
      color: 'success' as const,
      trend: {
        value: 5.3,
        direction: 'up' as const,
        label: 'vs período anterior',
      },
    },
    {
      id: 'productos-vendidos',
      title: 'Productos Vendidos',
      value: resumen.productosVendidos,
      subtitle: 'Unidades vendidas',
      icon: <Wallet className="w-6 h-6" />,
      color: 'warning' as const,
      trend: {
        value: 15.7,
        direction: 'up' as const,
        label: 'vs período anterior',
      },
    },
  ];

  const metodosPago = [
    {
      id: 'efectivo',
      title: 'Efectivo',
      value: formatearMoneda(resumen.metodoPago.efectivo),
      subtitle: `${((resumen.metodoPago.efectivo / resumen.totalVentas) * 100).toFixed(1)}% del total`,
      icon: <Wallet className="w-6 h-6" />,
      color: 'success' as const,
    },
    {
      id: 'tarjeta',
      title: 'Tarjeta',
      value: formatearMoneda(resumen.metodoPago.tarjeta),
      subtitle: `${((resumen.metodoPago.tarjeta / resumen.totalVentas) * 100).toFixed(1)}% del total`,
      icon: <CreditCard className="w-6 h-6" />,
      color: 'primary' as const,
    },
    {
      id: 'transferencia',
      title: 'Transferencia',
      value: formatearMoneda(resumen.metodoPago.transferencia),
      subtitle: `${((resumen.metodoPago.transferencia / resumen.totalVentas) * 100).toFixed(1)}% del total`,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'info' as const,
    },
    {
      id: 'credito',
      title: 'Crédito',
      value: formatearMoneda(resumen.metodoPago.credito),
      subtitle: `${((resumen.metodoPago.credito / resumen.totalVentas) * 100).toFixed(1)}% del total`,
      icon: <ShoppingBag className="w-6 h-6" />,
      color: 'warning' as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header con selector de período */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Seguimiento de Ventas
              </h2>
              <p className="text-base text-gray-600 mt-1">
                Análisis detallado del rendimiento de ventas
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Período
              </label>
              <select
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value as typeof periodo)}
                className="w-48 rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 pr-3 py-2.5"
              >
                <option value="dia">Día</option>
                <option value="semana">Semana</option>
                <option value="mes">Mes</option>
                <option value="año">Año</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Métricas principales */}
      <MetricCards data={metricas} columns={4} />

      {/* Métodos de pago */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Distribución por Método de Pago
          </h3>
          <MetricCards data={metodosPago} columns={4} />
        </div>
      </Card>

      {/* Gráfico de tendencias (placeholder) */}
      <Card className="bg-white shadow-sm">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Tendencias de Ventas
          </h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-base text-gray-600">
              Gráfico de tendencias (a implementar con librería de gráficos)
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

