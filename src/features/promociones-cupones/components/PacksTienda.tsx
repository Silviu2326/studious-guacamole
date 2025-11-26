import React, { useState } from 'react';
import { Card, Button, MetricCards, Badge } from '../../../components/componentsreutilizables';
import { PackTienda } from '../types';
import {
  Plus,
  Grid3X3,
  List,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  AlertCircle,
  Loader2,
  Search,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  Package,
  Star
} from 'lucide-react';

type VistaType = 'grid' | 'list';

// Mock data
const mockPacks: PackTienda[] = [
  {
    id: '1',
    nombre: 'Pack Inicio Fitness',
    descripcion: 'Todo lo necesario para empezar tu rutina de entrenamiento',
    productos: [
      { productoId: 'prod-1', cantidad: 1, precioUnitario: 49.99 },
      { productoId: 'prod-2', cantidad: 1, precioUnitario: 29.99 }
    ],
    precioTotal: 59.98,
    precioOriginal: 79.98,
    descuento: 25,
    activo: true,
    destacado: true,
    stock: 15,
    fechaCreacion: new Date('2024-12-01'),
    fechaActualizacion: new Date('2024-12-01')
  }
];

export const PacksTienda: React.FC = () => {
  const [packs] = useState<PackTienda[]>(mockPacks);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vista, setVista] = useState<VistaType>('grid');
  const [busqueda, setBusqueda] = useState('');
  const [filtrosAvanzados, setFiltrosAvanzados] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas] = useState(1);

  const totalPacks = packs.length;
  const activos = packs.filter(p => p.activo).length;
  const destacados = packs.filter(p => p.destacado).length;

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(precio);
  };

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
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar packs</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => setError(null)}>
          Reintentar
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar superior */}
      <div className="flex items-center justify-end">
        <Button onClick={() => {}}>
          <Plus size={20} className="mr-2" />
          Nuevo Pack
        </Button>
      </div>

      {/* KPIs */}
      <MetricCards
        data={[
          {
            id: 'total',
            title: 'Total packs',
            value: totalPacks,
            color: 'info',
          },
          {
            id: 'activos',
            title: 'Activos',
            value: activos,
            color: 'success',
          },
          {
            id: 'destacados',
            title: 'Destacados',
            value: destacados,
            color: 'warning',
          },
        ]}
      />

      {/* Filtros */}
      <Card className="mb-6 bg-white shadow-sm">
        <div className="space-y-4">
          {/* Barra de búsqueda */}
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search size={20} className="text-slate-400" />
                  </span>
                  <input
                    type="text"
                    placeholder="Buscar packs por nombre o descripción..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                  />
                  {busqueda && (
                    <button
                      onClick={() => setBusqueda('')}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              <Button
                variant='secondary'
                onClick={() => setFiltrosAvanzados(!filtrosAvanzados)}
                className="flex items-center gap-2"
              >
                <Filter size={16} />
                Filtros
                {filtrosAvanzados ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </Button>
            </div>
          </div>

          {/* Panel de filtros avanzados */}
          {filtrosAvanzados && (
            <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <ShoppingBag size={16} className="inline mr-1" />
                    Estado
                  </label>
                  <select className="w-full appearance-none rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 py-2.5 pl-3 pr-9">
                    <option value="">Todos</option>
                    <option value="activo">Activos</option>
                    <option value="inactivo">Inactivos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Package size={16} className="inline mr-1" />
                    Stock
                  </label>
                  <select className="w-full appearance-none rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 py-2.5 pl-3 pr-9">
                    <option value="">Todos</option>
                    <option value="disponible">Con stock</option>
                    <option value="agotado">Sin stock</option>
                  </select>
                </div>
              </div>

              {/* Resumen */}
              <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
                <span>
                  {totalPacks === 1 ? '1 pack encontrado' : `${totalPacks} packs encontrados`}
                </span>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Controles de vista */}
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
          </div>

          {/* Información de resultados */}
          <div className="text-sm text-gray-600">
            Página {paginaActual} de {totalPaginas} ({totalPacks} packs)
          </div>
        </div>
      </Card>

      {/* Lista de packs */}
      {loading ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando packs...</p>
        </Card>
      ) : packs.length === 0 ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <ShoppingBag size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay packs</h3>
          <p className="text-gray-600 mb-4">
            {busqueda
              ? 'No se encontraron packs con los filtros aplicados'
              : 'Aún no has creado packs para la tienda'
            }
          </p>
          <Button onClick={() => {}}>
            <Plus size={20} className="mr-2" />
            Crear primer pack
          </Button>
        </Card>
      ) : (
        <div className={
          vista === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
        }>
          {packs.map((pack) => (
            <Card key={pack.id} variant="hover" className="h-full flex flex-col transition-shadow overflow-hidden">
              {/* Imagen del pack */}
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                {pack.imagen ? (
                  <img
                    src={pack.imagen}
                    alt={pack.nombre}
                    className="w-full h-full object-cover transition-transform duration-300 ease-out hover:scale-[1.03]"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ShoppingBag size={48} />
                  </div>
                )}
                
                {/* Badges superiores */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {pack.destacado && (
                    <Badge variant="yellow" leftIcon={<Star size={12} />}>Destacado</Badge>
                  )}
                  {!pack.activo && (
                    <Badge variant="gray">Inactivo</Badge>
                  )}
                </div>

                {/* Estado de stock */}
                <div className="absolute top-2 right-2">
                  <Badge
                    variant={pack.stock === 0 ? 'red' : pack.stock < 5 ? 'yellow' : 'green'}
                  >
                    {pack.stock === 0 ? 'Sin stock' : pack.stock < 5 ? 'Stock bajo' : 'En stock'}
                  </Badge>
                </div>
              </div>

              {/* Contenido */}
              <div className="flex-1 p-4 flex flex-col">
                {/* Nombre */}
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {pack.nombre}
                </h3>

                {/* Descripción */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">
                  {pack.descripcion}
                </p>

                {/* Información del pack */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Productos:</span>
                    <span className="font-medium text-gray-900">{pack.productos.length} items</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Stock:</span>
                    <span className={`font-semibold ${pack.stock === 0 ? 'text-red-600' : pack.stock < 5 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {pack.stock} unidades
                    </span>
                  </div>
                </div>

                {/* Precios */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-2xl font-bold text-gray-900">
                      {formatearPrecio(pack.precioTotal)}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      {formatearPrecio(pack.precioOriginal)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="red" className="text-sm">
                      {pack.descuento}% OFF
                    </Badge>
                    <span className="text-xs text-gray-500">
                      Ahorras {formatearPrecio(pack.precioOriginal - pack.precioTotal)}
                    </span>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {}}
                    className="flex-1"
                  >
                    Ver
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {}}
                    className="flex-1"
                  >
                    Editar
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Paginación */}
      {totalPaginas > 1 && (
        <Card className="p-4 bg-white shadow-sm">
          <div className="flex justify-center items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPaginaActual(paginaActual - 1)}
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
                onClick={() => setPaginaActual(pagina)}
              >
                {pagina}
              </Button>
            ))}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPaginaActual(paginaActual + 1)}
              disabled={paginaActual === totalPaginas}
            >
              Siguiente
              <ChevronRight size={16} />
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

