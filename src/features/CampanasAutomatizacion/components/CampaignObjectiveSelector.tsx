import React, { useState } from 'react';
import { Badge, Button, Card } from '../../../components/componentsreutilizables';
import { Target, Sparkles, CheckCircle2, ArrowRight, Lightbulb } from 'lucide-react';
import type {
  CampaignObjective,
  CampaignObjectiveConfig,
  CampaignObjectiveSuggestions,
  JourneySuggestion,
  ChannelSuggestion,
} from '../types';

interface CampaignObjectiveSelectorProps {
  onSuggestionsGenerated?: (suggestions: CampaignObjectiveSuggestions) => void;
  className?: string;
}

const objectiveLabels: Record<CampaignObjective, { label: string; description: string; icon: React.ReactNode }> = {
  captar: {
    label: 'Captar',
    description: 'Atraer nuevos clientes y leads',
    icon: <Target className="w-5 h-5" />,
  },
  reactivar: {
    label: 'Reactivar',
    description: 'Recuperar clientes inactivos',
    icon: <Sparkles className="w-5 h-5" />,
  },
  fidelizar: {
    label: 'Fidelizar',
    description: 'Mantener y fortalecer relación con clientes activos',
    icon: <CheckCircle2 className="w-5 h-5" />,
  },
};

