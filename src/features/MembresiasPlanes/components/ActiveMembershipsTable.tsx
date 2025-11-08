import { useMemo } from 'react';
import {
  Badge,
  Button,
  Card,
  Select,
  Table,
  type SelectOption,
  type TableColumn,
} from '../../../components/componentsreutilizables';
import { ArrowRight, Filter, PlayCircle, Sparkles, Users, Zap } from 'lucide-react';
import type { ActiveMembership } from '../api';

interface ActiveMembershipsTableProps {
  memberships: ActiveMembership[];
}

const statusVariant: Record<ActiveMembership['status'], 'green' | 'red' | 'orange' | 'purple' | 'gray'> = {
  activa: 'green',
  morosidad: 'red',
  en_revision: 'orange',
  pausada: 'purple',
  proxima_baja: 'gray',
};

const statusLabel: Record<ActiveMembership['status'], string> = {
  activa: 'Activa',
  morosidad: 'Morosidad',
  en_revision: 'En revisión',
  pausada: 'Pausada',
  proxima_baja: 'Próxima baja',
};

const riskVariant: Record<ActiveMembership['upgradePotential'], 'purple' | 'orange' | 'green'> = {
  alto: 'purple',
  medio: 'orange',
  bajo: 'green',
};

const siteOptions: SelectOption[] = [
  { value: 'todas', label: 'Todas las sedes' },
  { value: 'central', label: 'Sede Central' },
  { value: 'norte', label: 'Sede Norte' },
  { value: 'sur', label: 'Sede Sur' },
  { value: 'digital', label: 'Digital' },
];

const planOptions: SelectOption[] = [
  { value: 'todos', label: 'Todos los planes' },
  { value: 'premium', label: 'Premium 24/7 + PT' },
  { value: 'flexible', label: 'Flexible Mañanas' },
  { value: 'online', label: 'Online Hybrid' },
  { value: 'corporate', label: 'Corporate Scale' },
];

const statusOptions: SelectOption[] = [
  { value: 'todos', label: 'Todos los estados' },
  { value: 'activa', label: 'Activas' },
  { value: 'morosidad', label: 'Morosidad' },
  { value: 'pausada', label: 'Pausadas' },
  { value: 'proxima_baja', label: 'Próxima baja' },
];

