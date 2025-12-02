import { useMemo } from 'react';
import {
  Badge,
  Card,
  Button,
} from '../../../components/componentsreutilizables';
import type { LeadOpportunity, LeadWorkloadInsight } from '../api';
import {
  CalendarDays,
  Clock,
  Flame,
  Mail,
  MessageCircle,
  Phone,
  RefreshCw,
  Timer,
  TrendingUp,
} from 'lucide-react';

interface LeadTimelineViewProps {
  leads: LeadOpportunity[];
  workload: LeadWorkloadInsight | null;
  onSelectLead: (leadId: string) => void;
}

type GroupKey =
  | 'hoy'
  | 'sinContacto'
  | 'citas'
  | 'sinRespuesta';

interface TimelineGroup {
  title: string;
  description: string;
  emptyMessage: string;
  accent: string;
  icon: JSX.Element;
  leads: LeadOpportunity[];
}

const isSameDay = (date: Date, other: Date) =>
  date.getFullYear() === other.getFullYear() &&
  date.getMonth() === other.getMonth() &&
  date.getDate() === other.getDate();

const formatHour = (isoDate: string) =>
  new Date(isoDate).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
  });

const channelIcon = (channel?: string) => {
  switch (channel) {
    case 'whatsapp':
      return <MessageCircle className="h-4 w-4 text-emerald-500" />;
    case 'email':
      return <Mail className="h-4 w-4 text-sky-500" />;
    case 'llamada':
      return <Phone className="h-4 w-4 text-indigo-500" />;
    case 'sms':
      return <MessageCircle className="h-4 w-4 text-violet-500" />;
    default:
      return <Clock className="h-4 w-4 text-slate-500" />;
  }
};

