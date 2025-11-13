import React, { useState, useEffect } from 'react';
import { AISuggestedObjective, Metric, PerformanceData } from '../types';
import { generateAISuggestedObjectives } from '../api/aiSuggestions';
import { createObjective } from '../api/objectives';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import { Sparkles, TrendingUp, Target, CheckCircle, X, Loader2, Info } from 'lucide-react';

interface AISuggestedObjectivesProps {
  role: 'entrenador' | 'gimnasio';
  currentMetrics: Metric[];
  historicalData?: PerformanceData[];
  onObjectiveCreated?: () => void;
}

export const AISuggestedObjectives: React.FC<AISuggestedObjectivesProps> = ({
  role,
  currentMetrics,
  historicalData,
  onObjectiveCreated,
}) => {
  const [suggestions, setSuggestions] = useState<AISuggestedObjective[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [creatingId, setCreatingId] = useState<string | null>(null);

  const loadSuggestions = async () => {
    setLoading(true);
    try {
      const data = await generateAISuggestedObjectives(role, currentMetrics, historicalData);
      setSuggestions(data);
    } catch (error) {
      console.error('Error loading AI suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentMetrics.length > 0) {
      loadSuggestions();
    }
  }, [role, currentMetrics.length]);

  const handleAcceptSuggestion = async (suggestion: AISuggestedObjective) => {
    setCreatingId(suggestion.id);
    try {
      await createObjective({
        title: suggestion.title,
        description: suggestion.description,
        metric: suggestion.metric,
        targetValue: suggestion.suggestedTargetValue,
        currentValue: suggestion.currentValue,
        unit: suggestion.unit,
        deadline: suggestion.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'not_started',
        category: suggestion.category,
      } as any);
      
      // Remover la sugerencia aceptada
      setSuggestions(suggestions.filter(s => s.id !== suggestion.id));
      
      if (onObjectiveCreated) {
        onObjectiveCreated();
      }
    } catch (error) {
      console.error('Error creating objective from suggestion:', error);
      alert('Error al crear el objetivo');
    } finally {
      setCreatingId(null);
    }
  };

  const handleDismissSuggestion = (id: string) => {
    setSuggestions(suggestions.filter(s => s.id !== id));
  };

  if (loading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Generando sugerencias de IA...</p>
      </Card>
    );
  }

  if (suggestions.length === 0) {
    return (
      <Card className="p-6 bg-white shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Objetivos Sugeridos por IA</h3>
        </div>
        <p className="text-gray-600">No hay sugerencias disponibles en este momento.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Objetivos Sugeridos por IA</h3>
          <Badge variant="purple" className="ml-auto">
            {suggestions.length} sugerencia{suggestions.length !== 1 ? 's' : ''}
          </Badge>
        </div>
        <p className="text-sm text-gray-600">
          Basados en datos históricos y benchmarks del sector para inspirar nuevos desafíos
        </p>
      </Card>

      <div className="space-y-3">
        {suggestions.map((suggestion) => (
          <Card
            key={suggestion.id}
            className="p-5 bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  <h4 className="text-base font-semibold text-gray-900">{suggestion.title}</h4>
                  <Badge
                    variant={suggestion.confidence >= 80 ? 'green' : suggestion.confidence >= 60 ? 'yellow' : 'blue'}
                    className="text-xs"
                  >
                    {suggestion.confidence}% confianza
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>
                
                <div className="flex items-center gap-4 text-sm mb-3">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">Objetivo sugerido:</span>
                    <span className="font-semibold text-gray-900">
                      {suggestion.suggestedTargetValue} {suggestion.unit}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">Valor actual:</span>
                    <span className="font-semibold text-gray-700">
                      {suggestion.currentValue} {suggestion.unit}
                    </span>
                  </div>
                </div>

                {suggestion.basedOn.industryBenchmark && (
                  <div className="flex items-center gap-2 mb-3 p-2 bg-blue-50 rounded-lg">
                    <Info className="w-4 h-4 text-blue-600" />
                    <span className="text-xs text-blue-700">
                      Benchmark del sector: {suggestion.basedOn.industryBenchmark} {suggestion.unit}
                      {suggestion.basedOn.benchmarkSource && ` (${suggestion.basedOn.benchmarkSource})`}
                    </span>
                  </div>
                )}

                <button
                  onClick={() => setExpandedId(expandedId === suggestion.id ? null : suggestion.id)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  {expandedId === suggestion.id ? 'Ocultar' : 'Ver'} explicación de IA
                </button>

                {expandedId === suggestion.id && (
                  <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-700 mb-3">{suggestion.rationale}</p>
                    
                    {suggestion.basedOn.historicalAverage && (
                      <div className="text-xs text-gray-600 mb-2">
                        <strong>Promedio histórico:</strong> {suggestion.basedOn.historicalAverage.toFixed(0)} {suggestion.unit}
                      </div>
                    )}
                    
                    {suggestion.basedOn.trend && (
                      <div className="text-xs text-gray-600 mb-2">
                        <strong>Tendencia:</strong>{' '}
                        {suggestion.basedOn.trend === 'increasing' ? '📈 Creciente' :
                         suggestion.basedOn.trend === 'decreasing' ? '📉 Decreciente' : '➡️ Estable'}
                      </div>
                    )}
                    
                    {suggestion.basedOn.similarPeriods && suggestion.basedOn.similarPeriods.length > 0 && (
                      <div className="text-xs text-gray-600">
                        <strong>Períodos similares:</strong>{' '}
                        {suggestion.basedOn.similarPeriods.map((v, i) => `${v.toFixed(0)} ${suggestion.unit}`).join(', ')}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
              <Button
                variant="primary"
                onClick={() => handleAcceptSuggestion(suggestion)}
                disabled={creatingId === suggestion.id}
                className="flex-1"
              >
                {creatingId === suggestion.id ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Aceptar sugerencia
                  </>
                )}
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleDismissSuggestion(suggestion.id)}
                disabled={creatingId === suggestion.id}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

