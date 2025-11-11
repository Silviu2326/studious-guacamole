import { useMemo, useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  MessageCircleHeart,
  Star,
  Sparkles,
  Gauge,
  MessageCirclePlus,
  ClipboardList,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  Card,
  Badge,
  Button,
  Table,
  Modal,
  Select,
  Input,
  Textarea,
} from '../../../components/componentsreutilizables';
import type { TableColumn } from '../../../components/componentsreutilizables';
import {
  CommunityPulseMetric,
  CommunitySummary,
  Testimonial,
  FeedbackInsight,
  FeedbackAutomation,
} from '../types';

interface PulseOverviewProps {
  summary: CommunitySummary;
  pulseMetrics: CommunityPulseMetric[];
  testimonials: Testimonial[];
  insights: FeedbackInsight[];
  automations: FeedbackAutomation[];
  loading?: boolean;
  periodLabel: string;
  onNavigateToReviews: (anchorId?: string) => void;
  onNavigateToFeedback: (anchorId?: string) => void;
  onNavigateToAutomations: () => void;
}

export function PulseOverview({
  summary,
  pulseMetrics,
  testimonials,
  insights,
  automations,
  loading,
  periodLabel,
  onNavigateToReviews,
  onNavigateToFeedback,
  onNavigateToAutomations,
}: PulseOverviewProps) {
  const [isConfigureOpen, setIsConfigureOpen] = useState(false);
  const [isRequestTestimonialOpen, setIsRequestTestimonialOpen] = useState(false);
  const [isCreateSurveyOpen, setIsCreateSurveyOpen] = useState(false);

  const averageScore = useMemo(() => {
    if (!testimonials.length) return 0;
    const total = testimonials.reduce((acc, testimonial) => acc + testimonial.score, 0);
    return total / testimonials.length;
  }, [testimonials]);

  const feedbackBreakdown = useMemo(() => {
    if (!insights.length) {
      return { positive: 0, neutral: 0, negative: 0 };
    }

    const counts = insights.reduce(
      (acc, insight) => {
        acc[insight.sentiment] += 1;
        return acc;
      },
      { positive: 0, neutral: 0, negative: 0 },
    );

    const total = counts.positive + counts.neutral + counts.negative || 1;

    return {
      positive: Math.round((counts.positive / total) * 100),
      neutral: Math.round((counts.neutral / total) * 100),
      negative: Math.round((counts.negative / total) * 100),
    };
  }, [insights]);

  const recentTestimonials = useMemo(() => testimonials.slice(0, 5), [testimonials]);
  const recentSurveys = useMemo(() => insights.slice(0, 5), [insights]);

  const riskAlerts = useMemo(
    () => insights.filter((insight) => insight.sentiment === 'negative').slice(0, 4),
    [insights],
  );
  const promoterAlerts = useMemo(
    () => testimonials.filter((testimonial) => testimonial.score >= 4.5).slice(0, 4),
    [testimonials],
  );

  const metricColumns = useMemo<TableColumn<CommunityPulseMetric>[]>(
    () => [
      {
        key: 'label',
        label: 'Indicador',
        render: (_, row) => (
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{row.label}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
              {row.description}
            </p>
          </div>
        ),
      },
      {
        key: 'value',
        label: 'Valor actual',
        render: (value) => (
          <span className="text-base font-semibold text-slate-900 dark:text-slate-100">{value}</span>
        ),
        width: '40',
      },
      {
        key: 'trend',
        label: 'Variación',
        render: (_, row) => <TrendPill trend={row.trend} delta={row.delta} />,
        width: '40',
      },
      {
        key: 'actions',
        label: 'Acciones',
        align: 'right',
        render: () => (
          <div className="inline-flex items-center gap-2">
            <Button variant="secondary" size="sm">
              Ver detalle
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200"
            >
              Ajustar meta
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <Card className="bg-white/90 dark:bg-slate-900/80 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">KPIs clave en un vistazo</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Comprende la salud de la comunidad y la voz del cliente de forma inmediata.
            </p>
          </div>
          <Badge variant="blue" size="sm">
            {periodLabel}
          </Badge>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <KpiTile
            icon={Star}
            title="Nota media global"
            primaryValue={testimonials.length ? `${averageScore.toFixed(1)} ⭐` : 'Sin datos'}
            helper="Promedio ponderado de testimonios"
            loading={loading}
            onClick={() => onNavigateToReviews('reviews-testimonials')}
          />
          <KpiTile
            icon={Sparkles}
            title="Nº de reseñas recientes"
            primaryValue={summary.testimonialsCollected.toString()}
            helper="Últimos 30 días"
            loading={loading}
            onClick={() => onNavigateToReviews('reviews-testimonials')}
          />
          <KpiTile
            icon={MessageCircleHeart}
            title="NPS / CSAT medio"
            primaryValue={`${summary.cNps}`}
            helper="cNPS comunidad"
            loading={loading}
            onClick={() => onNavigateToFeedback('feedback-insights')}
          />
          <KpiTile
            icon={Users}
            title="% feedback positivo / neutro / negativo"
          helper="Distribución del feedback"
            loading={loading}
            renderContent={() => (
              <div className="flex flex-wrap gap-2">
                <Badge variant="green" size="sm">
                  Positivo {feedbackBreakdown.positive}%
                </Badge>
                <Badge variant="secondary" size="sm">
                  Neutro {feedbackBreakdown.neutral}%
                </Badge>
                <Badge variant="destructive" size="sm">
                  Negativo {feedbackBreakdown.negative}%
                </Badge>
              </div>
            )}
            onClick={() => onNavigateToFeedback('feedback-insights')}
          />
        </div>
      </Card>

      <Card className="bg-white/90 dark:bg-slate-900/80 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Latido de la comunidad</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Indicadores que miden la salud de relación y prueba social en el periodo seleccionado.
            </p>
          </div>
          <Button variant="ghost" size="sm" leftIcon={<Gauge className="w-4 h-4" />} onClick={() => setIsConfigureOpen(true)}>
            Ajustar umbrales
          </Button>
        </div>

        <div className="mt-6">
          <Table
            data={pulseMetrics}
            columns={metricColumns}
            loading={loading}
            emptyMessage="No hay métricas registradas para este periodo."
          />
        </div>
      </Card>

      <Card className="bg-white/90 dark:bg-slate-900/80 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Actividad reciente</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Observa qué dicen tus clientes y cómo responden a las encuestas.
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
          <section>
            <header className="flex items-center justify-between">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Últimos testimonios recibidos
              </h4>
              <Badge variant="blue" size="sm">
                {recentTestimonials.length}
              </Badge>
            </header>
            <div className="mt-4 space-y-3">
              {loading ? (
                <PlaceholderList count={3} />
              ) : recentTestimonials.length ? (
                recentTestimonials.map((testimonial) => (
                  <article
                    key={testimonial.id}
                    className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-4 flex flex-col gap-2 bg-gradient-to-br from-white via-white to-slate-50 dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950 transition-shadow hover:shadow-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    role="button"
                    tabIndex={0}
                    onClick={() => onNavigateToReviews('reviews-testimonials')}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        onNavigateToReviews('reviews-testimonials');
                      }
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {testimonial.customerName}
                        </p>
                        <p className="text-xs uppercase tracking-wide text-slate-400">{testimonial.role}</p>
                      </div>
                      <Badge variant="blue" size="sm">
                        {testimonial.channel}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3">“{testimonial.quote}”</p>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-500 dark:text-amber-300">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {testimonial.score.toFixed(1)} · {testimonial.impactTag}
                    </span>
                  </article>
                ))
              ) : (
                <EmptyState message="Aún no hay testimonios recientes." />
              )}
            </div>
          </section>

          <section>
            <header className="flex items-center justify-between">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Últimas encuestas y resultados
              </h4>
              <Badge variant="blue" size="sm">
                {recentSurveys.length}
              </Badge>
            </header>
            <div className="mt-4 space-y-3">
              {loading ? (
                <PlaceholderList count={3} />
              ) : recentSurveys.length ? (
                recentSurveys.map((insight) => (
                  <article
                    key={insight.id}
                    className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-4 bg-gradient-to-br from-white via-white to-slate-50 dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950 transition-shadow hover:shadow-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    role="button"
                    tabIndex={0}
                    onClick={() => onNavigateToFeedback('feedback-insights')}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        onNavigateToFeedback('feedback-insights');
                      }
                    }}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{insight.topic}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{insight.keyFinding}</p>
                      </div>
                      <Badge variant="blue" size="sm">
                        {insight.responseRate}% participación
                      </Badge>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <SentimentTag sentiment={insight.sentiment} />
                      <span>Última corrida: {insight.lastRun}</span>
                    </div>
                  </article>
                ))
              ) : (
                <EmptyState message="Aún no hay encuestas registradas." />
              )}
            </div>
          </section>
        </div>
      </Card>

      <Card className="bg-white/90 dark:bg-slate-900/80 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Alertas &amp; oportunidades</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Detecta riesgos a tiempo y activa a tus mejores promotores.
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
          <section>
            <header className="flex items-center justify-between">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-rose-500">Clientes en riesgo</h4>
              <Badge variant="destructive" size="sm">
                {riskAlerts.length}
              </Badge>
            </header>
            <div className="mt-4 space-y-3">
              {loading ? (
                <PlaceholderList count={3} />
              ) : riskAlerts.length ? (
                riskAlerts.map((insight) => (
                  <article
                    key={insight.id}
                    className="rounded-2xl border border-rose-500/50 dark:border-rose-900/60 p-4 bg-rose-100/70 dark:bg-rose-900/20 shadow-sm cursor-pointer transition-shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-rose-400/80"
                    role="button"
                    tabIndex={0}
                    onClick={() => onNavigateToFeedback('feedback-insights')}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        onNavigateToFeedback('feedback-insights');
                      }
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-rose-600 dark:text-rose-300">{insight.topic}</p>
                      <Badge variant="destructive" size="sm" className="uppercase tracking-wide">
                        Crítico
                      </Badge>
                    </div>
                    <p className="text-xs text-rose-600/80 dark:text-rose-200/80 mt-2 line-clamp-3">
                      {insight.keyFinding}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs text-rose-500 dark:text-rose-200">
                      Próxima acción: {insight.followUpAction}
                    </span>
                  </article>
                ))
              ) : (
                <EmptyState message="Sin alertas críticas por ahora." />
              )}
            </div>
          </section>

          <section>
            <header className="flex items-center justify-between">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-emerald-500">Promoters detectados</h4>
              <Badge variant="green" size="sm">
                {promoterAlerts.length}
              </Badge>
            </header>
            <div className="mt-4 space-y-3">
              {loading ? (
                <PlaceholderList count={3} />
              ) : promoterAlerts.length ? (
                promoterAlerts.map((testimonial) => (
                  <article
                    key={testimonial.id}
                    className="rounded-2xl border border-emerald-200/60 dark:border-emerald-900/40 p-4 bg-emerald-50/60 dark:bg-emerald-900/10 cursor-pointer transition-shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-400/80"
                    role="button"
                    tabIndex={0}
                    onClick={() => onNavigateToReviews('reviews-testimonials')}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        onNavigateToReviews('reviews-testimonials');
                      }
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-200">
                        {testimonial.customerName}
                      </p>
                      <Badge variant="success" size="sm">
                        {testimonial.score.toFixed(1)} ⭐
                      </Badge>
                    </div>
                    <p className="text-xs text-emerald-700/80 dark:text-emerald-200/80 mt-2 line-clamp-2">
                      {testimonial.quote}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-200">
                      Ideal para: {testimonial.impactTag}
                    </span>
                  </article>
                ))
              ) : (
                <EmptyState message="Aún no hay promotores destacados." />
              )}
            </div>
          </section>
        </div>
      </Card>

      <div className="md:sticky md:top-6">
        <Card className="bg-white/90 dark:bg-slate-900/80 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Acciones rápidas</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Activa en segundos la próxima palanca de fidelización o advocacy.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button
              leftIcon={<MessageCirclePlus className="w-4 h-4" />}
              onClick={() => setIsRequestTestimonialOpen(true)}
            >
              Pedir nuevo testimonio
            </Button>
            <Button variant="secondary" leftIcon={<ClipboardList className="w-4 h-4" />} onClick={() => setIsCreateSurveyOpen(true)}>
              Crear encuesta
            </Button>
            <Button variant="ghost" onClick={onNavigateToAutomations}>
              Automatizaciones activas ({automations.length})
            </Button>
          </div>
        </Card>
      </div>

      <ConfigureModal
        isOpen={isConfigureOpen}
        pulseMetrics={pulseMetrics}
        onClose={() => setIsConfigureOpen(false)}
      />

      <RequestTestimonialModal
        isOpen={isRequestTestimonialOpen}
        onClose={() => setIsRequestTestimonialOpen(false)}
      />

      <CreateSurveyModal isOpen={isCreateSurveyOpen} onClose={() => setIsCreateSurveyOpen(false)} />
    </div>
  );
}

