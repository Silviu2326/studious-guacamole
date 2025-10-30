import React, { useState, useEffect } from 'react';
import { Card, Input, Select, Button } from '../../../components/componentsreutilizables';
import { FiltrosProductos as FiltrosType, Categoria } from '../types';
import { 
  Search, 
  Filter, 
  X, 
  ChevronDown, 
  ChevronUp,
  Package,
  DollarSign,
  Tag,
  Star
} from 'lucide-react';

interface FiltrosProductosProps {
  filtros: FiltrosType;
  categorias: Categoria[];
  onFiltrosChange: (filtros: FiltrosType) => void;
  onLimpiarFiltros: () => void;
  totalResultados: number;
}

export const FiltrosProductos: React.FC<FiltrosProductosProps> = ({
  filtros,
  categorias,
  onFiltrosChange,
  onLimpiarFiltros,
  totalResultados
}) => {
  const [filtrosLocales, setFiltrosLocales] = useState<FiltrosType>(filtros);
  const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(false);
  const [subcategorias, setSubcategorias] = useState<Categoria[]>([]);

  // Sincronizar filtros locales con props
  useEffect(() => {
    setFiltrosLocales(filtros);
  }, [filtros]);

  // Actualizar subcategorías cuando cambia la categoría seleccionada
  useEffect(() => {
    if (filtrosLocales.categoria) {
      const categoriaSeleccionada = categorias.find(c => c.id === filtrosLocales.categoria);
      setSubcategorias(categoriaSeleccionada?.subcategorias || []);
    } else {
      setSubcategorias([]);
    }
  }, [filtrosLocales.categoria, categorias]);

  const handleFiltroChange = (campo: keyof FiltrosType, valor: any) => {
    const nuevosFiltros = { ...filtrosLocales, [campo]: valor };
    
    // Si cambia la categoría, limpiar subcategoría
    if (campo === 'categoria') {
      nuevosFiltros.subcategoria = undefined;
    }
    
    setFiltrosLocales(nuevosFiltros);
    onFiltrosChange(nuevosFiltros);
  };

  const handleLimpiarFiltros = () => {
    setFiltrosLocales({});
    setMostrarFiltrosAvanzados(false);
    onLimpiarFiltros();
  };

  const contarFiltrosActivos = () => {
    return Object.values(filtrosLocales).filter(valor => 
      valor !== undefined && valor !== '' && valor !== null
    ).length;
  };

  const filtrosActivos = contarFiltrosActivos();

  // Opciones para los selects
  const opcionesCategoria = [
    { value: '', label: 'Todas las categorías' },
    ...categorias.map(categoria => ({
      value: categoria.id,
      label: categoria.nombre
    }))
  ];

  const opcionesSubcategoria = [
    { value: '', label: 'Todas las subcategorías' },
    ...subcategorias.map(subcategoria => ({
      value: subcategoria.id,
      label: subcategoria.nombre
    }))
  ];

  const opcionesStock = [
    { value: '', label: 'Todos los productos' },
    { value: 'true', label: 'Solo con stock' },
    { value: 'false', label: 'Sin stock' }
  ];

  const opcionesEstado = [
    { value: '', label: 'Todos los estados' },
    { value: 'true', label: 'Solo activos' },
    { value: 'false', label: 'Solo inactivos' }
  ];

  return (
    <Card className="mb-6">
      <div className="space-y-4">
        {/* Barra de búsqueda principal */}
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Buscar productos por nombre, descripción, SKU o tags..."
              value={filtrosLocales.busqueda || ''}
              onChange={(e) => handleFiltroChange('busqueda', e.target.value)}
              leftIcon={<Search size={20} />}
              rightIcon={
                filtrosLocales.busqueda && (
                  <button
                    onClick={() => handleFiltroChange('busqueda', '')}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )
              }
            />
          </div>
          
          <Button
            variant="secondary"
            onClick={() => setMostrarFiltrosAvanzados(!mostrarFiltrosAvanzados)}
            className="flex items-center gap-2"
          >
            <Filter size={16} />
            Filtros
            {filtrosActivos > 0 && (
              <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                {filtrosActivos}
              </span>
            )}
            {mostrarFiltrosAvanzados ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>

          {filtrosActivos > 0 && (
            <Button
              variant="ghost"
              onClick={handleLimpiarFiltros}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X size={16} className="mr-1" />
              Limpiar
            </Button>
          )}
        </div>

        {/* Filtros avanzados */}
        {mostrarFiltrosAvanzados && (
          <div className="border-t pt-4 space-y-4">
            {/* Primera fila de filtros */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Package size={16} className="inline mr-1" />
                  Categoría
                </label>
                <Select
                  options={opcionesCategoria}
                  value={filtrosLocales.categoria || ''}
                  onChange={(value) => handleFiltroChange('categoria', value || undefined)}
                  placeholder="Seleccionar categoría"
                />
              </div>

              {subcategorias.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Tag size={16} className="inline mr-1" />
                    Subcategoría
                  </label>
                  <Select
                    options={opcionesSubcategoria}
                    value={filtrosLocales.subcategoria || ''}
                    onChange={(value) => handleFiltroChange('subcategoria', value || undefined)}
                    placeholder="Seleccionar subcategoría"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Package size={16} className="inline mr-1" />
                  Stock
                </label>
                <Select
                  options={opcionesStock}
                  value={filtrosLocales.enStock?.toString() || ''}
                  onChange={(value) => handleFiltroChange('enStock', value ? value === 'true' : undefined)}
                  placeholder="Estado del stock"
                />
              </div>
            </div>

            {/* Segunda fila de filtros */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign size={16} className="inline mr-1" />
                  Precio mínimo
                </label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={filtrosLocales.precioMin?.toString() || ''}
                  onChange={(e) => handleFiltroChange('precioMin', e.target.value ? parseFloat(e.target.value) : undefined)}
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign size={16} className="inline mr-1" />
                  Precio máximo
                </label>
                <Input
                  type="number"
                  placeholder="999.99"
                  value={filtrosLocales.precioMax?.toString() || ''}
                  onChange={(e) => handleFiltroChange('precioMax', e.target.value ? parseFloat(e.target.value) : undefined)}
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <Select
                  options={opcionesEstado}
                  value={filtrosLocales.activos?.toString() || ''}
                  onChange={(value) => handleFiltroChange('activos', value ? value === 'true' : undefined)}
                  placeholder="Estado del producto"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Star size={16} className="inline mr-1" />
                  Destacados
                </label>
                <Select
                  options={[
                    { value: '', label: 'Todos' },
                    { value: 'true', label: 'Solo destacados' },
                    { value: 'false', label: 'No destacados' }
                  ]}
                  value={filtrosLocales.destacados?.toString() || ''}
                  onChange={(value) => handleFiltroChange('destacados', value ? value === 'true' : undefined)}
                  placeholder="Productos destacados"
                />
              </div>
            </div>

            {/* Tercera fila - Marca */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marca
                </label>
                <Input
                  placeholder="Filtrar por marca..."
                  value={filtrosLocales.marca || ''}
                  onChange={(e) => handleFiltroChange('marca', e.target.value || undefined)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Resumen de resultados */}
        <div className="flex justify-between items-center text-sm text-gray-600 border-t pt-4">
          <span>
            {totalResultados === 1 
              ? '1 producto encontrado' 
              : `${totalResultados} productos encontrados`
            }
          </span>
          
          {filtrosActivos > 0 && (
            <span>
              {filtrosActivos === 1 
                ? '1 filtro aplicado' 
                : `${filtrosActivos} filtros aplicados`
              }
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};