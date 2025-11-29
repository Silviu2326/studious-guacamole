import React from 'react';
import { Search, Filter, X } from 'lucide-react';

interface GlobalFilterBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  activeFilters: string[];
  onToggleFilter: (filter: string) => void;
  onClearFilters: () => void;
  resultCount?: number;
  totalCount?: number;
}

export const GlobalFilterBar: React.FC<GlobalFilterBarProps> = ({
  searchTerm,
  onSearchChange,
  activeFilters,
  onToggleFilter,
  onClearFilters,
  resultCount,
  totalCount
}) => {
  const hasFilters = searchTerm || activeFilters.length > 0;

  const filters = [
    { id: 'fuerza', label: 'Mostrar solo Fuerza', type: 'include' },
    { id: 'descanso', label: 'Ocultar Descanso', type: 'exclude' },
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex flex-col md:flex-row gap-4 items-center sticky top-0 z-10 mb-4">
      {/* Search Input */}
      <div className="relative w-full md:w-auto md:min-w-[300px]">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={16} className="text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition duration-150 ease-in-out"
          placeholder="Buscar días, ejercicios..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchTerm && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" onClick={() => onSearchChange('')}>
            <X size={16} className="text-gray-400 hover:text-gray-600" />
          </div>
        )}
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
        <div className="flex items-center gap-1 text-gray-500 text-sm mr-2">
          <Filter size={16} />
          <span className="hidden sm:inline">Filtros:</span>
        </div>
        
        {filters.map(filter => {
          const isActive = activeFilters.includes(filter.id);
          return (
            <button
              key={filter.id}
              onClick={() => onToggleFilter(filter.id)}
              className={`
                inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors
                ${isActive 
                  ? filter.type === 'include' 
                    ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                }
              `}
            >
              {filter.label}
              {isActive && <X size={12} className="ml-1.5" />}
            </button>
          );
        })}

        {/* Clear All */}
        {hasFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-gray-500 hover:text-blue-600 underline ml-auto md:ml-2"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Results Count */}
      {hasFilters && resultCount !== undefined && (
        <div className="text-xs text-gray-400 ml-auto">
          Mostrando {resultCount} de {totalCount} días
        </div>
      )}
    </div>
  );
};
