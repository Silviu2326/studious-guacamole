import React, { useState, useEffect } from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
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

/* ---------- Controles claros (sin tema dark) ---------- */

type LightInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

const LightInput: React.FC<LightInputProps> = ({ leftIcon, rightIcon, className = '', ...props }) => (
  <div className={`relative ${className}`}>
    {leftIcon && (
      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <span className="text-slate-400">{leftIcon}</span>
      </span>
    )}
    <input
      {...props}
      className={[
        'w-full rounded-xl bg-white text-slate-900 placeholder-slate-400',
        'ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400',
        leftIcon ? 'pl-10' : 'pl-3',
        rightIcon ? 'pr-10' : 'pr-3',
        'py-2.5'
      ].join(' ')}
    />
    {rightIcon && (
      <span className="absolute inset-y-0 right-0 flex items-center pr-3">
        {rightIcon}
      </span>
    )}
  </div>
);

type Option = { value: string | number; label: string };

const LightSelect: React.FC<{
  options: Option[];
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}> = ({ options, value, onChange, placeholder, className = '' }) => (
  <div className={`relative ${className}`}>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={[
        'w-full appearance-none rounded-xl bg-white text-slate-900',
        'ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400',
        'py-2.5 pl-3 pr-9'
      ].join(' ')}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
  </div>
);