export function LeadTimelineView({ leads, workload, onSelectLead }: LeadTimelineViewProps) {
  const groups = useMemo(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    const leadsNewToday = leads.filter(lead => isSameDay(new Date(lead.createdAt), now));

    const leadsWithoutContact = leads.filter(lead => {
      if (!lead.lastContact) return true;
      const diffMs = now.getTime() - new Date(lead.lastContact.date).getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      return diffHours >= 12 && lead.status !== 'cerrado_ganado';
    });

    const leadsWithAppointments = leads.filter(lead => {
      if (!lead.nextAction?.dueDate) return false;
      const dueDate = new Date(lead.nextAction.dueDate);
      return (
        isSameDay(dueDate, now) ||
        isSameDay(dueDate, tomorrow)
      );
    });

    const leadsNoResponse3Days = leads.filter(lead => {
      if (!lead.lastContact) return false;
      const diffMs = now.getTime() - new Date(lead.lastContact.date).getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      return diffDays >= 3 && lead.status !== 'cerrado_ganado';
    });

    const groupsMap: Record<GroupKey, TimelineGroup> = {
      hoy: {
        title: 'Hoy: leads nuevos',
        description: 'Activa la secuencia de bienvenida en menos de 10 minutos para maximizar la conversión.',
        emptyMessage: 'Sin nuevos leads hoy. Revisa campañas y automatizaciones.',
        accent: 'from-sky-100 to-sky-200/60 border-sky-200',
        icon: <RefreshCw className="h-4 w-4 text-sky-600" />,
        leads: leadsNewToday,
      },
      sinContacto: {
        title: 'Leads sin contacto +12h',
        description: 'Prioriza contacto multicanal para evitar perder interés.',
        emptyMessage: 'Todos los leads han sido contactados dentro del SLA.',
        accent: 'from-amber-100 to-amber-200/60 border-amber-200',
        icon: <Timer className="h-4 w-4 text-amber-600" />,
        leads: leadsWithoutContact,
      },
      citas: {
        title: 'Citas hoy / mañana',
        description: 'Confirma asistencia, prepara dossier y envía recordatorio automático.',
        emptyMessage: 'No hay citas programadas para las próximas 48h.',
        accent: 'from-indigo-100 to-indigo-200/60 border-indigo-200',
        icon: <CalendarDays className="h-4 w-4 text-indigo-600" />,
        leads: leadsWithAppointments,
      },
      sinRespuesta: {
        title: 'Leads sin respuesta +3 días',
        description: 'Activa cadencias de reenganche y considera ofertas especiales.',
        emptyMessage: 'No hay leads estancados sin respuesta.',
        accent: 'from-rose-100 to-rose-200/60 border-rose-200',
        icon: <Flame className="h-4 w-4 text-rose-600" />,
        leads: leadsNoResponse3Days,
      },
    };

    return groupsMap;
  }, [leads]);

  return (
    <div className="grid gap-6 2xl:grid-cols-[2fr_1fr]">
      <div className="space-y-5">
        {Object.entries(groups).map(([key, group]) => (
          <Card
            key={key}
            className={`bg-white shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900/40 dark:ring-slate-700/50`}
          >
            <div className="space-y-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br ${group.accent}`}
                    >
                      {group.icon}
                    </span>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{group.title}</h3>
                  </div>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{group.description}</p>
                </div>
                <Badge variant="secondary" size="md" className="bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-200">
                  {group.leads.length} leads
                </Badge>
              </div>

              <div className="space-y-3">
                {group.leads.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-300">
                    {group.emptyMessage}
                  </div>
                ) : (
                  group.leads.map(lead => (
                    <div
                      key={`${key}-${lead.id}`}
                      className="rounded-2xl border border-slate-200/60 bg-white px-4 py-3 shadow-sm transition hover:border-indigo-200 hover:shadow-md dark:border-slate-700/60 dark:bg-slate-900/50"
                    >
                      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="text-base font-semibold text-slate-900 dark:text-white">{lead.name}</p>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <Badge variant="secondary" size="sm" className="bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-200">
                              {lead.source}
                            </Badge>
                            <span className="h-1 w-1 rounded-full bg-slate-300" />
                            <span>{lead.owner}</span>
                            <span className="h-1 w-1 rounded-full bg-slate-300" />
                            <span>{lead.sede}</span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => onSelectLead(lead.id)}
                        >
                          Abrir ficha
                        </Button>
                      </div>

                      <div className="mt-3 grid gap-3 text-xs text-slate-600 dark:text-slate-300 md:grid-cols-3">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-emerald-500" />
                          <span>{Math.round(lead.probability * 100)}% cierre</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {channelIcon(lead.lastContact?.channel)}
                          <span>
                            {lead.lastContact
                              ? `${formatDate(lead.lastContact.date)} · ${formatHour(lead.lastContact.date)}`
                              : 'Sin contacto'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-slate-400" />
                          <span>
                            {lead.nextAction?.dueDate
                              ? `${formatDate(lead.nextAction.dueDate)} · ${formatHour(lead.nextAction.dueDate)}`
                              : 'Sin próxima acción'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <aside className="space-y-4">
        <Card className="bg-white shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900/40 dark:ring-slate-700/50">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white">Alertas SLA</h4>
              <Badge variant="destructive" size="md">
                {workload?.slaBreached ?? 0} pendientes
              </Badge>
            </div>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-3">
                <Timer className="mt-1 h-4 w-4 text-amber-500" />
                <span>
                  {workload?.slaBreached ?? 0} leads sin contacto en las últimas 24h. Prioriza seguimiento inmediato.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CalendarDays className="mt-1 h-4 w-4 text-indigo-500" />
                <span>
                  {workload?.appointmentsToday ?? 0} citas hoy. Confirma asistencia y prepara dossiers personalizados.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <TrendingUp className="mt-1 h-4 w-4 text-emerald-500" />
                <span>
                  {workload?.leadsToday ?? 0} leads entraron hoy vía campañas. Activa cadencias de bienvenida automáticamente.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Flame className="mt-1 h-4 w-4 text-rose-500" />
                <span>
                  {workload?.followUpsDue ?? 0} seguimientos vencen hoy. Revisa listas inteligentes «Calientes».
                </span>
              </li>
            </ul>
          </div>
        </Card>
      </aside>
    </div>
  );
}

