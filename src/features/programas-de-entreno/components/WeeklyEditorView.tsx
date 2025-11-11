import { memo, useState, useMemo } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import { Button } from '../../../components/componentsreutilizables';
import type { DayPlan } from '../types';

type WeeklyEditorViewProps = {
  weekDays: readonly string[];
  weeklyPlan: Record<string, DayPlan>;
  onViewDay: (day: string) => void;
  onReorderSessions?: (day: string, newSessions: DayPlan['sessions']) => void;
  weeklyTargets?: {
    duration: number;
    calories: number;
  };
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

const parseFirstNumber = (value: string) => {
  const match = value.match(/\d+(?:[.,]\d+)?/);
  return match ? Number(match[0].replace(',', '.')) : null;
};

function WeeklyEditorViewComponent({ weekDays, weeklyPlan, onViewDay, onReorderSessions, weeklyTargets }: WeeklyEditorViewProps) {
  const [dragState, setDragState] = useState<{ day: string | null; fromIndex: number | null }>({ day: null, fromIndex: null });
  
  // Calcular si cada día excede los objetivos semanales
  const dayExceedsTargets = useMemo(() => {
    const exceeds: Record<string, { duration: boolean; calories: boolean }> = {};
    
    weekDays.forEach((day) => {
      const plan = weeklyPlan[day];
      if (!plan || !weeklyTargets) {
        exceeds[day] = { duration: false, calories: false };
        return;
      }
      
      const totalMinutes = plan.sessions.reduce((total, session) => total + (parseFirstNumber(session.duration) ?? 0), 0);
      const calories = Math.round(totalMinutes * 8);
      
      exceeds[day] = {
        duration: totalMinutes > weeklyTargets.duration,
        calories: calories > weeklyTargets.calories,
      };
    });
    
    return exceeds;
  }, [weekDays, weeklyPlan, weeklyTargets]);

  const handleDragStart = (day: string, index: number) => (e: React.DragEvent<HTMLDivElement>) => {
    setDragState({ day, fromIndex: index });
    e.dataTransfer.setData('text/plain', JSON.stringify({ day, index }));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (day: string) => (e: React.DragEvent<HTMLDivElement>) => {
    if (dragState.day === day) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDrop = (day: string, toIndex: number) => (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const fromIndex = dragState.day === day ? dragState.fromIndex : null;
    if (fromIndex == null || fromIndex === toIndex) return;
    const sessions = weeklyPlan[day]?.sessions || [];
    const newSessions = [...sessions];
    const [moved] = newSessions.splice(fromIndex, 1);
    newSessions.splice(toIndex, 0, moved);
    onReorderSessions?.(day, newSessions);
    setDragState({ day: null, fromIndex: null });
  };

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
          const planSessions = plan?.sessions || [];
          const exceeds = dayExceedsTargets[day];
          const hasExceeded = exceeds && (exceeds.duration || exceeds.calories);

          return (
            <div
              key={day}
              className={`space-y-4 rounded-3xl border p-4 shadow-lg transition hover:-translate-y-1 hover:shadow-xl ${
                hasExceeded
                  ? 'border-red-300 bg-red-50/50 ring-2 ring-red-200'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-medium uppercase text-slate-400">{day}</p>
                    {hasExceeded && (
                      <AlertCircle className="h-4 w-4 text-red-500" title="Excede objetivos semanales" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{plan?.focus ?? 'Sin plan'}</h3>
                  {hasExceeded && (
                    <div className="mt-1 flex flex-wrap gap-1 text-xs">
                      {exceeds.duration && (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-red-700">Excede duración</span>
                      )}
                      {exceeds.calories && (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-red-700">Excede calorías</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                {planSessions.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-center text-slate-500">
                    Sin sesiones. Crea o arrastra bloques.
                  </div>
                ) : (
                  planSessions.map((session, idx) => (
                    <div
                      key={session.id}
                      className="group flex cursor-move items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
                      draggable
                      onDragStart={handleDragStart(day, idx)}
                      onDragOver={handleDragOver(day)}
                      onDrop={handleDrop(day, idx)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-6 w-6 rounded-md bg-slate-100 text-[11px] font-semibold text-slate-500 flex items-center justify-center">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900">{session.block}</div>
                          <div className="text-xs text-slate-500">{session.time} · {session.duration} · {session.modality}</div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
                        Ver día
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const WeeklyEditorView = memo(WeeklyEditorViewComponent);

