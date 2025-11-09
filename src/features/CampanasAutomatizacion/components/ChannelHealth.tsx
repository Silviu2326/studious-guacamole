import React from 'react';
import { ActivitySquare, AlertTriangle, BarChart3, ShieldCheck } from 'lucide-react';
import { Card, Badge } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { ChannelHealthMetric } from '../types';

interface ChannelHealthProps {
  metrics: ChannelHealthMetric[];
  loading?: boolean;
  className?: string;
}

const channelColors: Record<ChannelHealthMetric['channel'], string> = {
  email: 'from-blue-500 to-indigo-500',
  sms: 'from-purple-500 to-pink-500',
  whatsapp: 'from-emerald-500 to-teal-500',
  push: 'from-sky-500 to-cyan-500',
  'in-app': 'from-orange-500 to-amber-500',
  multi: 'from-slate-600 to-slate-800',
};

export const ChannelHealth: React.FC<ChannelHealthProps> = ({ metrics, loading = false, className = '' }) => {
  if (loading && metrics.length === 0) {
    return (
      <Card className={className}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className={`${ds.shimmer} h-40`} />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-slate-700" />
            </span>
            <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Health por canal
            </h2>
          </div>
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            Monitoriza entregabilidad, engagement y cobertura de automatización.
          </p>
        </div>
        <Badge variant="gray" size="md">
          {metrics.length} canales
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className="relative overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800 p-4 bg-white dark:bg-[#0f1828]"
          >
            <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full bg-gradient-to-br ${channelColors[metric.channel]} opacity-20`} />
            <div className="flex items-center justify-between gap-3 mb-3 relative">
              <div>
                <p className={`${ds.typography.caption} uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300`}>
                  Channel health
                </p>
                <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                  {metric.channel === 'multi' ? 'Omnicanal' : metric.channel.toUpperCase()}
                </h3>
              </div>
              <Badge variant="outline" className="bg-white/70 dark:bg-[#0f1828]">
                Incidentes {metric.incidents}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-3 relative">
              <div className="rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100/70 dark:border-white/10 p-3">
                <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>Deliverability</p>
                <div className="flex items-center gap-2 mt-1">
                  <BarChart3 className="w-4 h-4 text-indigo-500" />
                  <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimaryDark}`}>
                    {metric.deliverability}%
                  </span>
                </div>
              </div>
              <div className="rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100/70 dark:border-white/10 p-3">
                <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>Engagement</p>
                <div className="flex items-center gap-2 mt-1">
                  <ActivitySquare className="w-4 h-4 text-emerald-500" />
                  <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimaryDark}`}>
                    {metric.engagement}%
                  </span>
                </div>
              </div>
              <div className="rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100/70 dark:border-white/10 p-3">
                <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>Satisfacción</p>
                <div className="flex items-center gap-2 mt-1">
                  <ShieldCheck className="w-4 h-4 text-sky-500" />
                  <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimaryDark}`}>
                    {metric.satisfaction}%
                  </span>
                </div>
              </div>
              <div className="rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100/70 dark:border-white/10 p-3">
                <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>Coverage</p>
                <div className="flex items-center gap-2 mt-1">
                  <ShieldCheck className="w-4 h-4 text-purple-500" />
                  <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimaryDark}`}>
                    {metric.automationCoverage}%
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 rounded-xl bg-slate-900/5 dark:bg-white/5 border border-slate-200/70 dark:border-white/10 p-3 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" />
              <p className={`${ds.typography.bodySmall} ${ds.color.textPrimaryDark}`}>{metric.highlight}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};



