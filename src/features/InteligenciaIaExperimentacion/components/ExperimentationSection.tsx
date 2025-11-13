import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Badge, Tooltip } from '../../../components/componentsreutilizables';
import { ExperimentRecord, AIExperimentSuggestion } from '../types';
import { FlaskConical, Plus, ActivitySquare, Sparkles, TrendingUp, Clock, Lightbulb, Loader2 } from 'lucide-react';
import { getAIExperimentSuggestionsService, createExperimentFromSuggestionService } from '../services/intelligenceService';
import { useAuth } from '../../../context/AuthContext';

interface ExperimentationSectionProps {
  experiments: ExperimentRecord[];
  trainerId?: string;
  onExperimentCreated?: (experiment: ExperimentRecord) => void;
}

const statusConfig: Record<ExperimentRecord['status'], { label: string; variant: 'success' | 'secondary' | 'yellow' | 'purple' }> = {
  running: { label: 'En ejecución', variant: 'success' },
  planned: { label: 'Planificado', variant: 'yellow' },
  completed: { label: 'Completado', variant: 'purple' },
  paused: { label: 'Pausado', variant: 'secondary' },
};

const impactVariant: Record<AIExperimentSuggestion['estimatedImpact'], 'purple' | 'blue' | 'secondary'> = {
  Alto: 'purple',
  Medio: 'blue',
  Bajo: 'secondary',
};

const effortVariant: Record<AIExperimentSuggestion['estimatedEffort'], 'success' | 'yellow' | 'destructive'> = {
  Bajo: 'success',
  Medio: 'yellow',
  Alto: 'destructive',
};

const experimentTypeLabel: Record<AIExperimentSuggestion['experimentType'], string> = {
  tone: 'Tono',
  content: 'Contenido',
  timing: 'Timing',
  channel: 'Canal',
  audience: 'Audiencia',
  cta: 'CTA',
};

