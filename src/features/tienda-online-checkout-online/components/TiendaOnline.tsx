import React, { useState, useEffect } from 'react';
import { Card, Button, Select, Badge } from '../../../components/componentsreutilizables';
import { Producto, ItemCarrito, CategoriaProducto } from '../types';
import { getProductos, getCategorias } from '../api/productos';
import { Search, ShoppingCart, Package, Zap, Loader2, Filter, X, Sparkles, Star, AlertCircle, Grid, List, Repeat } from 'lucide-react';

interface TiendaOnlineProps {
  onAddToCart?: (item: ItemCarrito) => void;
  onVerDetalle?: (producto: Producto) => void;
}

interface FiltrosProductos {
  categoriaId?: string;
  tipo?: 'servicio' | 'producto' | 'bono' | 'suscripcion';
  soloDestacados?: boolean;
  soloActivos?: boolean;
  precioMin?: number;
  precioMax?: number;
  texto?: string;
}

export const TiendaOnline: React.FC<TiendaOnlineProps> = ({
  onAddToCart,
  onVerDetalle,
}: TiendaOnlineProps) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<CategoriaProducto[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState<FiltrosProductos>({
    soloActivos: true,
  });
  const [busqueda, setBusqueda] = useState('');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [vistaGrid, setVistaGrid] = useState(true);

  useEffect(() => {
    cargarCategorias();
  }, []);

  useEffect(() => {
    cargarProductos();
  }, [filtros]);

  const cargarCategorias = async () => {
    try {
      const data = await getCategorias();
      setCategorias(data);
    } catch (error) {
      console.error('Error cargando categorías:', error);
    }
  };

  const cargarProductos = async () => {
    setCargando(true);
    setError(null);
    try {
      const filtrosAPI: Parameters<typeof getProductos>[0] = {
        soloActivos: true,
        categoriaId: filtros.categoriaId,
        texto: filtros.texto || busqueda || undefined,
        soloDestacados: filtros.soloDestacados,
      };

      const data = await getProductos(filtrosAPI);
      
      // Aplicar filtros adicionales en el cliente (tipo, precio)
      let productosFiltrados = data;

      if (filtros.tipo) {
        productosFiltrados = productosFiltrados.filter((p) => p.tipo === filtros.tipo);
      }

      if (filtros.precioMin !== undefined) {
        productosFiltrados = productosFiltrados.filter((p) => p.precioBase >= filtros.precioMin!);
      }

      if (filtros.precioMax !== undefined) {
        productosFiltrados = productosFiltrados.filter((p) => p.precioBase <= filtros.precioMax!);
      }

      setProductos(productosFiltrados);
    } catch (error) {
      console.error('Error cargando productos:', error);
      setError('Error al cargar los productos. Por favor, intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  const handleBuscar = () => {
    setFiltros({ ...filtros, texto: busqueda });
  };

  const handleLimpiarFiltros = () => {
    setFiltros({ soloActivos: true });
    setBusqueda('');
  };

  const handleCategoriaClick = (categoriaId: string) => {
    if (filtros.categoriaId === categoriaId) {
      setFiltros({ ...filtros, categoriaId: undefined });
    } else {
      setFiltros({ ...filtros, categoriaId });
    }
  };

  const handleAddToCart = (producto: Producto) => {
    if (!onAddToCart) return;

    const itemCarrito: ItemCarrito = {
      id: `item-${producto.id}-${Date.now()}`,
      productoId: producto.id,
      nombreProducto: producto.nombre,
      cantidad: 1,
      precioUnitario: producto.precioBase,
      importeSubtotal: producto.precioBase,
    };

    onAddToCart(itemCarrito);
  };

  const filtrosActivos = Object.keys(filtros).filter(
    (key) => {
      const value = filtros[key as keyof FiltrosProductos];
      return value !== undefined && value !== '' && key !== 'soloActivos';
    }
  ).length + (busqueda ? 1 : 0);

  const tipos = [
    { value: 'servicio', label: 'Servicios' },
    { value: 'producto', label: 'Productos' },
    { value: 'bono', label: 'Bonos' },
    { value: 'suscripcion', label: 'Suscripciones' },
  ];

  const getTipoIcono = (tipo: string) => {
    switch (tipo) {
      case 'servicio':
        return <Zap className="w-4 h-4" />;
      case 'suscripcion':
        return <Repeat className="w-4 h-4" />;
      case 'bono':
        return <Sparkles className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case 'servicio':
        return 'info';
      case 'suscripcion':
        return 'success';
      case 'bono':
        return 'warning';
      default:
        return 'primary';
    }
  };

  const getProductoTags = (producto: Producto) => {
    const tags = [];
    if (producto.esDestacadoOpcional) {
      tags.push({ label: 'Destacado', icon: Star, variant: 'warning' as const });
    }
    // Puedes agregar más lógica para "Nuevo" basado en fecha de creación
    // o "Popular" basado en ventas/valoraciones
    return tags;
  };

  return (
    <div className="space-y-6">
      {/* Barra de búsqueda y controles */}
      <Card className="bg-white shadow-sm">
        <div className="p-4 space-y-4">
          {/* Barra de búsqueda */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar productos, categorías, tags..."
                value={busqueda}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBusqueda(e.target.value)}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleBuscar()}
                className="w-full rounded-lg bg-slate-50 text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10 pr-4 py-2.5"
              />
            </div>
            <Button
              variant="primary"
              onClick={handleBuscar}
            >
              Buscar
            </Button>
            <Button
              variant="secondary"
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
            >
              <Filter size={18} className="mr-2" />
              Filtros
              {filtrosActivos > 0 && (
                <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-2 py-0.5">
                  {filtrosActivos}
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={() => setVistaGrid(!vistaGrid)}
              title={vistaGrid ? 'Vista lista' : 'Vista grid'}
            >
              {vistaGrid ? <List size={18} /> : <Grid size={18} />}
            </Button>
          </div>

          {/* Panel de filtros */}
          {mostrarFiltros && (
            <div className="rounded-lg bg-slate-50 ring-1 ring-slate-200 p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Categoría
                  </label>
                  <Select
                    placeholder="Todas las categorías"
                    options={[
                      { value: '', label: 'Todas las categorías' },
                      ...categorias.map((cat: CategoriaProducto) => ({ value: cat.id, label: cat.nombre })),
                    ]}
                    value={filtros.categoriaId || ''}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setFiltros({
                        ...filtros,
                        categoriaId: e.target.value || undefined,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tipo
                  </label>
                  <Select
                    placeholder="Todos los tipos"
                    options={[
                      { value: '', label: 'Todos los tipos' },
                      ...tipos,
                    ]}
                    value={filtros.tipo || ''}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setFiltros({
                        ...filtros,
                        tipo: e.target.value as any || undefined,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Precio mínimo (€)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={filtros.precioMin || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFiltros({
                        ...filtros,
                        precioMin: e.target.value ? parseFloat(e.target.value) : undefined,
                      })
                    }
                    className="w-full rounded-lg bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Precio máximo (€)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="999.99"
                    value={filtros.precioMax || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFiltros({
                        ...filtros,
                        precioMax: e.target.value ? parseFloat(e.target.value) : undefined,
                      })
                    }
                    className="w-full rounded-lg bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filtros.soloDestacados || false}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFiltros({
                        ...filtros,
                        soloDestacados: e.target.checked || undefined,
                      })
                    }
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">Solo destacados</span>
                </label>

                {filtrosActivos > 0 && (
                  <Button variant="ghost" size="sm" onClick={handleLimpiarFiltros}>
                    <X size={16} className="mr-1" />
                    Limpiar filtros
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Listado de categorías */}
      {categorias.length > 0 && (
        <Card className="bg-white shadow-sm">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Categorías
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFiltros({ ...filtros, categoriaId: undefined })}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  !filtros.categoriaId
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Todas
              </button>
              {categorias.map((categoria) => (
                <button
                  key={categoria.id}
                  onClick={() => handleCategoriaClick(categoria.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    filtros.categoriaId === categoria.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {categoria.nombre}
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Resumen de resultados */}
      {!cargando && productos.length > 0 && (
        <div className="flex justify-between items-center text-sm text-slate-600">
          <span className="font-medium">
            {productos.length} {productos.length === 1 ? 'producto encontrado' : 'productos encontrados'}
          </span>
          {filtrosActivos > 0 && (
            <span className="text-slate-500">
              {filtrosActivos} {filtrosActivos === 1 ? 'filtro aplicado' : 'filtros aplicados'}
            </span>
          )}
        </div>
      )}

      {/* Grid de productos */}
      {cargando ? (
        <Card className="p-12 text-center bg-white shadow-sm">
          <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600 font-medium">Cargando productos...</p>
        </Card>
      ) : error ? (
        <Card className="p-12 text-center bg-white shadow-sm">
          <AlertCircle size={48} className="mx-auto text-red-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar productos</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button variant="primary" onClick={cargarProductos}>
            Intentar de nuevo
          </Button>
        </Card>
      ) : productos.length === 0 ? (
        <Card className="p-12 text-center bg-white shadow-sm">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron productos</h3>
          <p className="text-gray-600 mb-4">
            {filtrosActivos > 0
              ? 'No hay productos que coincidan con los filtros seleccionados. Intenta ajustar los filtros para ver más resultados.'
              : 'Aún no hay productos disponibles en la tienda'}
          </p>
          {filtrosActivos > 0 && (
            <Button variant="secondary" onClick={handleLimpiarFiltros}>
              <X size={16} className="mr-2" />
              Limpiar filtros
            </Button>
          )}
        </Card>
      ) : (
        <div className={vistaGrid 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          : "space-y-4"
        }>
          {productos.map((producto: Producto) => {
            const tags = getProductoTags(producto);
            const categoriaNombre = categorias.find((c: CategoriaProducto) => c.id === producto.categoriaId)?.nombre || 'Sin categoría';

            return (
              <Card
                key={producto.id}
                variant="hover"
                className={`h-full flex flex-col transition-all overflow-hidden bg-white shadow-sm hover:shadow-md ${
                  vistaGrid ? '' : 'flex-row'
                }`}
              >
                {/* Imagen */}
                <div className={`${vistaGrid ? 'w-full h-48' : 'w-48 h-48 flex-shrink-0'} bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center relative overflow-hidden`}>
                  {producto.imagenPrincipalUrlOpcional ? (
                    <img 
                      src={producto.imagenPrincipalUrlOpcional} 
                      alt={producto.nombre}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package className="w-16 h-16 text-white opacity-80" />
                  )}
                  {/* Tags flotantes */}
                  {tags.length > 0 && (
                    <div className="absolute top-2 right-2 flex flex-col gap-1">
                      {tags.map((tag: { label: string; icon: React.ComponentType<{ size?: number; className?: string }>; variant: 'warning' | 'success' | 'info' | 'primary' | 'secondary' }, idx: number) => {
                        const Icon = tag.icon;
                        return (
                          <Badge key={idx} variant={tag.variant} className="text-xs shadow-md">
                            <Icon size={10} className="mr-1" />
                            {tag.label}
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className={`p-4 flex-1 space-y-3 flex flex-col ${vistaGrid ? '' : 'min-w-0'}`}>
                  {/* Header con nombre y tipo */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {producto.nombre}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">{categoriaNombre}</p>
                    </div>
                    <Badge variant={getTipoBadge(producto.tipo) as any} className="flex-shrink-0">
                      {getTipoIcono(producto.tipo)}
                      <span className="ml-1 capitalize text-xs">
                        {producto.tipo}
                      </span>
                    </Badge>
                  </div>

                  {/* Descripción */}
                  <p className="text-sm text-gray-600 line-clamp-2 flex-1">
                    {producto.descripcionCorta}
                  </p>

                  {/* Tags adicionales */}
                  {producto.tagsOpcionales && producto.tagsOpcionales.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {producto.tagsOpcionales.slice(0, 3).map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Precio y stock */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-blue-600">
                        €{producto.precioBase.toFixed(2)}
                      </span>
                      {producto.stockGeneralOpcional !== undefined && (
                        <span className="text-xs text-gray-500 mt-1">
                          Stock: {producto.stockGeneralOpcional}
                        </span>
                      )}
                    </div>
                    {!producto.activo && (
                      <Badge variant="secondary" className="text-xs">
                        No disponible
                      </Badge>
                    )}
                  </div>

                  {/* Botones de acción */}
                  <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
                    {onVerDetalle && (
                      <Button
                        variant="secondary"
                        size="sm"
                        fullWidth
                        onClick={() => onVerDetalle(producto)}
                      >
                        Ver Detalles
                      </Button>
                    )}
                    <Button
                      variant="primary"
                      size="sm"
                      fullWidth
                      onClick={() => handleAddToCart(producto)}
                      disabled={!producto.activo}
                    >
                      <ShoppingCart size={16} className="mr-1" />
                      Añadir al carrito
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

