import React from 'react';
import { Card, Button, Input, Select } from '../../../components/componentsreutilizables';
import type { DayPlan, DaySession } from '../types';

type Props = {
  weekDays: ReadonlyArray<string>;
  workingPlan: Record<string, DayPlan>;
  setWorkingPlan: React.Dispatch<React.SetStateAction<Record<string, DayPlan>>>;
  setManualApplyStatus: (msg: string | null) => void;
};

type VariationType = 'none' | 'progression' | 'intensity' | 'rotate-exercises';

export function DuplicateWeekMode({ weekDays, workingPlan, setWorkingPlan, setManualApplyStatus }: Props) {
  const [sourceWeek, setSourceWeek] = React.useState<number>(1);
  const [targetWeeks, setTargetWeeks] = React.useState<number[]>([]);
  const [variationType, setVariationType] = React.useState<VariationType>('none');
  const [progressionPercent, setProgressionPercent] = React.useState('5');
  const [intensityDelta, setIntensityDelta] = React.useState('0.5');
  const [keepExactStructure, setKeepExactStructure] = React.useState(true);

  // Extraer número de semana de un dayKey (ej: "Lunes · Semana 2" -> 2)
  const getWeekNumber = (dayKey: string): number => {
    const match = dayKey.match(/Semana (\d+)/);
    return match ? parseInt(match[1], 10) : 1;
  };

  // Obtener todos los días de una semana específica
  const getDaysForWeek = (weekNum: number): string[] => {
    return weekDays.filter((day) => getWeekNumber(day) === weekNum);
  };

  // Obtener semanas disponibles (1-4)
  const availableWeeks = [1, 2, 3, 4];

  const toggleTargetWeek = (week: number) => {
    setTargetWeeks((prev) => (prev.includes(week) ? prev.filter((w) => w !== week) : [...prev, week]));
  };

  // Aplicar progresión de carga a un valor numérico
  const applyProgression = (value: number | undefined, percent: number): number | undefined => {
    if (value === undefined) return undefined;
    return Math.round(value * (1 + percent / 100) * 100) / 100;
  };

  // Ajustar intensidad (RPE)
  const adjustIntensity = (intensity: string, delta: number): string => {
    // Intentar extraer número RPE (ej: "RPE 7" -> 7)
    const rpeMatch = intensity.match(/RPE\s*([\d.]+)/i);
    if (rpeMatch) {
      const currentRPE = parseFloat(rpeMatch[1]);
      const newRPE = Math.max(1, Math.min(10, currentRPE + delta));
      return intensity.replace(/RPE\s*[\d.]+/i, `RPE ${newRPE.toFixed(1)}`);
    }
    // Si no es RPE numérico, intentar ajustar descriptivamente
    const intensityMap: Record<string, number> = {
      ligera: 3,
      moderada: 5,
      media: 5,
      alta: 8,
      regenerativa: 2,
    };
    const lowerIntensity = intensity.toLowerCase();
    for (const [key, value] of Object.entries(intensityMap)) {
      if (lowerIntensity.includes(key)) {
        const newValue = Math.max(1, Math.min(10, value + delta));
        // Convertir de vuelta a texto aproximado
        if (newValue <= 3) return 'Ligera';
        if (newValue <= 5) return 'Moderada';
        if (newValue <= 7) return 'Media';
        return 'Alta';
      }
    }
    return intensity; // Si no se puede ajustar, mantener original
  };

  // Clonar una sesión con variaciones
  const cloneSession = (session: DaySession, weekOffset: number): DaySession => {
    const cloned: DaySession = {
      ...session,
      id: `${session.id}-w${weekOffset}-${Math.random().toString(36).slice(2, 6)}`,
    };

    // Aplicar variaciones según el tipo
    if (variationType === 'progression' && progressionPercent) {
      const percent = parseFloat(progressionPercent) || 0;
      if (cloned.peso !== undefined) {
        cloned.peso = applyProgression(cloned.peso, percent * weekOffset);
      }
      if (cloned.series !== undefined) {
        cloned.series = Math.round((cloned.series || 0) * (1 + (percent * weekOffset) / 100));
      }
    }

    if (variationType === 'intensity' && intensityDelta) {
      const delta = parseFloat(intensityDelta) || 0;
      cloned.intensity = adjustIntensity(cloned.intensity, delta * weekOffset);
    }

    if (variationType === 'rotate-exercises') {
      // Rotación simple: añadir variante al nombre del bloque
      if (weekOffset > 0) {
        cloned.block = `${cloned.block} (v${weekOffset + 1})`;
        cloned.notes = `${cloned.notes || ''} · Variante semana ${weekOffset + 1}`.trim();
      }
    }

    return cloned;
  };

  const handleDuplicateWeek = () => {
    if (targetWeeks.length === 0) return;

    const sourceDays = getDaysForWeek(sourceWeek);
    if (sourceDays.length === 0) return;

    setWorkingPlan((prev) => {
      const next: Record<string, DayPlan> = { ...prev };

      targetWeeks.forEach((targetWeek) => {
        const targetDays = getDaysForWeek(targetWeek);
        const weekOffset = targetWeek - sourceWeek;

        // Mapear cada día de la semana origen al día correspondiente de la semana destino
        sourceDays.forEach((sourceDay, index) => {
          const targetDay = targetDays[index];
          if (!targetDay || !prev[sourceDay]) return;

          const sourceDayPlan = prev[sourceDay];
          const clonedDayPlan: DayPlan = {
            ...sourceDayPlan,
            sessions: sourceDayPlan.sessions.map((session) => cloneSession(session, weekOffset)),
          };

          next[targetDay] = clonedDayPlan;
        });
      });

      return next;
    });

    const variationText =
      variationType === 'none'
        ? 'sin variaciones'
        : variationType === 'progression'
        ? `con progresión de ${progressionPercent}%`
        : variationType === 'intensity'
        ? `con ajuste de intensidad ${intensityDelta > 0 ? '+' : ''}${intensityDelta}`
        : 'con rotación de ejercicios';

    setManualApplyStatus(
      `Semana ${sourceWeek} duplicada a semana(s) ${targetWeeks.join(', ')} ${variationText}. Revisa y aplica los cambios para guardarlos en el programa.`,
    );
  };

  return (
    <div className="space-y-5">
      <Card className="space-y-4 border border-slate-200/70 bg-white/95 p-4 dark:border-slate-800/70 dark:bg-slate-900/50">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Duplicar semana completa
            </p>
            <p className="text-xs text-slate-500">
              Duplica una semana completa a otras semanas con opciones de variación automática.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500">Semana origen</p>
              <Select
                value={sourceWeek.toString()}
                onChange={(e) => setSourceWeek(parseInt(e.target.value, 10))}
                options={availableWeeks.map((w) => ({ label: `Semana ${w}`, value: w.toString() }))}
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500">Semanas destino</p>
              <div className="flex flex-wrap gap-2">
                {availableWeeks
                  .filter((w) => w !== sourceWeek)
                  .map((week) => {
                    const active = targetWeeks.includes(week);
                    return (
                      <Button
                        key={week}
                        variant={active ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => toggleTargetWeek(week)}
                      >
                        Semana {week}
                      </Button>
                    );
                  })}
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500">Tipo de variación</p>
            <Select
              value={variationType}
              onChange={(e) => setVariationType(e.target.value as VariationType)}
              options={[
                { label: 'Sin variaciones (copia exacta)', value: 'none' },
                { label: 'Progresión de carga', value: 'progression' },
                { label: 'Ajuste de intensidad', value: 'intensity' },
                { label: 'Rotación de ejercicios', value: 'rotate-exercises' },
              ]}
            />
          </div>

          {variationType === 'progression' && (
            <div className="space-y-1 rounded-lg border border-slate-200/70 bg-slate-50/50 p-3 dark:border-slate-800/70 dark:bg-slate-900/40">
              <p className="text-xs font-semibold text-slate-500">Porcentaje de progresión por semana</p>
              <Input
                type="number"
                value={progressionPercent}
                onChange={(e) => setProgressionPercent(e.target.value)}
                placeholder="5"
                min="0"
                max="50"
              />
              <p className="text-[11px] text-slate-500">
                Ej: 5% = +5% cada semana. Si duplicas Semana 1 a Semana 2, la carga será +5%. Si también a Semana 3,
                será +10% respecto a la original.
              </p>
            </div>
          )}

          {variationType === 'intensity' && (
            <div className="space-y-1 rounded-lg border border-slate-200/70 bg-slate-50/50 p-3 dark:border-slate-800/70 dark:bg-slate-900/40">
              <p className="text-xs font-semibold text-slate-500">Delta de intensidad (RPE)</p>
              <Input
                type="number"
                step="0.5"
                value={intensityDelta}
                onChange={(e) => setIntensityDelta(e.target.value)}
                placeholder="0.5"
                min="-2"
                max="2"
              />
              <p className="text-[11px] text-slate-500">
                Ej: +0.5 = aumenta RPE en 0.5 cada semana. Si duplicas Semana 1 (RPE 7) a Semana 2, será RPE 7.5. A
                Semana 3 será RPE 8.
              </p>
            </div>
          )}

          {variationType === 'rotate-exercises' && (
            <div className="rounded-lg border border-slate-200/70 bg-slate-50/50 p-3 dark:border-slate-800/70 dark:bg-slate-900/40">
              <p className="text-[11px] text-slate-500">
                Añadirá una variante al nombre del bloque y una nota indicando la semana. Útil para mantener la misma
                estructura pero con ejercicios diferentes.
              </p>
            </div>
          )}

          <div className="rounded-lg border border-amber-200/70 bg-amber-50/50 p-3 dark:border-amber-900/50 dark:bg-amber-950/30">
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">⚠️ Advertencia</p>
            <p className="text-[11px] text-amber-600 dark:text-amber-400">
              Esta acción reemplazará completamente el contenido de las semanas destino. Los bloques existentes se
              perderán. Asegúrate de revisar el resultado antes de aplicar definitivamente.
            </p>
          </div>
        </div>
      </Card>

      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button
          variant="secondary"
          onClick={handleDuplicateWeek}
          disabled={targetWeeks.length === 0}
        >
          Duplicar semana
        </Button>
      </div>
    </div>
  );
}




