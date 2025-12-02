import React from 'react';
import { Card, Button, Input, Select } from '../../../components/componentsreutilizables';
import type { DayPlan } from '../types';

type Props = {
  weekDays: ReadonlyArray<string>;
  workingPlan: Record<string, DayPlan>;
  setWorkingPlan: React.Dispatch<React.SetStateAction<Record<string, DayPlan>>>;
  setManualApplyStatus: (msg: string | null) => void;
};

type MetricType = 'intensity' | 'series' | 'repeticiones' | 'peso' | 'tempo' | 'descanso';
type MetricAction = 'set' | 'increase' | 'decrease' | 'multiply';

export function BulkMetricsMode({ weekDays, workingPlan, setWorkingPlan, setManualApplyStatus }: Props) {
  const [targetDays, setTargetDays] = React.useState<string[]>([]);
  const [metricType, setMetricType] = React.useState<MetricType>('intensity');
  const [metricAction, setMetricAction] = React.useState<MetricAction>('set');
  const [metricValue, setMetricValue] = React.useState('');
  const [filterText, setFilterText] = React.useState('');
  const [scope, setScope] = React.useState<'all' | 'matches'>('matches');

  const toggleDay = (day: string) => {
    setTargetDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]));
  };

  const handleApplyBulkMetrics = () => {
    if (targetDays.length === 0) return;

    const filter = filterText.trim().toLowerCase();
    const value = metricValue.trim();

    setWorkingPlan((prev) => {
      const next: Record<string, DayPlan> = { ...prev };
      targetDays.forEach((day) => {
        const dayPlan = next[day];
        if (!dayPlan) return;
        next[day] = {
          ...dayPlan,
          sessions: dayPlan.sessions.map((session) => {
            // Aplicar filtro si está configurado
            if (scope === 'matches' && filter) {
              const matches =
                session.modality?.toLowerCase().includes(filter) ||
                session.block?.toLowerCase().includes(filter) ||
                session.intensity?.toLowerCase().includes(filter);
              if (!matches) return session;
            }

            const updated = { ...session };

            switch (metricType) {
              case 'intensity':
                if (metricAction === 'set') {
                  updated.intensity = value || session.intensity;
                }
                break;

              case 'series':
                if (metricAction === 'set') {
                  updated.series = value ? Number(value) : session.series;
                } else if (metricAction === 'increase') {
                  updated.series = (session.series ?? 0) + (value ? Number(value) : 0);
                } else if (metricAction === 'decrease') {
                  updated.series = Math.max(0, (session.series ?? 0) - (value ? Number(value) : 0));
                } else if (metricAction === 'multiply') {
                  updated.series = Math.round((session.series ?? 0) * (value ? Number(value) : 1));
                }
                break;

              case 'repeticiones':
                if (metricAction === 'set') {
                  updated.repeticiones = value || session.repeticiones;
                } else if (metricAction === 'increase') {
                  const current = session.repeticiones ? parseInt(session.repeticiones) || 0 : 0;
                  const increment = value ? parseInt(value) || 0 : 0;
                  updated.repeticiones = `${current + increment}`;
                } else if (metricAction === 'decrease') {
                  const current = session.repeticiones ? parseInt(session.repeticiones) || 0 : 0;
                  const decrement = value ? parseInt(value) || 0 : 0;
                  updated.repeticiones = `${Math.max(0, current - decrement)}`;
                } else if (metricAction === 'multiply') {
                  const current = session.repeticiones ? parseInt(session.repeticiones) || 0 : 0;
                  const factor = value ? parseFloat(value) || 1 : 1;
                  updated.repeticiones = `${Math.round(current * factor)}`;
                }
                break;

              case 'peso':
                if (metricAction === 'set') {
                  updated.peso = value ? Number(value) : session.peso;
                } else if (metricAction === 'increase') {
                  updated.peso = (session.peso ?? 0) + (value ? Number(value) : 0);
                } else if (metricAction === 'decrease') {
                  updated.peso = Math.max(0, (session.peso ?? 0) - (value ? Number(value) : 0));
                } else if (metricAction === 'multiply') {
                  updated.peso = (session.peso ?? 0) * (value ? Number(value) : 1);
                }
                break;

              case 'tempo':
                if (metricAction === 'set') {
                  updated.tempo = value || session.tempo;
                }
                break;

              case 'descanso':
                if (metricAction === 'set') {
                  updated.descanso = value ? Number(value) : session.descanso;
                } else if (metricAction === 'increase') {
                  updated.descanso = (session.descanso ?? 0) + (value ? Number(value) : 0);
                } else if (metricAction === 'decrease') {
                  updated.descanso = Math.max(0, (session.descanso ?? 0) - (value ? Number(value) : 0));
                } else if (metricAction === 'multiply') {
                  updated.descanso = Math.round((session.descanso ?? 0) * (value ? Number(value) : 1));
                }
                break;
            }

            return updated;
          }),
        };
      });
      return next;
    });

    const metricLabel =
      metricType === 'intensity'
        ? 'Intensidad'
        : metricType === 'series'
        ? 'Series'
        : metricType === 'repeticiones'
        ? 'Repeticiones'
        : metricType === 'peso'
        ? 'Peso (kg)'
        : metricType === 'tempo'
        ? 'Tempo'
        : 'Descanso (seg)';

    setManualApplyStatus(
      `${metricLabel} actualizado${metricAction === 'set' ? '' : ` (${metricAction === 'increase' ? 'aumentado' : metricAction === 'decrease' ? 'reducido' : 'multiplicado'})`} en lote. Revisa y aplica los cambios para guardarlos en el programa.`,
    );
  };

  const metricOptions = [
    { label: 'Intensidad', value: 'intensity' },
    { label: 'Series', value: 'series' },
    { label: 'Repeticiones', value: 'repeticiones' },
    { label: 'Peso (kg)', value: 'peso' },
    { label: 'Tempo', value: 'tempo' },
    { label: 'Descanso (seg)', value: 'descanso' },
  ];

  const actionOptions =
    metricType === 'intensity' || metricType === 'tempo'
      ? [{ label: 'Establecer', value: 'set' }]
      : [
          { label: 'Establecer', value: 'set' },
          { label: 'Aumentar', value: 'increase' },
          { label: 'Disminuir', value: 'decrease' },
          { label: 'Multiplicar', value: 'multiply' },
        ];

  const valuePlaceholder =
    metricType === 'intensity'
      ? 'Ej: RPE 7, Alta, Media...'
      : metricType === 'repeticiones'
      ? 'Ej: 10, 8-12, AMRAP...'
      : metricType === 'tempo'
      ? 'Ej: 3-1-1, 4-0-2...'
      : metricType === 'series' || metricType === 'peso' || metricType === 'descanso'
      ? metricAction === 'set'
        ? 'Valor numérico'
        : metricAction === 'multiply'
        ? 'Factor (ej: 1.1 para +10%)'
        : 'Cantidad a sumar/restar'
      : '';

  return (
    <div className="space-y-5">
      <Card className="space-y-4 border border-slate-200/70 bg-white/95 p-4 dark:border-slate-800/70 dark:bg-slate-900/50">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Modificar métricas en lote
            </p>
            <p className="text-xs text-slate-500">
              Cambia intensidad, series, repeticiones, peso, tempo o descanso de muchos bloques a la vez.
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
              <p className="text-xs font-semibold text-slate-500">Métrica a modificar</p>
              <Select
                value={metricType}
                onChange={(e) => {
                  setMetricType(e.target.value as MetricType);
                  // Reset action si es intensity o tempo (solo permiten 'set')
                  if (e.target.value === 'intensity' || e.target.value === 'tempo') {
                    setMetricAction('set');
                  }
                }}
                options={metricOptions}
              />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500">Acción</p>
              <Select
                value={metricAction}
                onChange={(e) => setMetricAction(e.target.value as MetricAction)}
                options={actionOptions}
              />
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500">
              {metricAction === 'set' ? 'Nuevo valor' : metricAction === 'increase' ? 'Cantidad a sumar' : metricAction === 'decrease' ? 'Cantidad a restar' : 'Factor de multiplicación'}
            </p>
            <Input
              value={metricValue}
              onChange={(e) => setMetricValue(e.target.value)}
              placeholder={valuePlaceholder}
              type={metricType === 'intensity' || metricType === 'tempo' || metricType === 'repeticiones' ? 'text' : 'number'}
            />
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
                Se aplica sobre modalidad, nombre de bloque e intensidad. Déjalo vacío para afectar a todos los bloques.
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
        </div>
      </Card>

      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button
          variant="secondary"
          onClick={handleApplyBulkMetrics}
          disabled={
            targetDays.length === 0 ||
            !metricValue.trim() ||
            (scope === 'matches' && filterText.trim() === '')
          }
        >
          Aplicar cambios en lote
        </Button>
      </div>
    </div>
  );
}

