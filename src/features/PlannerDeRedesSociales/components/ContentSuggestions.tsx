import React from 'react';
import { ContentSuggestion } from '../api/social';
import { Card, Button } from '../../../components/componentsreutilizables';
import { Lightbulb, Clock, TrendingUp, Hash, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ContentSuggestionsProps {
  suggestions: ContentSuggestion[];
  onSuggestionAccept?: (suggestion: ContentSuggestion) => void;
}

export const ContentSuggestions: React.FC<ContentSuggestionsProps> = ({
  suggestions,
  onSuggestionAccept
}) => {
  const getPriorityColor = (priority: ContentSuggestion['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: ContentSuggestion['priority']) => {
    switch (priority) {
      case 'high':
        return 'Alta Prioridad';
      case 'medium':
        return 'Prioridad Media';
      case 'low':
        return 'Baja Prioridad';
      default:
        return priority;
    }
  };

  const getTypeIcon = (type: ContentSuggestion['type']) => {
    switch (type) {
      case 'reel':
        return '🎬';
      case 'story':
        return '📱';
      case 'video':
        return '🎥';
      case 'post':
        return '📝';
      default:
        return '📄';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb size={20} className="text-yellow-600" />
          <h3 className="text-lg font-semibold text-gray-900">Sugerencias Inteligentes</h3>
        </div>
        <span className="text-sm text-gray-600">{suggestions.length} sugerencias</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suggestions.map((suggestion) => (
          <Card
            key={suggestion.id}
            className="p-5 bg-white shadow-sm ring-1 ring-gray-200 hover:ring-blue-400 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getTypeIcon(suggestion.type)}</span>
                <div>
                  <h4 className="font-semibold text-gray-900">{suggestion.title}</h4>
                  <p className="text-xs text-gray-600">{suggestion.type.toUpperCase()}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(suggestion.priority)}`}>
                {getPriorityLabel(suggestion.priority)}
              </span>
            </div>

            <p className="text-sm text-gray-700 mb-3">{suggestion.description}</p>

            <div className="bg-gray-50 rounded-lg p-3 mb-3">
              <p className="text-sm text-gray-600 italic">"{suggestion.suggestedContent}"</p>
            </div>

            {suggestion.suggestedHashtags && suggestion.suggestedHashtags.length > 0 && (
              <div className="mb-3">
                <div className="flex items-center gap-1 mb-2">
                  <Hash size={14} className="text-gray-400" />
                  <span className="text-xs font-medium text-gray-700">Hashtags sugeridos</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {suggestion.suggestedHashtags.map((tag, idx) => (
                    <span key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 mb-3 p-2 bg-blue-50 rounded-lg">
              <Clock size={14} className="text-blue-600" />
              <span className="text-xs text-blue-700">
                Mejor momento: {new Date(suggestion.suggestedTime).toLocaleString('es-ES')}
              </span>
            </div>

            <div className="flex items-start gap-2 mb-4 p-2 bg-yellow-50 rounded-lg">
              <AlertCircle size={14} className="text-yellow-600 mt-0.5" />
              <p className="text-xs text-yellow-800">{suggestion.reason}</p>
            </div>

            <Button
              onClick={() => onSuggestionAccept?.(suggestion)}
              variant="secondary"
              size="sm"
              className="w-full"
              leftIcon={<CheckCircle2 size={16} />}
            >
              Usar Sugerencia
            </Button>
          </Card>
        ))}
      </div>

      {suggestions.length === 0 && (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Lightbulb size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay sugerencias</h3>
          <p className="text-gray-600">Las sugerencias aparecerán basadas en tu rendimiento</p>
        </Card>
      )}
    </div>
  );
};

