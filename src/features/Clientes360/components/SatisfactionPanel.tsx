import { Card } from '../../../components/componentsreutilizables';
import type { SatisfactionInsight } from '../api';

interface SatisfactionPanelProps {
  insights: SatisfactionInsight[];
}

export function SatisfactionPanel({ insights }: SatisfactionPanelProps) {
  if (insights.length === 0) {
    return (
      <Card className="bg-white shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700/40" padding="lg">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Este cliente aún no ha respondido encuestas de satisfacción.
        </p>
      </Card>
    );
  }

  const averageScore =
    insights.reduce((sum, insight) => sum + insight.score, 0) / insights.length;

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-500 text-white shadow-lg" padding="lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-widest text-white/80">Satisfacción promedio</p>
            <p className="mt-2 text-4xl font-black">{averageScore.toFixed(1)}/10</p>
            <p className="text-sm text-white/80">
              Últimas {insights.length} encuestas respondidas por el cliente.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {insights.map(item => (
          <Card key={item.id} className="bg-white shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700/40" padding="lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.survey}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {new Date(item.submittedAt).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <div className="rounded-full bg-slate-900 px-3 py-2 text-sm font-semibold text-white dark:bg-slate-700">
                {item.score}/10
              </div>
            </div>
            {item.comment && (
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                “{item.comment}”
              </p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}







