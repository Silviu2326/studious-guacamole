import { useMemo } from 'react';
import { Eye } from 'lucide-react';
import { Badge, Button, Table, type TableColumn } from '../../../components/componentsreutilizables';
import type { Client360Summary } from '../api';

interface ClientListTableProps {
  clients: Client360Summary[];
  selectedClientIds?: string[];
  onToggleClientSelection?: (clientId: string) => void;
  onViewClientProfile?: (clientId: string) => void;
}

const statusConfig: Record<
  Client360Summary['status'],
  { label: string; variant: 'green' | 'blue' | 'orange' | 'gray' | 'purple' }
> = {
  activo: { label: 'Activo', variant: 'green' },
  pausa: { label: 'En pausa', variant: 'orange' },
  baja: { label: 'De baja', variant: 'gray' },
  lead: { label: 'Lead convertido', variant: 'purple' },
  prueba: { label: 'En prueba', variant: 'blue' },
};

const riskConfig: Record<
  Client360Summary['riskLevel'],
  { label: string; badgeClasses: string }
> = {
  alto: {
    label: 'Riesgo alto',
    badgeClasses:
      'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-200',
  },
  medio: {
    label: 'Riesgo medio',
    badgeClasses:
      'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200',
  },
  bajo: {
    label: 'Riesgo bajo',
    badgeClasses:
      'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200',
  },
};

const satisfactionLabel: Record<Client360Summary['satisfactionLevel'], string> = {
  alto: 'Promotor',
  neutro: 'Neutral',
  bajo: 'En riesgo',
};

const columns = (
  selectedClientIds: string[],
  onToggleClientSelection?: (clientId: string) => void,
  onViewClientProfile?: (clientId: string) => void,
): TableColumn<Client360Summary>[] => [
  {
    key: 'select',
    label: '',
    width: 48,
    render: (_value, row) => (
      <input
        type="checkbox"
        checked={selectedClientIds.includes(row.id)}
        onChange={() => onToggleClientSelection?.(row.id)}
        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600"
        aria-label={`Seleccionar ${row.name}`}
      />
    ),
  },
  {
    key: 'name',
    label: 'Cliente',
    render: (_value, row) => (
      <div className="space-y-1">
        <p className="font-semibold text-slate-900 dark:text-slate-100">
          {row.name}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {row.email}
        </p>
      </div>
    ),
  },
  {
    key: 'status',
    label: 'Estado',
    render: (_value, row) => {
      const config = statusConfig[row.status];
      return (
        <Badge variant={config.variant} size="sm">
          {config.label}
        </Badge>
      );
    },
  },
  {
    key: 'riskLevel',
    label: 'Riesgo',
    render: (_value, row) => {
      const config = riskConfig[row.riskLevel];
      return (
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${config.badgeClasses}`}>
          {config.label}
        </span>
      );
    },
  },
  {
    key: 'membership',
    label: 'Membresía',
    render: (value: Client360Summary['membership']) => value.name,
  },
  {
    key: 'assignedCoach',
    label: 'Coach',
  },
  {
    key: 'branch',
    label: 'Sede',
  },
  {
    key: 'lastVisit',
    label: 'Última visita',
    render: (value: string) =>
      new Date(value).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
      }),
  },
  {
    key: 'monthlyValue',
    label: 'Valor mensual',
    align: 'right',
    render: (value: number) =>
      value.toLocaleString('es-ES', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
      }),
  },
  {
    key: 'satisfactionLevel',
    label: 'Satisfacción',
    render: (value: Client360Summary['satisfactionLevel']) => satisfactionLabel[value],
  },
  {
    key: 'actions',
    label: 'Ficha',
    align: 'center',
    render: (_value, row) => (
      <Button
        variant="ghost"
        size="sm"
        leftIcon={<Eye size={14} />}
        onClick={() => onViewClientProfile?.(row.id)}
        aria-label={`Ver ficha de ${row.name}`}
      >
        Ver ficha
      </Button>
    ),
  },
];

export function ClientListTable({
  clients,
  selectedClientIds = [],
  onToggleClientSelection,
  onViewClientProfile,
}: ClientListTableProps) {
  const tableData = useMemo(() => clients, [clients]);

  return (
    <Table<Client360Summary>
      data={tableData}
      columns={columns(selectedClientIds, onToggleClientSelection, onViewClientProfile)}
      emptyMessage="No hay clientes que coincidan con los filtros activos"
      className="shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700/40"
      sortColumn={undefined}
      sortDirection={undefined}
      onSort={undefined}
    />
  );
}
