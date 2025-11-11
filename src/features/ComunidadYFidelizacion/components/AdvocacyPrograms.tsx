import { CalendarCheck, Rocket, Trophy, Target, ChevronRight } from 'lucide-react';
import { Card, Badge, Button } from '../../../components/componentsreutilizables';
import { AdvocacyMoment, EngagementProgram } from '../types';

interface AdvocacyProgramsProps {
  programs: EngagementProgram[];
  advocacyMoments: AdvocacyMoment[];
  loading?: boolean;
}

export function AdvocacyPrograms({ programs, advocacyMoments, loading }: AdvocacyProgramsProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <Card className="bg-white/90 dark:bg-slate-900/80 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Engagement Hub
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
              Orquesta tus programas de comunidad, fidelización y advocacy con claridad sobre KPIs,
              responsables e impacto.
            </p>
          </div>
          <Badge variant="blue" size="sm" className="inline-flex items-center gap-1.5">
            <Rocket className="w-3.5 h-3.5" />
            Playbooks
          </Badge>
        </header>

        <div className="mt-6 space-y-4">
          {(loading ? Array.from({ length: 3 }) : programs).map((program, index) => (
            <article
              key={program?.id ?? index}
              className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white via-white to-slate-50 dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950 p-5"
            >
              {program ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {program.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{program.description}</p>
                    </div>
                    <Badge variant="blue" size="sm" className="inline-flex items-center gap-1">
                      <Target className="w-3.5 h-3.5" />
                      {program.kpi}
                    </Badge>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                      <span>Owner: {program.owner}</span>
                      <span>Progreso: {program.progress}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-200/70 dark:bg-slate-800/60 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          program.trend === 'positive'
                            ? 'bg-emerald-500'
                            : program.trend === 'negative'
                              ? 'bg-rose-500'
                              : 'bg-slate-400'
                        }`}
                        style={{ width: `${Math.min(100, program.progress)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <ProgramSkeleton />
              )}
            </article>
          ))}
        </div>
      </Card>

      <Card className="bg-white/90 dark:bg-slate-900/80 shadow-sm border border-slate-200/60 dark:border-slate-800/60 flex flex-col">
        <header className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Momentos de advocacy
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Mantén vivo el momentum generando hitos sociales y celebraciones con tu comunidad.
            </p>
          </div>
          <Badge variant="blue" size="sm" className="inline-flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5" />
            Historias
          </Badge>
        </header>

        <div className="mt-6 grow">
          <ul className="space-y-4">
            {(loading ? Array.from({ length: 4 }) : advocacyMoments).map((moment, index) => (
              <li
                key={moment?.id ?? index}
                className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-4 bg-gradient-to-r from-white via-white to-slate-50 dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950"
              >
                {moment ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-slate-900/5 dark:bg-white/10">
                          <CalendarCheck className="w-4 h-4 text-slate-700 dark:text-slate-200" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {moment.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Due: {moment.dueDate} · Owner: {moment.owner}
                          </p>
                        </div>
                      </div>
                      <StatusBadge status={moment.status} />
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span>Tipo: {moment.type}</span>
                      <span className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300">
                        {moment.impact}
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ) : (
                  <MomentSkeleton />
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex justify-end">
          <Button variant="secondary" className="inline-flex items-center gap-2">
            <Rocket className="w-4 h-4" />
            Lanzar nuevo playbook
          </Button>
        </div>
      </Card>
    </div>
  );
}

interface StatusBadgeProps {
  status: AdvocacyMoment['status'];
}

function StatusBadge({ status }: StatusBadgeProps) {
  const map = {
    'planificado': { label: 'Planificado', className: 'bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-300' },
    'en curso': { label: 'En curso', className: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300' },
    'completado': { label: 'Completado', className: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300' },
  } as const;

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${map[status].className}`}>
      {map[status].label}
    </span>
  );
}

function ProgramSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-4 w-40 rounded-md bg-slate-200/70 dark:bg-slate-800/70" />
          <div className="h-3 w-56 rounded-md bg-slate-200/60 dark:bg-slate-800/60" />
        </div>
        <div className="h-5 w-20 rounded-full bg-slate-200/60 dark:bg-slate-800/60" />
      </div>
      <div className="flex items-center justify-between">
        <div className="h-3 w-32 rounded-md bg-slate-200/60 dark:bg-slate-800/60" />
        <div className="h-3 w-20 rounded-md bg-slate-200/60 dark:bg-slate-800/60" />
      </div>
      <div className="h-2 w-full rounded-full bg-slate-200/60 dark:bg-slate-800/60" />
    </div>
  );
}

function MomentSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-slate-200/60 dark:bg-slate-800/60" />
          <div>
            <div className="h-4 w-36 rounded-md bg-slate-200/70 dark:bg-slate-800/70" />
            <div className="mt-2 h-3 w-44 rounded-md bg-slate-200/60 dark:bg-slate-800/60" />
          </div>
        </div>
        <div className="h-5 w-20 rounded-full bg-slate-200/60 dark:bg-slate-800/60" />
      </div>
      <div className="flex items-center justify-between">
        <div className="h-3 w-24 rounded-md bg-slate-200/60 dark:bg-slate-800/60" />
        <div className="h-3 w-32 rounded-md bg-slate-200/60 dark:bg-slate-800/60" />
      </div>
    </div>
  );
}





