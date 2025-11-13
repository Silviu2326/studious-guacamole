import { useState, useCallback } from 'react';
import { Sparkles, X, Check, ArrowRight, Target, TrendingUp, Clock, Zap } from 'lucide-react';
import { Button, Card, Badge } from '../../../components/componentsreutilizables';
import { fetchRecommendedFunnels } from '../api';
import {
  TrainerSpecialty,
  TrainerObjective,
  FunnelRecommendationRequest,
  FunnelRecommendationResponse,
  RecommendedFunnel,
} from '../types';

interface RecommendedFunnelsGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFunnel?: (funnel: RecommendedFunnel) => void;
}

const specialtyOptions: { value: TrainerSpecialty; label: string }[] = [
  { value: 'fuerza', label: 'Fuerza' },
  { value: 'hiit', label: 'HIIT' },
  { value: 'yoga', label: 'Yoga' },
  { value: 'pilates', label: 'Pilates' },
  { value: 'crossfit', label: 'CrossFit' },
  { value: 'nutricion', label: 'Nutrición' },
  { value: 'rehabilitacion', label: 'Rehabilitación' },
  { value: 'perdida_peso', label: 'Pérdida de Peso' },
  { value: 'ganancia_muscular', label: 'Ganancia Muscular' },
  { value: 'running', label: 'Running' },
  { value: 'funcional', label: 'Funcional' },
  { value: 'calistenia', label: 'Calistenia' },
  { value: 'boxeo', label: 'Boxeo' },
  { value: 'natacion', label: 'Natación' },
  { value: 'otro', label: 'Otro' },
];

const objectiveOptions: { value: TrainerObjective; label: string }[] = [
  { value: 'captar_leads', label: 'Captar más leads' },
  { value: 'aumentar_ventas', label: 'Aumentar ventas' },
  { value: 'fidelizar_clientes', label: 'Fidelizar clientes' },
  { value: 'lanzar_nuevo_servicio', label: 'Lanzar nuevo servicio' },
  { value: 'aumentar_valor_ticket', label: 'Aumentar valor del ticket' },
  { value: 'mejorar_conversion', label: 'Mejorar conversión' },
  { value: 'expandir_audiencia', label: 'Expandir audiencia' },
  { value: 'posicionamiento_marca', label: 'Posicionamiento de marca' },
];

const difficultyColors = {
  principiante: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-200',
  intermedio: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200',
  avanzado: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-200',
};

