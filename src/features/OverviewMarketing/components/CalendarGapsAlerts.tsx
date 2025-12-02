import React from 'react';
import { AlertTriangle, Calendar, Clock, TrendingUp, Sparkles } from 'lucide-react';
import { Badge, Button, Card } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { MarketingCalendarGapsSnapshot, MarketingCalendarGap } from '../types';

interface CalendarGapsAlertsProps {
  snapshot: MarketingCalendarGapsSnapshot | null;
  loading?: boolean;
  className?: string;
  onApplySuggestion?: (suggestionId: string) => void;
}

const severityConfig: Record<MarketingCalendarGap['severity'], { label: string; variant: 'error' | 'warning' | 'info'; color: string }> = {
  critical: { label: 'Crítico', variant: 'error', color: 'text-red-600 dark:text-red-400' },
  warning: { label: 'Advertencia', variant: 'warning', color: 'text-yellow-600 dark:text-yellow-400' },
  info: { label: 'Informativo', variant: 'info', color: 'text-blue-600 dark:text-blue-400' },
};

const gapTypeLabels: Record<MarketingCalendarGap['gapType'], string> = {
  content: 'Contenido',
  campaign: 'Campaña',
  event: 'Evento',
  social_post: 'Publicación Social',
  email: 'Email',
};

export const CalendarGapsAlerts: React.FC<CalendarGapsAlertsProps> = ({
  snapshot,
  loading = false,
  className = '',
  onApplySuggestion,
}) => {
  if (loading) {
    return (
      <Card className={className}>
        <div className={`${ds.shimmer} h-32`} />
      </Card>
    );
  }

  if (!snapshot || snapshot.gaps.length === 0) {
    return null;
  }

  return (
    <Card className={className}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-100 to-red-200 dark:from-orange-900/40 dark:to-red-900/30 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-300" />
            </span>
            <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Huecos críticos en calendario
            </h2>
          </div>
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            Se detectaron {snapshot.totalGapsCount} hueco(s) en tu calendario de marketing. Rellénalos con propuestas IA.
          </p>
        </div>
        {snapshot.criticalGapsCount > 0 && (
          <Badge variant="error" className="flex items-center gap-1">
            {snapshot.criticalGapsCount} crítico(s)
          </Badge>
        )}
      </div>

      {/* Insights */}
      {snapshot.insights.length > 0 && (
        <div className="mb-6 p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
          <ul className="space-y-2">
            {snapshot.insights.map((insight, index) => (
              <li key={index} className={`text-sm ${ds.color.textPrimary} ${ds.color.textPrimaryDark} flex items-start gap-2`}>
                <span className="text-orange-600 dark:text-orange-400 mt-0.5">•</span>
                {insight}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Lista de huecos */}
      <div className="space-y-4">
        {snapshot.gaps.map((gap) => {
          const severity = severityConfig[gap.severity];
          const gapDate = new Date(gap.date);
          
          return (
            <div
              key={gap.id}
              className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 bg-white/80 dark:bg-[#111827]/80"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={severity.variant}>{severity.label}</Badge>
                    <Badge variant="secondary">{gapTypeLabels[gap.gapType]}</Badge>
                    <span className={`text-sm ${severity.color} flex items-center gap-1`}>
                      <Calendar className="w-4 h-4" />
                      {gapDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                    </span>
                    <span className={`text-sm ${ds.color.textSecondary} ${ds.color.textSecondaryDark} flex items-center gap-1`}>
                      <Clock className="w-4 h-4" />
                      {gap.duration} día(s)
                    </span>
                  </div>
                  <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-1`}>
                    {gap.description}
                  </h3>
                  {gap.context && (
                    <div className="mt-2 space-y-1">
                      {gap.context.previousActivity && (
                        <p className={`text-xs ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                          {gap.context.previousActivity}
                        </p>
                      )}
                      {gap.context.nextActivity && (
                        <p className={`text-xs ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                          {gap.context.nextActivity}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Impacto estimado */}
              {gap.impact && (
                <div className="mb-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className={`text-sm font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                      Impacto estimado:
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm">
                    {gap.impact.estimatedLeads && (
                      <span className={ds.color.textSecondary + ' ' + ds.color.textSecondaryDark}>
                        {gap.impact.estimatedLeads} leads potenciales
                      </span>
                    )}
                    {gap.impact.estimatedEngagement && (
                      <span className={ds.color.textSecondary + ' ' + ds.color.textSecondaryDark}>
                        {gap.impact.estimatedEngagement} engagement
                      </span>
                    )}
                    {gap.impact.estimatedRevenue && (
                      <span className={ds.color.textSecondary + ' ' + ds.color.textSecondaryDark}>
                        {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(gap.impact.estimatedRevenue)}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Sugerencias IA */}
              {gap.suggestedActions.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span className={`text-sm font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                      Sugerencias IA para rellenar este hueco:
                    </span>
                  </div>
                  <div className="space-y-2">
                    {gap.suggestedActions.map((suggestion) => (
                      <div
                        key={suggestion.id}
                        className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800"
                      >
                        <h4 className={`text-sm font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-1`}>
                          {suggestion.title}
                        </h4>
                        <p className={`text-xs ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-2`}>
                          {suggestion.description}
                        </p>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => onApplySuggestion?.(suggestion.id)}
                          className="inline-flex items-center gap-1"
                        >
                          {suggestion.cta}
                        </Button>
                      </div>
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
};

