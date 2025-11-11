import { Badge, Card } from '../../../components/componentsreutilizables';
import type { ForecastEntry } from '../api';

interface ForecastPanelProps {
  entries: ForecastEntry[];
}

export function ForecastPanel({ entries }: ForecastPanelProps) {
  return (
    <Card className="bg-white shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700/40" padding="lg">
      <div className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Presupuestos & forecast</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Analiza proyecciones de ingresos y gastos por período.
            </p>
          </div>
          <Badge variant="purple" size="md">
            {entries.length} períodos proyectados
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {entries.map(entry => {
            const net = entry.projectedRevenue - entry.projectedExpenses;
            return (
              <div
                key={entry.id}
                className="rounded-2xl border border-slate-200/70 bg-slate-50 p-5 shadow-sm dark:border-slate-700/40 dark:bg-slate-900/40"
              >
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  {entry.period}
                </p>
                <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  <p>
                    Ingresos: {' '}
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {entry.projectedRevenue.toLocaleString('es-ES', {
                        style: 'currency',
                        currency: 'EUR',
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </p>
                  <p>
                    Gastos: {' '}
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {entry.projectedExpenses.toLocaleString('es-ES', {
                        style: 'currency',
                        currency: 'EUR',
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </p>
                  <p>
                    Net: {' '}
                    <span className={`font-semibold ${net >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {net.toLocaleString('es-ES', {
                        style: 'currency',
                        currency: 'EUR',
                        maximumFractionDigits: 0,
                      })}
                    </span>
                  </p>
                </div>
                <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                  Confianza: {(entry.confidence * 100).toFixed(0)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}