export function RecommendedFunnelsGenerator({
  isOpen,
  onClose,
  onSelectFunnel,
}: RecommendedFunnelsGeneratorProps) {
  const [selectedSpecialties, setSelectedSpecialties] = useState<TrainerSpecialty[]>([]);
  const [selectedObjectives, setSelectedObjectives] = useState<TrainerObjective[]>([]);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<FunnelRecommendationResponse | null>(null);
  const [step, setStep] = useState<'selection' | 'results'>('selection');

  const toggleSpecialty = useCallback((specialty: TrainerSpecialty) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialty) ? prev.filter((s) => s !== specialty) : [...prev, specialty],
    );
  }, []);

  const toggleObjective = useCallback((objective: TrainerObjective) => {
    setSelectedObjectives((prev) =>
      prev.includes(objective) ? prev.filter((o) => o !== objective) : [...prev, objective],
    );
  }, []);

  const handleGenerate = useCallback(async () => {
    if (selectedSpecialties.length === 0 || selectedObjectives.length === 0) {
      return;
    }

    setLoading(true);
    try {
      const request: FunnelRecommendationRequest = {
        specialties: selectedSpecialties,
        objectives: selectedObjectives,
      };
      const response = await fetchRecommendedFunnels(request);
      setRecommendations(response);
      setStep('results');
    } catch (error) {
      console.error('Error generando recomendaciones:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedSpecialties, selectedObjectives]);

  const handleSelectFunnel = useCallback(
    (funnel: RecommendedFunnel) => {
      if (onSelectFunnel) {
        onSelectFunnel(funnel);
      }
      onClose();
    },
    [onSelectFunnel, onClose],
  );

  const handleReset = useCallback(() => {
    setSelectedSpecialties([]);
    setSelectedObjectives([]);
    setRecommendations(null);
    setStep('selection');
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-200/60 bg-white shadow-2xl dark:border-slate-800/60 dark:bg-slate-900">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200/60 bg-white/95 px-6 py-4 backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/95">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-indigo-100 to-pink-200 p-2 dark:from-indigo-900/40 dark:to-pink-900/30">
              <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
                Generar Funnels Recomendados
              </h2>
              <p className="text-sm text-gray-600 dark:text-slate-400">
                {step === 'selection'
                  ? 'Selecciona tu especialidad y objetivos para generar funnels personalizados'
                  : 'Revisa los funnels recomendados para tu perfil'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {step === 'selection' ? (
            <div className="space-y-8">
              <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-slate-100">
                  ¿Cuál es tu especialidad?
                </h3>
                <div className="flex flex-wrap gap-2">
                  {specialtyOptions.map((option) => {
                    const isSelected = selectedSpecialties.includes(option.value);
                    return (
                      <button
                        key={option.value}
                        onClick={() => toggleSpecialty(option.value)}
                        className={[
                          'rounded-lg border px-4 py-2 text-sm font-medium transition-all',
                          isSelected
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm dark:border-indigo-400 dark:bg-indigo-500/20 dark:text-indigo-200'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:bg-indigo-50/50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:bg-indigo-500/10',
                        ].join(' ')}
                      >
                        {isSelected && <Check className="mr-1 inline h-4 w-4" />}
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-slate-100">
                  ¿Cuáles son tus objetivos?
                </h3>
                <div className="flex flex-wrap gap-2">
                  {objectiveOptions.map((option) => {
                    const isSelected = selectedObjectives.includes(option.value);
                    return (
                      <button
                        key={option.value}
                        onClick={() => toggleObjective(option.value)}
                        className={[
                          'rounded-lg border px-4 py-2 text-sm font-medium transition-all',
                          isSelected
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm dark:border-indigo-400 dark:bg-indigo-500/20 dark:text-indigo-200'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:bg-indigo-50/50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:bg-indigo-500/10',
                        ].join(' ')}
                      >
                        {isSelected && <Check className="mr-1 inline h-4 w-4" />}
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                <Button variant="ghost" onClick={onClose}>
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  onClick={handleGenerate}
                  disabled={selectedSpecialties.length === 0 || selectedObjectives.length === 0 || loading}
                  className="inline-flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Sparkles className="h-4 w-4 animate-spin" />
                      Generando...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generar Funnels Recomendados
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {recommendations && (
                <>
                  <div className="rounded-xl border border-indigo-200/70 bg-indigo-50/50 p-4 dark:border-indigo-500/40 dark:bg-indigo-500/10">
                    <p className="text-sm text-indigo-800 dark:text-indigo-200">
                      {recommendations.personalizedMessage}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {recommendations.recommendedFunnels.map((funnel) => (
                      <Card
                        key={funnel.id}
                        className="border border-gray-200/60 bg-white p-6 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/60"
                      >
                        <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                                {funnel.name}
                              </h3>
                              <Badge
                                size="sm"
                                className={difficultyColors[funnel.difficulty]}
                              >
                                {funnel.difficulty}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-slate-400">
                              {funnel.description}
                            </p>
                          </div>
                        </div>

                        <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Target className="h-4 w-4 text-indigo-500" />
                            <span className="text-gray-600 dark:text-slate-400">
                              {funnel.estimatedConversion}% conv.
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <TrendingUp className="h-4 w-4 text-emerald-500" />
                            <span className="text-gray-600 dark:text-slate-400">
                              €{funnel.estimatedRevenue.toLocaleString('es-ES')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-amber-500" />
                            <span className="text-gray-600 dark:text-slate-400">
                              {funnel.timeToLaunch}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Zap className="h-4 w-4 text-purple-500" />
                            <span className="text-gray-600 dark:text-slate-400">
                              {funnel.stages.length} etapas
                            </span>
                          </div>
                        </div>

                        <div className="mb-4 flex flex-wrap gap-2">
                          {funnel.tags.map((tag) => (
                            <Badge key={tag} size="sm" variant="blue">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="mb-4 rounded-lg border border-gray-200/60 bg-gray-50/50 p-4 dark:border-slate-800/60 dark:bg-slate-900/40">
                          <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-slate-100">
                            Etapas del Funnel:
                          </h4>
                          <div className="space-y-2">
                            {funnel.stages.map((stage) => (
                              <div
                                key={stage.id}
                                className="flex items-start gap-3 rounded-lg border border-gray-200/60 bg-white p-3 dark:border-slate-800/60 dark:bg-slate-800/60"
                              >
                                <div className="flex-shrink-0 rounded-full bg-indigo-100 px-2 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200">
                                  {stage.order}
                                </div>
                                <div className="flex-1">
                                  <div className="mb-1 flex items-center gap-2">
                                    <span className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                                      {stage.title}
                                    </span>
                                    <Badge size="sm" variant="purple">
                                      {stage.stageType}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-gray-600 dark:text-slate-400">
                                    {stage.description}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-3">
                          <Button variant="ghost" size="sm">
                            Ver detalles
                          </Button>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleSelectFunnel(funnel)}
                            className="inline-flex items-center gap-2"
                          >
                            Usar este funnel
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {recommendations.nextSteps && recommendations.nextSteps.length > 0 && (
                    <div className="rounded-xl border border-gray-200/60 bg-gray-50/50 p-4 dark:border-slate-800/60 dark:bg-slate-900/40">
                      <h4 className="mb-3 text-sm font-semibold text-gray-900 dark:text-slate-100">
                        Próximos pasos:
                      </h4>
                      <ul className="space-y-2">
                        {recommendations.nextSteps.map((step, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-slate-400">
                            <span className="mt-0.5 flex-shrink-0 rounded-full bg-indigo-100 px-1.5 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200">
                              {index + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-3">
                    <Button variant="ghost" onClick={handleReset}>
                      Generar otros funnels
                    </Button>
                    <Button variant="secondary" onClick={onClose}>
                      Cerrar
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

