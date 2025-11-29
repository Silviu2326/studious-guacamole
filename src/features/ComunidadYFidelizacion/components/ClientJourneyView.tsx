import { useState } from 'react';
import {
  User,
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
  ShoppingCart,
  Heart,
  Users,
  Award,
  Target,
  ArrowRight,
  Clock,
  MapPin,
  Phone,
  Mail,
  Sparkles,
  Activity,
  Zap,
} from 'lucide-react';
import { Card, Badge, Button } from '../../../components/componentsreutilizables';
import {
  ClientJourney,
  JourneyStage,
  JourneyEvent,
  JourneyRecommendation,
  JourneyStrength,
} from '../types';

interface ClientJourneyViewProps {
  journeys?: ClientJourney[];
  selectedClientId?: string;
  loading?: boolean;
  onSelectClient?: (clientId: string) => void;
  onViewClientDetails?: (clientId: string) => void;
  onExecuteRecommendation?: (recommendationId: string, clientId: string) => void;
}

const STAGE_LABELS: Record<JourneyStage, string> = {
  'first-contact': 'Primer Contacto',
  onboarding: 'Onboarding',
  active: 'Activo',
  community: 'Comunidad',
  loyalty: 'Fidelización',
  'at-risk': 'En Riesgo',
  churned: 'Abandonado',
};

