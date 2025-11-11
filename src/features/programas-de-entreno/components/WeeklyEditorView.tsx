import { memo } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../../components/componentsreutilizables';
import type { DayPlan } from '../types';

type WeeklyEditorViewProps = {
  weekDays: readonly string[];
  weeklyPlan: Record<string, DayPlan>;
  onViewDay: (day: string) => void;
};

const dayGradients = [
  'from-amber-200 via-rose-100 to-indigo-100',
  'from-indigo-200 via-amber-100 to-emerald-100',
  'from-emerald-200 via-indigo-100 to-rose-100',
  'from-amber-200 via-rose-100 to-indigo-100',
  'from-indigo-200 via-amber-100 to-emerald-100',
  'from-emerald-200 via-indigo-100 to-rose-100',
  'from-amber-200 via-rose-100 to-indigo-100',
];

function WeeklyEditorViewComponent({ weekDays, weeklyPlan, onViewDay }: WeeklyEditorViewProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Plan semanal</h2>

      <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-7">
        {weekDays.map((day, index) => (
          <button
            key={day}
            type="button"
            onClick={() => onViewDay(day)}
            className={`flex flex-col items-center justify-center rounded-3xl bg-gradient-to-br ${dayGradients[index % dayGradients.length]} p-4 text-slate-800 shadow-md transition hover:-translate-y-1 hover:shadow-xl`}
          >
            <span className="text-sm text-slate-500">{day}</span>
            <span className="mt-2 text-2xl font-semibold text-slate-900">{index + 22}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {weekDays.map((day) => {
          const plan = weeklyPlan[day];

          const renderSlot = (slot: string) => (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-4 text-center shadow-sm">
              <div className="mx-auto inline-flex items-center rounded-full bg-slate-100 px-4 py-1 text-xs font-semibold text-slate-500">
                {slot}
              </div>
              <div className="mt-4 flex h-20 flex-col items-center justify-center rounded-full bg-slate-50 shadow-inner">
                <span className="text-3xl text-slate-400">+</span>
                <span className="mt-1 text-xs text-slate-400">Arrastra ejercicios aquí</span>
              </div>
              <Button
                variant="primary"
                size="sm"
                className="mt-4 w-full bg-amber-500 text-white hover:bg-amber-600"
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Crear sesión
              </Button>
            </div>
          );

          return (
            <div
              key={day}
              className="space-y-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase text-slate-400">{day}</p>
                  <h3 className="text-lg font-semibold text-slate-900">{plan?.focus ?? 'Sin plan'}</h3>
                </div>
              </div>
              <div className="space-y-4">
                {renderSlot('Mañana')}
                {renderSlot('Tarde')}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const WeeklyEditorView = memo(WeeklyEditorViewComponent);

