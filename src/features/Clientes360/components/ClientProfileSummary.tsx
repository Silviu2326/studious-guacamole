import { Badge, Card, MetricCards, type MetricCardData } from '../../../components/componentsreutilizables';
import type { Client360Summary, ClientProfile } from '../api';

interface ClientProfileSummaryProps {
  client?: Client360Summary;
  profile?: ClientProfile | null;
}

const trendColor: Record<'up' | 'down' | 'neutral', MetricCardData['color']> = {
  up: 'success',
  down: 'warning',
  neutral: 'info',
};

export function ClientProfileSummary({ client, profile }: ClientProfileSummaryProps) {
  if (!client) {
    return (
      <Card className="bg-white shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700/40" padding="lg">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Selecciona un cliente del listado para ver su ficha 360°.
        </p>
      </Card>
    );
  }

  const metrics: MetricCardData[] =
    profile?.metrics.map(metric => ({
      id: metric.id,
      title: metric.label,
      value: metric.value,
      color: trendColor[metric.trend],
    })) ?? [];

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700/40" padding="lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <Badge variant="blue" size="sm">
              Cliente {client.status === 'activo' ? 'activo' : client.status}
            </Badge>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{client.name}</h2>
              <p className="text-sm text-slate-500">{client.email}</p>
            </div>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Membresía
                </dt>
                <dd className="text-sm text-slate-900 dark:text-slate-100">{client.membership}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Coach asignado
                </dt>
                <dd className="text-sm text-slate-900 dark:text-slate-100">{client.assignedCoach}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Última visita
                </dt>
                <dd className="text-sm text-slate-900 dark:text-slate-100">
                  {new Date(client.lastVisit).toLocaleString('es-ES', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  LTV
                </dt>
                <dd className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {client.lifetimeValue.toLocaleString('es-ES', {
                    style: 'currency',
                    currency: 'EUR',
                    maximumFractionDigits: 0,
                  })}
                </dd>
              </div>
            </dl>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 text-center dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Satisfacción
            </p>
            <p className="mt-2 text-4xl font-black text-indigo-600 dark:text-indigo-300">
              {client.satisfactionScore}%
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Promedio últimas encuestas</p>
          </div>
        </div>
      </Card>

      {profile && (
        <Card className="bg-white shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700/40" padding="lg">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Resumen</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{profile.biography}</p>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Objetivos activos
              </h4>
              <ul className="mt-2 grid gap-2 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
                {profile.goals.map(goal => (
                  <li key={goal} className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900/60">
                    {goal}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Programas
              </h4>
              <div className="grid gap-3 lg:grid-cols-2">
                {profile.programs.map(program => (
                  <Card key={program.id} className="bg-slate-50 ring-1 ring-slate-200 dark:bg-slate-900/50" padding="md">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">{program.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Próxima sesión:{' '}
                          {new Date(program.nextSession).toLocaleString('es-ES', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <Badge variant="purple" size="sm">
                        {program.progress}%
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {metrics.length > 0 && <MetricCards data={metrics} columns={3} />}
    </div>
  );
}