const STAGE_COLORS: Record<JourneyStage, string> = {
  'first-contact': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  onboarding: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  community: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  loyalty: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  'at-risk': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  churned: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

const EVENT_TYPE_ICONS: Record<string, any> = {
  contact: MessageSquare,
  purchase: ShoppingCart,
  session: Activity,
  feedback: MessageSquare,
  referral: Users,
  testimonial: Award,
  milestone: Target,
  interaction: Sparkles,
};

const RECOMMENDATION_TYPE_LABELS: Record<string, string> = {
  upsell: 'Upsell',
  reconnection: 'Reconexión',
  recognition: 'Reconocimiento',
  retention: 'Retención',
  engagement: 'Engagement',
  referral: 'Referido',
};

export function ClientJourneyView({
  journeys = [],
  selectedClientId,
  loading = false,
  onSelectClient,
  onViewClientDetails,
  onExecuteRecommendation,
}: ClientJourneyViewProps) {
  const [selectedJourney, setSelectedJourney] = useState<ClientJourney | null>(
    journeys.find((j) => j.clientId === selectedClientId) || journeys[0] || null
  );

  const handleSelectJourney = (journey: ClientJourney) => {
    setSelectedJourney(journey);
    if (onSelectClient) {
      onSelectClient(journey.clientId);
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 80) return 'text-green-600 dark:text-green-400';
    if (health >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getStrengthColor = (strength: string) => {
    if (strength === 'strong') return 'text-green-600 dark:text-green-400';
    if (strength === 'moderate') return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 border-4 border-indigo-500/40 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      </Card>
    );
  }

  if (journeys.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-12">
          <User className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-slate-400">
            No hay journeys de clientes disponibles.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
              Journey Completo del Cliente
            </h2>
            <p className="text-sm text-gray-600 dark:text-slate-400 mt-1">
              Vista 360° del journey del cliente desde el primer contacto hasta la fidelización
            </p>
          </div>
        </div>

        {/* Selector de cliente */}
        {journeys.length > 1 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
              Seleccionar Cliente
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {journeys.map((journey) => (
                <button
                  key={journey.id}
                  onClick={() => handleSelectJourney(journey)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedJourney?.id === journey.id
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-gray-900 dark:text-slate-100">
                      {journey.clientName}
                    </div>
                    <Badge className={STAGE_COLORS[journey.currentStage]} size="sm">
                      {STAGE_LABELS[journey.currentStage]}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-slate-400">
                    {journey.totalDuration} días como cliente
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className={`text-sm font-semibold ${getHealthColor(journey.analysis.overallHealth)}`}>
                      Salud: {journey.analysis.overallHealth}%
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Journey seleccionado */}
        {selectedJourney && (
          <div className="space-y-6">
            {/* Header del cliente */}
            <div className="p-6 rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                    <User className="w-6 h-6 text-indigo-600 dark:text-indigo-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-slate-100">
                      {selectedJourney.clientName}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <Badge className={STAGE_COLORS[selectedJourney.currentStage]} size="md">
                        {STAGE_LABELS[selectedJourney.currentStage]}
                      </Badge>
                      <span className="text-sm text-gray-600 dark:text-slate-400">
                        Cliente desde {new Date(selectedJourney.firstContactDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getHealthColor(selectedJourney.analysis.overallHealth)}`}>
                    {selectedJourney.analysis.overallHealth}%
                  </div>
                  <div className="text-xs text-gray-600 dark:text-slate-400">Salud del Journey</div>
                </div>
              </div>

              {/* Métricas rápidas */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {selectedJourney.metrics.totalSessions !== undefined && (
                  <div className="p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                    <div className="text-xs text-gray-600 dark:text-slate-400 mb-1">Sesiones</div>
                    <div className="text-lg font-bold text-gray-900 dark:text-slate-100">
                      {selectedJourney.metrics.totalSessions}
                    </div>
                  </div>
                )}
                {selectedJourney.metrics.averageSatisfaction !== undefined && (
                  <div className="p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                    <div className="text-xs text-gray-600 dark:text-slate-400 mb-1">Satisfacción</div>
                    <div className="text-lg font-bold text-gray-900 dark:text-slate-100">
                      {selectedJourney.metrics.averageSatisfaction.toFixed(1)}/5
                    </div>
                  </div>
                )}
                {selectedJourney.metrics.referralsGiven !== undefined && (
                  <div className="p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                    <div className="text-xs text-gray-600 dark:text-slate-400 mb-1">Referidos</div>
                    <div className="text-lg font-bold text-gray-900 dark:text-slate-100">
                      {selectedJourney.metrics.referralsGiven}
                    </div>
                  </div>
                )}
                {selectedJourney.metrics.totalSpent !== undefined && (
                  <div className="p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
                    <div className="text-xs text-gray-600 dark:text-slate-400 mb-1">Total Gastado</div>
                    <div className="text-lg font-bold text-gray-900 dark:text-slate-100">
                      ${selectedJourney.metrics.totalSpent.toLocaleString()}
                    </div>
                  </div>
                )}
              </div>

              {onViewClientDetails && (
                <div className="mt-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onViewClientDetails(selectedJourney.clientId)}
                  >
                    Ver Detalles Completos
                  </Button>
                </div>
              )}
            </div>

            {/* Timeline del Journey */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
                Timeline del Journey
              </h4>
              <div className="space-y-4">
                {selectedJourney.stages.map((stage, index) => {
                  const EventIcon = EVENT_TYPE_ICONS[stage.events[0]?.type] || Activity;
                  return (
                    <div key={stage.stage} className="relative">
                      {/* Línea conectora */}
                      {index < selectedJourney.stages.length - 1 && (
                        <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
                      )}
                      
                      <div className="flex gap-4">
                        {/* Indicador de etapa */}
                        <div className="flex-shrink-0">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${STAGE_COLORS[stage.stage]}`}>
                            <ArrowRight className="w-5 h-5" />
                          </div>
                        </div>

                        {/* Contenido de la etapa */}
                        <div className="flex-1 pb-6">
                          <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <Badge className={STAGE_COLORS[stage.stage]} size="sm">
                                  {STAGE_LABELS[stage.stage]}
                                </Badge>
                                <div className="text-xs text-gray-600 dark:text-slate-400 mt-1">
                                  {new Date(stage.enteredAt).toLocaleDateString()}
                                  {stage.exitedAt && ` - ${new Date(stage.exitedAt).toLocaleDateString()}`}
                                  {stage.duration && ` (${stage.duration} días)`}
                                </div>
                              </div>
                            </div>

                            {/* Eventos */}
                            {stage.events.length > 0 && (
                              <div className="mt-3 space-y-2">
                                <div className="text-xs font-medium text-gray-700 dark:text-slate-300 mb-2">
                                  Eventos ({stage.events.length}):
                                </div>
                                {stage.events.slice(0, 3).map((event) => {
                                  const Icon = EVENT_TYPE_ICONS[event.type] || Activity;
                                  return (
                                    <div
                                      key={event.id}
                                      className="flex items-start gap-2 p-2 rounded bg-white dark:bg-gray-800/50"
                                    >
                                      <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-300 mt-0.5 flex-shrink-0" />
                                      <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-gray-900 dark:text-slate-100">
                                          {event.title}
                                        </div>
                                        <div className="text-xs text-gray-600 dark:text-slate-400">
                                          {event.description}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-slate-500 mt-1">
                                          {new Date(event.date).toLocaleDateString()}
                                          {event.channel && ` • ${event.channel}`}
                                        </div>
                                      </div>
                                      {event.sentiment && (
                                        <Badge
                                          variant={event.sentiment === 'positive' ? 'green' : event.sentiment === 'negative' ? 'destructive' : 'gray'}
                                          size="sm"
                                        >
                                          {event.sentiment === 'positive' ? 'Positivo' : event.sentiment === 'negative' ? 'Negativo' : 'Neutral'}
                                        </Badge>
                                      )}
                                    </div>
                                  );
                                })}
                                {stage.events.length > 3 && (
                                  <div className="text-xs text-gray-500 dark:text-slate-500 text-center py-1">
                                    +{stage.events.length - 3} eventos más
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Puntos fuertes y débiles */}
                            {(stage.strengths.length > 0 || stage.weaknesses.length > 0) && (
                              <div className="mt-3 grid grid-cols-2 gap-3">
                                {stage.strengths.length > 0 && (
                                  <div>
                                    <div className="text-xs font-medium text-green-700 dark:text-green-300 mb-1 flex items-center gap-1">
                                      <TrendingUp className="w-3 h-3" />
                                      Puntos Fuertes
                                    </div>
                                    <ul className="text-xs text-gray-600 dark:text-slate-400 space-y-1">
                                      {stage.strengths.map((strength, idx) => (
                                        <li key={idx} className="flex items-start gap-1">
                                          <span className="text-green-500 mt-0.5">•</span>
                                          <span>{strength}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {stage.weaknesses.length > 0 && (
                                  <div>
                                    <div className="text-xs font-medium text-red-700 dark:text-red-300 mb-1 flex items-center gap-1">
                                      <TrendingDown className="w-3 h-3" />
                                      Puntos Débiles
                                    </div>
                                    <ul className="text-xs text-gray-600 dark:text-slate-400 space-y-1">
                                      {stage.weaknesses.map((weakness, idx) => (
                                        <li key={idx} className="flex items-start gap-1">
                                          <span className="text-red-500 mt-0.5">•</span>
                                          <span>{weakness}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Análisis de Fortalezas y Debilidades */}
            {(selectedJourney.analysis.strengths.length > 0 || selectedJourney.analysis.weaknesses.length > 0) && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
                  Análisis de Fortalezas y Debilidades
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedJourney.analysis.strengths.length > 0 && (
                    <Card className="p-4 border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10">
                      <h5 className="font-semibold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Fortalezas
                      </h5>
                      <div className="space-y-3">
                        {selectedJourney.analysis.strengths.map((strength, idx) => (
                          <div key={idx}>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={STAGE_COLORS[strength.stage]} size="sm">
                                {STAGE_LABELS[strength.stage]}
                              </Badge>
                              <span className={`text-sm font-medium ${getStrengthColor(strength.strength)}`}>
                                {strength.strength === 'strong' ? 'Fuerte' : strength.strength === 'moderate' ? 'Moderado' : 'Débil'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-slate-300">{strength.description}</p>
                            {strength.evidence.length > 0 && (
                              <ul className="text-xs text-gray-600 dark:text-slate-400 mt-1 space-y-0.5">
                                {strength.evidence.map((ev, evIdx) => (
                                  <li key={evIdx} className="flex items-start gap-1">
                                    <span className="text-green-500 mt-0.5">•</span>
                                    <span>{ev}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}

                  {selectedJourney.analysis.weaknesses.length > 0 && (
                    <Card className="p-4 border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10">
                      <h5 className="font-semibold text-red-900 dark:text-red-100 mb-3 flex items-center gap-2">
                        <TrendingDown className="w-4 h-4" />
                        Debilidades
                      </h5>
                      <div className="space-y-3">
                        {selectedJourney.analysis.weaknesses.map((weakness, idx) => (
                          <div key={idx}>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={STAGE_COLORS[weakness.stage]} size="sm">
                                {STAGE_LABELS[weakness.stage]}
                              </Badge>
                              <span className={`text-sm font-medium ${getStrengthColor(weakness.strength)}`}>
                                {weakness.strength === 'strong' ? 'Fuerte' : weakness.strength === 'moderate' ? 'Moderado' : 'Débil'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-slate-300">{weakness.description}</p>
                            {weakness.evidence.length > 0 && (
                              <ul className="text-xs text-gray-600 dark:text-slate-400 mt-1 space-y-0.5">
                                {weakness.evidence.map((ev, evIdx) => (
                                  <li key={evIdx} className="flex items-start gap-1">
                                    <span className="text-red-500 mt-0.5">•</span>
                                    <span>{ev}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            )}

            {/* Recomendaciones IA */}
            {selectedJourney.aiRecommendations.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-500" />
                  Recomendaciones IA
                </h4>
                <div className="space-y-3">
                  {selectedJourney.aiRecommendations.map((recommendation) => (
                    <Card
                      key={recommendation.id}
                      className="p-4 border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-900/10"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="font-semibold text-gray-900 dark:text-slate-100">
                              {recommendation.title}
                            </h5>
                            <Badge
                              variant={recommendation.priority === 'high' ? 'destructive' : recommendation.priority === 'medium' ? 'blue' : 'gray'}
                              size="sm"
                            >
                              {recommendation.priority === 'high' ? 'Alta' : recommendation.priority === 'medium' ? 'Media' : 'Baja'}
                            </Badge>
                            <Badge variant="secondary" size="sm">
                              {RECOMMENDATION_TYPE_LABELS[recommendation.type] || recommendation.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-slate-400 mb-2">
                            {recommendation.description}
                          </p>
                          <div className="text-xs text-gray-500 dark:text-slate-500 mb-2">
                            <span className="font-medium">Razonamiento:</span> {recommendation.reasoning}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-slate-500 mb-2">
                            <span className="font-medium">Impacto esperado:</span> {recommendation.expectedImpact}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-slate-500 mb-2">
                            <span className="font-medium">Timeline sugerido:</span> {recommendation.suggestedTimeline}
                          </div>
                          {recommendation.actionableSteps.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-indigo-200 dark:border-indigo-800">
                              <div className="text-xs font-medium text-gray-700 dark:text-slate-300 mb-2 flex items-center gap-1">
                                <Zap className="w-3 h-3" />
                                Pasos a seguir:
                              </div>
                              <ol className="text-xs text-gray-600 dark:text-slate-400 space-y-1.5">
                                {recommendation.actionableSteps.map((step, idx) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <span className="font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                                      {idx + 1}.
                                    </span>
                                    <span>{step}</span>
                                  </li>
                                ))}
                              </ol>
                            </div>
                          )}
                        </div>
                        <div className="ml-4 text-xs text-gray-500 dark:text-slate-500">
                          {recommendation.confidence}% confianza
                        </div>
                      </div>
                      {onExecuteRecommendation && (
                        <div className="mt-3 pt-3 border-t border-indigo-200 dark:border-indigo-800">
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => onExecuteRecommendation(recommendation.id, selectedJourney.clientId)}
                          >
                            Ejecutar Recomendación
                          </Button>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

