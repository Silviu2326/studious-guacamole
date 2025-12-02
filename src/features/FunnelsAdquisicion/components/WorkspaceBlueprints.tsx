import React from 'react';
import { ArrowRight, ClipboardList, Rocket, Sparkles, Zap } from 'lucide-react';
import { Badge, Button, Card } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { AcquisitionWorkspaceBlueprint } from '../types';

interface WorkspaceBlueprintsProps {
  blueprint?: AcquisitionWorkspaceBlueprint;
  loading?: boolean;
  className?: string;
}

const impactVariant: Record<
  NonNullable<AcquisitionWorkspaceBlueprint['automations'][number]>['impact'],
  { label: string; variant: 'success' | 'warning' | 'secondary' }
> = {
  high: { label: 'Alto impacto', variant: 'success' },
  medium: { label: 'Impacto medio', variant: 'warning' },
  low: { label: 'Impacto ligero', variant: 'secondary' },
};

export const WorkspaceBlueprints: React.FC<WorkspaceBlueprintsProps> = ({
  blueprint,
  loading = false,
  className = '',
}) => {
  if (loading) {
    return (
      <Card className={`col-span-2 ${className}`.trim()}>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={`workspace-skeleton-${index}`} className={`${ds.shimmer} h-32`} />
          ))}
        </div>
      </Card>
    );
  }

  if (!blueprint) {
    return (
      <Card className={`col-span-2 ${className}`.trim()}>
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
          <Sparkles className="w-8 h-8 text-indigo-500" />
          <div>
            <h3 className={`${ds.typography.h3} ${ds.color.textPrimaryDark}`}>Selecciona un workspace</h3>
            <p className={`${ds.typography.bodySmall} ${ds.color.textSecondaryDark}`}>
              Elige un tab para ver KPIs clave, quick wins y automatizaciones recomendadas por IA.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`col-span-2 ${className}`.trim()}>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-600" />
            </span>
            <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              {blueprint.title}
            </h2>
          </div>
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            {blueprint.description}
          </p>
        </div>
        <Button variant="secondary" size="sm" className="inline-flex items-center gap-2">
          Ver playbook detallado
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        {blueprint.focusMetrics.map((metric) => (
          <div
            key={metric.id}
            className="rounded-2xl border border-gray-100 dark:border-gray-900 p-4 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                {metric.label}
              </h3>
              {typeof metric.change === 'number' ? (
                <Badge variant={metric.trend === 'down' ? 'warning' : 'success'} size="sm">
                  {metric.trend === 'down' ? '−' : '+'}
                  {Math.abs(metric.change)}
                  {metric.id.includes('rate') || metric.id.includes('conversion') ? ' pts' : '%'}
                </Badge>
              ) : null}
            </div>
            <p className={`${ds.typography.h3} font-semibold ${ds.color.textPrimaryDark}`}>{metric.value}</p>
            {metric.helper ? (
              <p className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                {metric.helper}
              </p>
            ) : null}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-indigo-500" />
            <h3 className={`${ds.typography.h3} ${ds.color.textPrimaryDark}`}>Quick wins & acciones clave</h3>
          </div>
          <div className="space-y-3">
            {blueprint.recommendedActions.map((action) => (
              <div
                key={action.id}
                className="rounded-2xl border border-gray-100 dark:border-gray-900 p-4 bg-white/80 dark:bg-[#0f172a]/80"
              >
                <h4 className={`${ds.typography.bodyLarge} font-semibold ${ds.color.textPrimaryDark}`}>{action.title}</h4>
                <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                  {action.description}
                </p>
                <Button
                  asChild={Boolean(action.href)}
                  variant="ghost"
                  size="sm"
                  className="mt-3 inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-300"
                >
                  {action.href ? (
                    <a href={action.href}>
                      {action.cta}
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  ) : (
                    <>
                      {action.cta}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-emerald-500" />
              <h3 className={`${ds.typography.h3} ${ds.color.textPrimaryDark}`}>Automatizaciones recomendadas</h3>
            </div>
            <div className="space-y-3">
              {blueprint.automations.map((automation) => {
                const impact = impactVariant[automation.impact];
                return (
                  <div
                    key={automation.id}
                    className="rounded-2xl border border-gray-100 dark:border-gray-900 p-4 bg-white/80 dark:bg-[#0f172a]/80"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`${ds.typography.bodyLarge} font-semibold ${ds.color.textPrimaryDark}`}>
                        {automation.title}
                      </h4>
                      <Badge variant={impact.variant}>{impact.label}</Badge>
                    </div>
                    <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                      {automation.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Rocket className="w-5 h-5 text-indigo-500" />
              <h3 className={`${ds.typography.h3} ${ds.color.textPrimaryDark}`}>Recursos & docs clave</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {blueprint.resources.map((resource) => (
                <Button
                  key={resource.id}
                  asChild
                  variant="outline"
                  className="justify-between bg-white/70 dark:bg-[#111827]/70 hover:bg-indigo-50 dark:hover:bg-indigo-900/40"
                  size="sm"
                >
                  <a href={resource.href} className="flex items-center justify-between w-full gap-2">
                    {resource.label}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};










