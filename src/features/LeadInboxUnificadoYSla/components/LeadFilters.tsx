import React from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { Search, Filter, X } from 'lucide-react';
import { Lead } from '../api/inbox';

interface LeadFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: Lead['status'] | 'all';
  onStatusFilterChange: (status: Lead['status'] | 'all') => void;
  channelFilter: Lead['sourceChannel'] | 'all';
  onChannelFilterChange: (channel: Lead['sourceChannel'] | 'all') => void;
  slaFilter: Lead['slaStatus'] | 'all';
  onSlaFilterChange: (sla: Lead['slaStatus'] | 'all') => void;
  showFilters: boolean;
  onToggleFilters: () => void;
}

export const LeadFilters: React.FC<LeadFiltersProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  channelFilter,
  onChannelFilterChange,
  slaFilter,
  onSlaFilterChange,
  showFilters,
  onToggleFilters
}) => {
  const statusOptions: Array<{ value: Lead['status'] | 'all'; label: string }> = [
    { value: 'all', label: 'Todos' },
    { value: 'new', label: 'Nuevos' },
    { value: 'contacted', label: 'Contactados' },
    { value: 'converted', label: 'Convertidos' },
    { value: 'discarded', label: 'Descartados' }
  ];

  const channelOptions: Array<{ value: Lead['sourceChannel'] | 'all'; label: string }> = [
    { value: 'all', label: 'Todos los canales' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'email', label: 'Email' },
    { value: 'web_form', label: 'Formulario Web' }
  ];

  const slaOptions: Array<{ value: Lead['slaStatus'] | 'all'; label: string }> = [
    { value: 'all', label: 'Todos los SLA' },
    { value: 'on_time', label: 'A tiempo' },
    { value: 'at_risk', label: 'En riesgo' },
    { value: 'overdue', label: 'Vencidos' }
  ];

  const activeFiltersCount = 
    (statusFilter !== 'all' ? 1 : 0) + 
    (channelFilter !== 'all' ? 1 : 0) + 
    (slaFilter !== 'all' ? 1 : 0);

  const hasActiveFilters = activeFiltersCount > 0;

  return (
    <div className="space-y-4">
      {/* Barra de búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar leads por nombre o mensaje..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Botón de filtros */}
      <div className="flex items-center justify-between">
        <button
          onClick={onToggleFilters}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
            showFilters || hasActiveFilters
              ? 'bg-blue-100 text-blue-700 border border-blue-200'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Filtros</span>
          {hasActiveFilters && (
            <span className="px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={() => {
              onStatusFilterChange('all');
              onChannelFilterChange('all');
              onSlaFilterChange('all');
            }}
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Panel de filtros */}
      {showFilters && (
        <Card className="bg-white shadow-sm" padding="md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtro por estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={statusFilter}
                onChange={(e) => onStatusFilterChange(e.target.value as Lead['status'] | 'all')}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por canal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Canal
              </label>
              <select
                value={channelFilter}
                onChange={(e) => onChannelFilterChange(e.target.value as Lead['sourceChannel'] | 'all')}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {channelOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtro por SLA */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado SLA
              </label>
              <select
                value={slaFilter}
                onChange={(e) => onSlaFilterChange(e.target.value as Lead['slaStatus'] | 'all')}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {slaOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

