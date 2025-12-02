import React from 'react';
import { Card, Button, Input } from '../../../components/componentsreutilizables';
import type { DayPlan } from '../types';

type Props = {
  weekDays: ReadonlyArray<string>;
  workingPlan: Record<string, DayPlan>;
  setWorkingPlan: React.Dispatch<React.SetStateAction<Record<string, DayPlan>>>;
  setManualApplyStatus: (msg: string | null) => void;
};

const parseMinutes = (value: string) => {
  const match = value.match(/\d+/);
  return match ? Number(match[0]) : 0;
};

export function DeloadWeekMode({ weekDays, workingPlan, setWorkingPlan, setManualApplyStatus }: Props) {
  const [durationFactor, setDurationFactor] = React.useState('0.7'); // 70% por defecto
  const [lowerIntensity, setLowerIntensity] = React.useState(true);

  const handleApplyDeload = () => {
    const factor = Number(durationFactor);
    if (!factor || factor <= 0 || factor >= 1) return;

    setWorkingPlan((prev) => {
      const next: Record<string, DayPlan> = {};
      weekDays.forEach((day) => {
        const dayPlan = prev[day];
        if (!dayPlan) return;
        next[day] = {
          ...dayPlan,
          sessions: dayPlan.sessions.map((session) => {
            const currentMinutes = parseMinutes(session.duration || '0');
            const nextMinutes = Math.max(5, Math.round(currentMinutes * factor));
            let nextIntensity = session.intensity;

            if (lowerIntensity && session.intensity) {
              const value = session.intensity.toLowerCase();
              if (value.includes('alta')) nextIntensity = 'Media';
              else if (value.includes('media')) nextIntensity = 'Baja';
            }

            return {
              ...session,
              duration: `${nextMinutes} min`,
              intensity: nextIntensity,
            };
          }),
        };
      });
      return { ...prev, ...next };
    });

    setManualApplyStatus(
      'Semana de descarga aplicada (deload). Revisa y aplica los cambios para guardarlos en el programa.',
    );
  };

  return (
    <div className="space-y-5">
      <Card className="space-y-4 border border-slate-200/70 bg-white/95 p-4 dark:border-slate-800/70 dark:bg-slate-900/50">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Semana de descarga (deload)
            </p>
            <p className="text-xs text-slate-500">
              Reduce duración e intensidad de todos los bloques de la semana para crear una semana de descarga.
            </p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500">Factor de duración</p>
            <Input
              value={durationFactor}
              onChange={(e) => setDurationFactor(e.target.value)}
              placeholder="Ej: 0.7 para reducir al 70%"
            />
            <p className="text-[11px] text-slate-500">
              Se aplica a todos los bloques (mínimo 5 min por bloque).
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500">Bajar intensidad</p>
            <label className="flex items-center gap-2 text-xs text-slate-600">
              <input
                type="checkbox"
                checked={lowerIntensity}
                onChange={(e) => setLowerIntensity(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600"
              />
              <span>Alta → Media, Media → Baja</span>
            </label>
          </div>
        </div>
      </Card>

      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button variant="secondary" onClick={handleApplyDeload}>
          Aplicar semana de descarga
        </Button>
      </div>
    </div>
  );
}


