import React from 'react';
import { Card, Button, Input, Select } from '../../../components/componentsreutilizables';
import type { DayPlan, DaySession } from '../types';

type Props = {
  weekDays: ReadonlyArray<string>;
  workingPlan: Record<string, DayPlan>;
  setWorkingPlan: React.Dispatch<React.SetStateAction<Record<string, DayPlan>>>;
  setManualApplyStatus: (msg: string | null) => void;
};

export function AutoFinisherMode({ weekDays, workingPlan, setWorkingPlan, setManualApplyStatus }: Props) {
  const [targetDays, setTargetDays] = React.useState<string[]>([]);
  const [position, setPosition] = React.useState<'warmup' | 'finisher'>('warmup');
  const [blockName, setBlockName] = React.useState('Finisher');
  const [duration, setDuration] = React.useState('10 min');
  const [modality, setModality] = React.useState('MetCon');
  const [intensity, setIntensity] = React.useState('Alta');
  const [notes, setNotes] = React.useState('Añadido automáticamente como finisher.');

  const toggleDay = (day: string) => {
    setTargetDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  };

  const handleApplyAutoBlocks = () => {
    if (targetDays.length === 0) return;

    setWorkingPlan((prev) => {
      const next: Record<string, DayPlan> = { ...prev };
      targetDays.forEach((day) => {
        const dayPlan = next[day];
        if (!dayPlan) return;

        const newSession: DaySession = {
          id: Math.random().toString(36).slice(2, 9),
          time: position === 'warmup' ? '00:00' : '99:59',
          block: blockName || (position === 'warmup' ? 'Warm-up' : 'Finisher'),
          duration: duration || '10 min',
          modality: modality || 'Custom',
          intensity: intensity || 'Media',
          notes,
        };

        const sessions = [...dayPlan.sessions];
        if (position === 'warmup') {
          sessions.unshift(newSession);
        } else {
          sessions.push(newSession);
        }

        next[day] = {
          ...dayPlan,
          sessions,
        };
      });
      return next;
    });

    setManualApplyStatus(
      'Bloques de calentamiento/finisher añadidos. Revisa y aplica los cambios para guardarlos en el programa.',
    );
  };

  return (
    <div className="space-y-5">
      <Card className="space-y-4 border border-slate-200/70 bg-white/95 p-4 dark:border-slate-800/70 dark:bg-slate-900/50">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Finisher / Calentamiento automático
            </p>
            <p className="text-xs text-slate-500">
              Añade automáticamente un bloque de calentamiento o finisher a los días seleccionados.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500">Días objetivo</p>
            <div className="flex flex-wrap gap-2">
              {weekDays.map((day) => {
                const active = targetDays.includes(day);
                return (
                  <Button
                    key={day}
                    variant={active ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => toggleDay(day)}
                  >
                    {day}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500">Tipo de bloque</p>
              <Select
                value={position}
                onChange={(e) => setPosition(e.target.value as 'warmup' | 'finisher')}
                options={[
                  { label: 'Calentamiento (antes de las sesiones)', value: 'warmup' },
                  { label: 'Finisher (al final del día)', value: 'finisher' },
                ]}
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500">Nombre del bloque</p>
              <Input
                value={blockName}
                onChange={(e) => setBlockName(e.target.value)}
                placeholder="Ej: Warm-up movilidad, Finisher core..."
              />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500">Duración</p>
              <Input
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Ej: 10 min"
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500">Modalidad</p>
              <Input
                value={modality}
                onChange={(e) => setModality(e.target.value)}
                placeholder="Ej: Mobility, MetCon, Técnica..."
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500">Intensidad</p>
              <Input
                value={intensity}
                onChange={(e) => setIntensity(e.target.value)}
                placeholder="Ej: Baja, Media, Alta o RPE 7..."
              />
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500">Notas</p>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notas que acompañarán al bloque"
            />
          </div>
        </div>
      </Card>

      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button
          variant="secondary"
          onClick={handleApplyAutoBlocks}
          disabled={targetDays.length === 0}
        >
          Añadir bloques automáticos
        </Button>
      </div>
    </div>
  );
}


