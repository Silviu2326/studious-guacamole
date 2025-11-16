import React from 'react';
import { Card, Button, Select } from '../../../components/componentsreutilizables';
import type { DayPlan } from '../types';

type Props = {
  weekDays: ReadonlyArray<string>;
  workingPlan: Record<string, DayPlan>;
  setWorkingPlan: React.Dispatch<React.SetStateAction<Record<string, DayPlan>>>;
  setManualApplyStatus: (msg: string | null) => void;
};

type TargetIntensity = 'keep' | 'Baja' | 'Media' | 'Alta';

const INTENSITY_OPTIONS: { label: string; value: TargetIntensity }[] = [
  { label: 'Mantener', value: 'keep' },
  { label: 'Baja', value: 'Baja' },
  { label: 'Media', value: 'Media' },
  { label: 'Alta', value: 'Alta' },
];

const computeCurrentSummary = (plan: Record<string, DayPlan>, weekDays: ReadonlyArray<string>) => {
  const byDay: Array<{ day: string; alta: number; media: number; baja: number }> = [];

  weekDays.forEach((day) => {
    const dayPlan = plan[day];
    if (!dayPlan) {
      byDay.push({ day, alta: 0, media: 0, baja: 0 });
      return;
    }
    let alta = 0;
    let media = 0;
    let baja = 0;
    dayPlan.sessions.forEach((session) => {
      const value = session.intensity ?? '';
      if (value.toLowerCase().includes('alta')) alta += 1;
      else if (value.toLowerCase().includes('media')) media += 1;
      else if (value.toLowerCase().includes('baja')) baja += 1;
    });
    byDay.push({ day, alta, media, baja });
  });

  return byDay;
};

export function RebalanceIntensityMode({ weekDays, workingPlan, setWorkingPlan, setManualApplyStatus }: Props) {
  const initialTargets: Record<string, TargetIntensity> = {};
  weekDays.forEach((day) => {
    initialTargets[day] = 'keep';
  });

  const [targets, setTargets] = React.useState<Record<string, TargetIntensity>>(initialTargets);

  const handleTargetChange = (day: string, value: TargetIntensity) => {
    setTargets((prev) => ({ ...prev, [day]: value }));
  };

  const handleApplyRebalance = () => {
    setWorkingPlan((prev) => {
      const next: Record<string, DayPlan> = { ...prev };
      Object.entries(targets).forEach(([day, target]) => {
        if (target === 'keep') return;
        const dayPlan = next[day];
        if (!dayPlan) return;
        next[day] = {
          ...dayPlan,
          sessions: dayPlan.sessions.map((session) => ({
            ...session,
            intensity: target,
          })),
        };
      });
      return next;
    });

    setManualApplyStatus(
      'Intensidades reasignadas por día. Revisa y aplica los cambios para guardarlos en el programa.',
    );
  };

  const summary = computeCurrentSummary(workingPlan, weekDays);

  return (
    <div className="space-y-5">
      <Card className="space-y-4 border border-slate-200/70 bg-white/95 p-4 dark:border-slate-800/70 dark:bg-slate-900/50">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Rebalancear intensidades por día
            </p>
            <p className="text-xs text-slate-500">
              Elige la intensidad objetivo para cada día. Se ajustarán todas las sesiones de ese día a ese nivel.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {weekDays.map((day) => {
            const daySummary = summary.find((item) => item.day === day);
            const target = targets[day] ?? 'keep';
            return (
              <div
                key={day}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/70 bg-white/90 p-3 dark:border-slate-800/70 dark:bg-slate-950/40"
              >
                <div className="flex flex-col text-xs">
                  <span className="font-semibold text-slate-700">{day}</span>
                  {daySummary && (
                    <span className="text-slate-500">
                      Alta: {daySummary.alta} · Media: {daySummary.media} · Baja: {daySummary.baja}
                    </span>
                  )}
                </div>
                <div className="min-w-[140px]">
                  <Select
                    value={target}
                    onChange={(e) => handleTargetChange(day, e.target.value as TargetIntensity)}
                    options={INTENSITY_OPTIONS}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="flex flex-wrap items-center justify-end gap-2">
        <span className="text-xs text-slate-500">
          Después de rebalancear, usa &quot;Aplicar cambios al programa&quot; para guardar.
        </span>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button variant="secondary" onClick={handleApplyRebalance}>
          Rebalancear intensidades
        </Button>
      </div>
    </div>
  );
}


