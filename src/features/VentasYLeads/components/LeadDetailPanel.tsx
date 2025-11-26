import {
  Badge,
  Button,
  Card,
  Tooltip,
} from '../../../components/componentsreutilizables';
import type { LeadOpportunity } from '../api';
import {
  ArrowRightLeft,
  CalendarPlus,
  Check,
  FilePlus2,
  Mail,
  MessageCircle,
  Phone,
  Plus,
  Sparkles,
  Tag,
  UserRound,
} from 'lucide-react';

interface LeadDetailPanelProps {
  lead: LeadOpportunity | null;
  onClose: () => void;
}

const statusBadgeClass: Record<LeadOpportunity['status'], string> = {
  nuevo: 'bg-sky-100 text-sky-700',
  contactado: 'bg-orange-100 text-orange-700',
  cita_agendada: 'bg-amber-100 text-amber-700',
  no_presentado: 'bg-rose-100 text-rose-700',
  visita_realizada: 'bg-indigo-100 text-indigo-700',
  en_prueba: 'bg-emerald-100 text-emerald-700',
  cerrado_ganado: 'bg-green-100 text-green-700',
  cerrado_perdido: 'bg-slate-200 text-slate-600',
};

const statusLabels: Record<LeadOpportunity['status'], string> = {
  nuevo: 'Nuevo',
  contactado: 'Contactado',
  cita_agendada: 'Cita agendada',
  no_presentado: 'No presentado',
  visita_realizada: 'Visitó el centro',
  en_prueba: 'En prueba',
  cerrado_ganado: 'Cerrado ganado',
  cerrado_perdido: 'Cerrado perdido',
};

const stageLabels: Record<LeadOpportunity['stage'], string> = {
  captacion: 'Captación',
  calificacion: 'Calificación',
  agenda: 'Agenda',
  visita: 'Visita al centro',
  seguimiento_prueba: 'Seguimiento prueba',
  cierre: 'Cierre',
};

export function LeadDetailPanel({ lead, onClose }: LeadDetailPanelProps) {
  if (!lead) {
    return (
      <aside className="hidden w-[340px] lg:flex lg:flex-col">
        <Card className="flex h-full flex-col items-center justify-center bg-white text-center shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900/40 dark:ring-slate-700/50">
          <div className="space-y-3 px-6">
            <Sparkles className="mx-auto h-10 w-10 text-indigo-400" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Selecciona un lead</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Visualiza aquí la ficha 360º con información de contacto, histórico y acciones clave.
            </p>
          </div>
        </Card>
      </aside>
    );
  }

  return (
    <aside className="w-full lg:w-[360px] xl:w-[380px]">
      <div className="sticky top-6 space-y-5">
        <Card className="bg-white shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900/50 dark:ring-slate-700/60">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{lead.name}</h2>
                <Badge
                  variant="secondary"
                  className={`${statusBadgeClass[lead.status]} border border-white/60 dark:border-transparent`}
                >
                  {statusLabels[lead.status]}
                </Badge>
              </div>
              {lead.tags && lead.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {lead.tags.map(tag => (
                    <Badge key={tag} variant="secondary" size="sm" className="bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-100">
                      <Tag className="mr-1 h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{lead.objective}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cerrar
            </Button>
          </div>

          <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-indigo-500" />
              <span>{lead.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-indigo-500" />
              <span>{lead.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <UserRound className="h-4 w-4 text-indigo-500" />
              <span>
                {lead.owner} · {lead.ownerRole === 'comercial' ? 'Comercial' : 'Entrenador'}
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl border border-slate-200/70 bg-slate-50 px-3 py-3 dark:border-slate-700/60 dark:bg-slate-800/60">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                Probabilidad
              </p>
              <p className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
                {(lead.probability * 100).toFixed(0)}%
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/70 bg-slate-50 px-3 py-3 dark:border-slate-700/60 dark:bg-slate-800/60">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                Valor potencial
              </p>
              <p className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
                {lead.potentialValue.toLocaleString('es-ES', {
                  style: 'currency',
                  currency: 'EUR',
                  maximumFractionDigits: 0,
                })}
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2 text-xs">
            <Button variant="secondary" size="sm" leftIcon={<MessageCircle className="h-4 w-4" />}>
              WhatsApp
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<Phone className="h-4 w-4" />}>
              Llamar
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<Mail className="h-4 w-4" />}>
              Email
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<CalendarPlus className="h-4 w-4" />}>
              Cita
            </Button>
          </div>
        </Card>

        <Card className="bg-white shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900/40 dark:ring-slate-700/60">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
            Estado & pipeline
          </h3>
          <dl className="mt-3 space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <div className="flex items-center justify-between">
              <dt>Fase pipeline</dt>
              <dd className="font-semibold text-slate-900 dark:text-white">{stageLabels[lead.stage]}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt>Secuencias activas</dt>
              <dd className="flex flex-wrap justify-end gap-2">
                {lead.sequences?.map(sequence => (
                  <Badge
                    key={sequence.id}
                    variant={sequence.status === 'activa' ? 'green' : sequence.status === 'pausada' ? 'orange' : 'gray'}
                    size="sm"
                  >
                    {sequence.label}
                  </Badge>
                )) ?? '—'}
              </dd>
            </div>
            {lead.nextAction && (
              <div className="flex items-start justify-between gap-3">
                <dt>Próxima acción</dt>
                <dd className="text-right">
                  <p className="font-semibold text-slate-900 dark:text-white">{lead.nextAction.label}</p>
                  {lead.nextAction.dueDate && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(lead.nextAction.dueDate).toLocaleString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  )}
                </dd>
              </div>
            )}
          </dl>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="primary" size="sm" leftIcon={<Check className="h-4 w-4" />}>
              Convertir a cliente
            </Button>
            <Button variant="ghost" size="sm" leftIcon={<ArrowRightLeft className="h-4 w-4" />}>
              Mover de fase
            </Button>
          </div>
        </Card>

        <Card className="bg-white shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900/40 dark:ring-slate-700/60">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
              Actividades & notas
            </h3>
            <div className="flex gap-2">
              <Tooltip content="Añadir nota">
                <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0">
                  <FilePlus2 className="h-4 w-4" />
                </Button>
              </Tooltip>
              <Tooltip content="Nueva tarea">
                <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </Tooltip>
            </div>
          </div>

          <div className="mt-4 space-y-4">
            {lead.timeline.map(event => (
              <div key={event.id} className="rounded-2xl border border-slate-200/70 bg-white px-3 py-3 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/60">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{event.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{event.createdBy}</p>
                  </div>
                  <span className="text-xs text-slate-400">
                    {new Date(event.createdAt).toLocaleString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                {event.description && (
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{event.description}</p>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </aside>
  );
}

