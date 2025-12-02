import React from 'react';
import { Megaphone, Target, TrendingUp } from 'lucide-react';
import { Badge, Card } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { CampaignPerformance } from '../types';

interface ActiveCampaignsProps {
  campaigns: CampaignPerformance[];
  loading?: boolean;
  className?: string;
}

const statusVariant: Record<CampaignPerformance['status'], 'success' | 'warning' | 'info'> = {
  active: 'success',
  paused: 'warning',
  scheduled: 'info',
};

const statusLabel: Record<CampaignPerformance['status'], string> = {
  active: 'Activa',
  paused: 'En pausa',
  scheduled: 'Programada',
};

export const ActiveCampaigns: React.FC<ActiveCampaignsProps> = ({
  campaigns,
  loading = false,
  className = '',
}) => {
  const placeholders = Array.from({ length: 3 }).map((_, index) => (
    <div key={`campaign-skeleton-${index}`} className={`${ds.shimmer} h-28`} />
  ));

  return (
    <Card className={`col-span-2 ${className}`.trim()}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center">
              <Megaphone className="w-5 h-5 text-indigo-600" />
            </span>
            <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Campañas activas
            </h2>
          </div>
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            Seguimiento en tiempo real del spend, ROAS y performance por canal.
          </p>
        </div>
        <Badge variant="blue" size="md" className="shadow-sm">
          {campaigns.length} campañas
        </Badge>
      </div>

      <div className="space-y-4">
        {loading && campaigns.length === 0
          ? placeholders
          : campaigns.map((campaign) => {
              const spendProgress = Math.min(100, Math.round((campaign.spend / campaign.budget) * 100));
              return (
                <div
                  key={campaign.id}
                  className="rounded-2xl border border-gray-100 dark:border-gray-800 p-4 sm:p-5 bg-gradient-to-br from-white to-gray-50 dark:from-[#111827] dark:to-[#1f2937] hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                          {campaign.name}
                        </h3>
                        <Badge variant={statusVariant[campaign.status]}>{statusLabel[campaign.status]}</Badge>
                      </div>
                      <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                        {campaign.channel} · Objetivo: {campaign.objective}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                      <span className={`${ds.typography.caption} text-emerald-600 dark:text-emerald-400`}>
                        ROAS {campaign.roas.toFixed(1)}x
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-6 mb-4">
                    <div>
                      <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                        Inversión
                      </p>
                      <p className={`${ds.typography.bodyLarge} font-semibold ${ds.color.textPrimaryDark}`}>
                        €{campaign.spend.toLocaleString('es-ES')}
                      </p>
                    </div>
                    <div>
                      <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                        Presupuesto
                      </p>
                      <p className={`${ds.typography.bodyLarge} font-semibold ${ds.color.textPrimaryDark}`}>
                        €{campaign.budget.toLocaleString('es-ES')}
                      </p>
                    </div>
                    <div>
                      <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                        CTR
                      </p>
                      <p className={`${ds.typography.bodyLarge} font-semibold ${ds.color.textPrimaryDark}`}>
                        {campaign.ctr.toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                        Leads
                      </p>
                      <p className={`${ds.typography.bodyLarge} font-semibold ${ds.color.textPrimaryDark}`}>
                        {campaign.leadsGenerated}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                        Presupuesto invertido
                      </span>
                      <span className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                        {spendProgress}% del presupuesto
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all"
                        style={{ width: `${spendProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-4">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-indigo-500" />
          <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
            Optimiza creatividades y públicos con IA para mejorar el ROAS.
          </p>
        </div>
      </div>
    </Card>
  );
};


