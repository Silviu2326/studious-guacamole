import React, { useState } from 'react';
import { Card, Select, Button, Badge } from '../../../components/componentsreutilizables';
import { PipelineFilters as PipelineFiltersType, BusinessType, PipelinePhase } from '../types';
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { getPhases } from '../api/phases';

interface PipelineFiltersProps {
  businessType: BusinessType;
  filters: PipelineFiltersType;
  onFiltersChange: (filters: PipelineFiltersType) => void;
}

export const PipelineFilters: React.FC<PipelineFiltersProps> = ({
  businessType,
  filters,
  onFiltersChange,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [availablePhases, setAvailablePhases] = useState<PipelinePhase[]>([]);

  React.useEffect(() => {
    getPhases(businessType).then(phases => {
      setAvailablePhases(phases.map(p => p.key));
    });
  }, [businessType]);

  const handleSearchChange = (value: string) => {
    onFiltersChange({
      ...filters,
      search: value || undefined,
    });
  };

  const handlePhaseFilter = (phases: PipelinePhase[]) => {
    onFiltersChange({
      ...filters,
      phase: phases.length > 0 ? phases : undefined,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      businessType,
    });
  };

  const hasActiveFilters = Boolean(
    filters.search ||
    filters.phase?.length ||
    filters.assignedTo?.length ||
    filters.tags?.length
  );

  const activeFiltersCount = [
    filters.search,
    filters.phase?.length,
    filters.assignedTo?.length,
    filters.tags?.length,
  ].filter(Boolean).length;

  return (
    <Card className="mb-6 bg-white shadow-sm">
      <div className="space-y-4">
        {/* Barra de búsqueda */}
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex gap-4">
            {/* Input de búsqueda */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, email o teléfono..."
                value={filters.search || ''}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
              />
            </div>
            
            {/* Botón de filtros */}
            <Button
              variant={hasActiveFilters ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <Filter size={18} className="mr-2" />
              Filtros
              {activeFiltersCount > 0 && (
                <Badge variant="yellow" className="ml-2">
                  {activeFiltersCount}
                </Badge>
              )}
              {showAdvanced ? (
                <ChevronUp size={18} className="ml-2" />
              ) : (
                <ChevronDown size={18} className="ml-2" />
              )}
            </Button>
            
            {/* Botón limpiar (si hay filtros activos) */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
              >
                <X size={18} className="mr-2" />
                Limpiar
              </Button>
            )}
          </div>
        </div>

        {/* Panel de Filtros Avanzados */}
        {showAdvanced && (
          <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Filter size={16} className="inline mr-1" />
                  Fases
                </label>
                <Select
                  value={filters.phase?.[0] || ''}
                  onChange={(e) => {
                    const selectedPhase = e.target.value as PipelinePhase;
                    if (selectedPhase) {
                      handlePhaseFilter([selectedPhase]);
                    } else {
                      handlePhaseFilter([]);
                    }
                  }}
                  options={[
                    { value: '', label: 'Todas las fases' },
                    ...availablePhases.map(phase => ({
                      value: phase,
                      label: phase.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
                    })),
                  ]}
                />
              </div>
            </div>
          </div>
        )}

        {/* Resumen de Resultados */}
        {hasActiveFilters && (
          <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
            <span>Filtros activos: {activeFiltersCount}</span>
          </div>
        )}
      </div>
    </Card>
  );
};

