import { useMemo } from 'react';
import {
  Badge,
  Button,
  Card,
  Table,
  type TableColumn,
} from '../../../components/componentsreutilizables';
import {
  Archive,
  ArrowUpRight,
  Copy,
  EyeOff,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';
import type { PlanSummary, PlanStatus } from '../api';

interface PlanCatalogTableProps {
  plans: PlanSummary[];
  selectedPlanId: string | null;
  onSelectPlan: (planId: string) => void;
}

const billingLabels: Record<PlanSummary['billingCycle'], string> = {
  mensual: 'Mensual',
  trimestral: 'Trimestral',
  anual: 'Anual',
};

const planStatusVariant: Record<PlanStatus, 'green' | 'orange' | 'red'> = {
  activo: 'green',
  oculto: 'orange',
  archivado: 'red',
};

const planTypeLabel: Record<PlanSummary['type'], string> = {
  general: 'General',
  premium: 'Premium',
  corporate: 'Corporate',
  online: 'Online',
  juvenil: 'Juvenil',
  daypass: 'Day pass',
};

type PlanChannel = PlanSummary['visibilityChannels'][number];

const channelLabels: Record<PlanChannel, string> = {
  web: 'Web',
  app: 'App',
  recepcion: 'Recepción',
  corporate: 'Corporate',
};

export function PlanCatalogTable({ plans, selectedPlanId, onSelectPlan }: PlanCatalogTableProps) {
  const data = useMemo(() => plans, [plans]);

  const columns: TableColumn<PlanSummary>[] = [
    {
      key: 'name',
      label: 'Plan',
      render: (_value, row) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-slate-900 dark:text-slate-100">{row.name}</p>
            {row.highlight && (
              <Badge variant="purple" size="sm" className="flex items-center gap-1">
                <Star size={12} />
                Destacado
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {billingLabels[row.billingCycle]} · {planTypeLabel[row.type]} · {row.duration}
          </p>
        </div>
      ),
    },
    {
      key: 'price',
      label: 'Precio',
      render: (_value, row) => (
        <div>
          <p className="font-medium text-slate-900 dark:text-slate-100">
            {row.price.toLocaleString('es-ES', {
              style: 'currency',
              currency: 'EUR',
              maximumFractionDigits: 0,
            })}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{billingLabels[row.billingCycle]}</p>
        </div>
      ),
    },
    {
      key: 'activeMembers',
      label: 'Activos',
      align: 'right',
      render: (value: number) => (
        <div className="flex items-center justify-end gap-2 text-sm font-medium text-slate-900 dark:text-slate-100">
          <Users size={14} />
          {value}
        </div>
      ),
    },
    {
      key: 'monthlyRevenue',
      label: 'MRR',
      align: 'right',
      render: (value: number) =>
        value.toLocaleString('es-ES', {
          style: 'currency',
          currency: 'EUR',
          maximumFractionDigits: 0,
        }),
    },
    {
      key: 'visibilityChannels',
      label: 'Canales',
      render: (_value, row) => (
        <div className="flex flex-wrap gap-1 text-xs text-slate-500 dark:text-slate-400">
          {row.visibilityChannels.map(channel => (
            <Badge key={channel} variant="outline" size="sm" className="!text-[11px] !px-2 !py-0.5">
              {channelLabels[channel]}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      align: 'right',
      render: (value: PlanSummary['status']) => (
        <Badge variant={planStatusVariant[value]} size="sm">
          {value === 'activo' ? 'Activo' : value === 'oculto' ? 'Oculto' : 'Archivado'}
        </Badge>
      ),
    },
  ];

  const selectedPlan = data.find(plan => plan.id === selectedPlanId) ?? data[0] ?? null;

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <Card className="bg-white shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900/50 dark:ring-slate-700/40" padding="lg">
        <div className="flex items-center justify-between pb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Catálogo de planes</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Gestiona todo tu portfolio: precios, visibilidad y planes destacados.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="primary" size="sm" leftIcon={<Sparkles size={14} />}>
              Matriz comparativa
            </Button>
            <Button variant="ghost" size="sm" leftIcon={<Copy size={14} />}>
              Duplicar como nuevo
            </Button>
          </div>
        </div>
        <Table<PlanSummary>
          data={data}
          columns={columns}
          emptyMessage="Todavía no has configurado planes."
          className="shadow-none ring-0"
          getRowProps={row => ({
            onClick: () => onSelectPlan(row.id),
            className: `cursor-pointer transition hover:bg-indigo-50/40 dark:hover:bg-indigo-500/10 ${
              row.id === selectedPlan?.id ? 'bg-indigo-50/70 dark:bg-indigo-500/10' : ''
            }`,
          })}
        />
      </Card>

      {selectedPlan ? (
        <Card className="sticky top-28 bg-white shadow-md ring-1 ring-indigo-100/70 dark:bg-slate-900/70 dark:ring-indigo-500/20" padding="lg">
          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{selectedPlan.name}</h3>
                  <Badge variant="blue" size="sm">{planTypeLabel[selectedPlan.type]}</Badge>
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{selectedPlan.detail.description}</p>
              </div>
              <Badge variant="outline" size="sm" className="!text-[11px] !px-2 !py-0.5">
                {selectedPlan.duration}
              </Badge>
            </div>

            <div className="grid gap-4">
              <section>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  KPIs plan
                </h4>
                <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-700 dark:text-slate-200">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500 dark:text-slate-400">MRR generado</span>
                    <span className="font-semibold">
                      {selectedPlan.monthlyRevenue.toLocaleString('es-ES', {
                        style: 'currency',
                        currency: 'EUR',
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Clientes activos</span>
                    <span className="font-semibold">{selectedPlan.activeMembers}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Precio</span>
                    <span className="font-semibold">
                      {selectedPlan.price.toLocaleString('es-ES', {
                        style: 'currency',
                        currency: 'EUR',
                        maximumFractionDigits: 0,
                      })}
                      /{selectedPlan.billingCycle}
                    </span>
                  </div>
                </div>
              </section>

              {selectedPlan.detail.tags.length > 0 && (
                <section>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Posicionamiento
                  </h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedPlan.detail.tags.map(tag => (
                      <Badge key={tag} variant="outline" size="sm" className="!text-[11px] !px-2 !py-0.5">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </section>
              )}

              <section>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Precios & ciclo
                  </h4>
                  <Button variant="ghost" size="sm" className="!px-3 !py-1 text-xs" leftIcon={<ArrowUpRight size={12} />}>
                    Simular cambios
                  </Button>
                </div>
                <div className="mt-2 space-y-2">
                  {selectedPlan.detail.pricing.map(option => (
                    <div key={option.id} className="flex items-center justify-between rounded-lg border border-slate-200/80 px-3 py-2 text-sm dark:border-slate-700/40">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-800 dark:text-slate-100">{option.label}</span>
                        {option.note && <span className="text-xs text-slate-500 dark:text-slate-400">{option.note}</span>}
                      </div>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {option.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Acceso & uso
                </h4>
                <div className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <p><span className="font-semibold">Horario:</span> {selectedPlan.detail.access.schedule}</p>
                  <p><span className="font-semibold">Zonas :</span> {selectedPlan.detail.access.zones.join(', ')}</p>
                  <p>
                    <span className="font-semibold">Reservas:</span> {selectedPlan.detail.reservations.maxActive} activas · {selectedPlan.detail.reservations.noShows} no-shows ·{' '}
                    {selectedPlan.detail.reservations.waitlist ? 'Con lista de espera' : 'Sin lista de espera'}
                  </p>
                </div>
              </section>

              <section>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Beneficios incluidos
                </h4>
                <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-200">
                  {selectedPlan.detail.benefits.map(benefit => (
                    <li key={benefit} className="flex items-center gap-2">
                      <ShieldCheck size={14} className="text-indigo-500" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </section>

              {selectedPlan.detail.restrictions.length > 0 && (
                <section>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Restricciones
                  </h4>
                  <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-300">
                    {selectedPlan.detail.restrictions.map(item => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </section>
              )}

              <section>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Visibilidad
                </h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {Object.entries(selectedPlan.detail.visibility).map(([channel, enabled]) => (
                    <Badge
                      key={channel}
                      variant={enabled ? 'green' : 'outline'}
                      size="sm"
                      className="!text-[11px] !px-2 !py-0.5"
                    >
                      {channelLabels[channel as PlanChannel] ?? channel}
                    </Badge>
                  ))}
                </div>
              </section>

              <section>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Automatizaciones
                </h4>
                <div className="mt-2 space-y-2">
                  {selectedPlan.detail.automations.map(automation => (
                    <div key={automation.id} className="rounded-lg border border-slate-200/80 bg-indigo-50/50 px-3 py-2 text-sm dark:border-slate-700/40 dark:bg-indigo-500/10">
                      <p className="text-xs uppercase text-indigo-600 dark:text-indigo-300">{automation.stage.replace('_', ' ')}</p>
                      <p className="font-medium text-slate-800 dark:text-slate-100">{automation.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{automation.description}</p>
                      {automation.offset && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">Aviso: {automation.offset}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="primary" size="sm" leftIcon={<Sparkles size={14} />}>
                Ver impacto ingresos
              </Button>
              <Button variant="secondary" size="sm" leftIcon={<Copy size={14} />}>
                Duplicar plan
              </Button>
              <Button variant="ghost" size="sm" leftIcon={<EyeOff size={14} />}>
                Ocultar de venta
              </Button>
              <Button variant="ghost" size="sm" leftIcon={<Archive size={14} />}>
                Archivar
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="bg-white shadow-md ring-1 ring-slate-200/70 dark:bg-slate-900/50 dark:ring-slate-700/40" padding="lg">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Selecciona un plan para ver los detalles completos y acciones disponibles.
          </p>
        </Card>
      )}
    </div>
  );
}
