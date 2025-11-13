import React, { useState, useEffect } from 'react';
import { AIObjectiveAdjustmentSuggestion, Objective } from '../types';
import { generateAdjustmentSuggestions, applyAdjustmentSuggestion } from '../api/objectiveLearning';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import { Sparkles, CheckCircle2, AlertCircle, TrendingUp, Target, Calendar, Lightbulb, Loader2 } from 'lucide-react';

interface AILearningSuggestionsProps {
  objective: Partial<Objective> & { metric: string; category: string; targetValue?: number; deadline?: string };
  onSuggestionApplied?: (suggestion: AIObjectiveAdjustmentSuggestion) => void;
}

export const AILearningSuggestions: React.FC<AILearningSuggestionsProps> = ({
  objective,
  onSuggestionApplied,
}) => {
  const [suggestions, setSuggestions] = useState<AIObjectiveAdjustmentSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (objective.metric && objective.category) {
      loadSuggestions();
    }
  }, [objective.metric, objective.category, objective.targetValue, objective.deadline]);

  const loadSuggestions = async () => {
    setLoading(true);
    try {
      const generated = await generateAdjustmentSuggestions(objective);
      setSuggestions(generated);
    } catch (error) {
      console.error('Error loading suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplySuggestion = async (suggestion: AIObjectiveAdjustmentSuggestion) => {
    try {
      await applyAdjustmentSuggestion(suggestion.id);
      setAppliedSuggestions(new Set([...appliedSuggestions, suggestion.id]));
      if (onSuggestionApplied) {
        onSuggestionApplied(suggestion);
      }
    } catch (error) {
      console.error('Error applying suggestion:', error);
      alert('Error al aplicar la sugerencia');
    }
  };

  const getSuggestionIcon = (type: AIObjectiveAdjustmentSuggestion['type']) => {
    switch (type) {
      case 'target_adjustment':
        return <Target className="w-5 h-5" />;
      case 'deadline_adjustment':
        return <Calendar className="w-5 h-5" />;
      case 'strategy_adjustment':
        return <Lightbulb className="w-5 h-5" />;
      case 'resource_adjustment':
        return <TrendingUp className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const getSuggestionTypeLabel = (type: AIObjectiveAdjustmentSuggestion['type']) => {
    switch (type) {
      case 'target_adjustment':
        return 'Ajuste de Objetivo';
      case 'deadline_adjustment':
        return 'Ajuste de Fecha';
      case 'strategy_adjustment':
        return 'Ajuste de Estrategia';
      case 'resource_adjustment':
        return 'Ajuste de Recursos';
      case 'metric_adjustment':
        return 'Ajuste de Métrica';
      default:
        return 'Sugerencia';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  if (loading) {
    return (
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-l-4 border-l-purple-500">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
          <p className="text-gray-700">Analizando planes anteriores y generando sugerencias...</p>
        </div>
      </Card>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-l-4 border-l-purple-500">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Sugerencias de IA basadas en planes anteriores
        </h3>
        <Badge variant="purple" className="ml-auto">
          {suggestions.length} sugerencia{suggestions.length > 1 ? 's' : ''}
        </Badge>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        La IA ha analizado objetivos anteriores similares (éxitos y fallos) y sugiere los siguientes ajustes para mejorar las probabilidades de éxito:
      </p>

      <div className="space-y-4">
        {suggestions.map((suggestion) => {
          const isApplied = appliedSuggestions.has(suggestion.id) || suggestion.applied;
          
          return (
            <div
              key={suggestion.id}
              className={`border rounded-lg p-4 ${
                isApplied ? 'bg-green-50 border-green-300' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-purple-600">
                    {getSuggestionIcon(suggestion.type)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{suggestion.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {getSuggestionTypeLabel(suggestion.type)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={suggestion.priority === 'high' ? 'red' : suggestion.priority === 'medium' ? 'yellow' : 'blue'}
                    className={getPriorityColor(suggestion.priority)}
                  >
                    {suggestion.priority === 'high' ? 'Alta' : suggestion.priority === 'medium' ? 'Media' : 'Baja'}
                  </Badge>
                  {isApplied && (
                    <Badge variant="green" className="bg-green-100 text-green-700">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Aplicada
                    </Badge>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-700 mb-3">{suggestion.description}</p>

              <div className="bg-blue-50 rounded-lg p-3 mb-3">
                <p className="text-xs font-semibold text-blue-900 mb-1">Razón basada en aprendizaje:</p>
                <p className="text-xs text-blue-800">{suggestion.rationale}</p>
              </div>

              {suggestion.suggestedValues && (
                <div className="mb-3">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Valores sugeridos:</p>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {suggestion.suggestedValues.newTargetValue && (
                      <li className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-purple-600" />
                        Nuevo objetivo: {suggestion.suggestedValues.newTargetValue}
                      </li>
                    )}
                    {suggestion.suggestedValues.newDeadline && (
                      <li className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-purple-600" />
                        Nueva fecha límite: {new Date(suggestion.suggestedValues.newDeadline).toLocaleDateString('es-ES')}
                      </li>
                    )}
                    {suggestion.suggestedValues.newStrategy && (
                      <li className="flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-purple-600" />
                        Estrategia: {suggestion.suggestedValues.newStrategy}
                      </li>
                    )}
                    {suggestion.suggestedValues.resourceRecommendations && (
                      <li className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-purple-600" />
                        Recursos: {suggestion.suggestedValues.resourceRecommendations.join(', ')}
                      </li>
                    )}
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>Confianza: {suggestion.basedOn.confidence}%</span>
                  {suggestion.basedOn.successRate && (
                    <span>Tasa de éxito: {suggestion.basedOn.successRate.toFixed(1)}%</span>
                  )}
                </div>
                {!isApplied && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleApplySuggestion(suggestion)}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Aplicar Sugerencia
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-purple-200">
        <p className="text-xs text-gray-600">
          💡 Estas sugerencias se basan en el análisis de objetivos anteriores similares. La IA aprende de éxitos y fallos para mejorar iterativamente la estrategia.
        </p>
      </div>
    </Card>
  );
};