interface KpiTileProps {
  icon: LucideIcon;
  title: string;
  primaryValue?: string;
  helper?: string;
  loading?: boolean;
  renderContent?: () => React.ReactNode;
  onClick?: () => void;
}

function KpiTile({ icon: Icon, title, primaryValue, helper, loading, renderContent, onClick }: KpiTileProps) {
  const interactiveProps = onClick
    ? {
        role: 'button' as const,
        tabIndex: 0,
        onClick,
        onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onClick();
          }
        },
      }
    : {};

  return (
    <div
      className={`rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white via-white to-slate-50 dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950 p-5 ${
        onClick ? 'cursor-pointer transition-transform hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500' : ''
      }`}
      {...interactiveProps}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-slate-900/5 dark:bg-white/10">
          <Icon className="w-5 h-5 text-slate-900 dark:text-slate-100" />
        </div>
        {helper && <span className="text-xs uppercase tracking-wide text-slate-400">{helper}</span>}
      </div>
      <div className="mt-4 space-y-2">
        {renderContent ? (
          renderContent()
        ) : loading ? (
          <div className="h-8 w-24 rounded-md bg-slate-200/70 dark:bg-slate-700/60 animate-pulse" />
        ) : (
          <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{primaryValue}</p>
        )}
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{title}</p>
      </div>
    </div>
  );
}

