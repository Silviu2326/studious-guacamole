import { Badge, Card } from '../../../components/componentsreutilizables';
import type { AbsenceRecord } from '../api';

interface AbsencesPanelProps {
  records: AbsenceRecord[];
}

const followUpVariant: Record<AbsenceRecord['followUpStatus'], 'orange' | 'blue' | 'green'> = {
  pendiente: 'orange',
  contactado: 'blue',
  resuelto: 'green',
};

export function AbsencesPanel({ records }: AbsencesPanelProps) {
  return (
    <Card className="bg-white shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700/40" padding="lg">
      <div className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Ausencias & cancelaciones
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Visualiza patrones y gestiona follow-ups para reducir churn.
            </p>
          </div>
          <Badge variant="purple" size="md">
            {records.length} casos recientes
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {records.map(record => (
            <div
              key={record.id}
              className="rounded-2xl border border-slate-200/70 bg-slate-50 p-5 shadow-sm dark:border-slate-700/40 dark:bg-slate-900/40"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{record.member}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{record.session}</p>
                </div>
                <Badge variant={followUpVariant[record.followUpStatus]} size="sm">
                  {record.followUpStatus}
                </Badge>
              </div>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                {new Date(record.date).toLocaleString('es-ES', {
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              {record.reason && (
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                  Nota: {record.reason}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}







