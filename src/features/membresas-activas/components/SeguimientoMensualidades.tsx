import React, { useState, useEffect } from 'react';
import { Card, Table, MetricCards } from '../../../components/componentsreutilizables';
import { SeguimientoMensual } from '../types';
import { getSeguimientoMensual, getEstadisticasMensuales } from '../api/seguimiento';
import { Calendar, TrendingUp, DollarSign, CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';

interface SeguimientoMensualidadesProps {
  role: 'entrenador' | 'gimnasio';
  userId?: string;
}

export const SeguimientoMensualidades: React.FC<SeguimientoMensualidadesProps> = ({
  role,
  userId,
}) => {
  const [seguimiento, setSeguimiento] = useState<SeguimientoMensual[]>([]);
  const [estadisticas, setEstadisticas] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mesSeleccionado, setMesSeleccionado] = useState(
    new Date().toISOString().slice(0, 7) // YYYY-MM
  );

  useEffect(() => {
    loadData();
  }, [mesSeleccionado, role, userId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [seguimientoData, statsData] = await Promise.all([
        getSeguimientoMensual(role, userId, mesSeleccionado),
        getEstadisticasMensuales(role, userId),
      ]);
      setSeguimiento(seguimientoData);
      setEstadisticas(statsData);
    } catch (error) {
      console.error('Error cargando seguimiento:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)} €`;
  };

  const formatMes = (mes: string) => {
    const [year, month] = mes.split('-');
    const fecha = new Date(parseInt(year), parseInt(month) - 1);
    return fecha.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'completo':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-green-100 text-green-700 text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            Completo
          </span>
        );
      case 'pendiente':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-yellow-100 text-yellow-700 text-xs font-medium">
            <Clock className="w-3 h-3" />
            Pendiente
          </span>
        );
      case 'atrasado':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-red-100 text-red-700 text-xs font-medium">
            <AlertCircle className="w-3 h-3" />
            Atrasado
          </span>
        );
      default:
        return <span className="px-2 py-1 rounded-lg bg-gray-100 text-gray-700 text-xs font-medium">{estado}</span>;
    }
  };

  const metricas = estadisticas
    ? [
        {
          id: 'total',
          title: 'Total Esperado',
          value: formatCurrency(estadisticas.totalEsperado),
          icon: <DollarSign className="w-5 h-5" />,
          color: 'primary' as const,
        },
        {
          id: 'recibido',
          title: 'Total Recibido',
          value: formatCurrency(estadisticas.totalRecibido),
          icon: <CheckCircle className="w-5 h-5" />,
          color: 'success' as const,
        },
        {
          id: 'tasa',
          title: 'Tasa de Cobro',
          value: `${estadisticas.tasaCobro.toFixed(1)}%`,
          icon: <TrendingUp className="w-5 h-5" />,
          color: estadisticas.tasaCobro >= 80 ? 'success' : estadisticas.tasaCobro >= 50 ? 'warning' : 'error' as const,
        },
        {
          id: 'completados',
          title: 'Pagos Completados',
          value: estadisticas.pagosCompletados.toString(),
          subtitle: `de ${estadisticas.pagosCompletados + estadisticas.pagosPendientes + estadisticas.pagosAtrasados} total`,
          icon: <CheckCircle className="w-5 h-5" />,
          color: 'success' as const,
        },
      ]
    : [];

  const columns = [
    {
      key: 'mes',
      label: 'Mes',
      render: (_: any, row: SeguimientoMensual) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-500" />
          <span className="text-sm font-semibold text-gray-900">
            {formatMes(row.mes)}
          </span>
        </div>
      ),
    },
    {
      key: 'montoTotal',
      label: 'Monto Esperado',
      render: (_: any, row: SeguimientoMensual) => (
        <span className="text-sm font-semibold text-gray-900">
          {formatCurrency(row.montoTotal)}
        </span>
      ),
    },
    {
      key: 'montoRecibido',
      label: 'Monto Recibido',
      render: (_: any, row: SeguimientoMensual) => (
        <span className="text-sm font-semibold text-green-600">
          {formatCurrency(row.montoRecibido)}
        </span>
      ),
    },
    {
      key: 'pagosRecibidos',
      label: 'Pagos',
      render: (_: any, row: SeguimientoMensual) => (
        <span className="text-sm text-gray-600">
          {row.pagosRecibidos} / {row.pagosEsperados}
        </span>
      ),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (_: any, row: SeguimientoMensual) => getEstadoBadge(row.estado),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Selector de mes */}
      <Card className="bg-white shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Seguimiento Mensual
            </h3>
          </div>
          <input
            type="month"
            value={mesSeleccionado}
            onChange={(e) => setMesSeleccionado(e.target.value)}
            className="rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
          />
        </div>
      </Card>

      {/* Métricas */}
      {estadisticas && <MetricCards data={metricas} columns={4} />}

      {/* Tabla de seguimiento */}
      {loading ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando...</p>
        </Card>
      ) : seguimiento.length === 0 ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay datos de seguimiento</h3>
          <p className="text-gray-600">No se encontraron datos para este mes</p>
        </Card>
      ) : (
        <Card className="bg-white shadow-sm">
          <Table
            data={seguimiento}
            columns={columns}
            loading={false}
            emptyMessage="No hay datos de seguimiento para este mes"
          />
        </Card>
      )}
    </div>
  );
};

