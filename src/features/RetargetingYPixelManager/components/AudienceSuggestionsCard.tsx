import React from 'react';
import { AudienceSuggestion } from '../api/pixels';
import { Card, Button } from '../../../components/componentsreutilizables';
import { Lightbulb, ExternalLink } from 'lucide-react';

interface AudienceSuggestionsCardProps {
  suggestions: AudienceSuggestion[];
}

export const AudienceSuggestionsCard: React.FC<AudienceSuggestionsCardProps> = ({ suggestions }) => {
  return (
    <Card className="bg-white shadow-sm p-4">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb size={18} className="text-yellow-600" />
        <h3 className="text-lg font-semibold text-gray-900">Audiencias Sugeridas</h3>
      </div>

      {suggestions.length === 0 ? (
        <p className="text-gray-600 text-center py-8">No hay sugerencias disponibles</p>
      ) : (
        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <div key={suggestion.id} className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 ring-1 ring-blue-200/70">
              <h4 className="font-semibold text-gray-900 mb-2">{suggestion.name}</h4>
              <p className="text-sm text-gray-600 mb-4">{suggestion.description}</p>
              <Button variant="primary" size="sm" leftIcon={<ExternalLink size={16} />}>
                Crear Audiencia
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

