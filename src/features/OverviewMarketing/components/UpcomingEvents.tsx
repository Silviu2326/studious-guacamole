import React from 'react';
import { CalendarDays, Users, Video } from 'lucide-react';
import { Badge, Card } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { UpcomingEvent } from '../types';

interface UpcomingEventsProps {
  events: UpcomingEvent[];
  loading?: boolean;
  className?: string;
}

const typeIcon: Record<UpcomingEvent['type'], React.ReactNode> = {
  webinar: <Video className="w-4 h-4" />,
  live: <Video className="w-4 h-4" />,
  workshop: <Users className="w-4 h-4" />,
  challenge: <Users className="w-4 h-4" />,
};

const statusBadge: Record<UpcomingEvent['status'], { label: string; variant: 'blue' | 'yellow' | 'gray' }> = {
  draft: { label: 'Borrador', variant: 'gray' },
  scheduled: { label: 'Programado', variant: 'yellow' },
  registration_open: { label: 'Inscripciones abiertas', variant: 'blue' },
};

const dateFormatter = new Intl.DateTimeFormat('es-ES', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

export const UpcomingEvents: React.FC<UpcomingEventsProps> = ({
  events,
  loading = false,
  className = '',
}) => {
  const placeholders = Array.from({ length: 3 }).map((_, index) => (
    <div key={`upcoming-skeleton-${index}`} className={`${ds.shimmer} h-24`} />
  ));

  return (
    <Card className={`col-span-2 ${className}`.trim()}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-slate-600" />
            </span>
            <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Próximos eventos y webinars
            </h2>
          </div>
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            Activa nurturing y campañas cruzadas para maximizar registros y asistencia.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {loading && events.length === 0
          ? placeholders
          : events.map((event) => {
              const badge = statusBadge[event.status];
              const goalProgress = Math.min(100, Math.round((event.registrations / event.goal) * 100));

              return (
                <div
                  key={event.id}
                  className="rounded-2xl border border-gray-100 dark:border-gray-900 p-4 sm:p-5 bg-white/90 dark:bg-[#0f172a]/80 backdrop-blur"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                        {typeIcon[event.type]}
                      </div>
                      <div>
                        <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                          {event.title}
                        </h3>
                        <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                          {event.targetAudience}
                        </p>
                      </div>
                    </div>
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                        Fecha
                      </p>
                      <p className={`${ds.typography.bodyLarge} font-semibold ${ds.color.textPrimaryDark}`}>
                        {dateFormatter.format(new Date(event.date))}
                      </p>
                    </div>
                    <div>
                      <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                        Host
                      </p>
                      <p className={`${ds.typography.bodyLarge} font-semibold ${ds.color.textPrimaryDark}`}>
                        {event.host}
                      </p>
                    </div>
                    <div>
                      <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                        Registros
                      </p>
                      <p className={`${ds.typography.bodyLarge} font-semibold ${ds.color.textPrimaryDark}`}>
                        {event.registrations}/{event.goal}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                        Progreso de registro
                      </span>
                      <span className={`${ds.typography.caption} font-semibold text-indigo-500`}>{goalProgress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
                        style={{ width: `${goalProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
    </Card>
  );
};