export const CampaignObjectiveSelector: React.FC<CampaignObjectiveSelectorProps> = ({
  onSuggestionsGenerated,
  className = '',
}) => {
  const [selectedObjective, setSelectedObjective] = useState<CampaignObjective | null>(null);
  const [config, setConfig] = useState<CampaignObjectiveConfig>({
    objective: 'captar',
    targetAudience: '',
    budget: undefined,
    timeline: undefined,
    additionalContext: '',
  });
  const [suggestions, setSuggestions] = useState<CampaignObjectiveSuggestions | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleObjectiveSelect = (objective: CampaignObjective) => {
    setSelectedObjective(objective);
    setConfig((prev) => ({ ...prev, objective }));
  };

  const handleGenerateSuggestions = async () => {
    if (!selectedObjective) return;

    setIsGenerating(true);
    try {
      // Simulación de generación de sugerencias con IA
      // En producción, esto llamaría a un servicio real
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockSuggestions: CampaignObjectiveSuggestions = generateMockSuggestions(config);
      setSuggestions(mockSuggestions);
      onSuggestionsGenerated?.(mockSuggestions);
    } catch (error) {
      console.error('Error generando sugerencias:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMockSuggestions = (config: CampaignObjectiveConfig): CampaignObjectiveSuggestions => {
    const baseJourneys: JourneySuggestion[] = [];
    const baseChannels: ChannelSuggestion[] = [];

    if (config.objective === 'captar') {
      baseJourneys.push(
        {
          id: 'journey-1',
          name: 'Onboarding de Nuevos Leads',
          description: 'Secuencia de bienvenida para convertir leads en clientes activos',
          objective: 'captar',
          recommendedChannels: ['email', 'whatsapp'],
          estimatedDuration: 14,
          steps: 5,
          expectedConversionRate: 25,
          priority: 'high',
          reasoning: 'Ideal para nuevos leads que necesitan información y motivación para su primera sesión',
        },
        {
          id: 'journey-2',
          name: 'Nurturing Educativo',
          description: 'Educar sobre beneficios del entrenamiento personalizado',
          objective: 'captar',
          recommendedChannels: ['email', 'whatsapp'],
          estimatedDuration: 21,
          steps: 7,
          expectedConversionRate: 18,
          priority: 'medium',
          reasoning: 'Perfecto para leads que necesitan más tiempo para decidir',
        }
      );
      baseChannels.push(
        {
          channel: 'email',
          priority: 'primary',
          reasoning: 'Email es ideal para contenido educativo y seguimiento detallado',
          estimatedReach: 1000,
          estimatedCost: 50,
        },
        {
          channel: 'whatsapp',
          priority: 'primary',
          reasoning: 'WhatsApp tiene alta tasa de apertura y engagement para leads calientes',
          estimatedReach: 500,
          estimatedCost: 100,
        }
      );
    } else if (config.objective === 'reactivar') {
      baseJourneys.push(
        {
          id: 'journey-3',
          name: 'Reactivación Progresiva',
          description: 'Secuencia escalonada para recuperar clientes inactivos',
          objective: 'reactivar',
          recommendedChannels: ['whatsapp', 'email'],
          estimatedDuration: 10,
          steps: 4,
          expectedConversionRate: 30,
          priority: 'high',
          reasoning: 'Enfoque directo y personalizado para clientes que ya conocen tu servicio',
        }
      );
      baseChannels.push(
        {
          channel: 'whatsapp',
          priority: 'primary',
          reasoning: 'WhatsApp es más directo y personal para reactivación',
          estimatedReach: 200,
          estimatedCost: 40,
        },
        {
          channel: 'email',
          priority: 'secondary',
          reasoning: 'Email complementa con ofertas especiales y recordatorios',
          estimatedReach: 200,
          estimatedCost: 20,
        }
      );
    } else if (config.objective === 'fidelizar') {
      baseJourneys.push(
        {
          id: 'journey-4',
          name: 'Programa de Fidelización',
          description: 'Comunicación continua para mantener engagement',
          objective: 'fidelizar',
          recommendedChannels: ['email', 'whatsapp', 'push'],
          estimatedDuration: 30,
          steps: 8,
          expectedConversionRate: 40,
          priority: 'high',
          reasoning: 'Mantiene a los clientes activos con contenido de valor y reconocimiento',
        }
      );
      baseChannels.push(
        {
          channel: 'email',
          priority: 'primary',
          reasoning: 'Email para newsletters y contenido educativo regular',
          estimatedReach: 800,
          estimatedCost: 40,
        },
        {
          channel: 'whatsapp',
          priority: 'secondary',
          reasoning: 'WhatsApp para mensajes personalizados y seguimiento cercano',
          estimatedReach: 400,
          estimatedCost: 80,
        }
      );
    }

    return {
      objective: config.objective,
      recommendedJourneys: baseJourneys,
      recommendedChannels: baseChannels,
      aiInsights: `Basado en tu objetivo de ${config.objective}, te recomendamos estos journeys y canales que han demostrado alta efectividad. Los journeys sugeridos están optimizados para maximizar la conversión y el engagement.`,
      createdAt: new Date().toISOString(),
    };
  };

  const priorityColors = {
    high: 'green',
    medium: 'yellow',
    low: 'gray',
  } as const;

  const channelPriorityColors = {
    primary: 'blue',
    secondary: 'purple',
    optional: 'gray',
  } as const;

  return (
    <Card className={className}>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-200 flex items-center justify-center">
              <Target className="w-5 h-5 text-indigo-600" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Definir Objetivo de Campaña
            </h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Selecciona el objetivo de tu campaña y el sistema sugerirá journeys y canales óptimos
          </p>
        </div>

        {!suggestions ? (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Objetivo de la campaña
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(Object.keys(objectiveLabels) as CampaignObjective[]).map((objective) => {
                    const objData = objectiveLabels[objective];
                    const isSelected = selectedObjective === objective;
                    return (
                      <button
                        key={objective}
                        type="button"
                        onClick={() => handleObjectiveSelect(objective)}
                        className={[
                          'p-4 rounded-xl border-2 text-left transition-all',
                          isSelected
                            ? 'border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-900/20'
                            : 'border-slate-200 hover:border-indigo-300 dark:border-slate-700 dark:hover:border-indigo-500/40',
                        ].join(' ')}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={[
                              'p-2 rounded-lg',
                              isSelected ? 'bg-indigo-100 dark:bg-indigo-900/40' : 'bg-slate-100 dark:bg-slate-800',
                            ].join(' ')}
                          >
                            {objData.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                              {objData.label}
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400">
                              {objData.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedObjective && (
                <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Audiencia objetivo (opcional)
                    </label>
                    <input
                      type="text"
                      value={config.targetAudience || ''}
                      onChange={(e) => setConfig((prev) => ({ ...prev, targetAudience: e.target.value }))}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      placeholder="Ej. Leads calientes, Clientes inactivos 30+ días, Clientes premium"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Presupuesto estimado (EUR)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={config.budget || ''}
                        onChange={(e) =>
                          setConfig((prev) => ({ ...prev, budget: e.target.value ? Number(e.target.value) : undefined }))
                        }
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                        placeholder="Ej. 500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Timeline (días)
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={config.timeline || ''}
                        onChange={(e) =>
                          setConfig((prev) => ({ ...prev, timeline: e.target.value ? Number(e.target.value) : undefined }))
                        }
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                        placeholder="Ej. 30"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Contexto adicional (opcional)
                    </label>
                    <textarea
                      rows={3}
                      value={config.additionalContext || ''}
                      onChange={(e) => setConfig((prev) => ({ ...prev, additionalContext: e.target.value }))}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                      placeholder="Información adicional que ayude a personalizar las sugerencias..."
                    />
                  </div>
                </div>
              )}

              {selectedObjective && (
                <div className="flex justify-end pt-4">
                  <Button
                    variant="primary"
                    onClick={handleGenerateSuggestions}
                    disabled={isGenerating}
                    leftIcon={isGenerating ? undefined : <Sparkles className="w-4 h-4" />}
                  >
                    {isGenerating ? 'Generando sugerencias...' : 'Generar sugerencias con IA'}
                  </Button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Sugerencias generadas
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Objetivo: {objectiveLabels[suggestions.objective].label}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSuggestions(null)}>
                Volver
              </Button>
            </div>

            {suggestions.aiInsights && (
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <p className="text-sm text-blue-900 dark:text-blue-100">{suggestions.aiInsights}</p>
                </div>
              </div>
            )}

            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
                Journeys recomendados
              </h4>
              <div className="space-y-3">
                {suggestions.recommendedJourneys.map((journey) => (
                  <div
                    key={journey.id}
                    className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h5 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                          {journey.name}
                        </h5>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          {journey.description}
                        </p>
                      </div>
                      <Badge variant={priorityColors[journey.priority]}>{journey.priority}</Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400 mb-2">
                      <span>{journey.steps} pasos</span>
                      <span>{journey.estimatedDuration} días</span>
                      <span>Conversión esperada: {journey.expectedConversionRate}%</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {journey.recommendedChannels.map((channel) => (
                        <Badge key={channel} variant="outline">
                          {channel.toUpperCase()}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                      {journey.reasoning}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
                Canales recomendados
              </h4>
              <div className="space-y-2">
                {suggestions.recommendedChannels.map((channel, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-slate-900 dark:text-slate-100">
                          {channel.channel.toUpperCase()}
                        </span>
                        <Badge variant={channelPriorityColors[channel.priority]} size="sm">
                          {channel.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{channel.reasoning}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-slate-500 dark:text-slate-400">
                        <span>Alcance estimado: {channel.estimatedReach}</span>
                        {channel.estimatedCost && <span>Costo: €{channel.estimatedCost}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

