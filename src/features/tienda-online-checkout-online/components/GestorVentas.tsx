import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, MetricCards } from '../../../components/componentsreutilizables';
import { Venta } from '../types';
import { getVentas } from '../api/ventas';
import { Receipt, Eye, Download, Calendar } from 'lucide-react';

interface GestorVentasProps {
  rol: 'entrenador' | 'gimnasio';
  onVerDetalle?: (venta: Venta) => void;
}

export const GestorVentas: React.FC<GestorVentasProps> = ({ rol, onVerDetalle }) => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    cargarVentas();
  }, [rol]);

  const cargarVentas = async () => {
    setCargando(true);
    try {
      const data = await getVentas(rol);
      setVentas(data);
    } catch (error) {
      console.error('Error cargando ventas:', error);
    } finally {
      setCargando(false);
    }
  };

  const getEstadoBadge = (estado: Venta['estado']) => {
    switch (estado) {
      case 'completada':
        return 'success';
      case 'pendiente':
        return 'warning';
      case 'cancelada':
      case 'reembolsada':
        return 'error';
      default:
        return 'info';
    }
  };

  const formatoFecha = (fecha: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(fecha));
  };

  const columnas = [
    {
      key: 'id',
      label: 'ID Venta',
      render: (value: string) => (
        <span className="font-mono text-xs text-gray-900">{value}</span>
      ),
    },
    {
      key: 'fecha',
      label: 'Fecha',
      render: (value: Date) => (
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-400" />
          <span className="text-sm text-gray-900">{formatoFecha(value)}</span>
        </div>
      ),
    },
    {
      key: 'cliente',
      label: 'Cliente',
      render: (value: Venta['cliente']) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{value.nombre}</p>
          <p className="text-xs text-gray-600">
            {value.email}
          </p>
        </div>
      ),
    },
    {
      key: 'productos',
      label: 'Productos',
      render: (value: Venta['productos']) => (
        <span className="text-sm text-gray-900">
          {value.length} {value.length === 1 ? 'producto' : 'productos'}
        </span>
      ),
    },
    {
      key: 'total',
      label: 'Total',
      render: (value: number) => (
        <span className="text-base font-semibold text-blue-600">
          €{value.toFixed(2)}
        </span>
      ),
      align: 'right' as const,
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (value: Venta['estado']) => (
        <Badge variant={getEstadoBadge(value) as any}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      ),
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_: any, venta: Venta) => (
        <div className="flex gap-2">
          {onVerDetalle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onVerDetalle(venta)}
            >
              <Eye size={16} />
            </Button>
          )}
          {venta.facturaId && (
            <Button variant="ghost" size="sm">
              <Download size={16} />
            </Button>
          )}
        </div>
      ),
      align: 'right' as const,
    },
  ];

  const resumen = {
    total: ventas.length,
    completadas: ventas.filter((v) => v.estado === 'completada').length,
    pendientes: ventas.filter((v) => v.estado === 'pendiente').length,
    ingresos: ventas
      .filter((v) => v.estado === 'completada')
      .reduce((sum, v) => sum + v.total, 0),
  };

  const metricas = [
    {
      id: 'total',
      title: 'Total Ventas',
      value: resumen.total,
      color: 'info' as const,
      icon: <Receipt size={20} />,
    },
    {
      id: 'completadas',
      title: 'Completadas',
      value: resumen.completadas,
      color: 'success' as const,
      icon: <Receipt size={20} />,
    },
    {
      id: 'pendientes',
      title: 'Pendientes',
      value: resumen.pendientes,
      color: 'warning' as const,
      icon: <Receipt size={20} />,
    },
    {
      id: 'ingresos',
      title: 'Ingresos Totales',
      value: `€${resumen.ingresos.toFixed(2)}`,
      color: 'primary' as const,
      icon: <Receipt size={20} />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Métricas */}
      <MetricCards data={metricas} columns={4} />

      {/* Tabla de ventas */}
      <Card className="p-0 bg-white shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
              <Receipt size={20} className="text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Historial de Ventas
            </h2>
          </div>
        </div>
        <Table
          data={ventas}
          columns={columnas}
          loading={cargando}
          emptyMessage="No hay ventas registradas"
        />
      </Card>
    </div>
  );
};

