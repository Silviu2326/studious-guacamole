import React from 'react';
import { Card, Button, Input, Select } from '../../../components/componentsreutilizables';
import type { DayPlan } from '../types';

type Props = {
  weekDays: ReadonlyArray<string>;
  workingPlan: Record<string, DayPlan>;
  setWorkingPlan: React.Dispatch<React.SetStateAction<Record<string, DayPlan>>>;
  setManualApplyStatus: (msg: string | null) => void;
};

export function BulkModalityMode({ weekDays, workingPlan, setWorkingPlan, setManualApplyStatus }: Props) {
  const [targetDays, setTargetDays] = React.useState<string[]>([]);
  const [filterText, setFilterText] = React.useState('');
  const [newModality, setNewModality] = React.useState('');
  const [scope, setScope] = React.useState<'all' | 'matches'>('matches');

  const toggleDay = (day: string) => {
    setTargetDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  };

  const handleApplyBulkModality = () => {
    const modality = newModality.trim();
    if (!modality || targetDays.length === 0) return;

    const filter = filterText.trim().toLowerCase();

    setWorkingPlan((prev) => {
      const next: Record<string, DayPlan> = { ...prev };
      targetDays.forEach((day) => {
        const dayPlan = next[day];
        if (!dayPlan) return;
        next[day] = {
          ...dayPlan,
          sessions: dayPlan.sessions.map((session) => {
            const current = session.modality ?? '';
            const matches =
              scope === 'all' ? true : current.toLowerCase().includes(filter) || session.block.toLowerCase().includes(filter);
            if (!matches) return session;
            return { ...session, modality };
          }),
        };
      });
      return next;
    });

    setManualApplyStatus(
      'Modalidad actualizada en lote. Revisa y aplica los cambios para guardarlos en el programa.',
    );
  };

  return (
    <div className="space-y-5">
      <Card className="space-y-4 border border-slate-200/70 bg-white/95 p-4 dark:border-slate-800/70 dark:bg-slate-900/50">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Cambiar modalidad en lote
            </p>
            <p className="text-xs text-slate-500">
              Cambia la modalidad de muchos bloques a la vez filtrando por texto (modalidad o nombre de bloque).
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
              <p className="text-xs font-semibold text-slate-500">Filtro (opcional)</p>
              <Input
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder="Ej: MetCon, fuerza, remo..."
              />
              <p className="text-[11px] text-slate-500">
                Se aplica sobre modalidad y nombre de bloque. Déjalo vacío para afectar a todos los bloques.
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500">Ámbito</p>
              <Select
                value={scope}
                onChange={(e) => setScope(e.target.value as 'all' | 'matches')}
                options={[
                  { label: 'Todos los bloques del día', value: 'all' },
                  { label: 'Solo los que coincidan con el filtro', value: 'matches' },
                ]}
              />
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500">Nueva modalidad</p>
            <Input
              value={newModality}
              onChange={(e) => setNewModality(e.target.value)}
              placeholder="Ej: Strength, Cardio intervalado, Técnica..."
            />
          </div>
        </div>
      </Card>

      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button
          variant="secondary"
          onClick={handleApplyBulkModality}
          disabled={!newModality.trim() || targetDays.length === 0}
        >
          Cambiar modalidad en lote
        </Button>
      </div>
    </div>
  );
}


