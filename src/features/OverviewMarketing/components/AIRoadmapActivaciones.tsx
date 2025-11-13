import React from 'react';
import { Calendar, Target, TrendingUp, Users, DollarSign, Eye, Clock, Sparkles, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { Badge, Card } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { AIRoadmapSnapshot, SuggestedActivation, ActivationType } from '../types';

interface AIRoadmapActivacionesProps {
  roadmap: AIRoadmapSnapshot | null;
  loading?: boolean;
  className?: string;
  onScheduleActivation?: (activation: SuggestedActivation) => void;
  onDismissActivation?: (activationId: string) => void;
}

const activationTypeIcon: Record<ActivationType, React.ReactNode> = {
  reto: <Target className="w-5 h-5" />,
  colaboracion: <Users className="w-5 h-5" />,
  live: <TrendingUp className="w-5 h-5" />,
  webinar: <Users className="w-5 h-5" />,
  workshop: <Target className="w-5 h-5" />,
  challenge: <Target className="w-5 h-5" />,
};

const activationTypeLabel: Record<ActivationType, string> = {
  reto: 'Reto',
  colaboracion: 'Colaboración',
  live: 'Live',
  webinar: 'Webinar',
  workshop: 'Workshop',
  challenge: 'Challenge',
};

const activationTypeColor: Record<ActivationType, string> = {
  reto: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  colaboracion: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  live: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  webinar: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  workshop: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  challenge: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
};

const priorityColor: Record<string, string> = {
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  low: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300',
};

const statusIcon: Record<string, React.ReactNode> = {
  suggested: <Clock className="w-4 h-4" />,
  scheduled: <Calendar className="w-4 h-4" />,
  completed: <CheckCircle2 className="w-4 h-4" />,
  dismissed: <XCircle className="w-4 h-4" />,
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number): string {
  if (value >= 1000) {
    return `${Math.round(value / 100) / 10}K`;
  }
  return value.toString();
}

function getConsistencyScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-600 dark:text-emerald-400';
  if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
}

