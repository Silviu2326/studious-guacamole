import React, { useState, useEffect } from 'react';
import { SuccessPatternExtended, ReplicationRecommendation, Objective } from '../types';
import { identifySuccessPatterns, generateReplicationRecommendations, applyReplicationRecommendation, getReplicationRecommendations } from '../api/successPatterns';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import { Sparkles, TrendingUp, Clock, Target, CheckCircle2, Zap, ArrowRight, Loader2, RefreshCw, Lightbulb, Calendar, Users } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

interface SuccessPatternsViewProps {
  objective?: Objective;
  onRecommendationApplied?: () => void;
}

export const SuccessPatternsView: React.FC<SuccessPatternsViewProps> = ({ objective, onRecommendationApplied }) => {
  const { user } = useAuth();
  const [patterns, setPatterns] = useState<SuccessPatternExtended[]>([]);
  const [recommendations, setRecommendations] = useState<ReplicationRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    loadData();
  }, [objective?.id]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [patternsData, recommendationsData] = await Promise.all([
        identifySuccessPatterns(),
        getReplicationRecommendations(objective?.id),
      ]);
      setPatterns(patternsData);
      setRecommendations(recommendationsData);
    } catch (error) {
      console.error('Error loading success patterns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const newRecommendations = await generateReplicationRecommendations(objective?.id);
      setRecommendations(newRecommendations);
      await loadData();
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleApplyRecommendation = async (recommendationId: string) => {
    if (!user?.id) return;
    
    try {
      await applyReplicationRecommendation(recommendationId, user.id);
      await loadData();
      if (onRecommendationApplied) {
        onRecommendationApplied();
      }
    } catch (error) {
      console.error('Error applying recommendation:', error);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Patrones de Éxito</h2>
          <p className="text-gray-600 mt-1">
            Identifica patrones exitosos y replica estrategias efectivas
          </p>
        </div>
        <Button onClick={handleAnalyze} disabled={analyzing}>
          {analyzing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Analizando...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Analizar Patrones
            </>
          )}
        </Button>
      </div>

      {/* Recomendaciones de Replicación */}
      {recommendations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
            Recomendaciones de IA
          </h3>
          <div className="space-y-4">
            {recommendations.map((recommendation) => (
              <Card key={recommendation.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">{recommendation.title}</h4>
                      <Badge variant="blue">{recommendation.recommendationType.replace('_', ' ')}</Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{recommendation.description}</p>
                    <div className="bg-blue-50 rounded-lg p-3 mb-3">
                      <p className="text-sm text-gray-700">
                        <strong>Razón:</strong> {recommendation.rationale}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Elementos a Replicar */}
                {recommendation.elementsToReplicate && (
                  <div className="border-t pt-4 mb-4">
                    <h5 className="font-semibold text-gray-900 mb-3">Elementos a Replicar:</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {recommendation.elementsToReplicate.timeline && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="h-4 w-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-900">Timeline Sugerido</span>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div>Inicio: {new Date(recommendation.elementsToReplicate.timeline.suggestedStartDate).toLocaleDateString()}</div>
                            <div>Fin: {new Date(recommendation.elementsToReplicate.timeline.suggestedDeadline).toLocaleDateString()}</div>
                            <div>Duración: {recommendation.elementsToReplicate.timeline.estimatedDays} días</div>
                          </div>
                        </div>
                      )}
                      {recommendation.elementsToReplicate.strategy && recommendation.elementsToReplicate.strategy.length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="h-4 w-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-900">Estrategias Clave</span>
                          </div>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {recommendation.elementsToReplicate.strategy.slice(0, 3).map((strategy, idx) => (
                              <li key={idx} className="flex items-start">
                                <CheckCircle2 className="h-3 w-3 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                                <span>{strategy}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Impacto Esperado */}
                <div className="border-t pt-4 mb-4">
                  <h5 className="font-semibold text-gray-900 mb-3">Impacto Esperado:</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <span className="text-xs text-gray-600">Probabilidad de Éxito</span>
                      <p className="text-lg font-semibold text-gray-900">
                        {recommendation.expectedImpact.successProbability.toFixed(0)}%
                      </p>
                    </div>
                    {recommendation.expectedImpact.estimatedTimeReduction !== undefined && (
                      <div>
                        <span className="text-xs text-gray-600">Reducción de Tiempo</span>
                        <p className="text-lg font-semibold text-green-600">
                          {recommendation.expectedImpact.estimatedTimeReduction.toFixed(0)}%
                        </p>
                      </div>
                    )}
                    {recommendation.expectedImpact.estimatedEffectiveness !== undefined && (
                      <div>
                        <span className="text-xs text-gray-600">Efectividad</span>
                        <p className="text-lg font-semibold text-blue-600">
                          {recommendation.expectedImpact.estimatedEffectiveness.toFixed(0)}%
                        </p>
                      </div>
                    )}
                    <div>
                      <span className="text-xs text-gray-600">Confianza</span>
                      <p className="text-lg font-semibold text-gray-900">
                        {recommendation.expectedImpact.confidence.toFixed(0)}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Basado en */}
                <div className="border-t pt-4 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      Basado en <strong>{recommendation.basedOn.patternOccurrences}</strong> objetivos exitosos
                    </span>
                    <Badge variant="green">
                      {recommendation.basedOn.averageSuccessRate.toFixed(0)}% tasa de éxito
                    </Badge>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleApplyRecommendation(recommendation.id)}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Aplicar Recomendación
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Patrones de Éxito Identificados */}
      {patterns.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
            Patrones Identificados
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {patterns.map((pattern) => (
              <Card key={pattern.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{pattern.category}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {pattern.occurrenceCount} objetivos exitosos
                    </p>
                  </div>
                  <Badge variant="green">
                    {pattern.successRate?.toFixed(0)}% éxito
                  </Badge>
                </div>

                {/* Tiempo de Logro */}
                {pattern.timeToAchievement && (
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="font-semibold text-gray-900">Tiempo de Logro</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <span className="text-xs text-gray-600">Promedio</span>
                        <p className="text-lg font-semibold text-gray-900">
                          {pattern.timeToAchievement.averageDays} días
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-600">Más Rápido</span>
                        <p className="text-lg font-semibold text-green-600">
                          {pattern.timeToAchievement.fastestDays} días
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-600">Eficiencia</span>
                        <p className="text-lg font-semibold text-blue-600">
                          {pattern.timeToAchievement.timeEfficiency}%
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Planes Más Efectivos */}
                {pattern.effectivePlans && pattern.effectivePlans.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Target className="h-4 w-4 mr-2" />
                      Planes Más Efectivos
                    </h5>
                    <div className="space-y-2">
                      {pattern.effectivePlans.slice(0, 3).map((plan) => (
                        <div key={plan.planId} className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-900">{plan.planName}</span>
                            <Badge variant="blue">{plan.effectivenessScore}% efectivo</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-600">
                            <span>{plan.averageTimeToComplete} días promedio</span>
                            <span>{plan.successRate.toFixed(0)}% éxito</span>
                            <span>{plan.usageCount} usos</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Factores de Aceleración */}
                {pattern.accelerationFactors && pattern.accelerationFactors.length > 0 && (
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Zap className="h-4 w-4 mr-2" />
                      Factores de Aceleración
                    </h5>
                    <div className="space-y-2">
                      {pattern.accelerationFactors.slice(0, 3).map((factor, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                          <div>
                            <span className="text-sm font-medium text-gray-900">{factor.factor}</span>
                            <p className="text-xs text-gray-600">{factor.description}</p>
                          </div>
                          <Badge variant={factor.impact === 'high' ? 'green' : factor.impact === 'medium' ? 'yellow' : 'gray'}>
                            {factor.frequency}%
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recomendaciones */}
                {pattern.recommendations && pattern.recommendations.length > 0 && (
                  <div className="border-t pt-4 mt-4">
                    <h5 className="font-semibold text-gray-900 mb-2">Recomendaciones:</h5>
                    <ul className="space-y-1">
                      {pattern.recommendations.slice(0, 2).map((rec, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start">
                          <ArrowRight className="h-3 w-3 mr-2 mt-1 text-blue-600 flex-shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Estado vacío */}
      {patterns.length === 0 && recommendations.length === 0 && (
        <Card className="p-6">
          <div className="text-center py-8">
            <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay patrones identificados
            </h3>
            <p className="text-gray-600 mb-4">
              Analiza los objetivos exitosos para identificar patrones y generar recomendaciones.
            </p>
            <Button onClick={handleAnalyze} disabled={analyzing}>
              {analyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Analizando...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Analizar Patrones
                </>
              )}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

