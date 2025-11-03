import React, { useState } from 'react';
import { AISuggestion, getSuggestionTypeLabel, getSuggestionTypeColor } from '../api/personalization';
import { Check, X, Clock, User, Zap, Lightbulb, Gift, MessageSquare } from 'lucide-react';

interface AISuggestionCardProps {
  suggestion: AISuggestion;
  onAccept: (suggestionId: string) => void;
  onReject: (suggestionId: string, reason?: string) => void;
}

export const AISuggestionCard: React.FC<AISuggestionCardProps> = ({
  suggestion,
  onAccept,
  onReject
}) => {
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleAccept = async () => {
    setIsProcessingAction(true);
    await onAccept(suggestion.suggestionId);
    setIsProcessingAction(false);
  };

  const handleReject = async () => {
    setIsProcessingAction(true);
    await onReject(suggestion.suggestionId);
    setIsProcessingAction(false);
  };

  const getSuggestionIcon = () => {
    const icons = {
      WORKOUT_ADJUSTMENT: Zap,
      ADAPTIVE_COMMUNICATION: MessageSquare,
      CONTENT_RECOMMENDATION: Lightbulb,
      INTELLIGENT_OFFER: Gift
    };
    return icons[suggestion.type];
  };

  const Icon = getSuggestionIcon();

  return (
    <div className={`bg-white rounded-lg border-2 ${getSuggestionTypeColor(suggestion.type)} p-6 hover:shadow-lg transition`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="p-2 bg-white rounded-lg">
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded text-xs font-medium">
                {getSuggestionTypeLabel(suggestion.type)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-600" />
              <span className="font-semibold text-gray-900">{suggestion.clientName}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <Clock className="w-4 h-4" />
          {new Date(suggestion.createdAt).toLocaleDateString('es-ES')}
        </div>
      </div>

      {/* Suggestion Details */}
      <div className="mb-4">
        <p className="text-sm text-gray-700 mb-2">
          <span className="font-semibold">Sugerencia:</span>{' '}
          {getSuggestionDescription(suggestion)}
        </p>

        {isExpanded && (
          <div className="mt-3 p-3 bg-white rounded border border-gray-200">
            <p className="text-xs font-semibold text-gray-700 mb-2">Justificación de la IA:</p>
            <p className="text-sm text-gray-600">{suggestion.justificationText}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleAccept}
          disabled={isProcessingAction}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
        >
          <Check className="w-4 h-4" />
          Aceptar
        </button>
        <button
          onClick={handleReject}
          disabled={isProcessingAction}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
        >
          <X className="w-4 h-4" />
          Rechazar
        </button>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          {isExpanded ? 'Menos' : 'Más'}
        </button>
      </div>
    </div>
  );
};

const getSuggestionDescription = (suggestion: AISuggestion): string => {
  const { type, data } = suggestion;

  switch (type) {
    case 'WORKOUT_ADJUSTMENT':
      if (data.action === 'INCREASE_WEIGHT' && data.exerciseName) {
        return `Aumentar peso en ${data.exerciseName} de ${data.value} a ${data.newValue}`;
      }
      if (data.action === 'REPLACE_EXERCISE' && data.exerciseName) {
        return `Reemplazar ejercicio: ${data.exerciseName}`;
      }
      return 'Ajustar plan de entrenamiento';
    
    case 'CONTENT_RECOMMENDATION':
      return `Recomendar contenido: ${data.contentTitle || 'Nuevo artículo'}`;
    
    case 'INTELLIGENT_OFFER':
      return `Ofrecer: ${data.offerProduct || 'Producto'} ${data.offerDiscount ? `con ${data.offerDiscount}% descuento` : ''}`;
    
    case 'ADAPTIVE_COMMUNICATION':
      return `Enviar mensaje ${data.messageTone || 'personalizado'}`;
    
    default:
      return 'Nueva sugerencia';
  }
};

