import React from 'react';
import { Location } from '../types';
import { Building2 } from 'lucide-react';

interface MultiLocationSelectorProps {
  locations: Location[];
  selectedIds: string[];
  onSelectionChange: (selectedIds: string[]) => void;
}

export const MultiLocationSelector: React.FC<MultiLocationSelectorProps> = ({
  locations,
  selectedIds,
  onSelectionChange,
}) => {
  const handleToggleLocation = (locationId: string) => {
    if (selectedIds.includes(locationId)) {
      onSelectionChange(selectedIds.filter((id) => id !== locationId));
    } else {
      onSelectionChange([...selectedIds, locationId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === locations.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(locations.map((loc) => loc.id));
    }
  };

  return (
    <div className="bg-white rounded-xl ring-1 ring-slate-200 p-4">
      <div className="mb-4 flex items-center justify-between">
        <label className="block text-sm font-medium text-slate-700">
          <Building2 size={16} className="inline mr-1" />
          Seleccionar Sedes
        </label>
        <button
          onClick={handleSelectAll}
          className="text-sm text-slate-600 hover:text-blue-600 transition-all"
        >
          {selectedIds.length === locations.length ? 'Deseleccionar todas' : 'Seleccionar todas'}
        </button>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {locations.length === 0 ? (
          <p className="text-sm text-slate-600 text-center py-4">
            No hay sedes disponibles
          </p>
        ) : (
          locations.map((location) => (
            <label
              key={location.id}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                selectedIds.includes(location.id)
                  ? 'bg-blue-50 border border-blue-200'
                  : 'hover:bg-slate-50 border border-transparent hover:border-slate-200'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(location.id)}
                onChange={() => handleToggleLocation(location.id)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-sm font-medium text-slate-900 flex-1">
                {location.name}
              </span>
            </label>
          ))
        )}
      </div>

      {selectedIds.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <p className="text-sm text-slate-600">
            {selectedIds.length} {selectedIds.length === 1 ? 'sede seleccionada' : 'sedes seleccionadas'}
          </p>
        </div>
      )}
    </div>
  );
};

