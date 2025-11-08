import { useMemo, useState } from 'react';
import { Badge, Table, type TableColumn } from '../../../components/componentsreutilizables';
import type { LeadOpportunity } from '../api';

type SortState = {
  column: string;
  direction: 'asc' | 'desc';
};

const statusConfig: Record<
  LeadOpportunity['status'],
  { label: string; variant: 'blue' | 'orange' | 'green' | 'red' }
> = {
  nuevo: { label: 'Nuevo', variant: 'blue' },
  en_progreso: { label: 'En progreso', variant: 'orange' },
  ganado: { label: 'Ganado', variant: 'green' },
  perdido: { label: 'Perdido', variant: 'red' },
};

const columns: TableColumn<LeadOpportunity>[] = [
  {
    key: 'id',
    label: 'ID',
  },
  {
    key: 'name',
    label: 'Oportunidad',
    render: (_value, row) => (
      <div className="space-y-0.5">
        <p className="font-semibold text-slate-900 dark:text-slate-100">{row.name}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{row.source}</p>
      </div>
    ),
  },
  {
    key: 'owner',
    label: 'Propietario',
  },
  {
    key: 'status',
    label: 'Estado',
    sortable: true,
    render: (_value, row) => {
      const config = statusConfig[row.status];
      return <Badge variant={config.variant}>{config.label}</Badge>;
    },
  },
  {
    key: 'value',
    label: 'Valor (€)',
    sortable: true,
    align: 'right',
    render: (value) => (
      <span className="font-semibold text-slate-900 dark:text-slate-100">
        {value.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
      </span>
    ),
  },
  {
    key: 'probability',
    label: 'Probabilidad',
    sortable: true,
    align: 'right',
    render: (value: number) => (
      <span className="font-medium text-slate-700 dark:text-slate-200">
        {(value * 100).toFixed(0)}%
      </span>
    ),
  },
  {
    key: 'createdAt',
    label: 'Creado',
    sortable: true,
    render: (value: string) =>
      new Date(value).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
  },
  {
    key: 'nextAction',
    label: 'Próximo paso',
    render: (value?: string) => value ?? '—',
  },
];

const compareValues = (a: LeadOpportunity, b: LeadOpportunity, column: string) => {
  const aValue = a[column as keyof LeadOpportunity];
  const bValue = b[column as keyof LeadOpportunity];

  if (column === 'createdAt') {
    return new Date(aValue as string).getTime() - new Date(bValue as string).getTime();
  }

  if (typeof aValue === 'number' && typeof bValue === 'number') {
    return aValue - bValue;
  }

  return String(aValue).localeCompare(String(bValue));
};

interface LeadOpportunitiesTableProps {
  opportunities: LeadOpportunity[];
}

export function LeadOpportunitiesTable({ opportunities }: LeadOpportunitiesTableProps) {
  const [sortState, setSortState] = useState<SortState>({ column: 'createdAt', direction: 'desc' });

  const sortedData = useMemo(() => {
    const { column, direction } = sortState;
    const dataCopy = [...opportunities];

    dataCopy.sort((a, b) => {
      const comparison = compareValues(a, b, column);
      return direction === 'asc' ? comparison : -comparison;
    });

    return dataCopy;
  }, [opportunities, sortState]);

  const handleSort = (column: string, direction: 'asc' | 'desc') => {
    setSortState({ column, direction });
  };

  return (
    <Table<LeadOpportunity>
      data={sortedData}
      columns={columns}
      onSort={handleSort}
      sortColumn={sortState.column}
      sortDirection={sortState.direction}
      emptyMessage="No hay oportunidades de venta registradas todavía"
      className="shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700/40"
    />
  );
}

