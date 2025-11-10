import { Brain, Clock, AlertTriangle, BarChart3, Power } from 'lucide-react';
import { Card, Badge } from '../../../components/componentsreutilizables';
import { FeedbackAutomation, FeedbackInsight } from '../types';

interface FeedbackInsightsBoardProps {
  insights: FeedbackInsight[];
  automations: FeedbackAutomation[];
  loading?: boolean;
}

export function FeedbackInsightsBoard({ insights, automations, loading }: FeedbackInsightsBoardProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <Card className="xl:col-span-2 bg-white/90 dark:bg-slate-900/80 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Feedback Loop & Encuestas Inteligentes
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Convertimos la voz del cliente en decisiones accionables, cerrando el loop de satisfacción en
              cuestión de horas.
            </p>
          </div>
          <Badge variant="blue" size="sm" className="inline-flex items-center gap-2">
            <Brain className="w-3.5 h-3.5" />
            IA Insight Ops
          </Badge>
        </header>

        <div className="mt-6 space-y-4">
          {(loading ? Array.from({ length: 3 }) : insights).map((insight, index) => (
            <article
              key={insight?.id ?? index}
              className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-r from-white via-white to-slate-50 dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950 p-5"
            >
              {insight ? (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {insight.topic}
                    </span>
                    <SentimentTag sentiment={insight.sentiment} />
                    <Badge variant="blue" size="sm" className="inline-flex items-center gap-1.5">
                      <BarChart3 className="w-3.5 h-3.5" />
                      {insight.responseRate}% RR
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {insight.keyFinding}
                  </p>
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span>Próxima acción: {insight.followUpAction}</span>
                    <span>Última corrida: {insight.lastRun}</span>
                  </div>
                </div>
              ) : (
                <InsightSkeleton />
              )}
            </article>
          ))}
        </div>
      </Card>

      <Card className="bg-white/90 dark:bg-slate-900/80 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Automatizaciones activas
          </h3>
          <Badge variant="blue" size="sm" className="inline-flex items-center gap-1.5">
            <Power className="w-3.5 h-3.5" />
            Always-on
          </Badge>
        </div>

        <ul className="mt-6 space-y-4">
          {(loading ? Array.from({ length: 3 }) : automations).map((automation, index) => (
            <li
              key={automation?.id ?? index}
              className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-4 bg-gradient-to-br from-white via-white to-slate-50 dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950"
            >
              {automation ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {automation.name}
                    </p>
                    <AutomationStatus status={automation.status} />
                  </div>
                  <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
                    <p>
                      <strong className="text-slate-600 dark:text-slate-300">Trigger:</strong>{' '}
                      {automation.trigger}
                    </p>
                    <p>
                      <strong className="text-slate-600 dark:text-slate-300">Audiencia:</strong>{' '}
                      {automation.audience}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Última ejecución: {automation.lastRun}
                    </span>
                    <span>{automation.nextAction}</span>
                  </div>
                </div>
              ) : (
                <AutomationSkeleton />
              )}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

interface SentimentTagProps {
  sentiment: FeedbackInsight['sentiment'];
}

function SentimentTag({ sentiment }: SentimentTagProps) {
  const map = {
    positive: { label: 'Positivo', className: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300' },
    neutral: { label: 'Neutro', className: 'bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-300' },
    negative: { label: 'Negativo', className: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300' },
  } as const;

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${map[sentiment].className}`}>
      {map[sentiment].label}
    </span>
  );
}

interface AutomationStatusProps {
  status: FeedbackAutomation['status'];
}

function AutomationStatus({ status }: AutomationStatusProps) {
  const map = {
    active: { label: 'Activa', className: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300' },
    paused: { label: 'Pausada', className: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300' },
    draft: { label: 'Borrador', className: 'bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-300' },
  } as const;

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${map[status].className}`}>
      {map[status].label}
    </span>
  );
}

function InsightSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="flex items-center gap-3">
        <div className="h-4 w-40 rounded-md bg-slate-200/70 dark:bg-slate-800/70" />
        <div className="h-5 w-16 rounded-full bg-slate-200/60 dark:bg-slate-800/60" />
        <div className="h-5 w-14 rounded-full bg-slate-200/60 dark:bg-slate-800/60" />
      </div>
      <div className="h-3 w-full rounded-md bg-slate-200/70 dark:bg-slate-800/70" />
      <div className="h-3 w-4/5 rounded-md bg-slate-200/70 dark:bg-slate-800/70" />
      <div className="flex items-center justify-between">
        <div className="h-3 w-48 rounded-md bg-slate-200/60 dark:bg-slate-800/60" />
        <div className="h-3 w-32 rounded-md bg-slate-200/60 dark:bg-slate-800/60" />
      </div>
    </div>
  );
}

function AutomationSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="flex items-center justify-between">
        <div className="h-4 w-32 rounded-md bg-slate-200/70 dark:bg-slate-800/70" />
        <div className="h-5 w-16 rounded-full bg-slate-200/60 dark:bg-slate-800/60" />
      </div>
      <div className="h-3 w-3/4 rounded-md bg-slate-200/70 dark:bg-slate-800/70" />
      <div className="h-3 w-2/3 rounded-md bg-slate-200/70 dark:bg-slate-800/70" />
      <div className="flex items-center justify-between">
        <div className="h-3 w-40 rounded-md bg-slate-200/60 dark:bg-slate-800/60" />
        <div className="h-3 w-32 rounded-md bg-slate-200/60 dark:bg-slate-800/60" />
      </div>
    </div>
  );
}



