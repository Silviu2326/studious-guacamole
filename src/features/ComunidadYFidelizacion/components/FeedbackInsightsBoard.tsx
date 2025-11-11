import { useMemo, useState } from 'react';
import { Clock, Plus, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  Card,
  Badge,
  Table,
  Button,
  Modal,
  Input,
  Select,
  Textarea,
} from '../../../components/componentsreutilizables';
import type { TableColumn } from '../../../components/componentsreutilizables';
import { FeedbackAutomation, FeedbackInsight } from '../types';

interface FeedbackInsightsBoardProps {
  insights: FeedbackInsight[];
  automations: FeedbackAutomation[];
  loading?: boolean;
}

export function FeedbackInsightsBoard({ insights, automations, loading }: FeedbackInsightsBoardProps) {
  const [isCreateSurveyOpen, setIsCreateSurveyOpen] = useState(false);

  const insightsColumns = useMemo<TableColumn<FeedbackInsight>[]>(
    () => [
      {
        key: 'topic',
        label: 'Encuesta',
        render: (_, row) => (
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{row.topic}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{row.keyFinding}</p>
          </div>
        ),
      },
      {
        key: 'sentiment',
        label: 'Sentimiento',
        render: (value, row) => (
          <div className="flex flex-col gap-2">
            <SentimentTag sentiment={value} />
            <span className="text-[11px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
              {row.sentiment === 'positive'
                ? 'Clientes promoters'
                : row.sentiment === 'negative'
                ? 'Clientes detractores'
                : 'Clientes neutrales'}
            </span>
          </div>
        ),
        width: '48',
      },
      {
        key: 'responseRate',
        label: 'Participación',
        render: (value, row) => (
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2">
              <Badge variant="blue" size="sm">
                {value}% RR
              </Badge>
              <ChangeIndicator value={row.change} />
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Tiempo de cierre: {row.lastRun}</span>
          </div>
        ),
      },
      {
        key: 'actions',
        label: 'Acciones',
        align: 'right',
        render: () => (
          <div className="inline-flex items-center gap-2">
            <Button variant="secondary" size="sm">
              Editar
            </Button>
            <Button variant="ghost" size="sm" className="text-rose-500 hover:text-rose-600 dark:text-rose-300 dark:hover:text-rose-200">
              Borrar
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div id="feedback-insights" className="xl:col-span-2">
        <Card className="bg-white/90 dark:bg-slate-900/80 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
          <header className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Feedback Loop & Encuestas Inteligentes
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Orquesta todas tus encuestas NPS, CSAT y VoC desde un solo lugar, automatizando la recogida de
                insights y el cierre del loop con tu equipo.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 ml-auto justify-end">
              <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsCreateSurveyOpen(true)}>
                Crear encuesta
              </Button>
            </div>
          </header>

          <div className="mt-6">
            <Table
              data={insights}
              columns={insightsColumns}
              loading={loading}
              emptyMessage="Tus encuestas aparecerán aquí cuando estén activas."
            />
          </div>
        </Card>
      </div>

      <div id="automations-board">
        <Card className="bg-white/90 dark:bg-slate-900/80 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Automatizaciones activas
            </h3>
          </div>

          <ul className="mt-6 space-y-4">
            {loading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <li
                    key={`automation-skeleton-${index}`}
                    className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-4 bg-gradient-to-br from-white via-white to-slate-50 dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950"
                  >
                    <AutomationSkeleton />
                  </li>
                ))
              : automations.map((automation) => (
                  <li
                    key={automation.id}
                    className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-4 bg-gradient-to-br from-white via-white to-slate-50 dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {automation.name}
                        </p>
                        <AutomationStatus status={automation.status} />
                      </div>
                      <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
                        <p>
                          <strong className="text-slate-600 dark:text-slate-300">Trigger:</strong>{' '}
                          {automation.trigger}
                        </p>
                        <p>
                          <strong className="text-slate-600 dark:text-slate-300">Audiencia:</strong>{' '}
                          {automation.audience}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          Última ejecución: {automation.lastRun}
                        </span>
                        <span>{automation.nextAction}</span>
                      </div>
                    </div>
                  </li>
                ))}
          </ul>
        </Card>
      </div>

      <Modal
        isOpen={isCreateSurveyOpen}
        onClose={() => setIsCreateSurveyOpen(false)}
        title="Configurar nueva encuesta"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsCreateSurveyOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setIsCreateSurveyOpen(false)}>Lanzar encuesta</Button>
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
                Define el objetivo, audiencia y canal para que la encuesta salga alineada con tu estrategia.
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

          <section className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Mensajes y lógica
            </h4>
            <Textarea
              label="Introducción al cliente"
              rows={3}
              placeholder="Comparte un mensaje de bienvenida y el propósito de la encuesta."
              showCount
              maxLength={400}
            />
            <Textarea
              label="Preguntas clave / condiciones"
              rows={4}
              placeholder="Ej. Pregunta NPS + reglas condicionales para preguntas abiertas."
            />
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Fecha de lanzamiento" type="date" />
              <Input label="Recordatorios automáticos" placeholder="Ej. 2 recordatorios, cada 48h" />
            </div>
          </section>

          <section className="space-y-3 border-t border-slate-200/70 pt-4 dark:border-slate-800/70">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Operaciones Insight
            </h4>
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Propietario de la encuesta" placeholder="Ej. Laura Méndez · CX Lead" />
              <Input label="Ruta de automatización" placeholder="Ej. Loop de cierre vía Slack + HubSpot" />
            </div>
            <div className="space-y-2">
              <label className="inline-flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-900"
                  defaultChecked
                />
                Activar scorecard automática con IA
              </label>
              <label className="inline-flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-900"
                />
                Sincronizar respuestas con CRM
              </label>
              <label className="inline-flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-900"
                />
                Añadir encuesta a campañas activas
              </label>
            </div>
          </section>
        </div>
      </Modal>
    </div>
  );
}

