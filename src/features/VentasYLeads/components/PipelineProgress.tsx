import { Card, Badge } from '../../../components/componentsreutilizables';
import type { PipelineStage } from '../api';

interface PipelineProgressProps {
  stages: PipelineStage[];
}

const stageColors = ['bg-indigo-500', 'bg-blue-500', 'bg-cyan-500', 'bg-emerald-500', 'bg-purple-500'];

export function PipelineProgress({ stages }: PipelineProgressProps) {
  return (
    <Card className="bg-white shadow-sm ring-1 ring-slate-200/70 dark:ring-slate-700/40">
      <div className="space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Flujo de oportunidades
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Visibilidad del embudo desde lead captado hasta cierre ganado.
            </p>
          </div>
          <Badge variant="purple" size="md" className="self-start">
            Conversión global {Math.round((stages.at(-1)?.conversionRate ?? 0) * 100)}%
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {stages.map((stage, index) => {
            const color = stageColors[index % stageColors.length];
            return (
              <div
                key={stage.id}
                className="rounded-2xl border border-slate-200/70 p-5 shadow-sm transition hover:shadow-md dark:border-slate-700/40"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-white shadow ${color}`}>
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {stage.label}
                      </p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {stage.deals}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Conversión</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      {(stage.conversionRate * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="h-2 rounded-full bg-slate-200/70 dark:bg-slate-700/50">
                    <div
                      className={`h-2 rounded-full ${color}`}
                      style={{ width: `${Math.max(stage.conversionRate * 100, 6)}%` }}
                    />
                  </div>

                  <dl className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/50">
                      <dt className="font-semibold text-slate-500 dark:text-slate-400">Velocidad</dt>
                      <dd className="text-sm font-medium text-slate-900 dark:text-white">
                        {stage.velocityDays.toFixed(1)} días
                      </dd>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/50">
                      <dt className="font-semibold text-slate-500 dark:text-slate-400">Ratio acumulado</dt>
                      <dd className="text-sm font-medium text-slate-900 dark:text-white">
                        {(stage.conversionRate * 100).toFixed(1)}%
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

