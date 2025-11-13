import React, { useState, useRef, useEffect } from 'react';
import { GlobalFilters as GlobalFiltersType } from '../types';
import { Filter, MapPin, Users, Building2, X, ChevronDown } from 'lucide-react';
import { Button } from '../../../components/componentsreutilizables';

interface GlobalFiltersProps {
  filters: GlobalFiltersType;
  onFiltersChange: (filters: GlobalFiltersType) => void;
  sedeOptions?: string[];
  equipoOptions?: string[];
  lineaNegocioOptions?: string[];
}

export const GlobalFilters: React.FC<GlobalFiltersProps> = ({
  filters,
  onFiltersChange,
  sedeOptions = [],
  equipoOptions = [],
  lineaNegocioOptions = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const activeFiltersCount = 
    (filters.sede ? 1 : 0) + 
    (filters.equipo ? 1 : 0) + 
    (filters.lineaNegocio ? 1 : 0);

  const handleFilterChange = (key: keyof GlobalFiltersType, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  // Mock options si no se proporcionan
  const sedes = sedeOptions.length > 0 ? sedeOptions : ['Sede Centro', 'Sede Norte', 'Sede Sur'];
  const equipos = equipoOptions.length > 0 ? equipoOptions : ['Equipo A', 'Equipo B', 'Equipo C'];
  const lineasNegocio = lineaNegocioOptions.length > 0 ? lineaNegocioOptions : ['Fitness', 'Nutrición', 'Wellness'];

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        leftIcon={<Filter size={18} />}
        className="flex items-center gap-2"
      >
        Filtros Globales
        {activeFiltersCount > 0 && (
          <span className="ml-1 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
            {activeFiltersCount}
          </span>
        )}
        <ChevronDown 
          size={16} 
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="p-4 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Filtros Globales</h3>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <X size={14} />
                  Limpiar
                </button>
              )}
            </div>

            {/* Sede Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2 flex items-center gap-1">
                <MapPin size={14} className="text-gray-500" />
                Sede
              </label>
              <select
                value={filters.sede || ''}
                onChange={(e) => handleFilterChange('sede', e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Todas las sedes</option>
                {sedes.map((sede) => (
                  <option key={sede} value={sede}>
                    {sede}
                  </option>
                ))}
              </select>
            </div>

            {/* Equipo Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Users size={14} className="text-gray-500" />
                Equipo
              </label>
              <select
                value={filters.equipo || ''}
                onChange={(e) => handleFilterChange('equipo', e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Todos los equipos</option>
                {equipos.map((equipo) => (
                  <option key={equipo} value={equipo}>
                    {equipo}
                  </option>
                ))}
              </select>
            </div>

            {/* Línea de Negocio Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2 flex items-center gap-1">
                <Building2 size={14} className="text-gray-500" />
                Línea de Negocio
              </label>
              <select
                value={filters.lineaNegocio || ''}
                onChange={(e) => handleFilterChange('lineaNegocio', e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Todas las líneas</option>
                {lineasNegocio.map((linea) => (
                  <option key={linea} value={linea}>
                    {linea}
                  </option>
                ))}
              </select>
            </div>

            {/* Active filters summary */}
            {activeFiltersCount > 0 && (
              <div className="pt-3 border-t border-slate-200">
                <div className="flex flex-wrap gap-2">
                  {filters.sede && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs">
                      <MapPin size={12} />
                      {filters.sede}
                      <button
                        onClick={() => handleFilterChange('sede', '')}
                        className="hover:bg-blue-100 rounded p-0.5"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {filters.equipo && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs">
                      <Users size={12} />
                      {filters.equipo}
                      <button
                        onClick={() => handleFilterChange('equipo', '')}
                        className="hover:bg-blue-100 rounded p-0.5"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {filters.lineaNegocio && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs">
                      <Building2 size={12} />
                      {filters.lineaNegocio}
                      <button
                        onClick={() => handleFilterChange('lineaNegocio', '')}
                        className="hover:bg-blue-100 rounded p-0.5"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

