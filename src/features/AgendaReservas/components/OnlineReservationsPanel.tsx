import { Badge, Card } from '../../../components/componentsreutilizables';
import type { OnlineReservationChannel } from '../api';

interface OnlineReservationsPanelProps {
  channels: OnlineReservationChannel[];
}

export function OnlineReservationsPanel({ channels }: OnlineReservationsPanelProps) {
  return (
    <Card className="bg-white shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700/40" padding="lg">
      <div className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Reservas online</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Analiza conversiones y tiempos de respuesta por canal digital.
            </p>
          </div>
          <Badge variant="purple" size="md">
            {channels.length} canales conectados
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {channels.map(channel => (
            <div
              key={channel.id}
              className="rounded-2xl border border-slate-200/70 bg-slate-50 p-5 shadow-sm dark:border-slate-700/40 dark:bg-slate-900/40"
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold text-slate-900 dark:text-white">{channel.name}</p>
                <Badge variant={channel.status === 'activo' ? 'green' : 'orange'} size="sm">
                  {channel.status === 'activo' ? 'Activo' : 'Pausado'}
                </Badge>
              </div>
              <dl className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Conversión
                  </dt>
                  <dd className="text-base font-semibold text-slate-900 dark:text-white">
                    {(channel.conversionRate * 100).toFixed(0)}%
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Antelación promedio
                  </dt>
                  <dd>{channel.averageLeadTime.toFixed(1)} días</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Última sincronización
                  </dt>
                  <dd>
                    {new Date(channel.lastSync).toLocaleString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}






