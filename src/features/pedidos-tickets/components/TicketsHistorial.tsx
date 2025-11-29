import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Badge } from '../../../components/componentsreutilizables';
import { ticketsApi } from '../api/tickets';
import { Ticket, FiltroTickets } from '../types';
import { Search, Download, Printer } from 'lucide-react';

export const TicketsHistorial: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtros, setFiltros] = useState<FiltroTickets>({});
  const [buscar, setBuscar] = useState('');

  useEffect(() => {
    cargarTickets();
  }, [filtros]);

  const cargarTickets = async () => {
    setLoading(true);
    try {
      const datos = await ticketsApi.obtenerTickets({ ...filtros, buscar });
      setTickets(datos);
    } catch (error) {
      console.error('Error al cargar tickets:', error);
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

  const getTipoBadge = (tipo: Ticket['tipo']) => {
    const tipos = {
      venta: { label: 'Venta', variant: 'green' as const },
      devolucion: { label: 'Devolución', variant: 'yellow' as const },
      cancelacion: { label: 'Cancelación', variant: 'red' as const },
      arqueo: { label: 'Arqueo', variant: 'blue' as const },
      inventario: { label: 'Inventario', variant: 'blue' as const },
    };
    return tipos[tipo] || tipos.venta;
  };

  const imprimirTicket = async (id: string) => {
    try {
      await ticketsApi.imprimirTicket(id);
      cargarTickets();
    } catch (error) {
      console.error('Error al imprimir ticket:', error);
    }
  };

  const exportarTickets = async () => {
    try {
      const blob = await ticketsApi.exportarTickets(filtros);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tickets-${new Date().toISOString()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error al exportar tickets:', error);
    }
  };

  const columnas = [
    {
      key: 'numeroTicket',
      label: 'Número de Ticket',
      sortable: true,
      render: (value: string, row: Ticket) => (
        <div className="font-semibold text-purple-600 dark:text-purple-400">{value}</div>
      ),
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (value: Ticket['tipo']) => {
        const tipoInfo = getTipoBadge(value);
        return <Badge variant={tipoInfo.variant}>{tipoInfo.label}</Badge>;
      },
    },
    {
      key: 'fecha',
      label: 'Fecha',
      sortable: true,
      render: (value: Date | string) => formatearFecha(value),
    },
    {
      key: 'montoTotal',
      label: 'Monto Total',
      align: 'right' as const,
      sortable: true,
      render: (value: number) => (
        <span className="font-semibold">{formatearMoneda(value)}</span>
      ),
    },
    {
      key: 'metodoPago',
      label: 'Método de Pago',
    },
    {
      key: 'impreso',
      label: 'Estado',
      render: (value: boolean, row: Ticket) => (
        <Badge variant={value ? 'green' : 'yellow'}>
          {value ? 'Impreso' : 'Pendiente'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (_: any, row: Ticket) => (
        <div className="flex items-center gap-2">
          {!row.impreso && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => imprimirTicket(row.id)}
              title="Imprimir ticket"
            >
              <Printer className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => verDetalle(row)}
            title="Ver detalle"
          >
            <Receipt className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  const verDetalle = (ticket: Ticket) => {
    // Implementar modal de detalle
    console.log('Ver detalle ticket:', ticket);
  };

  return (
    <div className="space-y-6">
      {/* Toolbar superior */}
      <div className="flex items-center justify-end">
        <Button onClick={exportarTickets}>
          <Download size={20} className="mr-2" />
          Exportar
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
                  placeholder="Buscar por número de ticket..."
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
              {/* Tipo de ticket */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tipo de Ticket
                </label>
                <select
                  value={filtros.tipo || ''}
                  onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value as Ticket['tipo'] })}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 pr-3 py-2.5"
                >
                  <option value="">Todos los tipos</option>
                  <option value="venta">Venta</option>
                  <option value="devolucion">Devolución</option>
                  <option value="cancelacion">Cancelación</option>
                  <option value="arqueo">Arqueo</option>
                  <option value="inventario">Inventario</option>
                </select>
              </div>

              {/* Estado */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Estado
                </label>
                <select
                  value={filtros.impreso !== undefined ? filtros.impreso.toString() : ''}
                  onChange={(e) => setFiltros({ ...filtros, impreso: e.target.value === 'true' ? true : e.target.value === 'false' ? false : undefined })}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 pr-3 py-2.5"
                >
                  <option value="">Todos</option>
                  <option value="true">Impreso</option>
                  <option value="false">Pendiente</option>
                </select>
              </div>
            </div>
          </div>

          {/* Resumen de resultados */}
          <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
            <span>{tickets.length} resultados encontrados</span>
          </div>
        </div>
      </Card>

      {/* Tabla de tickets */}
      <Table
        data={tickets}
        columns={columnas}
        loading={loading}
        emptyMessage="No hay tickets disponibles"
      />
    </div>
  );
};

