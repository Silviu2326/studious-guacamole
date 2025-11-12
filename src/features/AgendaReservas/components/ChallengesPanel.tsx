import { CalendarRange } from 'lucide-react';
import { Badge, Card } from '../../../components/componentsreutilizables';
import type { ChallengeEvent } from '../api';

interface ChallengesPanelProps {
  challenges: ChallengeEvent[];
}

export function ChallengesPanel({ challenges }: ChallengesPanelProps) {
  return (
    <Card className="bg-white shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700/40" padding="lg">
      <div className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-violet-100 p-3 text-violet-600">
              <CalendarRange className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Eventos & retos</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Gestiona competencias, retos gamificados y eventos especiales del centro.
              </p>
            </div>
          </div>
          <Badge variant="purple" size="md">
            {challenges.length} campañas activas o planificadas
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {challenges.map(challenge => (
            <div
              key={challenge.id}
              className="rounded-2xl border border-slate-200/70 bg-slate-50 p-5 shadow-sm dark:border-slate-700/40 dark:bg-slate-900/40"
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold text-slate-900 dark:text-white">{challenge.name}</p>
                <Badge
                  variant={
                    challenge.status === 'activo'
                      ? 'green'
                      : challenge.status === 'planificado'
                        ? 'blue'
                        : 'gray'
                  }
                  size="sm"
                >
                  {challenge.status}
                </Badge>
              </div>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {new Date(challenge.startDate).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: 'short',
                })}{' '}
                –{' '}
                {new Date(challenge.endDate).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: 'short',
                })}
              </p>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{challenge.goal}</p>
              <div className="mt-4 rounded-xl bg-white p-3 text-sm shadow-sm dark:bg-slate-800/60">
                {challenge.registered} participantes registrados
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}











