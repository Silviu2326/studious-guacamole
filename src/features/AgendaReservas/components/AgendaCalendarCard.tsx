import { Calendar } from 'lucide-react';
import { Badge, Card } from '../../../components/componentsreutilizables';
import type { AgendaEvent } from '../api';

interface AgendaCalendarCardProps {
  events: AgendaEvent[];
}

export function AgendaCalendarCard({ events }: AgendaCalendarCardProps) {
  return (
    <Card className="bg-white shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700/40" padding="lg">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-indigo-100 p-3 text-indigo-600">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Agenda del día</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Controla ocupación, tipos de actividad y disponibilidad por sala.
            </p>
          </div>
        </div>
        <Badge variant="blue" size="md">
          {events.length} actividades programadas
        </Badge>
      </div>

      <div className="mt-6 space-y-3">
        {events.map(event => {
          const occupancy = Math.round((event.attendees / event.capacity) * 100);
          return (
            <div
              key={event.id}
              className="rounded-2xl border border-slate-200/70 bg-slate-50 p-4 transition hover:border-indigo-200 hover:bg-indigo-50 dark:border-slate-700/40 dark:bg-slate-900/40"
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    {event.type === 'clase'
                      ? 'Clase grupal'
                      : event.type === 'evento'
                        ? 'Evento especial'
                        : 'Sesión individual'}
                  </p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{event.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {new Date(event.start).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    –{' '}
                    {new Date(event.end).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    • {event.location}
                  </p>
                </div>
                <Badge variant={occupancy >= 90 ? 'red' : occupancy >= 70 ? 'orange' : 'green'} size="sm">
                  {occupancy}% ocupación
                </Badge>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}











