import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Badge } from '../../../components/componentsreutilizables';
import { pedidosApi } from '../api/pedidos';
import { Pedido, FiltroPedidos } from '../types';
import { Plus, Search, Eye, Edit, X } from 'lucide-react';

export const PedidosManager: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtros, setFiltros] = useState<FiltroPedidos>({});
  const [buscar, setBuscar] = useState('');

  useEffect(() => {
    cargarPedidos();
  }, [filtros]);

  const cargarPedidos = async () => {
    setLoading(true);
    try {
      const datos = await pedidosApi.obtenerPedidos({ ...filtros, buscar });
      setPedidos(datos);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(valor);
  };

  const formatearFecha = (fecha: Date | string) => {
    const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
    return new Intl.DateTimeFormat('es-CO', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(fechaObj);
  };

  const getEstadoBadge = (estado: Pedido['estado']) => {
    const estados = {
      pendiente: { label: 'Pendiente', variant: 'yellow' as const },
      confirmado: { label: 'Confirmado', variant: 'blue' as const },
      procesando: { label: 'Procesando', variant: 'blue' as const },
      completado: { label: 'Completado', variant: 'green' as const },
      cancelado: { label: 'Cancelado', variant: 'red' as const },
    };
    return estados[estado] || estados.pendiente;
  };

  const columnas = [
    {
      key: 'numeroPedido',
      label: 'Número de Pedido',
      sortable: true,
      render: (value: string, row: Pedido) => (
        <div className="font-semibold text-purple-600 dark:text-purple-400">{value}</div>
      ),
    },
    {
      key: 'clienteNombre',
      label: 'Cliente',
      sortable: true,
    },
    {
      key: 'fecha',
      label: 'Fecha',
      sortable: true,
      render: (value: Date | string) => formatearFecha(value),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (value: Pedido['estado']) => {
        const estadoInfo = getEstadoBadge(value);
        return <Badge variant={estadoInfo.variant}>{estadoInfo.label}</Badge>;
      },
    },
    {
      key: 'total',
      label: 'Total',
      align: 'right' as const,
      sortable: true,
      render: (value: number) => (
        <span className="font-semibold">{formatearMoneda(value)}</span>
      ),
    },
    {
      key: 'metodoPago',
      label: 'Método de Pago',
      render: (value: Pedido['metodoPago']) => {
        const metodos: Record<string, string> = {
          efectivo: 'Efectivo',
          tarjeta: 'Tarjeta',
          transferencia: 'Transferencia',
          credito: 'Crédito',
        };
        return metodos[value] || value;
      },
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_: any, row: Pedido) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => verDetalle(row)}
            title="Ver detalle"
          >
            <Eye className="w-4 h-4" />
          </Button>
          {row.estado === 'pendiente' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editarPedido(row)}
              title="Editar"
            >
              <Edit className="w-4 h-4" />
            </Button>
          )}
          {row.estado !== 'cancelado' && row.estado !== 'completado' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => cancelarPedido(row.id)}
              title="Cancelar"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  const verDetalle = (pedido: Pedido) => {
    // Implementar modal de detalle
    console.log('Ver detalle:', pedido);
  };

  const editarPedido = (pedido: Pedido) => {
    // Implementar modal de edición
    console.log('Editar pedido:', pedido);
  };

  const cancelarPedido = async (id: string) => {
    if (window.confirm('¿Está seguro de cancelar este pedido?')) {
      try {
        await pedidosApi.cancelarPedido(id);
        cargarPedidos();
      } catch (error) {
        console.error('Error al cancelar pedido:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Toolbar superior */}
      <div className="flex items-center justify-end">
        <Button onClick={() => console.log('Nuevo pedido')}>
          <Plus size={20} className="mr-2" />
          Nuevo Pedido
        </Button>
      </div>

      {/* Filtros */}
      <Card className="mb-6 bg-white shadow-sm">
        <div className="space-y-4">
          {/* Barra de búsqueda */}
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="flex gap-4">
              {/* Input de búsqueda */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Buscar por número, cliente..."
                  value={buscar}
                  onChange={(e) => setBuscar(e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                />
              </div>
            </div>
          </div>

          {/* Panel de filtros avanzados */}
          <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Estado */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Estado
                </label>
                <select
                  value={filtros.estado || ''}
                  onChange={(e) => setFiltros({ ...filtros, estado: e.target.value as Pedido['estado'] })}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 pr-3 py-2.5"
                >
                  <option value="">Todos los estados</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="confirmado">Confirmado</option>
                  <option value="procesando">Procesando</option>
                  <option value="completado">Completado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>

              {/* Método de pago */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Método de Pago
                </label>
                <select
                  value={filtros.metodoPago || ''}
                  onChange={(e) => setFiltros({ ...filtros, metodoPago: e.target.value as Pedido['metodoPago'] })}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 pr-3 py-2.5"
                >
                  <option value="">Todos</option>
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="transferencia">Transferencia</option>
                  <option value="credito">Crédito</option>
                </select>
              </div>
            </div>
          </div>

          {/* Resumen de resultados */}
          <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
            <span>{pedidos.length} resultados encontrados</span>
          </div>
        </div>
      </Card>

      {/* Tabla de pedidos */}
      <Table
        data={pedidos}
        columns={columnas}
        loading={loading}
        emptyMessage="No hay pedidos disponibles"
      />
    </div>
  );
};

