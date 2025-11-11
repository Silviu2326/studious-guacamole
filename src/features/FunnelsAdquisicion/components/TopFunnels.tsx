import React from 'react';
import { ArrowRight, Layers, Timer, TrendingUp, Users } from 'lucide-react';
import { Card } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { AcquisitionFunnelPerformance } from '../types';

interface TopFunnelsProps {
  funnels: AcquisitionFunnelPerformance[];
  loading?: boolean;
  className?: string;
}

const stageColor: Record<AcquisitionFunnelPerformance['stage'], string> = {
  TOFU: 'bg-emerald-100 text-emerald-700',
  MOFU: 'bg-blue-100 text-blue-700',
  BOFU: 'bg-purple-100 text-purple-700',
};

const stageLabel: Record<AcquisitionFunnelPerformance['stage'], string> = {
  TOFU: 'Captación (TOFU)',
  MOFU: 'Nurturing (MOFU)',
  BOFU: 'Cierre (BOFU)',
};

export const TopFunnels: React.FC<TopFunnelsProps> = ({ funnels, loading = false, className = '' }) => {
  const placeholders = Array.from({ length: 3 }).map((_, index) => (
    <div key={`acquisition-funnel-skeleton-${index}`} className={`${ds.shimmer} h-24`} />
  ));

  return (
    <Card className={`col-span-2 ${className}`.trim()}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-200 flex items-center justify-center">
              <Layers className="w-5 h-5 text-emerald-600" />
            </span>
            <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Top funnels & experiencia de captación
            </h2>
          </div>
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            Analiza revenue, conversión, velocidad y leads cualificados por funnel.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {loading && funnels.length === 0
          ? placeholders
          : funnels.map((funnel) => (
              <div
                key={funnel.id}
                className="rounded-2xl border border-gray-100 dark:border-gray-900 p-4 sm:p-5 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1.5 rounded-full text-xs font-semibold ${stageColor[funnel.stage]}`}>
                      {stageLabel[funnel.stage]}
                    </div>
                    <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                      {funnel.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-500">
                    <TrendingUp className="w-4 h-4" />
                    <span className={`${ds.typography.caption} font-semibold`}>
                      +{funnel.growthPercentage.toFixed(1)}% crecimiento
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-5 gap-4 sm:gap-6">
                  <div>
                    <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                      Revenue atribuido
                    </p>
                    <p className={`${ds.typography.bodyLarge} font-semibold ${ds.color.textPrimaryDark}`}>
                      €{funnel.revenue.toLocaleString('es-ES')}
                    </p>
                  </div>
                  <div>
                    <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                      Conversión
                    </p>
                    <p className={`${ds.typography.bodyLarge} font-semibold ${ds.color.textPrimaryDark}`}>
                      {funnel.conversionRate.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                      Velocidad cierre
                    </p>
                    <p className={`${ds.typography.bodyLarge} font-semibold ${ds.color.textPrimaryDark}`}>
                      {funnel.velocityDays} días
                    </p>
                  </div>
                  <div>
                    <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                      Leads cualificados
                    </p>
                    <p className={`${ds.typography.bodyLarge} font-semibold ${ds.color.textPrimaryDark}`}>
                      {funnel.qualifiedLeads}
                    </p>
                  </div>
                  <div>
                    <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                      Próximo paso recomendado
                    </p>
                    <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                      <ArrowRight className="inline-block w-4 h-4 mr-1" />
                      Potenciar micro-conversiones de {funnel.stage === 'TOFU' ? 'lead magnet' : 'demo'}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3 text-indigo-600 dark:text-indigo-300">
                  <Users className="w-4 h-4" />
                  <p className={`${ds.typography.caption}`}>
                    Comparte insights con ventas para acelerar handoff de leads listos y optimizar nurturing.
                  </p>
                </div>
              </div>
            ))}
      </div>

      <div className="mt-6 flex items-center gap-3 text-indigo-600 dark:text-indigo-300">
        <Timer className="w-4 h-4" />
        <p className={`${ds.typography.caption}`}>
          Automatiza experimentos A/B por etapa y conecta señales de intención con acciones comerciales.
        </p>
      </div>
    </Card>
  );
};






