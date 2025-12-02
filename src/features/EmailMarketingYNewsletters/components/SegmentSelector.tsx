import React, { useState } from 'react';
import { EmailSegment } from '../api/campaigns';
import { Users, Plus, Search, X } from 'lucide-react';

interface SegmentSelectorProps {
  segments: EmailSegment[];
  selectedSegmentId: string | null;
  onSegmentSelect: (segmentId: string) => void;
  onCreateNew?: () => void;
}

/**
 * Componente de UI que permite seleccionar una lista o segmento de contactos existente,
 * o crear uno nuevo basado en reglas dinámicas.
 */
export const SegmentSelector: React.FC<SegmentSelectorProps> = ({
  segments,
  selectedSegmentId,
  onSegmentSelect,
  onCreateNew
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredSegments = segments.filter(segment =>
    segment.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-slate-700">
          Seleccionar Audiencia
        </label>
        {onCreateNew && (
          <button
            onClick={onCreateNew}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded transition"
          >
            <Plus className="w-4 h-4" />
            Crear Nuevo Segmento
          </button>
        )}
      </div>

      {/* Búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar segmento..."
          className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Lista de segmentos */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {filteredSegments.length > 0 ? (
          filteredSegments.map((segment) => (
            <button
              key={segment.id}
              onClick={() => onSegmentSelect(segment.id)}
              className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                selectedSegmentId === segment.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3 flex-1 text-left">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{segment.name}</h4>
                  {segment.description && (
                    <p className="text-sm text-gray-600 truncate">{segment.description}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {segment.contactCount} {segment.contactCount === 1 ? 'contacto' : 'contactos'}
                  </p>
                </div>
              </div>
              {selectedSegmentId === segment.id && (
                <div className="ml-3 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
              )}
            </button>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>No se encontraron segmentos</p>
          </div>
        )}
      </div>
    </div>
  );
};


