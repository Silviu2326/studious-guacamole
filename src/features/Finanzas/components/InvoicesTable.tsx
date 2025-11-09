import { useMemo } from 'react';
import { Badge, Table, type TableColumn } from '../../../components/componentsreutilizables';
import type { InvoiceSummary } from '../api';

interface InvoicesTableProps {
  invoices: InvoiceSummary[];
}

const statusVariant: Record<InvoiceSummary['status'], 'orange' | 'green' | 'red'> = {
  pendiente: 'orange',
  pagada: 'green',
  vencida: 'red',
};

export function InvoicesTable({ invoices }: InvoicesTableProps) {
  const data = useMemo(() => invoices, [invoices]);

  const columns: TableColumn<InvoiceSummary>[] = [
    {
      key: 'id',
      label: 'Factura',
    },
    {
      key: 'client',
      label: 'Cliente',
    },
    {
      key: 'amount',
      label: 'Importe',
      align: 'right',
      render: (value: number) =>
        value.toLocaleString('es-ES', {
          style: 'currency',
          currency: 'EUR',
          maximumFractionDigits: 0,
        }),
    },
    {
      key: 'issuedAt',
      label: 'Emitida',
      render: (value: string) =>
        new Date(value).toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
    },
    {
      key: 'dueAt',
      label: 'Vencimiento',
      render: (value: string) =>
        new Date(value).toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
    },
    {
      key: 'status',
      label: 'Estado',
      render: (value: InvoiceSummary['status']) => (
        <Badge variant={statusVariant[value]} size="sm">
          {value}
        </Badge>
      ),
    },
  ];

  return (
    <Table<InvoiceSummary>
      data={data}
      columns={columns}
      emptyMessage="No hay facturas registradas."
      className="shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700/40"
    />
  );
}


