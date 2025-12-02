import React from 'react';
import { Card, Input, Select, Button } from '../../../components/componentsreutilizables';
import { RiskFilters, UserRole } from '../types';
import { ds } from '../../adherencia/ui/ds';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';

interface RiskFilterPanelProps {
  userType: UserRole;
  initialFilters?: RiskFilters;
  onFilterChange: (filters: RiskFilters) => void;
}

export const RiskFilterPanel: React.FC<RiskFilterPanelProps> = ({
  userType,
  initialFilters = {},
  onFilterChange,
}) => {
  const [filters, setFilters] = React.useState<RiskFilters>(initialFilters);
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleFilterChange = (key: keyof RiskFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters: RiskFilters = {};
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== undefined && v !== '');

  const activeFiltersCount = Object.values(filters).filter(v => v !== undefined && v !== '').length;

  return (
    <Card className="mb-6 bg-white shadow-sm">
      <div className="space-y-4">
        {/* Barra de búsqueda */}
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2 flex-1">
              <Filter size={18} className="text-slate-600" />
              <span className="text-sm font-medium text-slate-700">Filtros</span>
              {hasActiveFilters && (
                <span className="bg-red-500 text-white text-xs font-semibold rounded-full px-2 py-0.5">
                  {activeFiltersCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleReset}
                >
                  <X size={16} className="mr-1" />
                  Limpiar
                </Button>
              )}
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <>
                    <ChevronUp size={16} className="mr-1" />
                    Ocultar
                  </>
                ) : (
                  <>
                    <ChevronDown size={16} className="mr-1" />
                    Mostrar
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Panel de filtros avanzados */}
        {isExpanded && (
          <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Filtro común: Nivel de Riesgo */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Filter size={16} className="inline mr-1" />
                  Nivel de Riesgo
                </label>
                <Select
                  value={filters.riskLevel || ''}
                  onChange={(e) => handleFilterChange('riskLevel', e.target.value || undefined)}
                  options={[
                    { value: '', label: 'Todos' },
                    { value: 'low', label: 'Bajo' },
                    { value: 'medium', label: 'Medio' },
                    { value: 'high', label: 'Alto' },
                  ]}
                />
              </div>

              {userType === 'gym' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <Filter size={16} className="inline mr-1" />
                      Días desde último check-in (mínimo)
                    </label>
                    <Input
                      type="number"
                      value={filters.lastCheckInDays?.toString() || ''}
                      onChange={(e) => handleFilterChange('lastCheckInDays', e.target.value ? parseInt(e.target.value) : undefined)}
                      placeholder="Ej: 30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <Filter size={16} className="inline mr-1" />
                      Estado de Pago
                    </label>
                    <Select
                      value={filters.paymentStatus || ''}
                      onChange={(e) => handleFilterChange('paymentStatus', e.target.value || undefined)}
                      options={[
                        { value: '', label: 'Todos' },
                        { value: 'paid', label: 'Pagado' },
                        { value: 'failed', label: 'Fallido' },
                        { value: 'pending_renewal', label: 'Pendiente Renovación' },
                      ]}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <Filter size={16} className="inline mr-1" />
                      Sesiones perdidas (mínimo)
                    </label>
                    <Input
                      type="number"
                      value={filters.missedSessions?.toString() || ''}
                      onChange={(e) => handleFilterChange('missedSessions', e.target.value ? parseInt(e.target.value) : undefined)}
                      placeholder="Ej: 2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <Filter size={16} className="inline mr-1" />
                      Adherencia de entrenamiento (máximo %)
                    </label>
                    <Input
                      type="number"
                      value={filters.minWorkoutAdherence?.toString() || ''}
                      onChange={(e) => handleFilterChange('minWorkoutAdherence', e.target.value ? parseInt(e.target.value) : undefined)}
                      placeholder="Ej: 50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <Filter size={16} className="inline mr-1" />
                      Adherencia nutricional (máximo %)
                    </label>
                    <Input
                      type="number"
                      value={filters.minNutritionAdherence?.toString() || ''}
                      onChange={(e) => handleFilterChange('minNutritionAdherence', e.target.value ? parseInt(e.target.value) : undefined)}
                      placeholder="Ej: 50"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

