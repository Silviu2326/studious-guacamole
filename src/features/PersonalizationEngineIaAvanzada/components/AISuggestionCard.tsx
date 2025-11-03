import React, { useState } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { AISuggestion, getSuggestionTypeLabel } from '../api/personalization';
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
    <Card variant="hover" className="h-full flex flex-col transition-shadow overflow-hidden p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
            <Icon className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-xl text-xs font-medium text-slate-700">
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
      <div className="mb-4 flex-1">
        <p className="text-sm text-gray-700 mb-2">
          <span className="font-semibold">Sugerencia:</span>{' '}
          {getSuggestionDescription(suggestion)}
        </p>

        {isExpanded && (
          <div className="mt-3 p-3 bg-slate-50 rounded-xl ring-1 ring-slate-200">
            <p className="text-xs font-semibold text-slate-700 mb-2">Justificación de la IA:</p>
            <p className="text-sm text-gray-600">{suggestion.justificationText}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
        <button
          onClick={handleAccept}
          disabled={isProcessingAction}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all disabled:opacity-50 font-medium text-sm"
        >
          <Check className="w-4 h-4" />
          Aceptar
        </button>
        <button
          onClick={handleReject}
          disabled={isProcessingAction}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all disabled:opacity-50 font-medium text-sm"
        >
          <X className="w-4 h-4" />
          Rechazar
        </button>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-4 py-2 border border-slate-300 rounded-xl hover:bg-slate-50 transition-all text-sm font-medium text-slate-700"
        >
          {isExpanded ? 'Menos' : 'Más'}
        </button>
      </div>
    </Card>
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

