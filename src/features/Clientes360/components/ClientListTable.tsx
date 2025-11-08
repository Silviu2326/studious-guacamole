import { useMemo } from 'react';
import { Badge, Button, Table, type TableColumn } from '../../../components/componentsreutilizables';
import type { Client360Summary } from '../api';

interface ClientListTableProps {
  clients: Client360Summary[];
  selectedClientId?: string;
  onSelectClient?: (clientId: string) => void;
}

const statusConfig: Record<
  Client360Summary['status'],
  { label: string; variant: 'green' | 'orange' | 'gray' }
> = {
  activo: { label: 'Activo', variant: 'green' },
  riesgo: { label: 'Riesgo', variant: 'orange' },
  inactivo: { label: 'Inactivo', variant: 'gray' },
};

const columns = (
  onSelectClient?: (clientId: string) => void,
): TableColumn<Client360Summary>[] => [
  {
    key: 'name',
    label: 'Cliente',
    render: (_value, row) => (
      <div className="space-y-1">
        <p className="font-semibold text-slate-900 dark:text-slate-100">{row.name}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{row.email}</p>
      </div>
    ),
  },
  {
    key: 'membership',
    label: 'Membresía',
  },
  {
    key: 'assignedCoach',
    label: 'Coach',
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
    key: 'lastVisit',
    label: 'Última visita',
    render: (value: string) =>
      new Date(value).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
      }),
  },
  {
    key: 'lifetimeValue',
    label: 'LTV (€)',
    align: 'right',
    render: (value: number) =>
      value.toLocaleString('es-ES', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
      }),
  },
  {
    key: 'satisfactionScore',
    label: 'Satisfacción',
    align: 'right',
    render: (value: number) => `${value}%`,
  },
  {
    key: 'actions',
    label: '',
    render: (_value, row) =>
      onSelectClient ? (
        <Button variant="ghost" size="sm" onClick={() => onSelectClient(row.id)}>
          Ver ficha
        </Button>
      ) : null,
    align: 'right',
  },
];

export function ClientListTable({ clients, selectedClientId, onSelectClient }: ClientListTableProps) {
  const tableData = useMemo(() => clients, [clients]);

  return (
    <Table<Client360Summary>
      data={tableData}
      columns={columns(onSelectClient)}
      emptyMessage="No hay clientes registrados todavía"
      className="shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700/40"
      onSort={undefined}
      sortColumn={undefined}
      sortDirection={undefined}
      loading={false}
    />
  );
}