interface PlaceholderListProps {
  count: number;
}

function PlaceholderList({ count }: PlaceholderListProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="h-20 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-slate-100/60 dark:bg-slate-800/40 animate-pulse"
        />
      ))}
    </>
  );
}

interface EmptyStateProps {
  message: string;
}

function EmptyState({ message }: EmptyStateProps) {
  return <p className="text-sm text-slate-500 dark:text-slate-400 italic">{message}</p>;
}

interface ConfigureModalProps {
  isOpen: boolean;
  onClose: () => void;
  pulseMetrics: CommunityPulseMetric[];
}

function ConfigureModal({ isOpen, onClose, pulseMetrics }: ConfigureModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Configurar tablero de comunidad"
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onClose}>Guardar ajustes</Button>
        </>
      }
    >
      <div className="space-y-6">
        <section className="space-y-3">
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Objetivos y umbrales
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Define metas y alertas para tus KPIs de comunidad y fidelización.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Select
              label="Métrica principal"
              placeholder="Selecciona métrica"
              options={pulseMetrics.map((metric) => ({
                label: metric.label,
                value: metric.id,
              }))}
            />
            <Input label="Meta objetivo" placeholder="Ej. 65" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Alerta mínima" placeholder="Ej. 45" />
            <Input label="Alerta máxima" placeholder="Ej. 80" />
          </div>
        </section>

        <section className="space-y-3 border-t border-slate-200/70 pt-4 dark:border-slate-800/70">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Automatizaciones de seguimiento
          </h4>
          <Select
            label="Canal de notificación"
            placeholder="Selecciona canal"
            options={[
              { label: 'Slack - Equipo Comunidad', value: 'slack' },
              { label: 'Email semanal', value: 'email' },
              { label: 'HubSpot Task', value: 'hubspot' },
              { label: 'Notificación in-app', value: 'inapp' },
            ]}
          />
          <Textarea
            label="Playbook sugerido"
            rows={4}
            placeholder="Explica cómo responder cuando la métrica supere o caiga por debajo de los umbrales."
          />
        </section>
      </div>
    </Modal>
  );
}

