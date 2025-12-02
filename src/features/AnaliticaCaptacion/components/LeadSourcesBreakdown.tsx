import { ReactNode } from 'react';
import { Activity, TrendingDown, TrendingUp } from 'lucide-react';
import { Badge, Card } from '../../../components/componentsreutilizables';
import { LeadSourceStat } from '../api';

interface LeadSourcesBreakdownProps {
  sources: LeadSourceStat[];
}

const TREND_CONFIG: Record<
  LeadSourceStat['trend'],
  {
    icon: ReactNode;
    label: string;
    badgeVariant: 'green' | 'red' | 'gray';
  }
> = {
  up: {
    icon: <TrendingUp size={16} className="text-emerald-600" />,
    label: 'Creciente',
    badgeVariant: 'green',
  },
  down: {
    icon: <TrendingDown size={16} className="text-rose-600" />,
    label: 'A la baja',
    badgeVariant: 'red',
  },
  stable: {
    icon: <Activity size={16} className="text-slate-500" />,
    label: 'Estable',
    badgeVariant: 'gray',
  },
};

export function LeadSourcesBreakdown({ sources }: LeadSourcesBreakdownProps) {
  const totalLeads = sources.reduce((sum, source) => sum + source.leads, 0);

  return (
    <Card padding="none" className="bg-white shadow-sm ring-1 ring-slate-200">
      <div className="px-6 py-5">
        <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-gray-900">Origen de los leads</h2>
            <p className="text-sm text-gray-600">
              Identifica qué canales generan más leads y cómo evoluciona su aportación mes a mes.
            </p>
          </div>
          <Badge variant="blue" size="md" className="justify-center">
            {totalLeads} leads totales
          </Badge>
        </header>

        <div className="mt-6 space-y-4">
          {sources.map(source => {
            const progress = totalLeads === 0 ? 0 : (source.leads / totalLeads) * 100;
            const trend = TREND_CONFIG[source.trend];

            return (
              <Card
                key={source.id}
                variant="hover"
                className="bg-slate-50 ring-1 ring-slate-200"
                padding="lg"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-base font-semibold text-slate-900">{source.label}</p>
                    <p className="text-xs text-slate-500">
                      {Math.round(source.contribution * 100)}% del total
                    </p>
                  </div>
                  <Badge variant={trend.badgeVariant} size="sm" className="flex items-center gap-1">
                    {trend.icon}
                    {trend.label}
                  </Badge>
                </div>

                <div className="mt-3 space-y-2">
                  <div className="h-3 w-full overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm font-semibold text-slate-600">
                    <span>{source.leads} leads</span>
                    <span>{progress.toFixed(0)}%</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