export const ExperimentationSection: React.FC<ExperimentationSectionProps> = ({ 
  experiments, 
  trainerId,
  onExperimentCreated 
}) => {
  const { user } = useAuth();
  const [aiSuggestions, setAiSuggestions] = useState<AIExperimentSuggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [creatingExperiment, setCreatingExperiment] = useState<string | null>(null);

  useEffect(() => {
    loadAISuggestions();
  }, [trainerId]);

  const loadAISuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const response = await getAIExperimentSuggestionsService({
        trainerId: trainerId || user?.id,
        period: '30d',
        limit: 5,
      });
      setAiSuggestions(response.suggestions);
    } catch (error) {
      console.error('Error cargando sugerencias de experimentos:', error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleCreateFromSuggestion = async (suggestion: AIExperimentSuggestion) => {
    setCreatingExperiment(suggestion.id);
    try {
      const response = await createExperimentFromSuggestionService({
        suggestionId: suggestion.id,
        name: suggestion.name,
        primaryMetric: suggestion.primaryMetric,
      });

      if (response.success && response.experiment) {
        if (onExperimentCreated) {
          onExperimentCreated(response.experiment);
        }
        // Remove the suggestion from the list
        setAiSuggestions((prev) => prev.filter((s) => s.id !== suggestion.id));
      }
    } catch (error) {
      console.error('Error creando experimento desde sugerencia:', error);
      alert('Error al crear el experimento');
    } finally {
      setCreatingExperiment(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* User Story 2: AI Experiment Suggestions */}
      {showSuggestions && aiSuggestions.length > 0 && (
        <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">
                  Experimentos Sugeridos por IA
                </h3>
                <p className="text-sm text-slate-600">
                  La IA analizó tus datos y sugiere estos experimentos para aprender qué funciona mejor en tu audiencia.
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSuggestions(false)}
            >
              Ocultar
            </Button>
          </div>

          <div className="space-y-3">
            {aiSuggestions.map((suggestion) => (
              <Card
                key={suggestion.id}
                className="p-4 bg-white border border-slate-200 hover:border-indigo-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="purple" size="sm">
                        {experimentTypeLabel[suggestion.experimentType]}
                      </Badge>
                      <Badge variant={impactVariant[suggestion.estimatedImpact]} size="sm">
                        Impacto: {suggestion.estimatedImpact}
                      </Badge>
                      <Badge variant={effortVariant[suggestion.estimatedEffort]} size="sm">
                        Esfuerzo: {suggestion.estimatedEffort}
                      </Badge>
                      {suggestion.expectedUplift && (
                        <Badge variant="success" size="sm" className="flex items-center gap-1">
                          <TrendingUp size={12} />
                          +{suggestion.expectedUplift}% esperado
                        </Badge>
                      )}
                    </div>
                    <h4 className="font-semibold text-slate-900 mb-1">{suggestion.name}</h4>
                    <p className="text-sm text-slate-600 mb-2">{suggestion.description}</p>
                    <p className="text-xs text-slate-500 mb-3">
                      <strong>Hipótesis:</strong> {suggestion.hypothesis}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {suggestion.variants.map((variant) => (
                        <Tooltip key={variant.id} content={variant.description}>
                          <Badge variant="secondary" size="sm">
                            {variant.name}
                          </Badge>
                        </Tooltip>
                      ))}
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Lightbulb size={14} className="text-indigo-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-slate-600">
                          <strong>Por qué se sugiere:</strong> {suggestion.reasoning}
                        </p>
                      </div>
                      {suggestion.basedOnData && (
                        <div className="mt-2 text-xs text-slate-500">
                          Basado en: {Object.values(suggestion.basedOnData).filter(Boolean).join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleCreateFromSuggestion(suggestion)}
                      disabled={creatingExperiment === suggestion.id || !suggestion.canCreate}
                      leftIcon={
                        creatingExperiment === suggestion.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Plus size={14} />
                        )
                      }
                    >
                      {creatingExperiment === suggestion.id ? 'Creando...' : 'Crear experimento'}
                    </Button>
                    {suggestion.suggestedDuration && (
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock size={12} />
                        {suggestion.suggestedDuration} días
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {loadingSuggestions && (
            <div className="flex items-center justify-center py-4">
              <Loader2 size={20} className="animate-spin text-indigo-600" />
              <span className="ml-2 text-sm text-slate-600">Cargando sugerencias...</span>
            </div>
          )}
        </Card>
      )}

      {/* Existing Experiments */}
      <Card className="p-0 bg-white shadow-sm border border-slate-200/70">
        <div className="p-6 border-b border-slate-200/60">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-rose-100 text-rose-600">
                <FlaskConical size={20} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Test de Estrategias</h2>
                <p className="text-sm text-slate-600">
                  Prueba mensajes y estrategias: envía dos versiones diferentes a tu audiencia y descubre cuál genera más respuestas o conversiones. Compara resultados en tiempo real y activa automáticamente la versión ganadora.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!showSuggestions && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  leftIcon={<Sparkles size={16} />}
                  onClick={() => {
                    setShowSuggestions(true);
                    loadAISuggestions();
                  }}
                >
                  Ver sugerencias IA
                </Button>
              )}
              <Button variant="ghost" size="sm" leftIcon={<ActivitySquare size={16} />}>
                Plantillas de experimentos
              </Button>
              <Button size="sm" leftIcon={<Plus size={16} />}>
                Nuevo experimento
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <Table<ExperimentRecord>
            data={experiments}
            emptyMessage="Aún no tienes experimentos configurados. Crea el primero para empezar a optimizar experiencias."
            columns={[
              {
                key: 'name',
                label: 'Test de Estrategias',
                render: (_, row) => (
                  <div>
                    <p className="font-semibold text-slate-900">{row.name}</p>
                    <p className="text-sm text-slate-500">{row.hypothesis}</p>
                  </div>
                ),
              },
              {
                key: 'primaryMetric',
                label: 'Métrica principal',
              },
              {
                key: 'status',
                label: 'Estado',
                render: (value: ExperimentRecord['status']) => (
                  <Badge variant={statusConfig[value].variant} size="sm">
                    {statusConfig[value].label}
                  </Badge>
                ),
              },
              {
                key: 'uplift',
                label: 'Uplift',
                align: 'right',
                render: (value: ExperimentRecord['uplift']) => (
                  <span className="font-semibold text-slate-900">
                    {value !== null ? `${value}%` : 'Pendiente'}
                  </span>
                ),
              },
            ]}
          />
        </div>
      </Card>
    </div>
  );
};

export default ExperimentationSection;
