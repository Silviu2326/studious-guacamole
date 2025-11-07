import React, { useState } from 'react';
import { Card, Table, TableColumn, Badge } from '../../../components/componentsreutilizables';
import { Factura, EstadoFactura } from '../types';
import { Filter, TrendingUp, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';

interface SeguimientoEstadosProps {
  facturas: Factura[];
  onRefresh: () => void;
}

export const SeguimientoEstados: React.FC<SeguimientoEstadosProps> = ({ facturas }) => {
  const [tabActiva, setTabActiva] = useState('todas');

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  const obtenerBadgeEstado = (estado: EstadoFactura) => {
    const estados: Record<EstadoFactura, { label: string; variant: 'gray' | 'blue' | 'green' | 'yellow' | 'red' }> = {
      pendiente: { label: 'Pendiente', variant: 'yellow' },
      parcial: { label: 'Parcial', variant: 'blue' },
      pagada: { label: 'Pagada', variant: 'green' },
      vencida: { label: 'Vencida', variant: 'red' },
      cancelada: { label: 'Cancelada', variant: 'gray' }
    };
    
    const estadoInfo = estados[estado];
    return (
      <Badge variant={estadoInfo.variant} size="sm">
        {estadoInfo.label}
      </Badge>
    );
  };

  const facturasPorEstado = {
    todas: facturas,
    pendientes: facturas.filter(f => f.estado === 'pendiente'),
    parciales: facturas.filter(f => f.estado === 'parcial'),
    pagadas: facturas.filter(f => f.estado === 'pagada'),
    vencidas: facturas.filter(f => f.estado === 'vencida'),
    canceladas: facturas.filter(f => f.estado === 'cancelada')
  };

  const columnas: TableColumn<Factura>[] = [
    {
      key: 'numeroFactura',
      label: 'Número',
      sortable: true
    },
    {
      key: 'cliente',
      label: 'Cliente',
      render: (_, row) => (
        <div>
          <div className="font-medium">{row.cliente.nombre}</div>
          <div className="text-sm text-gray-500">{row.cliente.email}</div>
        </div>
      )
    },
    {
      key: 'fechaEmision',
      label: 'Emisión',
      render: (_, row) => row.fechaEmision.toLocaleDateString('es-ES'),
      sortable: true
    },
    {
      key: 'fechaVencimiento',
      label: 'Vencimiento',
      render: (_, row) => {
        const vencida = new Date(row.fechaVencimiento) < new Date() && row.estado !== 'pagada';
        return (
          <span className={vencida ? 'text-red-600 font-medium' : ''}>
            {row.fechaVencimiento.toLocaleDateString('es-ES')}
          </span>
        );
      },
      sortable: true
    },
    {
      key: 'total',
      label: 'Total',
      render: (_, row) => formatearMoneda(row.total),
      align: 'right',
      sortable: true
    },
    {
      key: 'montoPendiente',
      label: 'Pendiente',
      render: (_, row) => (
        <span className={row.montoPendiente > 0 ? 'font-medium text-orange-600' : 'text-green-600'}>
          {formatearMoneda(row.montoPendiente)}
        </span>
      ),
      align: 'right',
      sortable: true
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (_, row) => obtenerBadgeEstado(row.estado)
    },
    {
      key: 'recordatoriosEnviados',
      label: 'Recordatorios',
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <span>{row.recordatoriosEnviados}</span>
        </div>
      )
    }
  ];

  const tabs = [
    {
      id: 'todas',
      label: 'Todas',
      icon: <Filter className="w-4 h-4" />
    },
    {
      id: 'pendientes',
      label: 'Pendientes',
      icon: <Clock className="w-4 h-4" />
    },
    {
      id: 'parciales',
      label: 'Parciales',
      icon: <TrendingUp className="w-4 h-4" />
    },
    {
      id: 'pagadas',
      label: 'Pagadas',
      icon: <CheckCircle className="w-4 h-4" />
    },
    {
      id: 'vencidas',
      label: 'Vencidas',
      icon: <AlertCircle className="w-4 h-4" />
    },
    {
      id: 'canceladas',
      label: 'Canceladas',
      icon: <XCircle className="w-4 h-4" />
    }
  ];

  const facturasFiltradas = facturasPorEstado[tabActiva as keyof typeof facturasPorEstado] || [];

  // Calcular estadísticas
  const estadisticas = {
    total: facturas.length,
    pendientes: facturasPorEstado.pendientes.length,
    parciales: facturasPorEstado.parciales.length,
    pagadas: facturasPorEstado.pagadas.length,
    vencidas: facturasPorEstado.vencidas.length,
    canceladas: facturasPorEstado.canceladas.length,
    montoTotal: facturas.reduce((sum, f) => sum + f.total, 0),
    montoPendiente: facturas.reduce((sum, f) => sum + f.montoPendiente, 0),
    montoCobrado: facturas.reduce((sum, f) => sum + (f.total - f.montoPendiente), 0)
  };

  return (
    <div className="space-y-6">
      {/* Estadísticas resumidas */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <div className="p-4">
            <div className="text-sm text-gray-600 mb-1">Total Facturas</div>
            <div className="text-2xl font-bold">{estadisticas.total}</div>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <div className="text-sm text-gray-600 mb-1">Monto Total</div>
            <div className="text-2xl font-bold">{formatearMoneda(estadisticas.montoTotal)}</div>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <div className="text-sm text-gray-600 mb-1">Pendiente</div>
            <div className="text-2xl font-bold text-orange-600">
              {formatearMoneda(estadisticas.montoPendiente)}
            </div>
          </div>
        </Card>
        <Card>
          <div className="p-4">
            <div className="text-sm text-gray-600 mb-1">Cobrado</div>
            <div className="text-2xl font-bold text-green-600">
              {formatearMoneda(estadisticas.montoCobrado)}
            </div>
          </div>
        </Card>
      </div>

      {/* Filtros por estado */}
      <Card className="p-0 bg-white shadow-sm">
        <div className="px-4 py-3">
          <div
            role="tablist"
            aria-label="Estados de facturas"
            className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
          >
            {tabs.map(({ id, label, icon: Icon }) => {
              const activo = tabActiva === id;
              return (
                <button
                  key={id}
                  role="tab"
                  aria-selected={activo}
                  onClick={() => setTabActiva(id)}
                  className={[
                    'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all',
                    activo
                      ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                  ].join(' ')}
                >
                  <Icon
                    size={18}
                    className={activo ? 'opacity-100' : 'opacity-70'}
                  />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-6 pb-6">
          <div className="mt-6">
            <Table
              data={facturasFiltradas}
              columns={columnas}
              emptyMessage={`No hay facturas en estado "${tabActiva}"`}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

