import React from 'react';
import {
  ReviewSource,
  ReviewStatus
} from '../api/reviews';
import { Filter } from 'lucide-react';

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

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">Filtros</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Source Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Plataforma
          </label>
          <select
            value={currentFilters.source || 'all'}
            onChange={(e) => handleSourceChange(e.target.value as ReviewSource | 'all')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Todas</option>
            <option value="google">Google</option>
            <option value="facebook">Facebook</option>
            <option value="web">Sitio Web</option>
          </select>
        </div>

        {/* Rating Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Puntuación
          </label>
          <select
            value={currentFilters.rating || 'all'}
            onChange={(e) => handleRatingChange(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado
          </label>
          <select
            value={currentFilters.status || 'all'}
            onChange={(e) => handleStatusChange(e.target.value as ReviewStatus | 'all')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
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
  );
};

