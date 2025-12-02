import {
  Badge,
  Button,
  Card,
  Tabs,
  type TabItem,
} from '../../../components/componentsreutilizables';
import type { Client360Summary, ClientProfile, ClientTimelineEvent } from '../api';
import {
  AlertCircle,
  Bot,
  CalendarClock,
  ClipboardList,
  CreditCard,
  Download,
  Dumbbell,
  FileText,
  FolderOpen,
  GaugeCircle,
  Heart,
  HeartPulse,
  Link2,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquare,
  PenSquare,
  Phone,
  Plus,
  RefreshCcw,
  Smile,
  Star,
  Users,
  UtensilsCrossed,
  Wallet,
  ChevronRight,
} from 'lucide-react';
import { useMemo, useState } from 'react';

interface ClientProfileSummaryProps {
  client?: Client360Summary;
  profile?: ClientProfile | null;
  loading?: boolean;
}

const DETAIL_TABS: TabItem[] = [
  { id: 'summary', label: 'Resumen', icon: <GaugeCircle className="h-4 w-4" /> },
  { id: 'health', label: 'Datos & Salud', icon: <HeartPulse className="h-4 w-4" /> },
  { id: 'memberships', label: 'Membresías & Planes', icon: <ClipboardList className="h-4 w-4" /> },
  { id: 'training', label: 'Entrenamiento & Resultados', icon: <Dumbbell className="h-4 w-4" /> },
  { id: 'nutrition', label: 'Nutrición', icon: <UtensilsCrossed className="h-4 w-4" /> },
  { id: 'attendance', label: 'Asistencia & Uso', icon: <CalendarClock className="h-4 w-4" /> },
  { id: 'finances', label: 'Finanzas & Pagos', icon: <CreditCard className="h-4 w-4" /> },
  { id: 'communications', label: 'Comunicaciones & Notas', icon: <MessageSquare className="h-4 w-4" /> },
  { id: 'satisfaction', label: 'Encuestas & Satisfacción', icon: <Smile className="h-4 w-4" /> },
  { id: 'documents', label: 'Documentos', icon: <FolderOpen className="h-4 w-4" /> },
  { id: 'automations', label: 'Automatizaciones & IA', icon: <Bot className="h-4 w-4" /> },
];

