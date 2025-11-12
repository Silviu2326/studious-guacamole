import React from 'react';
import { ArrowUpRight, ArrowDownRight, Clock, DollarSign, Target, Workflow } from 'lucide-react';
import { Card, Badge } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { MissionControlSummary } from '../types';

const iconMapper: Record<string, React.ReactNode> = {
  target: <Target className="w-5 h-5 text-indigo-500 dark:text-indigo-300" />,
  workflow: <Workflow className="w-5 h-5 text-purple-500 dark:text-purple-300" />,
  clock: <Clock className="w-5 h-5 text-sky-500 dark:text-sky-300" />,
  currency: <DollarSign className="w-5 h-5 text-emerald-500 dark:text-emerald-300" />,
};

const trendIcon = {
  up: <ArrowUpRight className="w-4 h-4 text-emerald-500" />,
  down: <ArrowDownRight className="w-4 h-4 text-rose-500" />,
  neutral: null,
};

const trendColor: Record<MissionControlSummary['trend'], string> = {
  up: 'text-emerald-600 dark:text-emerald-400',
  down: 'text-rose-600 dark:text-rose-400',
  neutral: 'text-slate-500 dark:text-slate-400',
};

interface SummaryGridProps {
  summary: MissionControlSummary[];
  loading?: boolean;
}

export const SummaryGrid: React.FC<SummaryGridProps> = ({ summary, loading = false }) => {
  if (loading && summary.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={`summary-skeleton-${index}`} className={`${ds.shimmer} h-44 rounded-2xl`} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {summary.map((item) => (
        <Card
          key={item.id}
          className="relative overflow-hidden bg-gradient-to-br from-white to-slate-50 dark:from-[#101827] dark:to-[#111c2f]"
        >
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-12 h-12 rounded-xl bg-indigo-100/70 dark:bg-indigo-900/40 flex items-center justify-center">
                  {iconMapper[item.icon] ?? iconMapper.target}
                </span>
                <div>
                  <p className={`${ds.typography.bodySmall} text-indigo-600 dark:text-indigo-300 uppercase tracking-[0.15em]`}>
                    Mission Control
                  </p>
                  <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                    {item.label}
                  </h3>
                </div>
              </div>
              <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-6`}>
                {item.description}
              </p>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                  {item.id === 'client-response-rate'
                    ? `${item.value}%`
                    : item.id === 'messages-sent' || item.id === 'active-reminders' || item.id === 'pending-communication'
                    ? item.value.toString()
                    : item.value}
                </span>
                <Badge variant="blue">
                  {item.channelFocus === 'multi' ? 'Omnicanal' : `Foco ${String(item.channelFocus).toUpperCase()}`}
                </Badge>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className={`flex items-center gap-1 ${trendColor[item.trend]}`}>
                {trendIcon[item.trend]}
                <span className={`${ds.typography.caption}`}>
                  {item.trend === 'neutral' ? 'Sin cambios' : `${item.changePercentage > 0 ? '+' : ''}${item.changePercentage}%`}
                </span>
              </div>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500" />
        </Card>
      ))}
    </div>
  );
};









