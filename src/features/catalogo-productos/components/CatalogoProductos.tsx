import React, { useState } from 'react';
import { Card, Button, MetricCards } from '../../../components/componentsreutilizables';
import { ProductoCard } from './ProductoCard';
import { FiltrosProductos } from './FiltrosProductos';
import { ProductoModal } from './ProductoModal';
import { ConfirmModal } from '../../../components/componentsreutilizables/Modal';
import { useProductos } from '../hooks/useProductos';
import { Producto, OrdenProductos } from '../types';
import { 
  Plus, 
  Grid3X3, 
  List, 
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Package,
  AlertCircle,
  Loader2
} from 'lucide-react';

type VistaType = 'grid' | 'list';

export const CatalogoProductos: React.FC = () => {
  const {
    productos,
    categorias,
    loading,
    error,
    totalProductos,
    totalPaginas,
    paginaActual,
    filtros,
    orden,
    cargarProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    duplicarProducto,
    aplicarFiltros,
    aplicarOrden,
    cambiarPagina,
    limpiarFiltros
  } = useProductos();

  // Estados locales
  const [vista, setVista] = useState<VistaType>('grid');
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoModal, setModoModal] = useState<'crear' | 'editar' | 'ver'>('crear');
  const [confirmModalAbierto, setConfirmModalAbierto] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState<Producto | null>(null);

  // Manejadores de eventos
  const handleCrearProducto = () => {
    setProductoSeleccionado(null);
    setModoModal('crear');
    setModalAbierto(true);
  };

  const handleEditarProducto = (producto: Producto) => {
    setProductoSeleccionado(producto);
    setModoModal('editar');
    setModalAbierto(true);
  };

  const handleVerProducto = (producto: Producto) => {
    setProductoSeleccionado(producto);
    setModoModal('ver');
    setModalAbierto(true);
  };

  const handleEliminarProducto = (producto: Producto) => {
    setProductoAEliminar(producto);
    setConfirmModalAbierto(true);
  };

  const confirmarEliminacion = async () => {
    if (productoAEliminar) {
      const eliminado = await eliminarProducto(productoAEliminar.id);
      if (eliminado) {
        setConfirmModalAbierto(false);
        setProductoAEliminar(null);
      }
    }
  };

  const handleDuplicarProducto = async (producto: Producto) => {
    await duplicarProducto(producto.id);
  };

  const handleToggleDestacado = async (producto: Producto) => {
    await actualizarProducto(producto.id, { destacado: !producto.destacado });
  };

  const handleGuardarProducto = async (datos: any) => {
    let exito = false;
    
    if (modoModal === 'crear') {
      exito = await crearProducto(datos);
    } else if (modoModal === 'editar' && productoSeleccionado) {
      exito = await actualizarProducto(productoSeleccionado.id, datos);
    }

    if (exito) {
      setModalAbierto(false);
      setProductoSeleccionado(null);
    }
  };

  const handleCambiarOrden = (campo: OrdenProductos['campo']) => {
    const nuevaDireccion = orden.campo === campo && orden.direccion === 'asc' ? 'desc' : 'asc';
    aplicarOrden({ campo, direccion: nuevaDireccion });
  };

  // Opciones de ordenamiento
  const opcionesOrden = [
    { campo: 'nombre' as const, label: 'Nombre' },
    { campo: 'precio' as const, label: 'Precio' },
    { campo: 'stock' as const, label: 'Stock' },
    { campo: 'fechaCreacion' as const, label: 'Fecha de creación' },
    { campo: 'categoria' as const, label: 'Categoría' }
  ];

  // Generar páginas para paginación
  const generarPaginas = () => {
    const paginas = [];
    const maxPaginas = 5;
    let inicio = Math.max(1, paginaActual - Math.floor(maxPaginas / 2));
    let fin = Math.min(totalPaginas, inicio + maxPaginas - 1);
    
    if (fin - inicio < maxPaginas - 1) {
      inicio = Math.max(1, fin - maxPaginas + 1);
    }

    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }
    
    return paginas;
  };

  if (error) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar productos</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => cargarProductos()}>
          Reintentar
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar superior */}
      <div className="flex items-center justify-end">
        <Button onClick={handleCrearProducto}>
          <Plus size={20} className="mr-2" />
          Nuevo Producto
        </Button>
      </div>

      {/* KPIs de catálogo */}
      <MetricCards
        data={[
          {
            id: 'total',
            title: 'Total productos',
            value: totalProductos,
            color: 'info',
          },
          {
            id: 'stock',
            title: 'En stock',
            value: productos.filter(p => p.stock > 0).length,
            color: 'success',
          },
          {
            id: 'featured',
            title: 'Destacados',
            value: productos.filter(p => p.destacado).length,
            color: 'warning',
          },
        ]}
      />

      {/* Filtros */}
      <FiltrosProductos
        filtros={filtros}
        categorias={categorias}
        onFiltrosChange={aplicarFiltros}
        onLimpiarFiltros={limpiarFiltros}
        totalResultados={totalProductos}
      />

      {/* Controles de vista y ordenamiento */}
      <Card className="p-4 bg-white shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            {/* Selector de vista */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Vista:</span>
              <div className="flex border rounded-lg overflow-hidden">
                <Button
                  variant={vista === 'grid' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setVista('grid')}
                  className="p-2 rounded-none"
                >
                  <Grid3X3 size={16} />
                </Button>
                <Button
                  variant={vista === 'list' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setVista('list')}
                  className="p-2 rounded-none"
                >
                  <List size={16} />
                </Button>
              </div>
            </div>

            {/* Selector de ordenamiento */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Ordenar por:</span>
              <div className="flex flex-wrap gap-1">
                {opcionesOrden.map((opcion) => (
                  <Button
                    key={opcion.campo}
                    variant={orden.campo === opcion.campo ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => handleCambiarOrden(opcion.campo)}
                    className="px-3 py-1 text-sm"
                  >
                    {opcion.label}
                    {orden.campo === opcion.campo && (
                      <ArrowUpDown size={12} className={`ml-1 ${orden.direccion === 'desc' ? 'rotate-180' : ''}`} />
                    )}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Información de resultados */}
          <div className="text-sm text-gray-600">
            Página {paginaActual} de {totalPaginas} ({totalProductos} productos)
          </div>
        </div>
      </Card>

      {/* Lista de productos */}
      {loading ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando productos...</p>
        </Card>
      ) : productos.length === 0 ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay productos</h3>
          <p className="text-gray-600 mb-4">
            {Object.keys(filtros).length > 0 
              ? 'No se encontraron productos con los filtros aplicados'
              : 'Aún no has agregado productos al catálogo'
            }
          </p>
          {Object.keys(filtros).length > 0 ? (
            <Button variant="secondary" onClick={limpiarFiltros}>
              Limpiar filtros
            </Button>
          ) : (
            <Button onClick={handleCrearProducto}>
              <Plus size={20} className="mr-2" />
              Crear primer producto
            </Button>
          )}
        </Card>
      ) : (
        <div className={
          vista === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
        }>
          {productos.map((producto) => {
            const categoria = categorias.find(c => c.id === producto.categoria);
            return (
              <ProductoCard
                key={producto.id}
                producto={producto}
                categoria={categoria}
                onEditar={handleEditarProducto}
                onEliminar={handleEliminarProducto}
                onDuplicar={handleDuplicarProducto}
                onVer={handleVerProducto}
                onToggleDestacado={handleToggleDestacado}
              />
            );
          })}
        </div>
      )}

      {/* Paginación */}
      {totalPaginas > 1 && (
        <Card className="p-4 bg-white shadow-sm">
          <div className="flex justify-center items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => cambiarPagina(paginaActual - 1)}
              disabled={paginaActual === 1}
            >
              <ChevronLeft size={16} />
              Anterior
            </Button>

            {generarPaginas().map((pagina) => (
              <Button
                key={pagina}
                variant={pagina === paginaActual ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => cambiarPagina(pagina)}
              >
                {pagina}
              </Button>
            ))}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => cambiarPagina(paginaActual + 1)}
              disabled={paginaActual === totalPaginas}
            >
              Siguiente
              <ChevronRight size={16} />
            </Button>
          </div>
        </Card>
      )}

      {/* Modal de producto */}
      <ProductoModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        producto={productoSeleccionado}
        categorias={categorias}
        modo={modoModal}
        onGuardar={handleGuardarProducto}
      />

      {/* Modal de confirmación de eliminación */}
      <ConfirmModal
        isOpen={confirmModalAbierto}
        onClose={() => setConfirmModalAbierto(false)}
        onConfirm={confirmarEliminacion}
        title="Eliminar producto"
        message={`¿Estás seguro de que deseas eliminar el producto "${productoAEliminar?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="destructive"
      />
    </div>
  );
};