interface SentimentTagProps {
  sentiment: FeedbackInsight['sentiment'];
}

function SentimentTag({ sentiment }: SentimentTagProps) {
  const map = {
    positive: { label: 'Positivo', className: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300' },
    neutral: { label: 'Neutro', className: 'bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-300' },
    negative: { label: 'Negativo', className: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300' },
  } as const;

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${map[sentiment].className}`}>
      {map[sentiment].label}
    </span>
  );
}

interface AutomationStatusProps {
  status: FeedbackAutomation['status'];
}

function AutomationStatus({ status }: AutomationStatusProps) {
  const map = {
    active: { label: 'Activa', className: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300' },
    paused: { label: 'Pausada', className: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300' },
    draft: { label: 'Borrador', className: 'bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-300' },
  } as const;

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${map[status].className}`}>
      {map[status].label}
    </span>
  );
}

function AutomationSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="flex items-center justify-between">
        <div className="h-4 w-32 rounded-md bg-slate-200/70 dark:bg-slate-800/70" />
        <div className="h-5 w-16 rounded-full bg-slate-200/60 dark:bg-slate-800/60" />
      </div>
      <div className="h-3 w-3/4 rounded-md bg-slate-200/70 dark:bg-slate-800/70" />
      <div className="h-3 w-2/3 rounded-md bg-slate-200/70 dark:bg-slate-800/70" />
      <div className="flex items-center justify-between">
        <div className="h-3 w-40 rounded-md bg-slate-200/60 dark:bg-slate-800/60" />
        <div className="h-3 w-32 rounded-md bg-slate-200/60 dark:bg-slate-800/60" />
      </div>
    </div>
  );
}

interface ChangeIndicatorProps {
  value: number;
}

function ChangeIndicator({ value }: ChangeIndicatorProps) {
  if (value > 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-300">
        <TrendingUp className="w-3.5 h-3.5" />
        +{value}%
      </span>
    );
  }

  if (value < 0) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-500 dark:text-rose-300">
        <TrendingDown className="w-3.5 h-3.5" />
        {value}%
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
      <Minus className="w-3.5 h-3.5" />
      Estable
    </span>
  );
}



