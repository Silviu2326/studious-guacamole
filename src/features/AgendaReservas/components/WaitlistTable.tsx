import { useMemo } from 'react';
import { Badge, Table, type TableColumn } from '../../../components/componentsreutilizables';
import type { WaitlistEntry } from '../api';

interface WaitlistTableProps {
  entries: WaitlistEntry[];
}

const priorityVariant: Record<WaitlistEntry['priority'], 'red' | 'orange' | 'blue'> = {
  alta: 'red',
  media: 'orange',
  baja: 'blue',
};

const columns: TableColumn<WaitlistEntry>[] = [
  {
    key: 'member',
    label: 'Miembro',
    render: (_value, row) => (
      <div className="space-y-1">
        <p className="font-semibold text-slate-900 dark:text-slate-100">{row.member}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{row.session}</p>
      </div>
    ),
  },
  {
    key: 'sessionDate',
    label: 'Fecha sesión',
    render: (value: string) =>
      new Date(value).toLocaleString('es-ES', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }),
  },
  {
    key: 'priority',
    label: 'Prioridad',
    render: (value: WaitlistEntry['priority']) => (
      <Badge variant={priorityVariant[value]} size="sm">
        {value.toUpperCase()}
      </Badge>
    ),
  },
  {
    key: 'notified',
    label: 'Notificado',
    render: (value: boolean) => (
      <Badge variant={value ? 'green' : 'outline'} size="sm">
        {value ? 'Sí' : 'Pendiente'}
      </Badge>
    ),
  },
];

export function WaitlistTable({ entries }: WaitlistTableProps) {
  const data = useMemo(() => entries, [entries]);

  return (
    <Table<WaitlistEntry>
      data={data}
      columns={columns}
      emptyMessage="No hay personas en lista de espera."
      className="shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700/40"
    />
  );
}