interface RequestTestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function RequestTestimonialModal({ isOpen, onClose }: RequestTestimonialModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pedir nuevo testimonio"
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onClose}>Enviar solicitud</Button>
        </>
      }
    >
      <div className="space-y-5">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Activa una nueva solicitud de testimonio con tu cliente en minutos.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Cliente" placeholder="Ej. María Fernández" />
          <Input label="Responsable interno" placeholder="Ej. Ana Ruiz · Customer Marketing" />
        </div>
        <Select
          label="Canal objetivo"
          placeholder="Selecciona un canal"
          options={[
            { label: 'Email', value: 'email' },
            { label: 'Video Testimonial', value: 'video' },
            { label: 'Social Media', value: 'social' },
            { label: 'Evento en vivo', value: 'event' },
          ]}
        />
        <Textarea
          label="Mensaje personalizado"
          rows={4}
          placeholder="Comparte contexto, prompts sugeridos y el tipo de resultado que necesitas."
        />
      </div>
    </Modal>
  );
}

interface CreateSurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function CreateSurveyModal({ isOpen, onClose }: CreateSurveyModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Crear encuesta"
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onClose}>Lanzar encuesta</Button>
        </>
      }
    >
      <div className="space-y-6">
        <section className="space-y-3">
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Detalles generales
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Define el objetivo, audiencia y canal de tu encuesta.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Nombre interno" placeholder="Ej. NPS onboarding Q1" />
            <Select
              label="Tipo de encuesta"
              placeholder="Selecciona un tipo"
              options={[
                { label: 'NPS', value: 'nps' },
                { label: 'CSAT', value: 'csat' },
                { label: 'CES', value: 'ces' },
                { label: 'Encuesta personalizada', value: 'custom' },
              ]}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Select
              label="Audiencia principal"
              placeholder="Selecciona audiencia"
              options={[
                { label: 'Clientes activos', value: 'activos' },
                { label: 'Clientes churn', value: 'churn' },
                { label: 'Leads recientes', value: 'leads' },
                { label: 'Comunidad', value: 'comunidad' },
              ]}
            />
            <Select
              label="Canal de entrega"
              placeholder="Selecciona canal"
              options={[
                { label: 'Email', value: 'email' },
                { label: 'In-app', value: 'in-app' },
                { label: 'SMS', value: 'sms' },
                { label: 'WhatsApp', value: 'wa' },
              ]}
            />
          </div>
        </section>

        <Textarea
          label="Mensaje de introducción"
          rows={3}
          placeholder="Comparte un mensaje de bienvenida y el propósito de la encuesta."
        />
        <Textarea
          label="Preguntas clave / lógica"
          rows={4}
          placeholder="Ej. Pregunta NPS + reglas condicionales para preguntas abiertas."
        />
      </div>
    </Modal>
  );
}

