import { memo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Clock,
  Timer,
  Flame,
  MapPin,
} from 'lucide-react';
import { Button, Card, Badge } from '../../../components/componentsreutilizables';
import type { DayPlan } from '../types';

type DailyEditorViewProps = {
  selectedDay: string;
  weekDays: readonly string[];
  dayPlan: DayPlan;
  onPreviousDay: () => void;
  onNextDay: () => void;
  onSelectDay: (day: string) => void;
  onBackToWeekly: () => void;
};

function DailyEditorViewComponent({
  selectedDay,
  weekDays,
  dayPlan,
  onPreviousDay,
  onNextDay,
  onSelectDay,
  onBackToWeekly,
}: DailyEditorViewProps) {
  const getExerciseMetrics = (index: number) => {
    const calories = 70 + index * 12;
    const rest = 60 + index * 15;
    return { calories, rest };
  };

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-500 via-indigo-400 to-emerald-400 p-6 text-white shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onPreviousDay}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div>
              <p className="text-xs uppercase tracking-wider text-indigo-100">Planificación diaria</p>
              <h2 className="text-2xl font-semibold leading-tight">{selectedDay}</h2>
              <p className="text-sm text-indigo-100/80">{dayPlan.microCycle}</p>
            </div>
            <button
              type="button"
              onClick={onNextDay}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<PlusCircle className="h-4 w-4" />}
              className="bg-white text-indigo-600 hover:bg-white/90"
            >
              Nueva sesión
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={onBackToWeekly}>
              Volver a semana
            </Button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-xs text-indigo-100">
          <span className="rounded-full bg-white/15 px-3 py-1 font-medium">Focus · {dayPlan.focus}</span>
          <span className="rounded-full bg-white/15 px-3 py-1 font-medium">Volumen · {dayPlan.volume}</span>
          <span className="rounded-full bg-white/15 px-3 py-1 font-medium">Intensidad · {dayPlan.intensity}</span>
          <span className="rounded-full bg-white/15 px-3 py-1 font-medium">Recuperación · {dayPlan.restorative}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {weekDays.map((day) => {
          const isActive = day === selectedDay;
          return (
            <button
              key={day}
              type="button"
              onClick={() => onSelectDay(day)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200/60'
                  : 'bg-white text-slate-500 shadow hover:bg-slate-100'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      <div className="grid gap-5">
        {dayPlan.sessions.map((session, index) => (
          <Card key={session.id} className="overflow-hidden border-none bg-white p-6 shadow-xl">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wide text-indigo-500">Bloque {index + 1}</span>
                <h3 className="mt-1 text-xl font-semibold text-slate-900">{session.block}</h3>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-indigo-500" />
                    {session.time}
                  </span>
                  <span className="flex items-center gap-2">
                    <Timer className="h-4 w-4 text-indigo-500" />
                    {session.duration}
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-indigo-500" />
                    Gimnasio principal
                  </span>
                </div>
              </div>
              <Badge size="sm" variant="secondary" className="rounded-full bg-amber-100 text-amber-600">
                pendiente
              </Badge>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600">Modalidad · {session.modality}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600">Intensidad · {session.intensity}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600">Notas · {session.notes}</span>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-slate-700">Ejercicios ({dayPlan.summary.length})</span>
                <span className="text-xs text-slate-400">Sugeridos para este bloque</span>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {dayPlan.summary.map((item, summaryIndex) => {
                  const { calories, rest } = getExerciseMetrics(summaryIndex);
                  return (
                    <div
                      key={`${session.id}-summary-${summaryIndex}`}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm transition hover:border-indigo-200 hover:bg-white"
                    >
                      <p className="text-sm font-semibold text-slate-800">{item}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Flame className="h-3.5 w-3.5 text-amber-500" />
                          {calories} kcal
                        </span>
                        <span className="flex items-center gap-1">
                          <Timer className="h-3.5 w-3.5 text-emerald-500" />
                          Descanso · {rest}s
                        </span>
                        <span className="flex items-center gap-1">
                          <PlusCircle className="h-3.5 w-3.5 text-indigo-500" />
                          3 series
                        </span>
                      </div>
                      <div className="mt-4 flex items-center gap-2">
                        <Button variant="ghost" size="xs">
                          Editar
                        </Button>
                        <Button variant="ghost" size="xs">
                          Duplicar
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export const DailyEditorView = memo(DailyEditorViewComponent);

