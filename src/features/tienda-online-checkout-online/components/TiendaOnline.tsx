import React, { useState, useEffect } from 'react';
import { Card, Button, Select, Badge } from '../../../components/componentsreutilizables';
import { Producto, FiltrosProductos, CarritoItem } from '../types';
import { getProductos } from '../api/productos';
import { Search, ShoppingCart, Package, Zap, Download, Loader2, Filter, X } from 'lucide-react';

interface TiendaOnlineProps {
  rol: 'entrenador' | 'gimnasio';
  carrito: CarritoItem[];
  onAgregarCarrito: (producto: Producto, cantidad?: number) => void;
  onVerDetalle: (producto: Producto) => void;
}

export const TiendaOnline: React.FC<TiendaOnlineProps> = ({
  rol,
  carrito,
  onAgregarCarrito,
  onVerDetalle,
}) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(false);
  const [filtros, setFiltros] = useState<FiltrosProductos>({});
  const [busqueda, setBusqueda] = useState('');
  const [filtrosAvanzados, setFiltrosAvanzados] = useState(false);

  useEffect(() => {
    cargarProductos();
  }, [rol, filtros]);

  const cargarProductos = async () => {
    setCargando(true);
    try {
      const data = await getProductos(rol, filtros);
      setProductos(data);
    } catch (error) {
      console.error('Error cargando productos:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleBuscar = () => {
    setFiltros({ ...filtros, busqueda });
  };

  const handleLimpiarFiltros = () => {
    setFiltros({});
    setBusqueda('');
  };

  const filtrosActivos = Object.keys(filtros).filter(
    (key) => filtros[key as keyof FiltrosProductos] !== undefined && filtros[key as keyof FiltrosProductos] !== ''
  ).length + (busqueda ? 1 : 0);

  const categorias = Array.from(
    new Set(productos.map((p) => p.categoria))
  );

  const tipos = [
    { value: 'servicio', label: 'Servicios' },
    { value: 'producto-fisico', label: 'Productos Físicos' },
    { value: 'producto-digital', label: 'Productos Digitales' },
  ];

  const getTipoIcono = (tipo: string) => {
    switch (tipo) {
      case 'servicio':
        return <Zap className="w-4 h-4" />;
      case 'producto-digital':
        return <Download className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case 'servicio':
        return 'info';
      case 'producto-digital':
        return 'success';
      default:
        return 'primary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Sistema de Filtros */}
      <Card className="mb-6 bg-white shadow-sm">
        <div className="space-y-4">
          {/* Barra de búsqueda */}
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                />
              </div>
              <Button
                variant="secondary"
                onClick={() => setFiltrosAvanzados(!filtrosAvanzados)}
              >
                <Filter size={18} className="mr-2" />
                Filtros
                {filtrosActivos > 0 && (
                  <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">
                    {filtrosActivos}
                  </span>
                )}
              </Button>
              {filtrosActivos > 0 && (
                <Button variant="ghost" onClick={handleLimpiarFiltros}>
                  <X size={18} className="mr-2" />
                  Limpiar
                </Button>
              )}
            </div>
          </div>

          {/* Panel de filtros avanzados */}
          {filtrosAvanzados && (
            <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Package size={16} className="inline mr-1" />
                    Categoría
                  </label>
                  <Select
                    placeholder="Todas las categorías"
                    options={[
                      { value: '', label: 'Todas las categorías' },
                      ...categorias.map((cat) => ({ value: cat, label: cat })),
                    ]}
                    value={filtros.categoria || ''}
                    onChange={(e) =>
                      setFiltros({
                        ...filtros,
                        categoria: e.target.value || undefined,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Zap size={16} className="inline mr-1" />
                    Tipo
                  </label>
                  <Select
                    placeholder="Todos los tipos"
                    options={[
                      { value: '', label: 'Todos los tipos' },
                      ...tipos,
                    ]}
                    value={filtros.tipo || ''}
                    onChange={(e) =>
                      setFiltros({
                        ...filtros,
                        tipo: e.target.value || undefined,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* Resumen de resultados */}
          {productos.length > 0 && (
            <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
              <span>{productos.length} {productos.length === 1 ? 'producto encontrado' : 'productos encontrados'}</span>
              {filtrosActivos > 0 && (
                <span>{filtrosActivos} {filtrosActivos === 1 ? 'filtro aplicado' : 'filtros aplicados'}</span>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Grid de productos */}
      {cargando ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando...</p>
        </Card>
      ) : productos.length === 0 ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron productos</h3>
          <p className="text-gray-600 mb-4">
            {filtrosActivos > 0
              ? 'Intenta ajustar los filtros para ver más resultados'
              : 'Aún no hay productos disponibles en la tienda'}
          </p>
          {filtrosActivos > 0 && (
            <Button variant="secondary" onClick={handleLimpiarFiltros}>
              Limpiar filtros
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productos.map((producto) => {
            const enCarrito = carrito.find((item) => item.producto.id === producto.id);
            const cantidadEnCarrito = enCarrito?.cantidad || 0;

            return (
              <Card
                key={producto.id}
                variant="hover"
                className="h-full flex flex-col transition-shadow overflow-hidden bg-white shadow-sm"
              >
                {/* Imagen */}
                {producto.imagen ? (
                  <div className="w-full h-48 bg-gray-100 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                    <Package className="w-16 h-16 text-gray-400" />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mb-4 flex items-center justify-center">
                    <Package className="w-16 h-16 text-white opacity-80" />
                  </div>
                )}

                <div className="p-4 flex-1 space-y-3 flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-semibold text-gray-900 flex-1">
                      {producto.nombre}
                    </h3>
                    <Badge variant={getTipoBadge(producto.tipo) as any}>
                      {getTipoIcono(producto.tipo)}
                      <span className="ml-1 capitalize text-xs">
                        {producto.tipo.replace('-', ' ')}
                      </span>
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2">
                    {producto.descripcion}
                  </p>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xl font-bold text-blue-600">
                      €{producto.precio.toFixed(2)}
                    </span>
                    {producto.stock !== undefined && (
                      <span className="text-xs text-gray-500">
                        Stock: {producto.stock}
                      </span>
                    )}
                  </div>

                  {cantidadEnCarrito > 0 && (
                    <Badge variant="success" className="text-xs">
                      {cantidadEnCarrito} en carrito
                    </Badge>
                  )}

                  {/* Botones de acción */}
                  <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
                    <Button
                      variant="secondary"
                      size="sm"
                      fullWidth
                      onClick={() => onVerDetalle(producto)}
                    >
                      Ver Detalles
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      fullWidth
                      onClick={() => onAgregarCarrito(producto)}
                      disabled={!producto.disponible}
                    >
                      <ShoppingCart size={16} className="mr-1" />
                      Agregar
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