/* ----------------- FiltrosProductos (claro) ----------------- */

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

  useEffect(() => {
    setFiltrosLocales(filtros);
  }, [filtros]);

  useEffect(() => {
    if (filtrosLocales.categoria) {
      const categoriaSeleccionada = categorias.find(c => c.id === filtrosLocales.categoria);
      setSubcategorias(categoriaSeleccionada?.subcategorias || []);
    } else {
      setSubcategorias([]);
    }
  }, [filtrosLocales.categoria, categorias]);

  const handleFiltroChange = (campo: keyof FiltrosType, valor: any) => {
    const nuevosFiltros: FiltrosType = { ...filtrosLocales, [campo]: valor };
    if (campo === 'categoria') nuevosFiltros.subcategoria = undefined;
    setFiltrosLocales(nuevosFiltros);
    onFiltrosChange(nuevosFiltros);
  };

  const handleLimpiarFiltros = () => {
    setFiltrosLocales({});
    setMostrarFiltrosAvanzados(false);
    onLimpiarFiltros();
  };

  const filtrosActivos = Object.values(filtrosLocales).filter(
    v => v !== undefined && v !== '' && v !== null
  ).length;

  const opcionesCategoria: Option[] = categorias.map(c => ({ value: c.id, label: c.nombre }));
  const opcionesSubcategoria: Option[] = subcategorias.map(s => ({ value: s.id, label: s.nombre }));
  const opcionesStock: Option[] = [
    { value: 'true', label: 'Solo con stock' },
    { value: 'false', label: 'Sin stock' }
  ];
  const opcionesEstado: Option[] = [
    { value: 'true', label: 'Solo activos' },
    { value: 'false', label: 'Solo inactivos' }
  ];

  return (
    <Card className="mb-6 bg-white shadow-sm">
      <div className="space-y-4">
        {/* Barra búsqueda clara */}
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex gap-4">
            <div className="flex-1">
              <LightInput
                placeholder="Buscar productos por nombre, descripción, SKU o tags..."
                value={(filtrosLocales.busqueda as string) || ''}
                onChange={(e) => handleFiltroChange('busqueda', e.currentTarget.value)}
                leftIcon={<Search size={20} />}
                rightIcon={
                  filtrosLocales.busqueda ? (
                    <button
                      onClick={() => handleFiltroChange('busqueda', '')}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X size={16} />
                    </button>
                  ) : undefined
                }
              />
            </div>

            <Button
              variant='secondary'
              onClick={() => setMostrarFiltrosAvanzados(!mostrarFiltrosAvanzados)}
              className="flex items-center gap-2"
            >
              <Filter size={16} />
              Filtros
              {filtrosActivos > 0 && (
                <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center shadow-sm">
                  {filtrosActivos}
                </span>
              )}
              {mostrarFiltrosAvanzados ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>

            {filtrosActivos > 0 && (
              <Button
                onClick={handleLimpiarFiltros}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                variant="ghost"
              >
                <X size={16} className="mr-1" />
                Limpiar
              </Button>
            )}
          </div>
        </div>

        {/* Panel avanzado claro */}
        {mostrarFiltrosAvanzados && (
          <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
            {/* Fila 1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Package size={16} className="inline mr-1" />
                  Categoría
                </label>
                <LightSelect
                  options={opcionesCategoria}
                  value={(filtrosLocales.categoria as string) || ''}
                  onChange={(v) => handleFiltroChange('categoria', v || undefined)}
                  placeholder="Seleccionar categoría"
                />
              </div>

              {subcategorias.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Tag size={16} className="inline mr-1" />
                    Subcategoría
                  </label>
                  <LightSelect
                    options={opcionesSubcategoria}
                    value={(filtrosLocales.subcategoria as string) || ''}
                    onChange={(v) => handleFiltroChange('subcategoria', v || undefined)}
                    placeholder="Seleccionar subcategoría"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Package size={16} className="inline mr-1" />
                  Stock
                </label>
                <LightSelect
                  options={opcionesStock}
                  value={filtrosLocales.enStock !== undefined ? String(filtrosLocales.enStock) : ''}
                  onChange={(v) => handleFiltroChange('enStock', v ? v === 'true' : undefined)}
                  placeholder="Estado del stock"
                />
              </div>
            </div>

            {/* Fila 2 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <DollarSign size={16} className="inline mr-1" />
                  Precio mínimo
                </label>
                <LightInput
                  type="number"
                  placeholder="0.00"
                  value={filtrosLocales.precioMin?.toString() || ''}
                  onChange={(e) =>
                    handleFiltroChange('precioMin', e.currentTarget.value ? parseFloat(e.currentTarget.value) : undefined)
                  }
                  min={0}
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <DollarSign size={16} className="inline mr-1" />
                  Precio máximo
                </label>
                <LightInput
                  type="number"
                  placeholder="999.99"
                  value={filtrosLocales.precioMax?.toString() || ''}
                  onChange={(e) =>
                    handleFiltroChange('precioMax', e.currentTarget.value ? parseFloat(e.currentTarget.value) : undefined)
                  }
                  min={0}
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Estado</label>
                <LightSelect
                  options={opcionesEstado}
                  value={filtrosLocales.activos !== undefined ? String(filtrosLocales.activos) : ''}
                  onChange={(v) => handleFiltroChange('activos', v ? v === 'true' : undefined)}
                  placeholder="Estado del producto"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Star size={16} className="inline mr-1" />
                  Destacados
                </label>
                <LightSelect
                  options={[
                    { value: 'true', label: 'Solo destacados' },
                    { value: 'false', label: 'No destacados' }
                  ]}
                  value={filtrosLocales.destacados !== undefined ? String(filtrosLocales.destacados) : ''}
                  onChange={(v) => handleFiltroChange('destacados', v ? v === 'true' : undefined)}
                  placeholder="Productos destacados"
                />
              </div>
            </div>

            {/* Fila 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Marca</label>
                <LightInput
                  placeholder="Filtrar por marca..."
                  value={filtrosLocales.marca || ''}
                  onChange={(e) => handleFiltroChange('marca', e.currentTarget.value || undefined)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Resumen */}
        <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
          <span>
            {totalResultados === 1 ? '1 producto encontrado' : `${totalResultados} productos encontrados`}
          </span>
          {filtrosActivos > 0 && (
            <span>{filtrosActivos === 1 ? '1 filtro aplicado' : `${filtrosActivos} filtros aplicados`}</span>
          )}
        </div>
      </div>
    </Card>
  );
};
