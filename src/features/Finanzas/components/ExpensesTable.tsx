import { useMemo } from 'react';
import { Badge, Table, type TableColumn } from '../../../components/componentsreutilizables';
import type { ExpenseRecord } from '../api';

interface ExpensesTableProps {
  expenses: ExpenseRecord[];
}

const statusVariant: Record<ExpenseRecord['status'], 'green' | 'orange'> = {
  pagado: 'green',
  pendiente: 'orange',
};

export function ExpensesTable({ expenses }: ExpensesTableProps) {
  const data = useMemo(() => expenses, [expenses]);

  const columns: TableColumn<ExpenseRecord>[] = [
    {
      key: 'vendor',
      label: 'Proveedor',
    },
    {
      key: 'category',
      label: 'Categoría',
    },
    {
      key: 'amount',
      label: 'Monto',
      align: 'right',
      render: (value: number) =>
        value.toLocaleString('es-ES', {
          style: 'currency',
          currency: 'EUR',
          minimumFractionDigits: 0,
        }),
    },
    {
      key: 'paidAt',
      label: 'Fecha',
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
      render: (value: ExpenseRecord['status']) => (
        <Badge variant={statusVariant[value]} size="sm">
          {value}
        </Badge>
      ),
    },
  ];

  return (
    <Table<ExpenseRecord>
      data={data}
      columns={columns}
      emptyMessage="No hay gastos registrados."
      className="shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700/40"
    />
  );
}

