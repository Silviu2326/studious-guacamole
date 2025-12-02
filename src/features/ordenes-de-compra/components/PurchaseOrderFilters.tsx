import React, { useState } from 'react';
import { Card } from '../../../components/componentsreutilizables/Card';
import { Button } from '../../../components/componentsreutilizables/Button';
import { OrderStatus, PurchaseOrderFilters as Filters } from '../types';
import { Search, ChevronDown, ChevronUp, X } from 'lucide-react';

interface PurchaseOrderFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

const statusOptions = [
  { value: '', label: 'Todos los estados' },
  { value: OrderStatus.DRAFT, label: 'Borrador' },
  { value: OrderStatus.PENDING_APPROVAL, label: 'Pendiente Aprobación' },
  { value: OrderStatus.APPROVED, label: 'Aprobada' },
  { value: OrderStatus.REJECTED, label: 'Rechazada' },
  { value: OrderStatus.ORDERED, label: 'Ordenada' },
  { value: OrderStatus.PARTIALLY_RECEIVED, label: 'Parcialmente Recibida' },
  { value: OrderStatus.COMPLETED, label: 'Completada' },
  { value: OrderStatus.CANCELLED, label: 'Cancelada' },
];

export const PurchaseOrderFilters: React.FC<PurchaseOrderFiltersProps> = ({
  filters,
  onFiltersChange,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const activeFiltersCount = [filters.status, filters.search].filter(Boolean).length;
  const hasActiveFilters = activeFiltersCount > 0;

  const handleStatusChange = (value: string) => {
    onFiltersChange({
      ...filters,
      status: value ? (value as OrderStatus) : undefined,
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      search: e.target.value || undefined,
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({});
  };

  return (
    <Card className="mb-6 bg-white shadow-sm">
      <div className="space-y-4">
        {/* Barra de búsqueda */}
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex gap-4">
            {/* Input de búsqueda */}
            <div className="flex-1 relative">
              <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search size={18} className="text-slate-400" />
              </span>
              <input
                type="text"
                placeholder="Buscar por ID, proveedor o solicitante..."
                value={filters.search || ''}
                onChange={handleSearchChange}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
              />
            </div>

            {/* Botón de filtros avanzados */}
            <Button
              variant={showAdvanced ? 'secondary' : 'ghost'}
              onClick={() => setShowAdvanced(!showAdvanced)}
              leftIcon={showAdvanced ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            >
              Filtros
              {activeFiltersCount > 0 && (
                <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-600 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </Button>

            {/* Botón limpiar */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={handleClearFilters}
                leftIcon={<X size={18} />}
              >
                Limpiar
              </Button>
            )}
          </div>
        </div>

        {/* Panel de filtros avanzados */}
        {showAdvanced && (
          <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Estado
                </label>
                <div className="relative">
                  <select
                    value={filters.status || ''}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="w-full appearance-none rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 py-2.5 pl-3 pr-9"
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Resumen de resultados */}
        {hasActiveFilters && (
          <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
            <span>{activeFiltersCount} filtro{activeFiltersCount > 1 ? 's' : ''} aplicado{activeFiltersCount > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>
    </Card>
  );
};

