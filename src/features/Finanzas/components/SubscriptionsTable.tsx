import { useMemo } from 'react';
import { Badge, Table, type TableColumn } from '../../../components/componentsreutilizables';
import type { SubscriptionSummary } from '../api';

interface SubscriptionsTableProps {
  subscriptions: SubscriptionSummary[];
}

const billingLabels: Record<SubscriptionSummary['billingCycle'], string> = {
  mensual: 'Mensual',
  trimestral: 'Trimestral',
  anual: 'Anual',
};

const statusVariant: Record<SubscriptionSummary['status'], 'green' | 'orange' | 'red'> = {
  activa: 'green',
  en_pausa: 'orange',
  morosidad: 'red',
};

export function SubscriptionsTable({ subscriptions }: SubscriptionsTableProps) {
  const data = useMemo(() => subscriptions, [subscriptions]);

  const columns: TableColumn<SubscriptionSummary>[] = [
    {
      key: 'memberName',
      label: 'Miembro',
    },
    {
      key: 'planName',
      label: 'Plan',
    },
    {
      key: 'billingCycle',
      label: 'Ciclo',
      render: (value: SubscriptionSummary['billingCycle']) => billingLabels[value],
    },
    {
      key: 'value',
      label: 'Valor',
      align: 'right',
      render: (value: number) =>
        value.toLocaleString('es-ES', {
          style: 'currency',
          currency: 'EUR',
          minimumFractionDigits: 0,
        }),
    },
    {
      key: 'status',
      label: 'Estado',
      render: (value: SubscriptionSummary['status']) => (
        <Badge variant={statusVariant[value]} size="sm">
          {value.replace('_', ' ')}
        </Badge>
      ),
    },
  ];

  return (
    <Table<SubscriptionSummary>
      data={data}
      columns={columns}
      emptyMessage="No hay suscripciones activas registradas."
      className="shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700/40"
    />
  );
}

