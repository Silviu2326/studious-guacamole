import { useMemo } from 'react';
import { Badge, Table, type TableColumn } from '../../../components/componentsreutilizables';
import type { ActiveMembership } from '../api';

interface ActiveMembershipsTableProps {
  memberships: ActiveMembership[];
}

const statusVariant: Record<ActiveMembership['status'], 'green' | 'red' | 'orange'> = {
  activa: 'green',
  morosidad: 'red',
  en_revision: 'orange',
};

export function ActiveMembershipsTable({ memberships }: ActiveMembershipsTableProps) {
  const data = useMemo(() => memberships, [memberships]);

  const columns: TableColumn<ActiveMembership>[] = [
    {
      key: 'memberName',
      label: 'Miembro',
      render: (_value, row) => (
        <div className="space-y-1">
          <p className="font-semibold text-slate-900 dark:text-slate-100">{row.memberName}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{row.planName}</p>
        </div>
      ),
    },
    {
      key: 'startDate',
      label: 'Inicio',
      render: (value: string) =>
        new Date(value).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
    },
    {
      key: 'renewalDate',
      label: 'Renovación',
      render: (value: string) =>
        new Date(value).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
    },
    {
      key: 'value',
      label: 'Valor',
      align: 'right',
      render: (value: number) =>
        value.toLocaleString('es-ES', {
          style: 'currency',
          currency: 'EUR',
          maximumFractionDigits: 0,
        }),
    },
    {
      key: 'status',
      label: 'Estado',
      render: (value: ActiveMembership['status']) => (
        <Badge variant={statusVariant[value]} size="sm">
          {value.replace('_', ' ')}
        </Badge>
      ),
    },
  ];

  return (
    <Table<ActiveMembership>
      data={data}
      columns={columns}
      emptyMessage="No hay membresías activas registradas."
      className="shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700/40"
    />
  );
}

