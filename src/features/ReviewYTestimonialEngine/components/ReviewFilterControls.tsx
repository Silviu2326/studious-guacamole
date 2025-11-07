import React from 'react';
import {
  ReviewSource,
  ReviewStatus
} from '../api/reviews';
import { Filter, Search } from 'lucide-react';
import { Card } from '../../../components/componentsreutilizables';

interface ReviewFilterControlsProps {
  currentFilters: {
    source?: ReviewSource | 'all';
    rating?: number | 'all';
    status?: ReviewStatus | 'all';
  };
  onFilterChange: (newFilters: {
    source?: ReviewSource | 'all';
    rating?: number | 'all';
    status?: ReviewStatus | 'all';
  }) => void;
}

export const ReviewFilterControls: React.FC<ReviewFilterControlsProps> = ({
  currentFilters,
  onFilterChange
}) => {
  const handleSourceChange = (source: ReviewSource | 'all') => {
    onFilterChange({ ...currentFilters, source });
  };

  const handleRatingChange = (rating: number | 'all') => {
    onFilterChange({ ...currentFilters, rating });
  };

  const handleStatusChange = (status: ReviewStatus | 'all') => {
    onFilterChange({ ...currentFilters, status });
  };

  const hasActiveFilters = 
    (currentFilters.source && currentFilters.source !== 'all') ||
    (currentFilters.rating && currentFilters.rating !== 'all') ||
    (currentFilters.status && currentFilters.status !== 'all');

  const activeFiltersCount = [
    currentFilters.source && currentFilters.source !== 'all',
    currentFilters.rating && currentFilters.rating !== 'all',
    currentFilters.status && currentFilters.status !== 'all'
  ].filter(Boolean).length;

  const handleClearFilters = () => {
    onFilterChange({ source: 'all', rating: 'all', status: 'all' });
  };

  return (
    <Card className="mb-6 bg-white shadow-sm">
      <div className="space-y-4">
        {/* Barra de búsqueda */}
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar reseñas..."
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
              />
            </div>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white/70 rounded-xl transition-all"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>

        {/* Panel de filtros avanzados */}
        <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-slate-600" />
            <h3 className="text-sm font-medium text-slate-700">Filtros</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Source Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Filter size={16} className="inline mr-1" />
                Plataforma
              </label>
              <select
                value={currentFilters.source || 'all'}
                onChange={(e) => handleSourceChange(e.target.value as ReviewSource | 'all')}
                className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              >
                <option value="all">Todas</option>
                <option value="google">Google</option>
                <option value="facebook">Facebook</option>
                <option value="web">Sitio Web</option>
              </select>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Filter size={16} className="inline mr-1" />
                Puntuación
              </label>
              <select
                value={currentFilters.rating || 'all'}
                onChange={(e) => handleRatingChange(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              >
                <option value="all">Todas</option>
                <option value="5">5 estrellas</option>
                <option value="4">4 estrellas</option>
                <option value="3">3 estrellas</option>
                <option value="2">2 estrellas</option>
                <option value="1">1 estrella</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Filter size={16} className="inline mr-1" />
                Estado
              </label>
              <select
                value={currentFilters.status || 'all'}
                onChange={(e) => handleStatusChange(e.target.value as ReviewStatus | 'all')}
                className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
              >
                <option value="all">Todos</option>
                <option value="new">Nueva</option>
                <option value="read">Leída</option>
                <option value="featured">Destacada</option>
                <option value="responded">Respondida</option>
                <option value="archived">Archivada</option>
              </select>
            </div>
          </div>
        </div>

        {/* Resumen de resultados */}
        <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
          <span>{activeFiltersCount > 0 ? `${activeFiltersCount} filtros aplicados` : 'Sin filtros aplicados'}</span>
        </div>
      </div>
    </Card>
  );
};

