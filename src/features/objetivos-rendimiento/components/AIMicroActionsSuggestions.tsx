import React, { useState, useEffect } from 'react';
import { Objective, AIMicroActionSuggestion } from '../types';
import { getMicroActionSuggestions, applyMicroActionSuggestion } from '../api/aiSuggestions';
import { Card, Button, Badge, Modal } from '../../../components/componentsreutilizables';
import { Sparkles, CheckCircle2, AlertTriangle, TrendingUp, Calendar, Target, Users, Lightbulb, Layers, Clock, Loader2 } from 'lucide-react';

interface AIMicroActionsSuggestionsProps {
  objective: Objective;
  onSuggestionApplied: () => void;
}

export const AIMicroActionsSuggestions: React.FC<AIMicroActionsSuggestionsProps> = ({
  objective,
  onSuggestionApplied,
}) => {
  const [suggestions, setSuggestions] = useState<AIMicroActionSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState<string | null>(null);

  useEffect(() => {
    loadSuggestions();
  }, [objective.id]);

  const loadSuggestions = async () => {
    // Solo cargar sugerencias si el objetivo está en riesgo
    if (objective.status !== 'at_risk' && objective.progress >= 50) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const data = await getMicroActionSuggestions(objective.id);
      setSuggestions(data);
    } catch (error) {
      console.error('Error loading suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplySuggestion = async (suggestion: AIMicroActionSuggestion) => {
    if (!window.confirm(`¿Aplicar la sugerencia "${suggestion.title}"?`)) {
      return;
    }

    setApplyingId(suggestion.id);
    try {
      await applyMicroActionSuggestion(objective.id, suggestion.id, 'user');
      await loadSuggestions();
      onSuggestionApplied();
    } catch (error) {
      console.error('Error applying suggestion:', error);
      alert('Error al aplicar la sugerencia');
    } finally {
      setApplyingId(null);
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'adjust_target':
        return <Target className="w-5 h-5" />;
      case 'extend_deadline':
        return <Calendar className="w-5 h-5" />;
      case 'increase_resources':
        return <TrendingUp className="w-5 h-5" />;
      case 'change_strategy':
        return <Lightbulb className="w-5 h-5" />;
      case 'add_checkpoint':
        return <Clock className="w-5 h-5" />;
      case 'break_down':
        return <Layers className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'yellow';
      case 'low':
        return 'blue';
      default:
        return 'blue';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'green';
      case 'medium':
        return 'yellow';
      case 'low':
        return 'blue';
      default:
        return 'blue';
    }
  };

  if (loading) {
    return (
      <Card className="p-6 bg-white shadow-sm">
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Generando sugerencias de IA...</span>
        </div>
      </Card>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Sugerencias de IA para Reencarrilar el Objetivo
        </h3>
        <Badge variant="purple">{suggestions.length}</Badge>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        La IA ha analizado el progreso de este objetivo y sugiere las siguientes micro-acciones para
        reencarrilarlo rápidamente:
      </p>

      <div className="space-y-3">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className="p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-300 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                  {getActionIcon(suggestion.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{suggestion.title}</h4>
                    <Badge variant={getPriorityColor(suggestion.priority)}>
                      {suggestion.priority === 'high' ? 'Alta' : suggestion.priority === 'medium' ? 'Media' : 'Baja'}
                    </Badge>
                    <Badge variant={getImpactColor(suggestion.estimatedImpact)}>
                      Impacto: {suggestion.estimatedImpact === 'high' ? 'Alto' : suggestion.estimatedImpact === 'medium' ? 'Medio' : 'Bajo'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Confianza: {suggestion.confidence}%</span>
                    {suggestion.suggestedValues && (
                      <button
                        onClick={() => setShowDetails(showDetails === suggestion.id ? null : suggestion.id)}
                        className="text-purple-600 hover:text-purple-700 font-medium"
                      >
                        {showDetails === suggestion.id ? 'Ocultar detalles' : 'Ver detalles'}
                      </button>
                    )}
                  </div>
                  {showDetails === suggestion.id && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>Razonamiento de IA:</strong>
                      </p>
                      <p className="text-sm text-gray-600 mb-3">{suggestion.rationale}</p>
                      {suggestion.suggestedValues && (
                        <div className="text-sm text-gray-600">
                          <strong>Valores sugeridos:</strong>
                          <ul className="list-disc list-inside mt-1 space-y-1">
                            {suggestion.suggestedValues.newTargetValue && (
                              <li>
                                Nuevo valor objetivo: {suggestion.suggestedValues.newTargetValue} {objective.unit}
                              </li>
                            )}
                            {suggestion.suggestedValues.newDeadline && (
                              <li>
                                Nueva fecha límite:{' '}
                                {new Date(suggestion.suggestedValues.newDeadline).toLocaleDateString('es-ES')}
                              </li>
                            )}
                            {suggestion.suggestedValues.resourceIncrease && (
                              <li>Aumento de recursos: {suggestion.suggestedValues.resourceIncrease}%</li>
                            )}
                            {suggestion.suggestedValues.checkpointDate && (
                              <li>
                                Fecha de checkpoint:{' '}
                                {new Date(suggestion.suggestedValues.checkpointDate).toLocaleDateString('es-ES')}
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleApplySuggestion(suggestion)}
                disabled={applyingId === suggestion.id}
              >
                {applyingId === suggestion.id ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Aplicando...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Aplicar
                  </>
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-blue-600 mt-0.5" />
          <p className="text-xs text-blue-700">
            <strong>Nota:</strong> Estas sugerencias son generadas automáticamente por IA basándose en el
            análisis del progreso del objetivo. Revisa cada sugerencia antes de aplicarla.
          </p>
        </div>
      </div>
    </Card>
  );
};

