import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { Input } from '../../../components/componentsreutilizables';
import { Location, Filters, DateRange } from '../types';
import { Calendar, Building2, Filter } from 'lucide-react';

interface AdvancedFiltersProps {
  locations: Location[];
  onFiltersChange: (filters: Filters) => void;
  initialFilters?: Filters;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  locations,
  onFiltersChange,
  initialFilters,
}) => {
  // Inicializar con el mes actual por defecto
  const getDefaultDateRange = (): DateRange => {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { startDate, endDate };
  };

  const [dateRange, setDateRange] = useState<DateRange>(
    initialFilters?.dateRange || getDefaultDateRange()
  );
  const [selectedLocationIds, setSelectedLocationIds] = useState<string[]>(
    initialFilters?.locationIds || []
  );

  useEffect(() => {
    onFiltersChange({
      dateRange,
      locationIds: selectedLocationIds,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange, selectedLocationIds]);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = new Date(e.target.value);
    setDateRange((prev) => ({ ...prev, startDate: newStartDate }));
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = new Date(e.target.value);
    setDateRange((prev) => ({ ...prev, endDate: newEndDate }));
  };

  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.selectedOptions);
    const values = options.map((option) => option.value);
    setSelectedLocationIds(values);
  };

  const presetRanges = [
    { label: 'Este mes', getRange: () => {
      const now = new Date();
      return {
        startDate: new Date(now.getFullYear(), now.getMonth(), 1),
        endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0),
      };
    }},
    { label: 'Mes pasado', getRange: () => {
      const now = new Date();
      return {
        startDate: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        endDate: new Date(now.getFullYear(), now.getMonth(), 0),
      };
    }},
    { label: 'Últimos 3 meses', getRange: () => {
      const now = new Date();
      return {
        startDate: new Date(now.getFullYear(), now.getMonth() - 2, 1),
        endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0),
      };
    }},
    { label: 'Este trimestre', getRange: () => {
      const now = new Date();
      const quarter = Math.floor(now.getMonth() / 3);
      return {
        startDate: new Date(now.getFullYear(), quarter * 3, 1),
        endDate: new Date(now.getFullYear(), (quarter + 1) * 3, 0),
      };
    }},
  ];

  const hasActiveFilters = selectedLocationIds.length > 0;

  return (
    <Card className="mb-6 bg-white shadow-sm">
      <div className="space-y-4">
        {/* Barra de búsqueda */}
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex gap-4">
            <div className="flex-1 flex items-center gap-2">
              <Filter className="w-5 h-5 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">Filtros Avanzados</span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={() => setSelectedLocationIds([])}
                className="text-sm text-slate-600 hover:text-slate-900 transition-all"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>

        {/* Panel de filtros avanzados */}
        <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtros de fecha */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Calendar size={16} className="inline mr-1" />
                Rango de Fechas
              </label>
              
              <div className="space-y-2">
                <Input
                  type="date"
                  label="Fecha Inicio"
                  value={formatDateForInput(dateRange.startDate)}
                  onChange={handleStartDateChange}
                />
                <Input
                  type="date"
                  label="Fecha Fin"
                  value={formatDateForInput(dateRange.endDate)}
                  onChange={handleEndDateChange}
                />
              </div>

              {/* Presets rápidos */}
              <div className="space-y-1">
                <p className="text-xs text-slate-500 mb-2">
                  Rangos predefinidos:
                </p>
                {presetRanges.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => setDateRange(preset.getRange())}
                    className="w-full text-left px-3 py-1.5 rounded-xl text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtro de sedes */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Building2 size={16} className="inline mr-1" />
                Sedes
              </label>
              
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {locations.map((location) => (
                  <label key={location.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedLocationIds.includes(location.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedLocationIds([...selectedLocationIds, location.id]);
                        } else {
                          setSelectedLocationIds(selectedLocationIds.filter((id) => id !== location.id));
                        }
                      }}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700">
                      {location.name}
                    </span>
                  </label>
                ))}
                {locations.length === 0 && (
                  <p className="text-sm text-slate-500">No hay sedes disponibles</p>
                )}
              </div>
              
              {locations.length > 0 && (
                <button
                  onClick={() => setSelectedLocationIds([])}
                  className="text-sm text-blue-600 hover:text-blue-700 transition-all mt-2"
                >
                  Deseleccionar todas
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Resumen de resultados */}
        <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
          <span>
            {selectedLocationIds.length === 0
              ? 'Mostrando todas las sedes'
              : `Mostrando ${selectedLocationIds.length} sede(s) seleccionada(s)`}
          </span>
          {hasActiveFilters && (
            <span>{selectedLocationIds.length} filtro(s) aplicado(s)</span>
          )}
        </div>
      </div>
    </Card>
  );
};

