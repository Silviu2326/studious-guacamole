import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, MetricCards, Select } from '../../../components/componentsreutilizables';
import { Pedido, EstadoPedido, Producto } from '../types';
import { getHistorialVentas, getMetricasVentas } from '../api/ventas';
import { getProductos } from '../api/productos';
import { Receipt, Eye, Download, Calendar, Filter, X, TrendingUp, Loader2, FileDown, Package, AlertCircle } from 'lucide-react';

interface GestorVentasProps {
  rol?: 'entrenador' | 'gimnasio';
  onVerDetalle?: (pedido: Pedido) => void;
}

export const GestorVentas: React.FC<GestorVentasProps> = ({ rol, onVerDetalle }) => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [metricas, setMetricas] = useState<{
    totalVentas: number;
    totalIngresos: number;
    ticketMedio: number;
    productosMasVendidos: Array<{ productoId: string; unidades: number }>;
  } | null>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productosMasVendidos, setProductosMasVendidos] = useState<Array<{
    productoId: string;
    nombre: string;
    unidades: number;
    ingresosAproximados: number;
  }>>([]);
  
  const [cargando, setCargando] = useState(false);
  const [cargandoMetricas, setCargandoMetricas] = useState(false);
  
  // Filtros
  const [fechaDesde, setFechaDesde] = useState<string>(() => {
    const fecha = new Date();
    fecha.setMonth(fecha.getMonth() - 1);
    return fecha.toISOString().split('T')[0];
  });
  const [fechaHasta, setFechaHasta] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [productoFiltro, setProductoFiltro] = useState<string>('');

  useEffect(() => {
    cargarProductos();
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [fechaDesde, fechaHasta, productoFiltro]);

  const cargarProductos = async () => {
    try {
      const data = await getProductos({ soloActivos: true });
      setProductos(data);
    } catch (error) {
      console.error('Error cargando productos:', error);
    }
  };

  const cargarDatos = async () => {
    setCargando(true);
    setCargandoMetricas(true);
    
    try {
      // Asegurar que los productos estén cargados
      let productosDisponibles = productos;
      if (productosDisponibles.length === 0) {
        productosDisponibles = await getProductos({ soloActivos: true });
        setProductos(productosDisponibles);
      }
      
      // Cargar historial de ventas
      const filtros = {
        desde: fechaDesde,
        hasta: fechaHasta,
        productoId: productoFiltro || undefined,
      };
      
      const [historialData, metricasData] = await Promise.all([
        getHistorialVentas(filtros),
        getMetricasVentas({
          desde: fechaDesde,
          hasta: fechaHasta,
        }),
      ]);
      
      setPedidos(historialData);
      setMetricas(metricasData);
      
      // Procesar productos más vendidos con nombres e ingresos aproximados
      // Calcular ingresos aproximados basándose en los pedidos reales
      const productosConInfo = metricasData.productosMasVendidos.map((item) => {
        const producto = productosDisponibles.find((p) => p.id === item.productoId);
        const nombre = producto?.nombre || `Producto ${item.productoId}`;
        
        // Calcular ingresos aproximados basándose en los pedidos del período
        // Buscar en los pedidos pagados para obtener el precio real
        let ingresosAproximados = 0;
        historialData
          .filter((p) => p.estado === 'pagado')
          .forEach((pedido) => {
            pedido.items.forEach((itemPedido) => {
              if (itemPedido.productoId === item.productoId) {
                ingresosAproximados += itemPedido.importeSubtotal;
              }
            });
          });
        
        // Si no encontramos ingresos en pedidos, usar precio base del producto o estimación
        if (ingresosAproximados === 0) {
          const precioEstimado = producto?.precioBase || 50;
          ingresosAproximados = item.unidades * precioEstimado;
        }
        
        return {
          productoId: item.productoId,
          nombre,
          unidades: item.unidades,
          ingresosAproximados,
        };
      });
      
      setProductosMasVendidos(productosConInfo);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setCargando(false);
      setCargandoMetricas(false);
    }
  };

  const getEstadoBadge = (estado: EstadoPedido) => {
    switch (estado) {
      case 'pagado':
        return 'success';
      case 'pendiente_pago':
        return 'warning';
      case 'cancelado':
      case 'reembolsado':
        return 'error';
      case 'fallido':
        return 'error';
      default:
        return 'info';
    }
  };

  const getEstadoLabel = (estado: EstadoPedido) => {
    const labels: Record<EstadoPedido, string> = {
      borrador: 'Borrador',
      pendiente_pago: 'Pendiente de Pago',
      pagado: 'Pagado',
      cancelado: 'Cancelado',
      fallido: 'Fallido',
      reembolsado: 'Reembolsado',
    };
    return labels[estado] || estado;
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

  const formatoFechaCorta = (fecha: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(fecha));
  };

  const handleExportarCSV = () => {
    // Placeholder para futura implementación
    console.log('Exportar CSV - Funcionalidad pendiente de implementar');
    // TODO: Implementar exportación a CSV
  };

  const handleLimpiarFiltros = () => {
    const fecha = new Date();
    const fechaHaceUnMes = new Date();
    fechaHaceUnMes.setMonth(fechaHaceUnMes.getMonth() - 1);
    
    setFechaDesde(fechaHaceUnMes.toISOString().split('T')[0]);
    setFechaHasta(fecha.toISOString().split('T')[0]);
    setProductoFiltro('');
  };

  const columnasHistorial = [
    {
      key: 'numeroPedido',
      label: 'Nº Pedido',
      render: (value: string) => (
        <span className="font-mono text-sm font-semibold text-gray-900">{value}</span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Fecha',
      render: (value: Date) => (
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-400" />
          <span className="text-sm text-gray-900">{formatoFecha(value)}</span>
        </div>
      ),
    },
    {
      key: 'emailCliente',
      label: 'Cliente',
      render: (value: string, pedido: Pedido) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{value}</p>
          {pedido.clienteIdOpcional && (
            <p className="text-xs text-gray-500">ID: {pedido.clienteIdOpcional}</p>
          )}
        </div>
      ),
    },
    {
      key: 'importeTotal',
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
      render: (value: EstadoPedido) => (
        <Badge variant={getEstadoBadge(value) as any}>
          {getEstadoLabel(value)}
        </Badge>
      ),
    },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (_: any, pedido: Pedido) => (
        <div className="flex gap-2">
          {onVerDetalle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onVerDetalle(pedido)}
              title="Ver detalle"
            >
              <Eye size={16} />
            </Button>
          )}
        </div>
      ),
      align: 'right' as const,
    },
  ];

  const columnasProductosTop = [
    {
      key: 'nombre',
      label: 'Producto',
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Package size={16} className="text-gray-400" />
          <span className="text-sm font-medium text-gray-900">{value}</span>
        </div>
      ),
    },
    {
      key: 'unidades',
      label: 'Unidades Vendidas',
      render: (value: number) => (
        <span className="text-sm text-gray-900 font-semibold">{value}</span>
      ),
      align: 'right' as const,
    },
    {
      key: 'ingresosAproximados',
      label: 'Ingresos Aproximados',
      render: (value: number) => (
        <span className="text-sm font-semibold text-green-600">
          €{value.toFixed(2)}
        </span>
      ),
      align: 'right' as const,
    },
  ];

  const metricasCards = metricas ? [
    {
      id: 'totalVentas',
      title: 'Total Ventas',
      value: metricas.totalVentas,
      color: 'info' as const,
      icon: <Receipt size={20} />,
    },
    {
      id: 'totalIngresos',
      title: 'Total Ingresos',
      value: `€${metricas.totalIngresos.toFixed(2)}`,
      color: 'primary' as const,
      icon: <TrendingUp size={20} />,
    },
    {
      id: 'ticketMedio',
      title: 'Ticket Medio',
      value: `€${metricas.ticketMedio.toFixed(2)}`,
      color: 'success' as const,
      icon: <Receipt size={20} />,
    },
  ] : [];

  const filtrosActivos = (fechaDesde && fechaHasta) || productoFiltro ? 1 : 0;

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card className="bg-white shadow-sm">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
            </div>
            {filtrosActivos > 0 && (
              <Button variant="ghost" size="sm" onClick={handleLimpiarFiltros}>
                <X size={16} className="mr-1" />
                Limpiar filtros
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Desde
              </label>
              <input
                type="date"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
                className="w-full rounded-lg bg-white text-gray-900 ring-1 ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha Hasta
              </label>
              <input
                type="date"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
                className="w-full rounded-lg bg-white text-gray-900 ring-1 ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Producto (Opcional)
              </label>
              <Select
                placeholder="Todos los productos"
                options={[
                  { value: '', label: 'Todos los productos' },
                  ...productos.map((p) => ({ value: p.id, label: p.nombre })),
                ]}
                value={productoFiltro}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setProductoFiltro(e.target.value)
                }
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Métricas KPIs */}
      {cargandoMetricas ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Loader2 size={32} className="mx-auto text-blue-500 animate-spin mb-2" />
          <p className="text-gray-600 text-sm">Cargando métricas...</p>
        </Card>
      ) : metricas ? (
        <MetricCards data={metricasCards} columns={3} />
      ) : null}

      {/* Tabla de Historial de Ventas */}
      <Card className="p-0 bg-white shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
                <Receipt size={20} className="text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Historial de Ventas
              </h2>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleExportarCSV}
              title="Exportar a CSV (Próximamente)"
            >
              <FileDown size={16} className="mr-2" />
              Exportar CSV
            </Button>
          </div>
        </div>
        {cargando ? (
          <div className="p-12 text-center">
            <Loader2 size={32} className="mx-auto text-blue-500 animate-spin mb-2" />
            <p className="text-gray-600 text-sm">Cargando historial...</p>
          </div>
        ) : pedidos.length === 0 ? (
          <div className="p-12 text-center">
            <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay ventas en el período seleccionado
            </h3>
            <p className="text-gray-600 text-sm">
              No se encontraron pedidos para el rango de fechas y filtros aplicados.
            </p>
          </div>
        ) : (
          <Table
            data={pedidos}
            columns={columnasHistorial}
            loading={false}
            emptyMessage="No hay ventas registradas"
          />
        )}
      </Card>

      {/* Tabla de Productos Más Vendidos */}
      <Card className="p-0 bg-white shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-100 rounded-xl ring-1 ring-green-200/70">
              <TrendingUp size={20} className="text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Productos Más Vendidos
            </h2>
          </div>
        </div>
        {cargandoMetricas ? (
          <div className="p-12 text-center">
            <Loader2 size={32} className="mx-auto text-blue-500 animate-spin mb-2" />
            <p className="text-gray-600 text-sm">Cargando productos...</p>
          </div>
        ) : productosMasVendidos.length === 0 ? (
          <div className="p-12 text-center">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay productos vendidos
            </h3>
            <p className="text-gray-600 text-sm">
              No se encontraron productos vendidos en el período seleccionado.
            </p>
          </div>
        ) : (
          <Table
            data={productosMasVendidos}
            columns={columnasProductosTop}
            loading={false}
            emptyMessage="No hay productos vendidos"
          />
        )}
      </Card>
    </div>
  );
};

