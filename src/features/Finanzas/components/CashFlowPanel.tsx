import { Badge, Card } from '../../../components/componentsreutilizables';
import type { CashFlowEntry } from '../api';

interface CashFlowPanelProps {
  entries: CashFlowEntry[];
}

export function CashFlowPanel({ entries }: CashFlowPanelProps) {
  return (
    <Card className="bg-white shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700/40" padding="lg">
      <div className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Caja & bancos
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Supervisa saldos y movimientos recientes por cuenta.
            </p>
          </div>
          <Badge variant="blue" size="md">
            {entries.length} cuentas monitorizadas
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {entries.map(entry => (
            <div
              key={entry.id}
              className="rounded-2xl border border-slate-200/70 bg-slate-50 p-5 shadow-sm dark:border-slate-700/40 dark:bg-slate-900/40"
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold text-slate-900 dark:text-white">{entry.account}</p>
                <Badge variant={entry.variation >= 0 ? 'green' : 'red'} size="sm">
                  {entry.variation >= 0 ? '+' : ''}
                  {entry.variation.toFixed(1)}%
                </Badge>
              </div>
              <p className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
                {entry.balance.toLocaleString('es-ES', {
                  style: 'currency',
                  currency: 'EUR',
                  maximumFractionDigits: 0,
                })}
              </p>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Último movimiento:{' '}
                {new Date(entry.lastMovement).toLocaleString('es-ES', {
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}






