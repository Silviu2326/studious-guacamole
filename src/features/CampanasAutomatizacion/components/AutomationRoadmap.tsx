import React from 'react';
import { Badge, Card } from '../../../components/componentsreutilizables';
import { CalendarClock, KanbanSquare, NotebookPen, TrendingUp } from 'lucide-react';
import { ds } from '../../adherencia/ui/ds';
import { AutomationRoadmapItem } from '../types';

const impactVariant: Record<AutomationRoadmapItem['impact'], React.ComponentProps<typeof Badge>['variant']> = {
  high: 'red',
  medium: 'orange',
  low: 'yellow',
};

const statusLabel: Record<AutomationRoadmapItem['status'], { label: string; variant: React.ComponentProps<typeof Badge>['variant'] }> =
  {
    backlog: { label: 'Backlog', variant: 'gray' },
    'in-progress': { label: 'En curso', variant: 'blue' },
    ready: { label: 'Listo', variant: 'purple' },
    launched: { label: 'Lanzado', variant: 'green' },
  };

interface AutomationRoadmapProps {
  items: AutomationRoadmapItem[];
  loading?: boolean;
  className?: string;
}

export const AutomationRoadmap: React.FC<AutomationRoadmapProps> = ({ items, loading = false, className = '' }) => {
  if (loading && items.length === 0) {
    return (
      <Card className={className}>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className={`${ds.shimmer} h-20`} />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-100 to-red-200 flex items-center justify-center">
              <KanbanSquare className="w-5 h-5 text-rose-600" />
            </span>
            <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Roadmap de automatización
            </h2>
          </div>
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            Prioriza iniciativas de alto impacto para el Mission Control.
          </p>
        </div>
        <Badge variant="purple" size="md">
          {items.length} iniciativas
        </Badge>
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const status = statusLabel[item.status];
          return (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-100 dark:border-slate-800 p-4 bg-white dark:bg-[#0f1828] flex flex-wrap items-start gap-4 justify-between"
            >
              <div className="flex-1 min-w-[220px]">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                    {item.title}
                  </h3>
                  <Badge variant={impactVariant[item.impact]}>
                    Impacto {item.impact.toUpperCase()}
                  </Badge>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </div>
                <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                  {item.description}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {item.tags.map((tag) => (
                    <Badge key={`${item.id}-${tag}`} variant="outline" className="bg-slate-50 dark:bg-white/10">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2 min-w-[180px]">
                <div className="flex items-center gap-2 text-sm">
                  <NotebookPen className="w-4 h-4 text-indigo-500" />
                  <span className={`${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>Owner: {item.owner}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CalendarClock className="w-4 h-4 text-emerald-500" />
                  <span className={`${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>ETA {item.eta}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-slate-500" />
                  <span className={`${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>Esfuerzo {item.effort}</span>
                </div>
                {item.dependencies && item.dependencies.length > 0 && (
                  <div className="text-xs bg-slate-100 dark:bg-white/10 rounded-lg px-2 py-1 text-slate-600 dark:text-slate-300">
                    Depende de: {item.dependencies.join(', ')}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};



