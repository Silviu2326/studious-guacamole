import React from 'react';
import { Badge, Card } from '../../../components/componentsreutilizables';
import { Clock3, Flag, Navigation, Workflow, Zap } from 'lucide-react';
import { ds } from '../../adherencia/ui/ds';
import { CampanasAutomatizacionService } from '../services/campanasAutomatizacionService';
import { LifecycleSequence } from '../types';

const goalLabel: Record<LifecycleSequence['goal'], { label: string; variant: React.ComponentProps<typeof Badge>['variant'] }> = {
  activation: { label: 'Activación', variant: 'blue' },
  retention: { label: 'Retención', variant: 'green' },
  upsell: { label: 'Upsell', variant: 'purple' },
  'winback': { label: 'Winback', variant: 'orange' },
  'churn-prevention': { label: 'Anti-churn', variant: 'red' },
};

interface LifecycleSequencesProps {
  sequences: LifecycleSequence[];
  loading?: boolean;
  className?: string;
}

export const LifecycleSequences: React.FC<LifecycleSequencesProps> = ({ sequences, loading = false, className = '' }) => {
  if (loading && sequences.length === 0) {
    return (
      <Card className={className}>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className={`${ds.shimmer} h-24`} />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-200 flex items-center justify-center">
              <Workflow className="w-5 h-5 text-emerald-600" />
            </span>
            <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Lifecycle email sequences
            </h2>
          </div>
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            Analiza automatizaciones por objetivo y detecta cuellos de botella.
          </p>
        </div>
        <Badge variant="green" size="md">
          {sequences.length} flujos
        </Badge>
      </div>

      <div className="space-y-4">
        {sequences.map((sequence) => {
          const goal = goalLabel[sequence.goal];
          return (
            <div
              key={sequence.id}
              className="rounded-2xl border border-slate-100 dark:border-slate-800 p-4 bg-gradient-to-br from-white to-slate-50 dark:from-[#0f192c] dark:to-[#101b30]"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                      {sequence.name}
                    </h3>
                    <Badge variant={goal.variant}>{goal.label}</Badge>
                    <Badge variant={sequence.status === 'running' ? 'green' : 'yellow'}>
                      {sequence.status === 'running' ? 'Live' : 'Programada'}
                    </Badge>
                  </div>
                  <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                    {sequence.steps} pasos · {sequence.activeContacts.toLocaleString('es-ES')} contactos activos
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                  <Zap className="w-4 h-4" />
                  Score automatización {sequence.automationScore}%
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-xl bg-white/70 dark:bg-white/5 border border-slate-100/80 dark:border-white/10 p-3">
                  <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>Completion rate</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Flag className="w-4 h-4 text-indigo-500" />
                    <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimaryDark}`}>
                      {CampanasAutomatizacionService.formatPercentage(sequence.completionRate)}
                    </span>
                  </div>
                </div>
                <div className="rounded-xl bg-white/70 dark:bg-white/5 border border-slate-100/80 dark:border-white/10 p-3">
                  <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>Time to convert</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock3 className="w-4 h-4 text-sky-500" />
                    <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimaryDark}`}>
                      {CampanasAutomatizacionService.formatDuration(sequence.avgTimeToConvert * 60)}
                    </span>
                  </div>
                </div>
                <div className="rounded-xl bg-white/70 dark:bg-white/5 border border-slate-100/80 dark:border-white/10 p-3">
                  <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                    Última optimización
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Navigation className="w-4 h-4 text-emerald-500" />
                    <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimaryDark}`}>
                      {sequence.lastOptimization}
                    </span>
                  </div>
                </div>
              </div>

              {sequence.bottleneckStep && (
                <div className="mt-4 rounded-xl bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 p-3 flex flex-wrap items-start gap-3">
                  <span className={`${ds.typography.caption} text-amber-600 dark:text-amber-300 uppercase tracking-[0.2em]`}>
                    Botella de conversión
                  </span>
                  <p className={`${ds.typography.bodySmall} ${ds.color.textPrimaryDark}`}>
                    Revisar el paso {sequence.bottleneckStep}: baja tasa de clic. Sugerencia: duplicar mensaje en WhatsApp y añadir micro video.
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};












