import { useState, useEffect } from 'react';
import { Mail, MessageCircle, Phone, Clock, TrendingUp, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { Button, Card, Badge } from '../../../components/componentsreutilizables';
import { FunnelsAdquisicionService } from '../services/funnelsAdquisicionService';
import {
  NurturingRecommendation,
  NurturingRecommendationRequest,
  NurturingStepRecommendation,
  NurturingChannel,
} from '../types';

interface NurturingRecommendationsProps {
  formSubmissionId: string;
  leadMagnetId: string;
  leadId?: string;
  responses: Record<string, any>;
  buyerPersonaId?: string;
  onApplyRecommendations?: (recommendations: NurturingRecommendation) => void;
}

const channelIcons: Record<NurturingChannel, React.ComponentType<{ className?: string }>> = {
  email: Mail,
  whatsapp: MessageCircle,
  sms: MessageCircle,
  phone: Phone,
  dm: MessageCircle,
};

const channelColors: Record<NurturingChannel, string> = {
  email: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200',
  whatsapp: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-200',
  sms: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-200',
  phone: 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-200',
  dm: 'bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-200',
};

const priorityColors: Record<string, string> = {
  high: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-200',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200',
  low: 'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-200',
};

const timingLabels: Record<string, string> = {
  immediate: 'Inmediato',
  '1h': '1 hora',
  '6h': '6 horas',
  '24h': '24 horas',
  '48h': '48 horas',
  '1w': '1 semana',
};

export function NurturingRecommendations({
  formSubmissionId,
  leadMagnetId,
  leadId,
  responses,
  buyerPersonaId,
  onApplyRecommendations,
}: NurturingRecommendationsProps) {
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<NurturingRecommendation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [appliedSteps, setAppliedSteps] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadRecommendations();
  }, [formSubmissionId, leadMagnetId, responses]);

  const loadRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const request: NurturingRecommendationRequest = {
        formSubmissionId,
        leadMagnetId,
        leadId,
        responses,
        buyerPersonaId,
      };
      const result = await FunnelsAdquisicionService.getNurturingRecommendations(request);
      setRecommendation(result);
    } catch (err) {
      console.error('Error cargando recomendaciones:', err);
      setError('Error al cargar recomendaciones de nurturing');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyStep = (step: NurturingStepRecommendation) => {
    setAppliedSteps((prev) => new Set(prev).add(step.id));
    // Aquí se podría integrar con el módulo de Campañas & Automatización
    console.log('Aplicando paso:', step);
  };

  const handleApplyAll = () => {
    if (recommendation && onApplyRecommendations) {
      onApplyRecommendations(recommendation);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 animate-spin text-indigo-500" />
          <p className="text-sm text-gray-600 dark:text-slate-400">
            Generando recomendaciones de nurturing personalizadas...
          </p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 border-red-200 dark:border-red-500/30">
        <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm">{error}</p>
        </div>
      </Card>
    );
  }

  if (!recommendation) {
    return null;
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-indigo-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
              Recomendaciones de Nurturing Personalizadas
            </h3>
          </div>
          {recommendation.personalizedMessage && (
            <p className="text-sm text-gray-600 dark:text-slate-400 mb-3">
              {recommendation.personalizedMessage}
            </p>
          )}
          {recommendation.estimatedConversionLift && (
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                Mejora estimada de conversión: +{recommendation.estimatedConversionLift}%
              </span>
            </div>
          )}
        </div>
        <Button variant="primary" size="sm" onClick={handleApplyAll} className="inline-flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          Aplicar todas
        </Button>
      </div>

      {recommendation.reasoning && (
        <div className="rounded-lg border border-indigo-200 bg-indigo-50/50 p-4 dark:border-indigo-500/30 dark:bg-indigo-500/10">
          <p className="text-sm text-indigo-900 dark:text-indigo-100">{recommendation.reasoning}</p>
        </div>
      )}

      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-slate-300">
          Secuencia de Follow-ups Recomendada
        </h4>
        {recommendation.recommendations.map((step) => {
          const ChannelIcon = channelIcons[step.channel];
          const isApplied = appliedSteps.has(step.id);
          const impactColors: Record<string, string> = {
            high: 'text-emerald-600 dark:text-emerald-400',
            medium: 'text-amber-600 dark:text-amber-400',
            low: 'text-gray-600 dark:text-gray-400',
          };

          return (
            <div
              key={step.id}
              className={`rounded-xl border p-5 transition-all ${
                isApplied
                  ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-500/30 dark:bg-emerald-500/10'
                  : 'border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900/60'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center">
                    <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-300">
                      {step.stepNumber}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h5 className="text-base font-semibold text-gray-900 dark:text-slate-100">{step.title}</h5>
                      {isApplied && (
                        <Badge size="sm" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Aplicado
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge size="sm" className={channelColors[step.channel]}>
                        <ChannelIcon className="h-3 w-3 mr-1" />
                        {step.channel}
                      </Badge>
                      <Badge size="sm" className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                        <Clock className="h-3 w-3 mr-1" />
                        {timingLabels[step.timing] || step.timing}
                      </Badge>
                      <Badge size="sm" className={priorityColors[step.priority]}>
                        Prioridad {step.priority}
                      </Badge>
                      <span className={`text-xs font-medium ${impactColors[step.expectedImpact]}`}>
                        Impacto: {step.expectedImpact}
                      </span>
                    </div>
                  </div>
                </div>
                {!isApplied && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleApplyStep(step)}
                    className="flex-shrink-0"
                  >
                    Aplicar
                  </Button>
                )}
              </div>

              {step.suggestedContent && (
                <div className="mt-4 space-y-3">
                  {step.suggestedContent.subject && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 mb-1">Asunto:</p>
                      <p className="text-sm text-gray-700 dark:text-slate-300">{step.suggestedContent.subject}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 mb-1">Mensaje:</p>
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
                      <p className="text-sm text-gray-700 dark:text-slate-300 whitespace-pre-wrap">
                        {step.suggestedContent.body}
                      </p>
                    </div>
                  </div>
                  {step.suggestedContent.cta && (
                    <div>
                      <Badge size="sm" className="bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200">
                        CTA: {step.suggestedContent.cta}
                      </Badge>
                    </div>
                  )}
                </div>
              )}

              {step.reasoning && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-slate-700">
                  <p className="text-xs text-gray-600 dark:text-slate-400 italic">{step.reasoning}</p>
                </div>
              )}

              {step.personalizationVariables && step.personalizationVariables.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-slate-700">
                  <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 mb-1">
                    Variables de personalización:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {step.personalizationVariables.map((variable) => (
                      <Badge key={variable} size="sm" className="bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-200">
                        {`{{${variable}}}`}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

