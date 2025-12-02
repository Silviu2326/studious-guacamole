import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Select, Input } from '../../../components/componentsreutilizables';
import { facturasAPI } from '../api';
import { Download, Calendar, Search, Filter, X } from 'lucide-react';
import type { TableColumn } from '../../../components/componentsreutilizables';

interface HistorialPago {
  id: string;
  numeroFactura: string;
  fechaEmision: string;
  monto: number;
  estado: string;
  tipo: string;
}

export const HistorialPagos: React.FC = () => {
  const [pagos, setPagos] = useState<HistorialPago[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [busqueda, setBusqueda] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(false);

  useEffect(() => {
    cargarPagos();
  }, []);

  const cargarPagos = async () => {
    try {
      setCargando(true);
      const facturas = await facturasAPI.obtenerFacturas();
      
      const pagosFormateados: HistorialPago[] = facturas.map(f => ({
        id: f.id,
        numeroFactura: f.numeroFactura,
        fechaEmision: f.fechaEmision.toLocaleDateString('es-ES'),
        monto: f.monto,
        estado: f.estado,
        tipo: f.tipo
      }));
      
      setPagos(pagosFormateados);
    } catch (error) {
      console.error('Error al cargar pagos:', error);
    } finally {
      setCargando(false);
    }
  };

  const descargarFactura = async (id: string) => {
    try {
      const blob = await facturasAPI.descargarFactura(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `factura-${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al descargar factura:', error);
    }
  };

  const pagosFiltrados = pagos.filter(pago => {
    if (filtroEstado !== 'todos' && pago.estado !== filtroEstado) return false;
    if (filtroTipo !== 'todos' && pago.tipo !== filtroTipo) return false;
    if (busqueda && !pago.numeroFactura.toLowerCase().includes(busqueda.toLowerCase())) return false;
    if (fechaInicio && pago.fechaEmision < fechaInicio) return false;
    if (fechaFin && pago.fechaEmision > fechaFin) return false;
    return true;
  });

  const tieneFiltrosActivos = filtroEstado !== 'todos' || filtroTipo !== 'todos' || busqueda || fechaInicio || fechaFin;
  const cantidadFiltrosActivos = [
    filtroEstado !== 'todos',
    filtroTipo !== 'todos',
    !!busqueda,
    !!fechaInicio || !!fechaFin
  ].filter(Boolean).length;

  const limpiarFiltros = () => {
    setFiltroEstado('todos');
    setFiltroTipo('todos');
    setBusqueda('');
    setFechaInicio('');
    setFechaFin('');
  };

  const columnas: TableColumn<HistorialPago>[] = [
    {
      key: 'numeroFactura',
      label: 'Número de Factura',
      sortable: true
    },
    {
      key: 'fechaEmision',
      label: 'Fecha de Emisión',
      sortable: true
    },
    {
      key: 'monto',
      label: 'Monto',
      sortable: true,
      align: 'right',
      render: (value) => (
        <span className="font-semibold">
          {new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR'
          }).format(value)}
        </span>
      )
    },
    {
      key: 'tipo',
      label: 'Tipo',
      render: (value) => (
        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
          value === 'recurrente' ? 'bg-blue-100 text-blue-700' :
          value === 'servicios' ? 'bg-green-100 text-green-700' :
          'bg-purple-100 text-purple-700'
        }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (value) => (
        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
          value === 'pagada' ? 'bg-green-100 text-green-700' :
          value === 'pendiente' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    },
    {
      key: 'acciones',
      label: 'Acciones',
      align: 'center',
      render: (_, row) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => descargarFactura(row.id)}
        >
          <Download className="w-4 h-4 mr-1" />
          Descargar
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="mb-6 bg-white shadow-sm">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">
            Historial de Pagos
          </h2>

          {/* Barra de búsqueda */}
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                  placeholder="Buscar por número de factura..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
              <Button
                variant="secondary"
                onClick={() => setMostrarFiltrosAvanzados(!mostrarFiltrosAvanzados)}
                className="relative"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros
                {cantidadFiltrosActivos > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                    {cantidadFiltrosActivos}
                  </span>
                )}
              </Button>
              {tieneFiltrosActivos && (
                <Button
                  variant="ghost"
                  onClick={limpiarFiltros}
                  size="sm"
                >
                  <X className="w-4 h-4 mr-1" />
                  Limpiar
                </Button>
              )}
            </div>
          </div>

          {/* Panel de filtros avanzados */}
          {mostrarFiltrosAvanzados && (
            <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Filter size={16} className="inline mr-1" />
                    Estado
                  </label>
                  <Select
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                    options={[
                      { value: 'todos', label: 'Todos' },
                      { value: 'pagada', label: 'Pagada' },
                      { value: 'pendiente', label: 'Pendiente' },
                      { value: 'vencida', label: 'Vencida' }
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Filter size={16} className="inline mr-1" />
                    Tipo
                  </label>
                  <Select
                    value={filtroTipo}
                    onChange={(e) => setFiltroTipo(e.target.value)}
                    options={[
                      { value: 'todos', label: 'Todos' },
                      { value: 'recurrente', label: 'Recurrente' },
                      { value: 'servicios', label: 'Servicios' },
                      { value: 'adicionales', label: 'Adicionales' }
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Calendar size={16} className="inline mr-1" />
                    Rango de fechas
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
                      value={fechaInicio}
                      onChange={(e) => setFechaInicio(e.target.value)}
                      placeholder="Desde"
                    />
                    <input
                      type="date"
                      className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
                      value={fechaFin}
                      onChange={(e) => setFechaFin(e.target.value)}
                      placeholder="Hasta"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Resumen de resultados */}
          <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
            <span>{pagosFiltrados.length} resultados encontrados</span>
            {tieneFiltrosActivos && (
              <span>{cantidadFiltrosActivos} filtros aplicados</span>
            )}
          </div>
        </div>
      </Card>

      {/* Tabla */}
      <Card className="bg-white shadow-sm">
        <Table
          data={pagosFiltrados}
          columns={columnas}
          loading={cargando}
          emptyMessage="No se encontraron pagos"
        />
      </Card>
    </div>
  );
};

