import { useMemo } from 'react';
import { Badge, Table, type TableColumn } from '../../../components/componentsreutilizables';
import type { PlanSummary } from '../api';

interface PlanCatalogTableProps {
  plans: PlanSummary[];
}

const billingLabels: Record<PlanSummary['billingCycle'], string> = {
  mensual: 'Mensual',
  trimestral: 'Trimestral',
  anual: 'Anual',
};

export function PlanCatalogTable({ plans }: PlanCatalogTableProps) {
  const data = useMemo(() => plans, [plans]);

  const columns: TableColumn<PlanSummary>[] = [
    {
      key: 'name',
      label: 'Plan',
      render: (_value, row) => (
        <div className="space-y-1">
          <p className="font-semibold text-slate-900 dark:text-slate-100">{row.name}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {billingLabels[row.billingCycle]} • {row.features.slice(0, 2).join(' · ')}
            {row.features.length > 2 ? '…' : ''}
          </p>
        </div>
      ),
    },
    {
      key: 'price',
      label: 'Precio',
      render: (value: number) =>
        value.toLocaleString('es-ES', {
          style: 'currency',
          currency: 'EUR',
          maximumFractionDigits: 0,
        }),
    },
    {
      key: 'activeMembers',
      label: 'Activos',
      align: 'right',
    },
    {
      key: 'status',
      label: 'Estado',
      render: (value: PlanSummary['status']) => (
        <Badge variant={value === 'activo' ? 'green' : 'orange'} size="sm">
          {value === 'activo' ? 'Activo' : 'Pausado'}
        </Badge>
      ),
    },
  ];

  return (
    <Table<PlanSummary>
      data={data}
      columns={columns}
      emptyMessage="Todavía no has configurado planes."
      className="shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700/40"
    />
  );
}