interface TrendPillProps {
  trend: CommunityPulseMetric['trend'];
  delta: number;
}

function TrendPill({ trend, delta }: TrendPillProps) {
  const Icon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const color =
    trend === 'up'
      ? 'text-emerald-600 bg-emerald-100/80 dark:text-emerald-300 dark:bg-emerald-900/30'
      : trend === 'down'
      ? 'text-rose-600 bg-rose-100/80 dark:text-rose-300 dark:bg-rose-900/30'
      : 'text-slate-500 bg-slate-100/80 dark:text-slate-300 dark:bg-slate-800/40';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${color}`}>
      <Icon className="w-3.5 h-3.5" />
      {trend === 'steady' ? 'Estable' : `${delta > 0 ? '+' : ''}${delta}`}
    </span>
  );
}

interface SentimentTagProps {
  sentiment: FeedbackInsight['sentiment'];
}

function SentimentTag({ sentiment }: SentimentTagProps) {
  const map = {
    positive: {
      label: 'Positivo',
      className:
        'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300',
    },
    neutral: {
      label: 'Neutro',
      className: 'bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-300',
    },
    negative: {
      label: 'Negativo',
      className: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300',
    },
  } as const;

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${map[sentiment].className}`}>
      {map[sentiment].label}
    </span>
  );
}