const formatCurrency = (value: number) =>
  value.toLocaleString('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  });

const formatDate = (value: string, options?: Intl.DateTimeFormatOptions) =>
  new Date(value).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    ...options,
  });

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString('es-ES', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

function Timeline({ events }: { events: ClientTimelineEvent[] }) {
  const ordered = useMemo(
    () =>
      [...events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [events],
  );

  return (
    <div className="space-y-4">
      {ordered.map(event => (
        <div key={event.id} className="flex gap-4">
          <div className="relative flex flex-col items-center">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-white shadow-lg ${
                event.tone === 'success'
                  ? 'bg-emerald-500'
                  : event.tone === 'warning'
                    ? 'bg-amber-500'
                    : 'bg-indigo-500'
              }`}
            >
              {event.category === 'membership' && <ClipboardList className="h-4 w-4" />}
              {event.category === 'attendance' && <CalendarClock className="h-4 w-4" />}
              {event.category === 'training' && <Dumbbell className="h-4 w-4" />}
              {event.category === 'nutrition' && <UtensilsCrossed className="h-4 w-4" />}
              {event.category === 'finance' && <CreditCard className="h-4 w-4" />}
              {event.category === 'communication' && <MessageCircle className="h-4 w-4" />}
              {event.category === 'incident' && <AlertCircle className="h-4 w-4" />}
            </span>
            <span className="mt-1 h-full w-px flex-1 bg-slate-200 last:hidden dark:bg-slate-700/60" />
          </div>
          <div className="flex-1 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/60">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{event.title}</h4>
                {event.description ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400">{event.description}</p>
                ) : null}
              </div>
              <span className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                {formatDateTime(event.date)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ClientProfileSummary({ client, profile, loading }: ClientProfileSummaryProps) {
  const [activeTab, setActiveTab] = useState<string>('summary');

  if (!client) {
    return (
      <Card className="bg-white shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700/40" padding="lg">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Selecciona un cliente del listado para ver su ficha 360°.
        </p>
      </Card>
    );
  }

  if (loading || !profile) {
    return (
      <div className="space-y-6">
        <div className="h-64 animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
        <div className="h-[500px] animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-800" />
      </div>
    );
  }

  const header = profile.header;
  const quickActions = [
    { id: 'whatsapp', label: 'Enviar WhatsApp', icon: <MessageCircle className="h-4 w-4" /> },
    { id: 'email', label: 'Enviar Email', icon: <Mail className="h-4 w-4" /> },
    { id: 'call', label: 'Llamar', icon: <Phone className="h-4 w-4" /> },
    { id: 'appointment', label: 'Crear cita', icon: <CalendarClock className="h-4 w-4" /> },
    { id: 'note', label: 'Nueva nota', icon: <PenSquare className="h-4 w-4" /> },
    { id: 'task', label: 'Nueva tarea', icon: <ClipboardList className="h-4 w-4" /> },
    { id: 'corporate', label: 'Convertir a corporativo', icon: <Users className="h-4 w-4" /> },
    { id: 'deactivate', label: 'Desactivar / Dar de baja', icon: <RefreshCcw className="h-4 w-4" /> },
    { id: 'portal', label: 'Ver como cliente en Portal', icon: <Link2 className="h-4 w-4" /> },
  ];

  const indicatorCards = [
    {
      id: 'risk',
      label: 'Riesgo de baja',
      value: header.indicators.riskLevel === 'alto' ? 'Alto' : header.indicators.riskLevel === 'medio' ? 'Medio' : 'Bajo',
      sublabel: 'Monitoriza adherencia y pagos',
      tone:
        header.indicators.riskLevel === 'alto'
          ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-200'
          : header.indicators.riskLevel === 'medio'
            ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-200'
            : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200',
      icon: <AlertCircle className="h-4 w-4" />,
    },
    {
      id: 'satisfaction',
      label: 'Satisfacción',
      value: `${header.indicators.satisfaction.score}%`,
      sublabel: header.indicators.satisfaction.label,
      tone: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-200',
      icon: <Star className="h-4 w-4" />,
    },
    {
      id: 'value',
      label: 'Valor total generado',
      value: formatCurrency(header.indicators.totalValue),
      sublabel: `MRR ${formatCurrency(header.indicators.monthlyValue)}`,
      tone: 'bg-slate-50 text-slate-700 dark:bg-slate-900/40 dark:text-slate-200',
      icon: <Wallet className="h-4 w-4" />,
    },
    {
      id: 'attendance',
      label: 'Asistencia 30 días',
      value: `${header.indicators.attendance30Days} visitas`,
      sublabel: 'Seguimiento de hábito',
      tone: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200',
      icon: <Heart className="h-4 w-4" />,
    },
    {
      id: 'goal',
      label: 'Objetivo principal',
      value: header.indicators.primaryGoal,
      sublabel: 'Actualizado en la última revisión',
      tone: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-200',
      icon: <GaugeCircle className="h-4 w-4" />,
    },
  ];

  const renderSummaryTab = () => (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {profile.summary.quickCards.map(card => (
          <div
            key={card.id}
            className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md dark:border-slate-700/60 dark:bg-slate-900/60"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {card.title}
            </p>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{card.value}</p>
            {card.caption ? (
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{card.caption}</p>
            ) : null}
            {card.actionLabel ? (
              <button
                type="button"
                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-300 dark:hover:text-indigo-200"
              >
                {card.actionLabel}
                <ChevronRight className="h-3 w-3" />
              </button>
            ) : null}
          </div>
        ))}
      </div>

      <Card padding="lg" className="bg-gradient-to-br from-white via-white to-slate-50 dark:from-slate-900/70 dark:via-slate-900/60">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-indigo-100 p-2 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-200">
                <GaugeCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Timeline reciente</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Entiende de un vistazo qué ha pasado con este cliente en las últimas semanas.
                </p>
              </div>
            </div>
            <Timeline events={profile.summary.timeline} />
          </div>
          <div className="w-full max-w-sm rounded-2xl border border-indigo-100 bg-indigo-50/70 p-5 dark:border-indigo-500/20 dark:bg-indigo-950/20">
            <h4 className="text-sm font-semibold text-indigo-700 dark:text-indigo-200">Atajos clave</h4>
            <p className="mt-1 text-xs text-indigo-600/80 dark:text-indigo-200/80">
              Accede directo a acciones críticas para este cliente.
            </p>
            <div className="mt-4 space-y-3">
              {profile.summary.shortcuts.map(shortcut => (
                <button
                  key={shortcut.id}
                  type="button"
                  className="flex w-full items-center justify-between rounded-xl bg-white px-4 py-3 text-left text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-100/60 hover:text-indigo-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:bg-indigo-900/30"
                >
                  <span>
                    {shortcut.label}
                    {shortcut.description ? (
                      <span className="block text-xs font-normal text-slate-500 dark:text-slate-400">
                        {shortcut.description}
                      </span>
                    ) : null}
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              ))}
            </div>
            {profile.summary.alerts.length > 0 ? (
              <div className="mt-4 space-y-3">
                {profile.summary.alerts.map(alert => (
                  <div
                    key={alert.id}
                    className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-700 dark:border-amber-500/30 dark:bg-amber-900/20 dark:text-amber-200"
                  >
                    <p className="font-semibold">{alert.label}</p>
                    {alert.description ? <p>{alert.description}</p> : null}
                    {alert.actionLabel ? (
                      <button
                        type="button"
                        className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-amber-700 hover:text-amber-600 dark:text-amber-200 dark:hover:text-amber-100"
                      >
                        {alert.actionLabel}
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </Card>
    </div>
  );

  const renderHealthTab = () => (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card padding="lg" className="space-y-4">
          <div className="flex items-center gap-2">
            <HeartPulse className="h-5 w-5 text-rose-500" />
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Datos personales
            </h3>
          </div>
          <dl className="grid gap-3 sm:grid-cols-2">
            {profile.health.personalData.map(item => (
              <div key={item.label}>
                <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {item.label}
                </dt>
                <dd className="text-sm text-slate-900 dark:text-slate-200">{item.value}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <Card padding="lg" className="space-y-4">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-emerald-500" />
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Preferencias
            </h3>
          </div>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            {profile.health.preferences.map(preference => (
              <li
                key={preference}
                className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium dark:bg-slate-900/60"
              >
                {preference}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card padding="lg" className="space-y-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-rose-500" />
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Historial médico relevante
          </h3>
        </div>
        <div className="space-y-3">
          {profile.health.medicalNotes.map(note => (
            <div
              key={note.id}
              className={`rounded-2xl border p-4 text-sm ${note.critical ? 'border-rose-300 bg-rose-50/70 text-rose-700 dark:border-rose-500/40 dark:bg-rose-900/20 dark:text-rose-200' : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700/60 dark:bg-slate-900/60 dark:text-slate-300'}`}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold">{note.label}</p>
                <span className="text-xs uppercase text-slate-400 dark:text-slate-500">
                  {formatDate(note.createdAt)}
                </span>
              </div>
              <p className="mt-1 text-sm">{note.detail}</p>
            </div>
          ))}
        </div>
        {profile.health.alerts.length > 0 ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-3 text-xs text-rose-700 dark:border-rose-500/40 dark:bg-rose-900/20 dark:text-rose-200">
            {profile.health.alerts.map(alert => (
              <p key={alert}>{alert}</p>
            ))}
          </div>
        ) : null}
      </Card>

      {profile.health.documents.length > 0 ? (
        <Card padding="lg" className="space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-500" />
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Documentos y formularios
            </h3>
          </div>
          <ul className="space-y-2">
            {profile.health.documents.map(doc => (
              <li
                key={doc.id}
                className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-sm shadow-sm dark:border-slate-700/60 dark:bg-slate-900/60"
              >
                <span>{doc.name}</span>
                <Badge variant={doc.status === 'vigente' ? 'green' : doc.status === 'pendiente' ? 'yellow' : 'red'} size="sm">
                  {doc.status === 'vigente' ? 'Vigente' : doc.status === 'pendiente' ? 'Pendiente' : 'Expirado'}
                </Badge>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
    </div>
  );

  const renderMembershipsTab = () => (
    <div className="space-y-6">
      <Card padding="lg" className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Membresía actual</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Gestiona cambios de plan, renovaciones y servicios extra sin salir de la ficha.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" size="sm" leftIcon={<RefreshCcw className="h-4 w-4" />}>
              Renovar
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<ClipboardList className="h-4 w-4" />}>
              Cambiar plan
            </Button>
            <Button variant="ghost" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
              Añadir servicio extra
            </Button>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700/60 dark:bg-slate-900/60">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Plan
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{profile.memberships.currentPlan.name}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700/60 dark:bg-slate-900/60">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Vigencia
            </p>
            <p className="mt-1 text-sm text-slate-900 dark:text-slate-200">
              {formatDate(profile.memberships.currentPlan.startDate)} →{' '}
              {formatDate(profile.memberships.currentPlan.endDate)}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700/60 dark:bg-slate-900/60">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Importe mensual
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
              {formatCurrency(profile.memberships.currentPlan.price)}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700/60 dark:bg-slate-900/60">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Estado
            </p>
            <Badge
              variant={profile.memberships.currentPlan.status === 'activo' ? 'green' : 'yellow'}
              size="sm"
              className="mt-1"
            >
              {profile.memberships.currentPlan.status === 'activo' ? 'Activo' : 'Pendiente'}
            </Badge>
          </div>
        </div>
      </Card>

      {profile.memberships.addons.length > 0 ? (
        <Card padding="lg" className="space-y-4">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-indigo-500" />
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Servicios adicionales
            </h3>
          </div>
          <div className="grid gap-3 lg:grid-cols-2">
            {profile.memberships.addons.map(addon => (
              <div
                key={addon.id}
                className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/60"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{addon.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{addon.description}</p>
                  </div>
                  <Badge variant={addon.active ? 'green' : 'gray'} size="sm">
                    {addon.active ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  {formatCurrency(addon.price)} / mes
                </p>
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      {profile.memberships.history.length > 0 ? (
        <Card padding="lg" className="space-y-4">
          <div className="flex items-center gap-2">
            <RefreshCcw className="h-5 w-5 text-slate-500" />
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Historial de membresías
            </h3>
          </div>
          <div className="divide-y divide-slate-200/80 dark:divide-slate-700/60">
            {profile.memberships.history.map(plan => (
              <div key={plan.id} className="flex flex-wrap items-center justify-between gap-4 py-3 text-sm">
                <div className="min-w-[200px]">
                  <p className="font-semibold text-slate-900 dark:text-white">{plan.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {formatDate(plan.startDate)} → {formatDate(plan.endDate)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={plan.status === 'finalizado' ? 'gray' : plan.status === 'activo' ? 'green' : 'orange'} size="sm">
                    {plan.status === 'finalizado' ? 'Finalizado' : plan.status === 'activo' ? 'Activo' : 'Cancelado'}
                  </Badge>
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    {formatCurrency(plan.price)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : null}
    </div>
  );

  const renderTrainingTab = () => (
    <div className="space-y-6">
      <Card padding="lg" className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Plan de entrenamiento activo</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Conoce progreso, cumplimiento y acciones recomendadas.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" size="sm" leftIcon={<PenSquare className="h-4 w-4" />}>
              Ver / editar plan
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
              Asignar nuevo plan
            </Button>
            <Button variant="ghost" size="sm" leftIcon={<RefreshCcw className="h-4 w-4" />}>
              Marcar revisión
            </Button>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700/60 dark:bg-slate-900/60">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Programa</p>
            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
              {profile.training.activeProgram.name}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700/60 dark:bg-slate-900/60">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Coach</p>
            <p className="mt-1 text-sm text-slate-900 dark:text-slate-200">
              {profile.training.activeProgram.coach}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700/60 dark:bg-slate-900/60">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Fechas</p>
            <p className="mt-1 text-sm text-slate-900 dark:text-slate-200">
              {formatDate(profile.training.activeProgram.startDate)} →{' '}
              {formatDate(profile.training.activeProgram.endDate)}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700/60 dark:bg-slate-900/60">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Cumplimiento
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
              {profile.training.activeProgram.completion}%
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700/60 dark:bg-slate-900/60">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Sesiones saltadas
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
              {profile.training.activeProgram.missedSessions}
            </p>
          </div>
        </div>
      </Card>

      {profile.training.keyMetrics.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-3">
          {profile.training.keyMetrics.map(metric => (
            <Card key={metric.id} padding="lg" className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {metric.label}
              </p>
              <p className="text-xl font-semibold text-slate-900 dark:text-white">{metric.value}</p>
              <Badge
                variant={metric.trend === 'up' ? 'green' : metric.trend === 'down' ? 'red' : 'secondary'}
                size="sm"
              >
                {metric.trend === 'up' ? 'Mejora' : metric.trend === 'down' ? 'Descenso' : 'Estable'}
              </Badge>
            </Card>
          ))}
        </div>
      ) : null}

      {profile.training.history.length > 0 ? (
        <Card padding="lg" className="space-y-4">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-slate-500" />
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Programas anteriores
            </h3>
          </div>
          <div className="divide-y divide-slate-200/80 dark:divide-slate-700/60">
            {profile.training.history.map(item => (
              <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{item.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{item.timeframe}</p>
                </div>
                <Badge variant="green" size="sm">
                  {item.completion}% completado
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      ) : null}
    </div>
  );

  const renderNutritionTab = () => (
    <div className="space-y-6">
      <Card padding="lg" className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Plan nutricional activo</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Revisa macros objetivo, cumplimiento y próximos check-ins.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" size="sm" leftIcon={<UtensilsCrossed className="h-4 w-4" />}>
              Ver / editar plan
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
              Asignar nuevo plan
            </Button>
            <Button variant="ghost" size="sm" leftIcon={<MessageCircle className="h-4 w-4" />}>
              Enviar recordatorio
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700/60 dark:bg-slate-900/60">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Plan</p>
            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
              {profile.nutrition.activePlan.name}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700/60 dark:bg-slate-900/60">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Coach</p>
            <p className="mt-1 text-sm text-slate-900 dark:text-slate-200">
              {profile.nutrition.activePlan.coach}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700/60 dark:bg-slate-900/60">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Calorías objetivo
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
              {profile.nutrition.activePlan.calories} kcal
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700/60 dark:bg-slate-900/60">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Cumplimiento
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
              {profile.nutrition.activePlan.compliance}%
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card padding="md" className="space-y-2 bg-slate-50 dark:bg-slate-900/60">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Proteína</p>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">
              {profile.nutrition.activePlan.macros.protein} g
            </p>
          </Card>
          <Card padding="md" className="space-y-2 bg-slate-50 dark:bg-slate-900/60">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Carbohidratos
            </p>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">
              {profile.nutrition.activePlan.macros.carbs} g
            </p>
          </Card>
          <Card padding="md" className="space-y-2 bg-slate-50 dark:bg-slate-900/60">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Grasas</p>
            <p className="text-lg font-semibold text-slate-900 dark:text-white">
              {profile.nutrition.activePlan.macros.fats} g
            </p>
          </Card>
        </div>
      </Card>

      {profile.nutrition.alerts.length > 0 ? (
        <div className="space-y-2">
          {profile.nutrition.alerts.map(alert => (
            <div
              key={alert}
              className="rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3 text-xs text-amber-700 dark:border-amber-500/40 dark:bg-amber-900/20 dark:text-amber-200"
            >
              {alert}
            </div>
          ))}
        </div>
      ) : null}

      {profile.nutrition.checkIns.length > 0 ? (
        <Card padding="lg" className="space-y-4">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-slate-500" />
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Check-ins recientes
            </h3>
          </div>
          <div className="space-y-3">
            {profile.nutrition.checkIns.map(checkIn => (
              <div
                key={checkIn.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-sm shadow-sm dark:border-slate-700/60 dark:bg-slate-900/60"
              >
                <div className="flex items-center gap-3">
                  <Badge variant="blue" size="sm">
                    {formatDate(checkIn.date)}
                  </Badge>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{checkIn.weight}</span>
                </div>
                {checkIn.notes ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400">{checkIn.notes}</p>
                ) : null}
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      {profile.nutrition.restrictions.length > 0 ? (
        <Card padding="lg" className="space-y-2">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Restricciones y alertas
          </h3>
          <div className="flex flex-wrap gap-2">
            {profile.nutrition.restrictions.map(restriction => (
              <Badge key={restriction} variant="secondary" size="sm">
                {restriction}
              </Badge>
            ))}
          </div>
        </Card>
      ) : null}
    </div>
  );

  const renderAttendanceTab = () => (
    <div className="space-y-6">
      <Card padding="lg" className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/60">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Frecuencia semanal
            </p>
            <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
              {profile.attendance.weeklyAverage} veces
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/60">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Frecuencia mensual
            </p>
            <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
              {profile.attendance.monthlyAverage} visitas
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/60">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Horario habitual
            </p>
            <p className="mt-2 text-sm text-slate-900 dark:text-slate-200">
              {profile.attendance.preferredSchedule}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/60">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              No-shows recientes
            </p>
            <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
              {profile.attendance.noShows.length}
            </p>
          </div>
        </div>
      </Card>

      {profile.attendance.alerts.length > 0 ? (
        <div className="space-y-2">
          {profile.attendance.alerts.map(alert => (
            <div
              key={alert}
              className="rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3 text-xs text-amber-700 dark:border-amber-500/40 dark:bg-amber-900/20 dark:text-amber-200"
            >
              {alert}
            </div>
          ))}
        </div>
      ) : null}

      {profile.attendance.entries.length > 0 ? (
        <Card padding="lg" className="space-y-4">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-slate-500" />
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Historial de visitas
            </h3>
          </div>
          <div className="space-y-3">
            {profile.attendance.entries.map(entry => (
              <div
                key={entry.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-sm shadow-sm dark:border-slate-700/60 dark:bg-slate-900/60"
              >
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{entry.label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{formatDateTime(entry.date)}</p>
                </div>
                <Badge
                  variant={entry.status === 'asistido' ? 'green' : entry.status === 'faltó' ? 'red' : 'orange'}
                  size="sm"
                >
                  {entry.status === 'asistido' ? 'Asistido' : entry.status === 'faltó' ? 'No show' : 'Cancelado'}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      {profile.attendance.noShows.length > 0 ? (
        <Card padding="lg" className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            No-shows recientes
          </h3>
          <div className="space-y-2 text-sm">
            {profile.attendance.noShows.map(item => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50/70 px-4 py-3 text-red-700 dark:border-red-500/40 dark:bg-red-900/20 dark:text-red-200"
              >
                <span>{item.className}</span>
                <span className="text-xs uppercase">{formatDate(item.date)}</span>
              </div>
            ))}
          </div>
        </Card>
      ) : null}
    </div>
  );

  const renderFinancesTab = () => (
    <div className="space-y-6">
      <Card padding="lg" className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Resumen financiero</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Controla pagos, suscripciones activas y métodos de pago en segundos.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" size="sm" leftIcon={<CreditCard className="h-4 w-4" />}>
              Cobrar ahora
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<Mail className="h-4 w-4" />}>
              Reenviar factura
            </Button>
            <Button variant="ghost" size="sm" leftIcon={<Wallet className="h-4 w-4" />}>
              Cambiar método de pago
            </Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Card padding="md" className="bg-slate-50 dark:bg-slate-900/60">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Total facturado
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
              {formatCurrency(profile.finances.summary.totalBilled)}
            </p>
          </Card>
          <Card padding="md" className="bg-slate-50 dark:bg-slate-900/60">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Pendiente
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
              {formatCurrency(profile.finances.summary.pending)}
            </p>
          </Card>
          <Card padding="md" className="bg-slate-50 dark:bg-slate-900/60">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Reembolsos
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
              {formatCurrency(profile.finances.summary.refunded)}
            </p>
          </Card>
        </div>
      </Card>

      {profile.finances.subscriptions.length > 0 ? (
        <Card padding="lg" className="space-y-4">
          <div className="flex items-center gap-2">
            <RefreshCcw className="h-5 w-5 text-slate-500" />
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Suscripciones activas
            </h3>
          </div>
          <div className="space-y-3">
            {profile.finances.subscriptions.map(subscription => (
              <div
                key={subscription.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-sm shadow-sm dark:border-slate-700/60 dark:bg-slate-900/60"
              >
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{subscription.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Próximo cobro: {formatDate(subscription.nextCharge)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {formatCurrency(subscription.amount)}
                  </span>
                  <Badge
                    variant={subscription.status === 'activa' ? 'green' : subscription.status === 'pendiente' ? 'yellow' : 'red'}
                    size="sm"
                  >
                    {subscription.status === 'activa' ? 'Activa' : subscription.status === 'pendiente' ? 'Pendiente' : 'Fallida'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      {profile.finances.invoices.length > 0 ? (
        <Card padding="lg" className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Facturas y cobros
          </h3>
          <div className="divide-y divide-slate-200/80 dark:divide-slate-700/60">
            {profile.finances.invoices.map(invoice => (
              <div key={invoice.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{invoice.concept}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{formatDate(invoice.date)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {formatCurrency(invoice.amount)}
                  </span>
                  <Badge
                    variant={invoice.status === 'pagado' ? 'green' : invoice.status === 'pendiente' ? 'yellow' : 'red'}
                    size="sm"
                  >
                    {invoice.status === 'pagado' ? 'Pagado' : invoice.status === 'pendiente' ? 'Pendiente' : 'Fallido'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      {profile.finances.paymentMethods.length > 0 ? (
        <Card padding="lg" className="space-y-4">
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-slate-500" />
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Métodos de pago
            </h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {profile.finances.paymentMethods.map(method => (
              <div
                key={method.id}
                className={`rounded-xl border px-4 py-3 text-sm shadow-sm ${method.primary ? 'border-indigo-300 bg-indigo-50/60 text-indigo-700 dark:border-indigo-500/40 dark:bg-indigo-900/20 dark:text-indigo-200' : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700/60 dark:bg-slate-900/60'}`}
              >
                <p className="font-semibold uppercase">{method.type.toUpperCase()}</p>
                <p className="text-xs">**** {method.lastDigits}</p>
                <Badge variant={method.status === 'activo' ? 'green' : 'red'} size="sm" className="mt-2">
                  {method.status === 'activo' ? 'Activo' : 'Expirado'}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      ) : null}
    </div>
  );

  const renderCommunicationsTab = () => (
    <div className="space-y-6">
      <Card padding="lg" className="space-y-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-indigo-500" />
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Timeline de comunicaciones
          </h3>
        </div>
        <div className="space-y-3">
          {profile.communications.timeline.map(entry => (
            <div
              key={entry.id}
              className="flex flex-col gap-1 rounded-xl border border-slate-200/80 bg-white p-4 text-sm shadow-sm dark:border-slate-700/60 dark:bg-slate-900/60"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Badge variant="blue" size="sm">
                    {entry.channel.toUpperCase()}
                  </Badge>
                  <p className="font-semibold text-slate-900 dark:text-white">{entry.subject}</p>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">{formatDateTime(entry.date)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Por {entry.author}</span>
                {entry.outcome ? <span>{entry.outcome}</span> : null}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {profile.communications.notes.length > 0 ? (
        <Card padding="lg" className="space-y-4">
          <div className="flex items-center gap-2">
            <PenSquare className="h-5 w-5 text-slate-500" />
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Notas internas
            </h3>
          </div>
          <div className="space-y-3">
            {profile.communications.notes.map(note => (
              <div
                key={note.id}
                className="rounded-xl border border-slate-200/80 bg-white p-4 text-sm leading-relaxed shadow-sm dark:border-slate-700/60 dark:bg-slate-900/60"
              >
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Por {note.author}</span>
                  <span>{formatDateTime(note.createdAt)}</span>
                </div>
                <p className="mt-2 text-slate-700 dark:text-slate-200">{note.content}</p>
              </div>
            ))}
          </div>
        </Card>
      ) : null}

      {profile.communications.templates.length > 0 ? (
        <Card padding="lg" className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Plantillas sugeridas
          </h3>
          <div className="grid gap-3 md:grid-cols-2">
            {profile.communications.templates.map(template => (
              <div
                key={template.id}
                className="rounded-xl border border-indigo-100 bg-indigo-50/70 px-4 py-3 text-sm text-indigo-700 shadow-sm dark:border-indigo-500/30 dark:bg-indigo-900/20 dark:text-indigo-200"
              >
                <p className="font-semibold">{template.name}</p>
                <p className="text-xs">{template.description}</p>
              </div>
            ))}
          </div>
        </Card>
      ) : null}
    </div>
  );

  const renderSatisfactionTab = () => (
    <div className="space-y-6">
      <Card padding="lg" className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Satisfacción y NPS</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Analiza feedback cualitativo, puntuaciones y tendencias de cada cliente.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <Card padding="md" className="bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-200">
              <p className="text-xs font-semibold uppercase tracking-wide">Último NPS</p>
              <p className="mt-2 text-2xl font-bold">{profile.satisfaction.lastNps}</p>
            </Card>
            <Card padding="md" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200">
              <p className="text-xs font-semibold uppercase tracking-wide">Promotores</p>
              <p className="mt-2 text-xl font-bold">{profile.satisfaction.promoters}</p>
            </Card>
            <Card padding="md" className="bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-200">
              <p className="text-xs font-semibold uppercase tracking-wide">Detractores</p>
              <p className="mt-2 text-xl font-bold">{profile.satisfaction.detractors}</p>
            </Card>
          </div>
        </div>
      </Card>

      {profile.satisfaction.surveys.length > 0 ? (
        <Card padding="lg" className="space-y-4">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-slate-500" />
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Encuestas y feedback
            </h3>
          </div>
          <div className="space-y-3">
            {profile.satisfaction.surveys.map(survey => (
              <div
                key={survey.id}
                className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-sm shadow-sm dark:border-slate-700/60 dark:bg-slate-900/60"
              >
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{survey.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{formatDate(survey.date)}</p>
                  {survey.comment ? (
                    <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{survey.comment}</p>
                  ) : null}
                </div>
                <Badge variant={survey.score >= 9 ? 'green' : survey.score >= 7 ? 'blue' : 'red'} size="sm">
                  {survey.score}/10
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      ) : null}
    </div>
  );

  const renderDocumentsTab = () => (
    <Card padding="lg" className="space-y-4">
      <div className="flex items-center gap-2">
        <FolderOpen className="h-5 w-5 text-slate-500" />
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Documentos y adjuntos
        </h3>
      </div>
      {profile.documents.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">No hay documentos asociados todavía.</p>
      ) : (
        <div className="space-y-3">
          {profile.documents.map(doc => (
            <div
              key={doc.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-sm shadow-sm dark:border-slate-700/60 dark:bg-slate-900/60"
            >
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{doc.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{doc.type}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={doc.status === 'firmado' ? 'green' : doc.status === 'pendiente' ? 'yellow' : 'red'} size="sm">
                  {doc.status === 'firmado' ? 'Firmado' : doc.status === 'pendiente' ? 'Pendiente' : 'Expirado'}
                </Badge>
                <span className="text-xs text-slate-400 dark:text-slate-500">{formatDate(doc.updatedAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
          Subir
        </Button>
        <Button variant="secondary" size="sm" leftIcon={<FileText className="h-4 w-4" />}>
          Solicitar firma
        </Button>
        <Button variant="ghost" size="sm" leftIcon={<Download className="h-4 w-4" />}>
          Descargar
        </Button>
      </div>
    </Card>
  );

  const renderAutomationsTab = () => (
    <div className="space-y-6">
      <Card padding="lg" className="space-y-4">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-indigo-500" />
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Reglas activas
          </h3>
        </div>
        {profile.automations.rules.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No hay automatizaciones activas para este cliente.
          </p>
        ) : (
          <div className="space-y-3">
            {profile.automations.rules.map(rule => (
              <div
                key={rule.id}
                className="rounded-xl border border-indigo-100 bg-indigo-50/70 px-4 py-3 text-sm text-indigo-700 shadow-sm dark:border-indigo-500/30 dark:bg-indigo-900/20 dark:text-indigo-200"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-semibold">{rule.name}</p>
                  <Badge variant={rule.status === 'activa' ? 'green' : 'yellow'} size="sm">
                    {rule.status === 'activa' ? 'Activa' : 'En pausa'}
                  </Badge>
                </div>
                <p className="mt-1 text-xs">{rule.description}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card padding="lg" className="space-y-4">
        <div className="flex items-center gap-2">
          <GaugeCircle className="h-5 w-5 text-slate-500" />
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Recomendaciones IA
          </h3>
        </div>
        {profile.automations.recommendations.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">Sin recomendaciones nuevas.</p>
        ) : (
          <div className="space-y-3">
            {profile.automations.recommendations.map(rec => (
              <div
                key={rec.id}
                className="rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-700 shadow-sm dark:border-emerald-500/30 dark:bg-emerald-900/20 dark:text-emerald-200"
              >
                <p className="font-semibold">{rec.message}</p>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span>Confianza: {(rec.confidence * 100).toFixed(0)}%</span>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-600 dark:text-emerald-200 dark:hover:text-emerald-100"
                  >
                    {rec.actionLabel}
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'summary':
        return renderSummaryTab();
      case 'health':
        return renderHealthTab();
      case 'memberships':
        return renderMembershipsTab();
      case 'training':
        return renderTrainingTab();
      case 'nutrition':
        return renderNutritionTab();
      case 'attendance':
        return renderAttendanceTab();
      case 'finances':
        return renderFinancesTab();
      case 'communications':
        return renderCommunicationsTab();
      case 'satisfaction':
        return renderSatisfactionTab();
      case 'documents':
        return renderDocumentsTab();
      case 'automations':
        return renderAutomationsTab();
      default:
        return renderSummaryTab();
    }
  };

  return (
    <div className="space-y-6">
      <Card padding="lg" className="space-y-6 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:bg-slate-900/70">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-1 flex-col gap-4 sm:flex-row">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-200 via-slate-100 to-white ring-4 ring-indigo-200/60 dark:bg-slate-800 dark:ring-indigo-500/30">
                {header.avatarUrl ? (
                  <img src={header.avatarUrl} alt={header.fullName} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-indigo-600">
                    {header.fullName.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{header.fullName}</h2>
                  <Badge variant="green" size="sm">
                    {header.status === 'activo' ? 'Activo' : header.status === 'prueba' ? 'En prueba' : header.status}
                  </Badge>
                  <Badge variant="blue" size="sm">
                    {header.membership.planType}
                  </Badge>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" />
                    <span>{header.contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" />
                    <span>{header.contact.email}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{header.branch}</span>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {header.tags.map(tag => (
                    <span
                      key={tag}
                      className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="w-full max-w-xs rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4 text-sm text-indigo-700 shadow-sm dark:border-indigo-500/20 dark:bg-indigo-900/20 dark:text-indigo-200">
            <h3 className="text-xs font-semibold uppercase tracking-wide">Equipo asignado</h3>
            <p className="mt-2 flex items-center gap-2 font-semibold">
              <Users className="h-4 w-4" />
              Coach: {header.assignedTeam.coach}
            </p>
            {header.assignedTeam.manager ? (
              <p className="mt-1 text-xs">Manager: {header.assignedTeam.manager}</p>
            ) : null}
            <div className="mt-3 space-y-1 text-xs">
              <p>Membresía: {header.membership.name}</p>
              <p>Fin plan: {formatDate(header.membership.endDate)}</p>
              {header.membership.nextBillingDate ? (
                <p>Próxima facturación: {formatDate(header.membership.nextBillingDate)}</p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-5">
          {indicatorCards.map(card => (
            <div key={card.id} className={`rounded-2xl border border-current/10 p-4 ${card.tone}`}>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide">
                {card.icon}
                <span>{card.label}</span>
              </div>
              <p className="mt-2 text-lg font-semibold">{card.value}</p>
              <p className="text-xs opacity-80">{card.sublabel}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {quickActions.map(action => (
            <Button key={action.id} variant="ghost" size="sm" leftIcon={action.icon}>
              {action.label}
            </Button>
          ))}
        </div>
      </Card>

      <Card padding="lg" className="space-y-6 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:bg-slate-900/80">
        <Tabs items={DETAIL_TABS} activeTab={activeTab} onTabChange={setActiveTab} variant="underline" />
        <div className="space-y-6">{renderActiveTab()}</div>
      </Card>
    </div>
  );
}
