import { Star, TrendingUp, Target, MessageCircle, Calendar, UserCheck, Copy, Send } from 'lucide-react';
import { Card, Badge, Button } from '../../../components/componentsreutilizables';
import { PromoterClient, PromoterSuggestionType, PromoterSuggestionTiming } from '../types';

interface PromoterClientsListProps {
  promoters: PromoterClient[];
  loading?: boolean;
  onRequestReferral?: (clientId: string) => void;
  onRequestTestimonial?: (clientId: string) => void;
  onContactClient?: (clientId: string, type: 'referral' | 'testimonial') => void;
}

export function PromoterClientsList({
  promoters,
  loading,
  onRequestReferral,
  onRequestTestimonial,
  onContactClient,
}: PromoterClientsListProps) {
  const getSuggestionTypeLabel = (type: PromoterSuggestionType): string => {
    const labels = {
      referido: 'Pedir referido',
      testimonio: 'Pedir testimonio',
      ambos: 'Pedir referido y testimonio',
    };
    return labels[type];
  };

  const getSuggestionTimingLabel = (timing: PromoterSuggestionTiming): string => {
    const labels = {
      ahora: 'Ahora',
      'esta-semana': 'Esta semana',
      'este-mes': 'Este mes',
      'mas-adelante': 'Más adelante',
    };
    return labels[timing];
  };

  const getSuggestionTimingColor = (timing: PromoterSuggestionTiming): string => {
    const colors = {
      ahora: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
      'esta-semana': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      'este-mes': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
      'mas-adelante': 'bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300',
    };
    return colors[timing];
  };

  const getPromoterScoreColor = (score: number): string => {
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 60) return 'text-blue-600 dark:text-blue-400';
    if (score >= 40) return 'text-amber-600 dark:text-amber-400';
    return 'text-slate-600 dark:text-slate-400';
  };

  if (loading) {
    return (
      <Card className="bg-white/90 dark:bg-slate-900/80 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 rounded-md bg-slate-200/70 dark:bg-slate-800/70" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 rounded-lg bg-slate-200/60 dark:bg-slate-800/60" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-white/90 dark:bg-slate-900/80 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
      <header className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Clientes Promotores
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Sistema que identifica clientes promotores basado en: alta satisfacción consistente, asistencia regular,
            cumplimiento de objetivos, feedback positivo. Lista de promotores con sugerencias de cuándo pedir referido
            o testimonio.
          </p>
        </div>
        <Badge variant="blue" size="sm" className="inline-flex items-center gap-1.5">
          <Star className="w-3.5 h-3.5" />
          {promoters.length} promotores
        </Badge>
      </header>

      {promoters.length === 0 ? (
        <div className="text-center py-12">
          <UserCheck className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No hay clientes promotores identificados en este momento.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {promoters.map((promoter) => (
            <div
              key={promoter.id}
              className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white via-white to-slate-50 dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                          {promoter.clientName}
                        </h4>
                        <Badge
                          variant="blue"
                          size="sm"
                          className={`${getPromoterScoreColor(promoter.promoterScore)} font-semibold`}
                        >
                          Score: {promoter.promoterScore}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-500" />
                          Satisfacción: {promoter.satisfactionScore.toFixed(1)}/5
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                          Asistencia: {promoter.attendanceRate}%
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="w-3.5 h-3.5 text-indigo-500" />
                          Objetivos: {promoter.objectivesCompleted}/{promoter.totalObjectives}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3.5 h-3.5 text-blue-500" />
                          Feedback positivo: {promoter.positiveFeedbackCount}
                        </span>
                        {promoter.lastSessionDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-purple-500" />
                            Última sesión: {new Date(promoter.lastSessionDate).toLocaleDateString('es-ES')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-200/50 dark:border-indigo-800/50 p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">
                          {getSuggestionTypeLabel(promoter.suggestionType)}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">{promoter.suggestionReason}</p>
                      </div>
                      <Badge size="sm" className={getSuggestionTimingColor(promoter.suggestionTiming)}>
                        {getSuggestionTimingLabel(promoter.suggestionTiming)}
                      </Badge>
                    </div>
                    {promoter.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {promoter.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {promoter.suggestionType === 'referido' || promoter.suggestionType === 'ambos' ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        onRequestReferral?.(promoter.clientId);
                        onContactClient?.(promoter.clientId, 'referral');
                      }}
                      className="inline-flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Pedir referido
                    </Button>
                  ) : null}
                  {promoter.suggestionType === 'testimonio' || promoter.suggestionType === 'ambos' ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        onRequestTestimonial?.(promoter.clientId);
                        onContactClient?.(promoter.clientId, 'testimonial');
                      }}
                      className="inline-flex items-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Pedir testimonio
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