export const AIRoadmapActivaciones: React.FC<AIRoadmapActivacionesProps> = ({
  roadmap,
  loading = false,
  className = '',
  onScheduleActivation,
  onDismissActivation,
}) => {
  const placeholders = Array.from({ length: 3 }).map((_, index) => (
    <div key={`roadmap-skeleton-${index}`} className={`${ds.shimmer} h-32`} />
  ));

  if (loading && !roadmap) {
    return (
      <Card className={`col-span-2 ${className}`.trim()}>
        <div className="space-y-4">{placeholders}</div>
      </Card>
    );
  }

  if (!roadmap) {
    return (
      <Card className={`col-span-2 ${className}`.trim()}>
        <div className="text-center py-8">
          <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            No hay roadmap de activaciones disponible
          </p>
        </div>
      </Card>
    );
  }

  // Filtrar activaciones por estado
  const suggestedActivations = roadmap.activations.filter(a => a.status === 'suggested');
  const scheduledActivations = roadmap.activations.filter(a => a.status === 'scheduled');
  const completedActivations = roadmap.activations.filter(a => a.status === 'completed');

  return (
    <Card className={`col-span-2 ${className}`.trim()}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-pink-200 dark:from-purple-900/40 dark:to-pink-900/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-300" />
            </span>
            <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Roadmap IA de Activaciones
            </h2>
          </div>
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            Sugerencias de retos, colaboraciones y lives para mantener consistencia en tu estrategia.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="blue" size="sm">
            {roadmap.roadmapPeriod}
          </Badge>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800">
            <Target className="w-4 h-4" />
            <span className={`text-sm font-semibold ${getConsistencyScoreColor(roadmap.consistencyScore)}`}>
              {roadmap.consistencyScore}/100
            </span>
          </div>
        </div>
      </div>

      {/* Score de Consistencia */}
      <div className="mb-6 p-4 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
            <Target className="w-6 h-6 text-purple-600 dark:text-purple-300" />
          </div>
          <div className="flex-1">
            <h3 className={`${ds.typography.bodyMedium} font-semibold mb-1 ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Score de Consistencia
            </h3>
            <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              {roadmap.consistencyScore >= 80
                ? 'Excelente consistencia. Sigue así para mantener el engagement.'
                : roadmap.consistencyScore >= 60
                ? 'Buena consistencia. Considera agregar más activaciones para mejorar.'
                : 'Consistencia baja. Es importante aumentar la frecuencia de activaciones.'}
            </p>
          </div>
          <div className={`text-3xl font-bold ${getConsistencyScoreColor(roadmap.consistencyScore)}`}>
            {roadmap.consistencyScore}
          </div>
        </div>
      </div>

      {/* Próxima Activación Sugerida */}
      {roadmap.nextSuggestedActivation && (
        <div className="mb-6 p-4 rounded-lg border-2 border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/30">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-300" />
              <h3 className={`${ds.typography.bodyMedium} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                Próxima Activación Recomendada
              </h3>
            </div>
            <Badge className={priorityColor[roadmap.nextSuggestedActivation.priority]} size="sm">
              {roadmap.nextSuggestedActivation.priority === 'high' ? 'Alta' : roadmap.nextSuggestedActivation.priority === 'medium' ? 'Media' : 'Baja'}
            </Badge>
          </div>
          <h4 className={`${ds.typography.h3} mb-2 ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
            {roadmap.nextSuggestedActivation.title}
          </h4>
          <p className={`${ds.typography.bodySmall} mb-3 ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            {roadmap.nextSuggestedActivation.description}
          </p>
          <div className="flex items-center gap-4 text-sm mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span className={ds.color.textSecondary}>{formatDate(roadmap.nextSuggestedActivation.suggestedDate)}</span>
            </div>
            {roadmap.nextSuggestedActivation.duration && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span className={ds.color.textSecondary}>{roadmap.nextSuggestedActivation.duration}</span>
              </div>
            )}
          </div>
          <p className={`text-sm italic ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            {roadmap.nextSuggestedActivation.rationale}
          </p>
        </div>
      )}

      {/* Activaciones Sugeridas */}
      {suggestedActivations.length > 0 && (
        <div className="mb-6">
          <h3 className={`${ds.typography.h3} mb-4 ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
            Activaciones Sugeridas
          </h3>
          <div className="space-y-4">
            {suggestedActivations.map((activation: SuggestedActivation) => (
              <div
                key={activation.id}
                className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-lg ${activationTypeColor[activation.type]} flex items-center justify-center flex-shrink-0`}>
                      {activationTypeIcon[activation.type]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <Badge className={activationTypeColor[activation.type]} size="sm">
                          {activationTypeLabel[activation.type]}
                        </Badge>
                        <Badge className={priorityColor[activation.priority]} size="sm">
                          {activation.priority === 'high' ? 'Alta' : activation.priority === 'medium' ? 'Media' : 'Baja'}
                        </Badge>
                        {activation.consistencyScore !== undefined && (
                          <Badge variant="secondary" size="sm">
                            Consistencia: {activation.consistencyScore}/100
                          </Badge>
                        )}
                      </div>
                      <h4 className={`${ds.typography.bodyMedium} font-semibold mb-1 ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                        {activation.title}
                      </h4>
                      <p className={`${ds.typography.bodySmall} mb-2 ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                        {activation.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span className={ds.color.textSecondary}>{formatDate(activation.suggestedDate)}</span>
                        </div>
                        {activation.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span className={ds.color.textSecondary}>{activation.duration}</span>
                          </div>
                        )}
                        {activation.preparationTime && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span className={ds.color.textSecondary}>Prep: {activation.preparationTime}</span>
                          </div>
                        )}
                      </div>
                      <p className={`text-sm mb-3 ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                        <strong>Audiencia:</strong> {activation.targetAudience}
                      </p>
                      <p className={`text-sm italic mb-3 ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                        {activation.rationale}
                      </p>
                      {activation.estimatedImpact && (
                        <div className="flex items-center gap-4 text-sm">
                          {activation.estimatedImpact.leads && (
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span className={ds.color.textSecondary}>{formatNumber(activation.estimatedImpact.leads)} leads</span>
                            </div>
                          )}
                          {activation.estimatedImpact.revenue && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              <span className={ds.color.textSecondary}>{formatCurrency(activation.estimatedImpact.revenue)}</span>
                            </div>
                          )}
                          {activation.estimatedImpact.engagement && (
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-4 h-4" />
                              <span className={ds.color.textSecondary}>{formatNumber(activation.estimatedImpact.engagement)} engagement</span>
                            </div>
                          )}
                          {activation.estimatedImpact.reach && (
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              <span className={ds.color.textSecondary}>{formatNumber(activation.estimatedImpact.reach)} alcance</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {onScheduleActivation && onDismissActivation && (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => onScheduleActivation(activation)}
                      className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                    >
                      Programar
                    </button>
                    <button
                      onClick={() => onDismissActivation(activation.id)}
                      className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      Descartar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Activaciones Programadas */}
      {scheduledActivations.length > 0 && (
        <div className="mb-6">
          <h3 className={`${ds.typography.h3} mb-4 ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
            Activaciones Programadas
          </h3>
          <div className="space-y-3">
            {scheduledActivations.map((activation: SuggestedActivation) => (
              <div
                key={activation.id}
                className="p-3 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20"
              >
                <div className="flex items-center gap-2">
                  {statusIcon.scheduled}
                  <span className={`${ds.typography.bodyMedium} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                    {activation.title}
                  </span>
                  <Badge className={activationTypeColor[activation.type]} size="sm">
                    {activationTypeLabel[activation.type]}
                  </Badge>
                  <span className={`text-sm ml-auto ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                    {formatDate(activation.suggestedDate)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recomendaciones */}
      {roadmap.recommendations && roadmap.recommendations.length > 0 && (
        <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-300 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className={`${ds.typography.bodyMedium} font-semibold mb-2 ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                Recomendaciones para Mantener Consistencia
              </h3>
              <ul className="space-y-2">
                {roadmap.recommendations.map((rec, idx) => (
                  <li key={idx} className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                    • {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Insights */}
      {roadmap.insights && roadmap.insights.length > 0 && (
        <div className="mt-6 p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-300 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className={`${ds.typography.bodyMedium} font-semibold mb-2 ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                Insights
              </h3>
              <ul className="space-y-2">
                {roadmap.insights.map((insight, idx) => (
                  <li key={idx} className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                    • {insight}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

