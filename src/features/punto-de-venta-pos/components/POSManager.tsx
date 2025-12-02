import React, { useState } from 'react';
import { Card, Button, MetricCards, Modal } from '../../../components/componentsreutilizables';
import { Venta, Arqueo, Ticket, FiltroVentas } from '../types';
import {
  Plus,
  Search,
  Filter,
  Download,
  FileText,
  Calendar,
  TrendingUp,
  DollarSign,
  CreditCard,
  Receipt,
  X,
  Loader2,
  AlertCircle,
  Package,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

/**
 * Componente POSManager
 * Gestor de ventas, tickets y arqueos del punto de venta
 */
export const POSManager: React.FC = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [filtros, setFiltros] = useState<FiltroVentas>({});
  const [ventaSeleccionada, setVentaSeleccionada] = useState<Venta | null>(null);
  const [mostrarDetalleVenta, setMostrarDetalleVenta] = useState(false);

  // Calcular métricas
  const calcularMetricas = () => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const ventasHoy = ventas.filter(v => {
      const fechaVenta = new Date(v.fecha);
      fechaVenta.setHours(0, 0, 0, 0);
      return fechaVenta.getTime() === hoy.getTime() && v.estado === 'completada';
    });

    const totalVentas = ventasHoy.length;
    const totalEfectivo = ventasHoy
      .filter(v => v.metodoPago === 'efectivo')
      .reduce((sum, v) => sum + v.total, 0);
    const totalTarjeta = ventasHoy
      .filter(v => v.metodoPago === 'tarjeta')
      .reduce((sum, v) => sum + v.total, 0);
    const totalIngresos = ventasHoy.reduce((sum, v) => sum + v.total, 0);

    return [
      {
        id: 'ventas',
        title: 'Ventas Hoy',
        value: totalVentas,
        color: 'info' as const,
        icon: <TrendingUp size={20} />
      },
      {
        id: 'efectivo',
        title: 'Efectivo',
        value: `€${totalEfectivo.toFixed(2)}`,
        color: 'success' as const,
        icon: <DollarSign size={20} />
      },
      {
        id: 'tarjeta',
        title: 'Tarjeta',
        value: `€${totalTarjeta.toFixed(2)}`,
        color: 'info' as const,
        icon: <CreditCard size={20} />
      },
      {
        id: 'total',
        title: 'Total Ingresos',
        value: `€${totalIngresos.toFixed(2)}`,
        color: 'primary' as const,
        icon: <DollarSign size={20} />
      }
    ];
  };

  const metricas = calcularMetricas();

  // Filtrar ventas
  const ventasFiltradas = ventas.filter(venta => {
    if (busqueda && !venta.numeroTicket.toLowerCase().includes(busqueda.toLowerCase())) {
      return false;
    }
    if (filtros.estado && venta.estado !== filtros.estado) {
      return false;
    }
    if (filtros.metodoPago && venta.metodoPago !== filtros.metodoPago) {
      return false;
    }
    return true;
  });

  const filtrosActivos = Object.values(filtros).filter(f => f !== undefined && f !== '').length;

  // Limpiar filtros
  const handleLimpiarFiltros = () => {
    setFiltros({});
    setBusqueda('');
  };

  // Ver detalle de venta
  const handleVerDetalle = (venta: Venta) => {
    setVentaSeleccionada(venta);
    setMostrarDetalleVenta(true);
  };

  return (
    <div className="space-y-6">
      {/* Métricas */}
      <MetricCards data={metricas} columns={4} />

      {/* Sistema de Filtros */}
      <Card className="mb-6 bg-white shadow-sm">
        <div className="space-y-4">
          {/* Barra de búsqueda */}
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Buscar por número de ticket..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                />
              </div>
              <Button
                variant={mostrarFiltros ? 'secondary' : 'ghost'}
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
              >
                <Filter size={18} className="mr-2" />
                Filtros
                {filtrosActivos > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white rounded-full text-xs font-semibold">
                    {filtrosActivos}
                  </span>
                )}
                {mostrarFiltros ? (
                  <ChevronUp size={18} className="ml-2" />
                ) : (
                  <ChevronDown size={18} className="ml-2" />
                )}
              </Button>
              {filtrosActivos > 0 && (
                <Button
                  variant="ghost"
                  onClick={handleLimpiarFiltros}
                >
                  <X size={18} className="mr-2" />
                  Limpiar
                </Button>
              )}
            </div>
          </div>

          {/* Panel de Filtros Avanzados */}
          {mostrarFiltros && (
            <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Calendar size={16} className="inline mr-1" />
                    Estado
                  </label>
                  <select
                    value={filtros.estado || ''}
                    onChange={(e) => setFiltros({ ...filtros, estado: e.target.value as FiltroVentas['estado'] })}
                    className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
                  >
                    <option value="">Todos</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="completada">Completada</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <CreditCard size={16} className="inline mr-1" />
                    Método de Pago
                  </label>
                  <select
                    value={filtros.metodoPago || ''}
                    onChange={(e) => setFiltros({ ...filtros, metodoPago: e.target.value as FiltroVentas['metodoPago'] })}
                    className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
                  >
                    <option value="">Todos</option>
                    <option value="efectivo">Efectivo</option>
                    <option value="tarjeta">Tarjeta</option>
                    <option value="mixto">Mixto</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Resumen de resultados */}
          <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
            <span>{ventasFiltradas.length} venta(s) encontrada(s)</span>
            {filtrosActivos > 0 && (
              <span>{filtrosActivos} filtro(s) aplicado(s)</span>
            )}
          </div>
        </div>
      </Card>

      {/* Lista de Ventas */}
      {loading ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando ventas...</p>
        </Card>
      ) : error ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar ventas</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => setError(null)}>Reintentar</Button>
        </Card>
      ) : ventasFiltradas.length === 0 ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Receipt size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay ventas</h3>
          <p className="text-gray-600">No se encontraron ventas con los filtros aplicados</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {ventasFiltradas.map((venta) => (
            <Card
              key={venta.id}
              variant="hover"
              className="transition-shadow"
            >
              <div className="flex items-center justify-between p-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Receipt size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Ticket #{venta.numeroTicket}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(venta.fecha).toLocaleString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pl-12">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Items:</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {venta.items.length}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Método:</span>
                      <span className="text-sm font-semibold text-gray-900 capitalize">
                        {venta.metodoPago}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        venta.estado === 'completada' ? 'bg-green-100 text-green-700' :
                        venta.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {venta.estado}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">
                      €{venta.total.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {venta.items.reduce((sum, item) => sum + item.cantidad, 0)} productos
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleVerDetalle(venta)}
                    >
                      <FileText size={16} className="mr-1" />
                      Ver
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                    >
                      <Download size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal Detalle de Venta */}
      <Modal
        isOpen={mostrarDetalleVenta}
        onClose={() => setMostrarDetalleVenta(false)}
        title={`Detalle de Venta - Ticket #${ventaSeleccionada?.numeroTicket}`}
        size="lg"
      >
        {ventaSeleccionada && (
          <div className="space-y-6">
            {/* Información general */}
            <div className="bg-slate-50 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Fecha:</span>
                <span className="font-semibold text-gray-900">
                  {new Date(ventaSeleccionada.fecha).toLocaleString('es-ES')}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Estado:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  ventaSeleccionada.estado === 'completada' ? 'bg-green-100 text-green-700' :
                  ventaSeleccionada.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {ventaSeleccionada.estado}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Método de pago:</span>
                <span className="font-semibold text-gray-900 capitalize">
                  {ventaSeleccionada.metodoPago}
                </span>
              </div>
            </div>

            {/* Items de la venta */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-900">Productos:</h4>
              <div className="space-y-2">
                {ventaSeleccionada.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {item.producto.nombre}
                      </p>
                      <p className="text-xs text-gray-600">
                        {item.cantidad} x €{item.producto.precio.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        €{item.subtotal.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resumen de totales */}
            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold text-gray-900">
                  €{ventaSeleccionada.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">IVA (21%):</span>
                <span className="font-semibold text-gray-900">
                  €{ventaSeleccionada.impuestos.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                <span className="text-gray-900">Total:</span>
                <span className="text-blue-600">
                  €{ventaSeleccionada.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

