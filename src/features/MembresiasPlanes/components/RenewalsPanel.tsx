import { Badge, Card } from '../../../components/componentsreutilizables';
import type { RenewalInsight } from '../api';

interface RenewalsPanelProps {
  renewals: RenewalInsight[];
}

const riskVariant: Record<RenewalInsight['churnRisk'], 'red' | 'orange' | 'green'> = {
  alto: 'red',
  medio: 'orange',
  bajo: 'green',
};

export function RenewalsPanel({ renewals }: RenewalsPanelProps) {
  if (renewals.length === 0) {
    return (
      <Card className="bg-white shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700/40" padding="lg">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          No hay renovaciones programadas en las próximas semanas.
        </p>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700/40" padding="lg">
      <div className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Renovaciones & bajas</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Prioriza clientes en riesgo y asigna acciones de retención.
            </p>
          </div>
          <Badge variant="purple" size="md">
            {renewals.length} renovaciones próximas
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {renewals.map(renewal => (
            <div
              key={renewal.id}
              className="rounded-2xl border border-slate-200/70 bg-slate-50 p-5 shadow-sm dark:border-slate-700/40 dark:bg-slate-900/40"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{renewal.memberName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{renewal.planName}</p>
                </div>
                <Badge variant={riskVariant[renewal.churnRisk]} size="sm">
                  Riesgo {renewal.churnRisk}
                </Badge>
              </div>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                Renovación:{" "}
                {new Date(renewal.renewalDate).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{renewal.nextAction}</p>
              {renewal.reason && (
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Motivo: {renewal.reason}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

