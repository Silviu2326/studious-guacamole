import { useMemo } from 'react';
import { Badge, Table, type TableColumn } from '../../../components/componentsreutilizables';
import type { TaxExportRecord } from '../api';

interface TaxExportTableProps {
  records: TaxExportRecord[];
}

const statusVariant: Record<TaxExportRecord['status'], 'orange' | 'blue' | 'green'> = {
  preparado: 'orange',
  enviado: 'blue',
  validado: 'green',
};

export function TaxExportTable({ records }: TaxExportTableProps) {
  const data = useMemo(() => records, [records]);

  const columns: TableColumn<TaxExportRecord>[] = [
    {
      key: 'document',
      label: 'Documento',
    },
    {
      key: 'amount',
      label: 'Monto',
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
      render: (value: TaxExportRecord['status']) => (
        <Badge variant={statusVariant[value]} size="sm">
          {value}
        </Badge>
      ),
    },
    {
      key: 'submittedAt',
      label: 'Enviado',
      render: (value?: string) =>
        value
          ? new Date(value).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })
          : '—',
    },
  ];

  return (
    <Table<TaxExportRecord>
      data={data}
      columns={columns}
      emptyMessage="No hay exportaciones fiscales preparadas."
      className="shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700/40"
    />
  );
}