export function ActiveMembershipsTable({ memberships }: ActiveMembershipsTableProps) {
  const data = useMemo(() => memberships, [memberships]);

  const totals = useMemo(() => {
    const active = data.filter(item => item.status === 'activa').length;
    const paused = data.filter(item => item.status === 'pausada').length;
    const delinquent = data.filter(item => item.status === 'morosidad').length;
    const churnRisk = data.filter(item => item.flags.includes('riesgo_fuga')).length;
    return { active, paused, delinquent, churnRisk };
  }, [data]);

  const columns: TableColumn<ActiveMembership>[] = [
    {
      key: 'memberName',
      label: 'Cliente',
      render: (_value, row) => (
        <div className="space-y-1">
          <p className="font-semibold text-slate-900 dark:text-slate-100">{row.memberName}</p>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>{row.planName}</span>
            {row.flags.includes('alto_valor') && <Badge variant="purple" size="sm" className="!text-[11px] !px-2 !py-0.5">Alto valor</Badge>}
            {row.flags.includes('riesgo_fuga') && <Badge variant="orange" size="sm" className="!text-[11px] !px-2 !py-0.5">Riesgo fuga</Badge>}
            {row.flags.includes('moroso') && <Badge variant="red" size="sm" className="!text-[11px] !px-2 !py-0.5">Moroso</Badge>}
          </div>
        </div>
      ),
    },
    {
      key: 'renewalDate',
      label: 'Renovación',
      render: (value: string) =>
        new Date(value).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
    },
    {
      key: 'value',
      label: 'Precio actual',
      align: 'right',
      render: (value: number) =>
        value.toLocaleString('es-ES', {
          style: 'currency',
          currency: 'EUR',
          maximumFractionDigits: 0,
        }),
    },
    {
      key: 'paymentMethod',
      label: 'Método pago',
      render: (value: ActiveMembership['paymentMethod']) => (
        <span className="text-sm capitalize text-slate-600 dark:text-slate-300">{value}</span>
      ),
    },
    {
      key: 'site',
      label: 'Sede',
      render: (value: string) => <span className="text-sm text-slate-600 dark:text-slate-300">{value}</span>,
    },
    {
      key: 'origin',
      label: 'Origen',
      render: (value: ActiveMembership['origin']) => (
        <Badge variant="outline" size="sm" className="capitalize !text-[11px] !px-2 !py-0.5">
          {value}
        </Badge>
      ),
    },
    {
      key: 'upgradePotential',
      label: 'Upgrade',
      render: (value: ActiveMembership['upgradePotential'], row) => (
        <div className="flex flex-col items-start">
          <Badge variant={riskVariant[value]} size="sm" className="capitalize !text-[11px] !px-2 !py-0.5">
            {value} potencial
          </Badge>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Riesgo: {row.riskScore}</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      render: (value: ActiveMembership['status']) => (
        <Badge variant={statusVariant[value]} size="sm">
          {statusLabel[value]}
        </Badge>
      ),
    },
  ];

  return (
    <Card className="bg-white shadow-sm ring-1 ring-slate-200/70 dark:bg-slate-900/60 dark:ring-slate-700/40" padding="lg">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Membresías activas</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Controla renovaciones, morosidad y oportunidades de upgrade en una sola vista.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" size="sm" leftIcon={<Sparkles size={14} />}>
              Política upgrade auto
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<Users size={14} />}>
              Asignar membresía
            </Button>
            <Button variant="ghost" size="sm" leftIcon={<PlayCircle size={14} />}>
              Lanzar campaña
            </Button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200/80 bg-slate-50 px-4 py-3 dark:border-slate-700/40 dark:bg-slate-900/40">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Activas</p>
            <p className="text-2xl font-semibold text-slate-900 dark:text-white">{totals.active}</p>
          </div>
          <div className="rounded-xl border border-slate-200/80 bg-slate-50 px-4 py-3 dark:border-slate-700/40 dark:bg-slate-900/40">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Morosidad</p>
            <p className="text-2xl font-semibold text-amber-600 dark:text-amber-400">{totals.delinquent}</p>
          </div>
          <div className="rounded-xl border border-slate-200/80 bg-slate-50 px-4 py-3 dark:border-slate-700/40 dark:bg-slate-900/40">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Pausadas</p>
            <p className="text-2xl font-semibold text-purple-600 dark:text-purple-300">{totals.paused}</p>
          </div>
          <div className="rounded-xl border border-slate-200/80 bg-slate-50 px-4 py-3 dark:border-slate-700/40 dark:bg-slate-900/40">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Riesgo fuga</p>
            <p className="text-2xl font-semibold text-rose-600 dark:text-rose-400">{totals.churnRisk}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="grid gap-3 md:grid-cols-3 md:flex-1">
            <Select label="Filtrar por sede" options={siteOptions} defaultValue="todas" />
            <Select label="Filtrar por plan" options={planOptions} defaultValue="todos" />
            <Select label="Estado" options={statusOptions} defaultValue="todos" />
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" leftIcon={<Filter size={14} />}>
              Filtros avanzados
            </Button>
            <Button variant="secondary" size="sm" leftIcon={<Zap size={14} />}>
              Acciones masivas
            </Button>
          </div>
        </div>

        <Table<ActiveMembership>
          data={data}
          columns={columns}
          emptyMessage="No hay membresías activas registradas."
          className="shadow-none ring-0"
        />

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 dark:border-indigo-500/20 dark:bg-indigo-500/10">
          <div>
            <p className="text-sm font-medium text-indigo-900 dark:text-indigo-200">
              ¿Clientes listos para upgrade automático?
            </p>
              <p className="text-xs text-indigo-700/80 dark:text-indigo-300/80">
                El 18% de tus clientes flexibles usa &gt;80% cupo. Ejecuta el playbook y sube tu ARPU.
              </p>
          </div>
          <Button variant="primary" size="sm" rightIcon={<ArrowRight size={14} />}>
            Ver clientes con potencial
          </Button>
        </div>
      </div>
    </Card>
  );
}
