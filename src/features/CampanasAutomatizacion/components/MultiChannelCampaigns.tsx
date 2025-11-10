import React from 'react';
import { Badge, Card } from '../../../components/componentsreutilizables';
import { Gauge, Layers3, Share2, Sparkles } from 'lucide-react';
import { ds } from '../../adherencia/ui/ds';
import { CampanasAutomatizacionService } from '../services/campanasAutomatizacionService';
import { MultiChannelCampaign } from '../types';

const statusBadge: Record<MultiChannelCampaign['status'], { label: string; variant: React.ComponentProps<typeof Badge>['variant'] }> = {
  draft: { label: 'Borrador', variant: 'gray' },
  scheduled: { label: 'Programada', variant: 'purple' },
  running: { label: 'En marcha', variant: 'green' },
  paused: { label: 'Pausada', variant: 'yellow' },
  completed: { label: 'Finalizada', variant: 'blue' },
};

interface MultiChannelCampaignsProps {
  campaigns: MultiChannelCampaign[];
  loading?: boolean;
  className?: string;
}

export const MultiChannelCampaigns: React.FC<MultiChannelCampaignsProps> = ({
  campaigns,
  loading = false,
  className = '',
}) => {
  if (loading && campaigns.length === 0) {
    return (
      <Card className={`col-span-2 ${className}`.trim()}>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className={`${ds.shimmer} h-32`} />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className={`col-span-2 ${className}`.trim()}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-200 flex items-center justify-center">
              <Layers3 className="w-5 h-5 text-indigo-600" />
            </span>
            <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Campañas omnicanal
            </h2>
          </div>
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            Orquesta campañas coordinadas en email, SMS, WhatsApp y push desde un único panel.
          </p>
        </div>
        <Badge variant="purple" size="md">
          {campaigns.length} activas
        </Badge>
      </div>

      <div className="space-y-5">
        {campaigns.map((campaign) => {
          const spendProgress = campaign.budget === 0 ? 0 : Math.min(100, Math.round((campaign.spend / campaign.budget) * 100));
          const status = statusBadge[campaign.status];
          return (
            <div
              key={campaign.id}
              className="rounded-2xl border border-slate-100 dark:border-slate-800 p-5 bg-gradient-to-br from-white to-slate-50 dark:from-[#0f172a] dark:to-[#111c30]"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                      {campaign.name}
                    </h3>
                    <Badge variant={status.variant}>{status.label}</Badge>
                  </div>
                  <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                    Objetivo: {campaign.objective} · Owner: {campaign.owner}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Gauge className="w-4 h-4 text-emerald-500" />
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    Score impacto {campaign.impactScore}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-4">
                <div>
                  <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>Canales</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {campaign.channels.map((channel) => (
                      <Badge key={`${campaign.id}-${channel}`} variant="outline">
                        {channel.toUpperCase()}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>Segmentos objetivo</p>
                  <p className={`${ds.typography.bodySmall} ${ds.color.textPrimaryDark}`}>
                    {campaign.targetSegments.join(' · ')}
                  </p>
                </div>

                <div>
                  <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>Presupuesto · Gasto</p>
                  <p className={`${ds.typography.bodySmall} ${ds.color.textPrimaryDark}`}>
                    {CampanasAutomatizacionService.formatCurrency(campaign.spend)} de{' '}
                    {CampanasAutomatizacionService.formatCurrency(campaign.budget)} ({spendProgress}%)
                  </p>
                </div>

                <div>
                  <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>Revenue atribuido</p>
                  <p className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimaryDark}`}>
                    {CampanasAutomatizacionService.formatCurrency(campaign.revenue)}
                  </p>
                  <p className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                    Conversión {CampanasAutomatizacionService.formatPercentage(campaign.conversionRate)}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between mb-1">
                  <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                    Progreso campaña
                  </span>
                  <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                    {campaign.progression}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-500 transition-all"
                    style={{ width: `${campaign.progression}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} flex items-center gap-2`}>
                  <Share2 className="w-4 h-4 text-indigo-500" />
                  Próxima acción:
                </span>
                <span className={`${ds.typography.bodySmall} ${ds.color.textPrimaryDark} bg-indigo-50/70 dark:bg-indigo-900/30 px-3 py-1.5 rounded-full`}>
                  {campaign.nextAction}
                </span>
                <Badge variant="green" leftIcon={<Sparkles className="w-3.5 h-3.5" />}>
                  Origen Mission Control
                </Badge>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};




