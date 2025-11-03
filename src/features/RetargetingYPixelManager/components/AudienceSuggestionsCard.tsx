import React from 'react';
import { AudienceSuggestion } from '../api/pixels';
import { Lightbulb, ExternalLink } from 'lucide-react';

interface AudienceSuggestionsCardProps {
  suggestions: AudienceSuggestion[];
}

export const AudienceSuggestionsCard: React.FC<AudienceSuggestionsCardProps> = ({ suggestions }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Lightbulb className="w-5 h-5 text-yellow-600" />
        <h3 className="text-xl font-bold text-gray-900">Audiencias Sugeridas</h3>
      </div>

      {suggestions.length === 0 ? (
        <p className="text-gray-600 text-center py-8">No hay sugerencias disponibles</p>
      ) : (
        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <div key={suggestion.id} className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-gray-900 mb-2">{suggestion.name}</h4>
              <p className="text-sm text-gray-600 mb-4">{suggestion.description}</p>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm">
                Crear Audiencia
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

