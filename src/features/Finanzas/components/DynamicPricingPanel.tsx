import { Card } from '../../../components/componentsreutilizables';
import type { DynamicPricingInsight } from '../api';

interface DynamicPricingPanelProps {
  insights: DynamicPricingInsight[];
}

const impactLabel: Record<DynamicPricingInsight['impact'], string> = {
  positivo: 'Impacto positivo',
  neutral: 'Impacto neutral',
  negativo: 'Impacto negativo',
};

export function DynamicPricingPanel({ insights }: DynamicPricingPanelProps) {
  if (insights.length === 0) {
    return (
      <Card className="bg-white shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700/40" padding="lg">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Aún no hay evaluaciones de precios dinámicos.
        </p>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700/40" padding="lg">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Precios dinámicos</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Ajusta tarifas según demanda, competitividad y ocupación en tiempo real.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {insights.map(item => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200/70 bg-slate-50 p-5 shadow-sm dark:border-slate-700/40 dark:bg-slate-900/40"
            >
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.product}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Último ajuste:{' '}
                {new Date(item.lastChange).toLocaleString('es-ES', {
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              <p className="mt-3 text-sm font-medium text-slate-900 dark:text-white">
                {impactLabel[item.impact]}
              </p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.recommendation}</p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}




