import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Button } from '../../../components/componentsreutilizables';
import { INTEGRATION_CATEGORIES, IntegrationCategory } from '../types';

interface IntegrationFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: IntegrationCategory | 'all';
  onCategoryChange: (category: IntegrationCategory | 'all') => void;
}

export const IntegrationFilters: React.FC<IntegrationFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8">
      {/* Search Bar */}
      <div className="relative w-full md:w-96">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
          placeholder="Buscar integraciones..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
        <Filter className="h-5 w-5 text-gray-400 mr-2 hidden md:block" />
        <Button
          variant={selectedCategory === 'all' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => onCategoryChange('all')}
          className="whitespace-nowrap"
        >
          Todas
        </Button>
        {Object.entries(INTEGRATION_CATEGORIES).map(([key, label]) => (
          <Button
            key={key}
            variant={selectedCategory === key ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => onCategoryChange(key as IntegrationCategory)}
            className="whitespace-nowrap"
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
};
